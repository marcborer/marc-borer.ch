/**
 * Tell IndexNow (Bing, Yandex and the other participating engines) which pages a
 * deploy changed. Run by .github/workflows/indexnow.yml after every push to main.
 *
 *   node scripts/indexnow.mjs --new dist [--old ../before/dist] [--sha <commit>] [--dry-run]
 *
 * --new      the build of the pushed commit
 * --old      the build of the commit before it; without it every page in the sitemap counts
 *            as changed
 * --sha      wait until https://marc-borer.ch/version.txt reports this commit (or a later
 *            one) before submitting, so the engines fetch the new pages
 * --dry-run  do everything, including the wait, except the submission
 *
 * For testing, INDEXNOW_VERSION_URL points the wait at another deployment (a preview)
 * and INDEXNOW_WAIT_MINUTES shortens it.
 *
 * A page counts as changed when its HTML differs, ignoring the generator tag and the
 * hashed /_astro/ asset names, which change with tooling rather than content. Pages that
 * left the sitemap are submitted too, so the engines see their 404.
 */

import { readFileSync, readdirSync, existsSync, statSync } from 'fs';
import { createHash } from 'crypto';
import { execFileSync, spawnSync } from 'child_process';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const SITE = 'https://marc-borer.ch';
const HOST = 'marc-borer.ch';
const ENDPOINT = 'https://api.indexnow.org/indexnow';
const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const VERSION_URL = process.env.INDEXNOW_VERSION_URL || `${SITE}/version.txt`;
const WAIT_MS = Number(process.env.INDEXNOW_WAIT_MINUTES || 15) * 60 * 1000;
const POLL_MS = 15 * 1000;

function parseArgs(argv) {
  const args = { dryRun: false };
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a === '--dry-run') args.dryRun = true;
    else if (a === '--new' || a === '--old' || a === '--sha') args[a.slice(2)] = argv[++i];
    else throw new Error(`Unknown argument: ${a}`);
  }
  if (!args.new) throw new Error('--new <dist> is required');
  return args;
}

// The key file is public/<key>.txt containing exactly <key>; find it rather than repeat the key.
function readKey() {
  const dir = join(ROOT, 'public');
  for (const name of readdirSync(dir)) {
    const m = name.match(/^([A-Za-z0-9-]{8,128})\.txt$/);
    if (m && readFileSync(join(dir, name), 'utf8').trim() === m[1]) return m[1];
  }
  throw new Error('No IndexNow key file (public/<key>.txt containing the key) found.');
}

function sitemapUrls(dist) {
  const file = join(dist, 'sitemap-0.xml');
  if (!existsSync(file)) return [];
  return [...readFileSync(file, 'utf8').matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);
}

// https://marc-borer.ch/en/skills/ -> <dist>/en/skills/index.html
function htmlFile(dist, url) {
  const path = url.slice(SITE.length).replace(/^\//, '');
  return join(dist, ...path.split('/').filter(Boolean), 'index.html');
}

function contentHash(file) {
  if (!existsSync(file) || !statSync(file).isFile()) return null;
  const html = readFileSync(file, 'utf8')
    .replace(/<meta name="generator"[^>]*>/g, '')
    .replace(/\/_astro\/[^"'\s)]+/g, '/_astro/*');
  return createHash('sha256').update(html).digest('hex');
}

function changedUrls(newDist, oldDist) {
  const current = sitemapUrls(newDist);
  if (current.length === 0) throw new Error(`No sitemap in ${newDist}; build first.`);
  if (!oldDist || sitemapUrls(oldDist).length === 0) {
    console.log('[indexnow] No previous build to compare with: every page counts as changed.');
    return current;
  }
  const changed = current.filter((url) => contentHash(htmlFile(newDist, url)) !== contentHash(htmlFile(oldDist, url)));
  const removed = sitemapUrls(oldDist).filter((url) => !current.includes(url));
  return [...changed, ...removed];
}

async function deployedSha() {
  const res = await fetch(`${VERSION_URL}?t=${Date.now()}`, { cache: 'no-store' });
  return res.ok ? (await res.text()).trim() : null;
}

// True when the deployed commit is the target or a later commit that contains it. Fetches
// main only when the deployed commit is unknown here (exit 128), not on every poll.
function isAtOrAfter(target, deployed) {
  if (target === deployed) return true;
  const isAncestor = () => spawnSync('git', ['merge-base', '--is-ancestor', target, deployed], { cwd: ROOT, stdio: 'ignore' }).status;
  let status = isAncestor();
  if (status !== 0 && status !== 1) {
    try {
      execFileSync('git', ['fetch', '--quiet', 'origin', 'main'], { cwd: ROOT, stdio: 'ignore' });
    } catch {
      return false;
    }
    status = isAncestor();
  }
  return status === 0;
}

async function waitForDeploy(sha) {
  const deadline = Date.now() + WAIT_MS;
  let seen = null;
  while (Date.now() < deadline) {
    seen = await deployedSha().catch(() => null);
    if (seen && isAtOrAfter(sha, seen)) {
      console.log(`[indexnow] ${VERSION_URL} reports ${seen}${seen === sha ? '' : ` (includes ${sha})`}.`);
      return;
    }
    await new Promise((r) => setTimeout(r, POLL_MS));
  }
  throw new Error(`${VERSION_URL} still reports ${seen ?? 'nothing'} after ${WAIT_MS / 60000} minute(s), not ${sha}. Did the Workers Builds deploy fail?`);
}

async function submit(key, urls) {
  const body = { host: HOST, key, keyLocation: `${SITE}/${key}.txt`, urlList: urls };
  const res = await fetch(ENDPOINT, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json; charset=utf-8' },
    body: JSON.stringify(body),
  });
  const text = await res.text();
  // 200: accepted; 202: accepted, key check pending. Anything else is a failure.
  if (res.status !== 200 && res.status !== 202) throw new Error(`IndexNow answered ${res.status}: ${text}`);
  console.log(`[indexnow] Submitted ${urls.length} URL(s): HTTP ${res.status}.`);
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  const key = readKey();
  const urls = changedUrls(args.new, args.old);

  if (urls.length === 0) {
    console.log('[indexnow] No page changed; nothing to submit.');
    return;
  }
  console.log(`[indexnow] ${urls.length} changed page(s):\n  ${urls.join('\n  ')}`);

  if (args.sha) await waitForDeploy(args.sha);
  if (args.dryRun) {
    console.log('[indexnow] Dry run: not submitting.');
    return;
  }
  await submit(key, urls);
}

main().catch((err) => {
  console.error(`[indexnow] ${err.message}`);
  process.exit(1);
});
