/**
 * Write dist/llms-full.txt: the text of the English pages in one Markdown file, so an
 * assistant can read the whole site in one request (the companion to public/llms.txt).
 * Runs after `astro build` and reads the built HTML, so it always matches the site.
 *
 * Order: home, projects, each case study (overview, architecture, components), skills,
 * principles, career, contact. The legal pages are left out.
 */

import { readFileSync, writeFileSync, existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const DIST = join(ROOT, 'dist');
const SITE = 'https://marc-borer.ch';

const projects = JSON.parse(readFileSync(join(ROOT, 'src/data/projects.en.json'), 'utf8'));
const navs = JSON.parse(readFileSync(join(ROOT, 'src/data/doc-navs.en.json'), 'utf8'));

function pagePaths() {
  const paths = ['/en/', '/en/projects/'];
  for (const p of projects) {
    const slug = p.link.split('/').filter(Boolean).pop();
    for (const item of navs[slug]?.items ?? []) paths.push(`/en${item.href}/`);
  }
  return [...paths, '/en/skills/', '/en/principles/', '/en/experience/', '/en/contact/'];
}

const ENTITIES = { amp: '&', lt: '<', gt: '>', quot: '"', apos: "'", nbsp: ' ', '#39': "'" };
function decode(s) {
  return s
    .replace(/&#x([0-9a-f]+);/gi, (_, h) => String.fromCodePoint(parseInt(h, 16)))
    .replace(/&#(\d+);/g, (_, d) => String.fromCodePoint(Number(d)))
    .replace(/&([a-z0-9#]+);/gi, (m, n) => ENTITIES[n] ?? m);
}

function absolute(href) {
  if (href.startsWith('/')) return SITE + href;
  return href;
}

// A deliberately small HTML-to-Markdown pass for this site's own markup.
function toMarkdown(html) {
  let s = html
    .replace(/<(svg|script|style|button|template)\b[\s\S]*?<\/\1>/gi, '')
    .replace(/<header class="doc-head[^"]*"[\s\S]*?<\/header>/gi, '') // eyebrow + h1, already in the heading
    // A link wrapped around a whole card: write the card, then the link on its own line.
    .replace(/<a\b[^>]*href="([^"]+)"[^>]*>((?:(?!<\/a>)[\s\S])*?<(?:div|h[1-6]|p|dl|ul|span)\b(?:(?!<\/a>)[\s\S])*?)<\/a>/gi,
      (_, href, inner) => `\n\n${inner}\n\nLink: ${absolute(decode(href))}\n\n`)
    // Layout containers and section labels break lines instead of running text together.
    .replace(/<\/?(div|section|article|header|footer|nav|ol|ul|dl)\b[^>]*>/gi, '\n')
    .replace(/<span class="eyebrow"[^>]*>([\s\S]*?)<\/span>/gi, '\n\n$1\n\n')
    .replace(/<\/span>\s*<span\b/gi, '</span> · <span')
    .replace(/<\/a>\s*<a\b/gi, '</a> · <a')
    .replace(/<!--[\s\S]*?-->/g, '');
  // Tables: one Markdown row per <tr>, with a separator after the header row.
  s = s.replace(/<table\b[\s\S]*?<\/table>/gi, (table) => {
    const rows = [...table.matchAll(/<tr\b[\s\S]*?<\/tr>/gi)].map((r) =>
      [...r[0].matchAll(/<t([hd])\b[^>]*>([\s\S]*?)<\/t\1>/gi)].map((c) => inline(c[2])),
    );
    if (rows.length === 0) return '';
    const out = rows.map((cells) => `| ${cells.join(' | ')} |`);
    out.splice(1, 0, `|${rows[0].map(() => ' --- |').join('')}`);
    return `\n\n${out.join('\n')}\n\n`;
  });
  s = s
    .replace(/<h1\b[^>]*>[\s\S]*?<\/h1>/gi, '') // the page title is written separately
    // List items first, so a heading inside one (the career timeline) stays inline.
    .replace(/<li\b[^>]*>([\s\S]*?)<\/li>/gi, (_, t) => `\n- ${inline(t.replace(/<\/h[1-6]>/gi, ' · '))}`)
    .replace(/<h([2-4])\b[^>]*>([\s\S]*?)<\/h\1>/gi, (_, n, t) => `\n\n${'#'.repeat(Number(n) + 1)} ${inline(t)}\n\n`)
    .replace(/<(dt)\b[^>]*>([\s\S]*?)<\/dt>/gi, (_, __, t) => `\n- **${inline(t)}**: `)
    .replace(/<dd\b[^>]*>([\s\S]*?)<\/dd>/gi, (_, t) => inline(t))
    .replace(/<(p|figcaption|blockquote|address)\b[^>]*>([\s\S]*?)<\/\1>/gi, (_, __, t) => `\n\n${inline(t)}\n\n`)
    .replace(/<br\s*\/?>/gi, '\n');
  s = inline(s, true)
    .replace(/— · /g, '— ')
    .replace(/( ·)+\s*(\n|$)/g, '$2')
    .replace(/^[ \t]+/gm, '')
    .replace(/[ \t]+\n/g, '\n')
    .replace(/\n{3,}/g, '\n\n');
  // Keep list items of one list on consecutive lines.
  while (/(\n- [^\n]*)\n\n(?=- )/.test(s)) s = s.replace(/(\n- [^\n]*)\n\n(?=- )/g, '$1\n');
  return s.trim();
}

function inline(html, keepNewlines = false) {
  let s = html
    .replace(/<a\b[^>]*href="([^"]+)"[^>]*>([\s\S]*?)<\/a>/gi, (_, href, text) => {
      const label = inline(text);
      if (!label) return '';
      if (href.startsWith('#') || href.startsWith('mailto:')) return label;
      return `[${label}](${absolute(decode(href))})`;
    })
    .replace(/<(strong|b)\b[^>]*>([\s\S]*?)<\/\1>/gi, (_, __, t) => `**${inline(t)}**`)
    .replace(/<(em|i)\b[^>]*>([\s\S]*?)<\/\1>/gi, (_, __, t) => `*${inline(t)}*`)
    .replace(/<code\b[^>]*>([\s\S]*?)<\/code>/gi, (_, t) => `\`${decode(t.replace(/<[^>]+>/g, ''))}\``)
    .replace(/<[^>]+>/g, ' ');
  s = decode(s);
  return keepNewlines ? s.replace(/[ \t]+/g, ' ') : s.replace(/\s+/g, ' ').trim();
}

function page(path) {
  const file = join(DIST, ...path.split('/').filter(Boolean), 'index.html');
  if (!existsSync(file)) throw new Error(`[llms-full] ${path} was not built (${file}).`);
  const html = readFileSync(file, 'utf8');
  const main = html.match(/<main\b[^>]*>([\s\S]*?)<\/main>/i)?.[1];
  if (!main) throw new Error(`[llms-full] ${path} has no <main>.`);
  const h1 = inline(main.match(/<h1\b[^>]*>([\s\S]*?)<\/h1>/i)?.[1] ?? '');
  const title = inline(html.match(/<title>([\s\S]*?)<\/title>/i)?.[1] ?? path).replace(/ — Marc Borer$/, '');
  // Keep the h1 as a subtitle when it says something the title does not (a tagline, a fuller name).
  const words = (t) => t.toLowerCase().match(/[a-z0-9]+/g) ?? [];
  const titleWords = new Set(words(title));
  const subtitle = h1 && !words(h1).every((w) => titleWords.has(w)) ? `*${h1}*\n\n` : '';
  return `## ${title}\n\nURL: ${SITE}${path}\n\n${subtitle}${toMarkdown(main)}\n`;
}

const header = `# Marc Borer: full text of marc-borer.ch (English)

> Every English page of marc-borer.ch in one file, generated from the built site: the profile, the five case studies with their architecture and component pages, skills, principles, career and contact. The German pages (same paths without /en/) say the same. The site overview is ${SITE}/llms.txt.
>
> Content © Marc Borer, all rights reserved (https://github.com/marcborer/marc-borer.ch/blob/main/LICENSE). Read it and quote it to answer a question, naming the source; it is not licensed for model training. Statements about Attestree are limited to what https://attestree.com states publicly.
`;

const body = pagePaths().map(page).join('\n---\n\n');
writeFileSync(join(DIST, 'llms-full.txt'), `${header}\n${body}`);
console.log(`[llms-full] Wrote dist/llms-full.txt (${pagePaths().length} pages, ${Math.round((header.length + body.length) / 1024)} KB).`);
