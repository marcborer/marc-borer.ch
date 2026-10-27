// Renders the Open Graph images (1200×630 PNG) with the site's own fonts and
// tokens through headless Chromium. Run: `npm run og`.
//
// Needs Playwright with Chromium: `npm i -D playwright && npx playwright install chromium`.
// Set PLAYWRIGHT_MODULE to an absolute path to use an existing Playwright install.
import { readFileSync, mkdirSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');
const OUT = join(ROOT, 'public', 'og');
const FONTS = join(ROOT, 'public', 'fonts');

const pw = await import(process.env.PLAYWRIGHT_MODULE ?? 'playwright');
const chromium = pw.chromium ?? pw.default.chromium;

const font = (name) => `url(data:font/woff2;base64,${readFileSync(join(FONTS, name)).toString('base64')}) format('woff2')`;

const targets = [
  { file: 'default.png', kicker: 'Senior ICT Systems Architect · Breitenbach, Switzerland', title: 'Marc Borer', subtitle: 'Hybrid identity, Microsoft 365, endpoint lifecycle and attested software delivery for Windows fleets.' },
  { file: 'projects.png', kicker: 'Marc Borer · Projects', title: 'Projects', subtitle: 'Attestree, enterprise cloud & hybrid infrastructure, CI/CD automation and two trading platforms.' },
  { file: 'skills.png', kicker: 'Marc Borer · Skills', title: 'Six domains, each with evidence.', subtitle: 'Identity & access, cloud & messaging, software supply chain, endpoint management, security & observability, automation & CI/CD.' },
  { file: 'principles.png', kicker: 'Marc Borer · Principles', title: 'Six convictions, learned in operations.', subtitle: 'Blast radius before feature velocity. Evidence before trust. The destructive step stays with a person.' },
  { file: 'attestree.png', kicker: 'Marc Borer · Case study', title: 'Attestree', subtitle: 'Attested winget for Windows fleets: every package detonated, given an SBOM and signed before it rolls out in rings.' },
  { file: 'options-gex.png', kicker: 'Marc Borer · Case study', title: 'options-gex', subtitle: 'Gamma-exposure research engine for options trading, behind a multi-condition statistical go-live gate.' },
  { file: 'smallcaptrader.png', kicker: 'Marc Borer · Case study', title: 'SmallCapTrader', subtitle: 'Full-stack algorithmic trading platform with rule mining, dual-mode architecture and multi-broker execution.' },
  { file: 'cloud-infrastructure.png', kicker: 'Marc Borer · Case study', title: 'Enterprise Cloud & Hybrid Infrastructure', subtitle: 'Exchange Online and Teams migration, endpoint compliance platform, hybrid identity automation and SIEM.' },
  { file: 'cicd-automation.png', kicker: 'Marc Borer · Case study', title: 'Enterprise SaaS Platform — CI/CD', subtitle: 'Infrastructure as code and deployment automation for a multi-environment SaaS platform.' },
];

const esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

function html({ kicker, title, subtitle }) {
  const long = title.length > 24;
  return `<!doctype html>
<html><head><meta charset="utf-8">
<style>
  @font-face { font-family: 'Archivo'; font-weight: 400 800; font-stretch: 100% 125%; src: ${font('archivo-latin-lSfdnoLg.woff2')}; }
  @font-face { font-family: 'IBM Plex Sans'; font-weight: 400 600; src: ${font('ibm-plex-sans-latin-1syxeKYY.woff2')}; }
  @font-face { font-family: 'IBM Plex Mono'; font-weight: 500; src: ${font('ibm-plex-mono-latin-wJwlBFgg.woff2')}; }
  html, body { margin: 0; }
  body { width: 1200px; height: 630px; background: #EEF0F4; color: #141821; font-family: 'IBM Plex Sans', sans-serif; position: relative; overflow: hidden; }
  .frame { position: absolute; inset: 56px 64px; display: grid; grid-template-rows: auto 1fr auto; }
  .kicker { font-family: 'IBM Plex Mono', monospace; font-size: 20px; letter-spacing: 0.12em; text-transform: uppercase; color: #5C6474; display: flex; align-items: center; gap: 16px; }
  .kicker::before { content: ''; width: 36px; height: 2px; background: #1E40D0; }
  .main { align-self: center; max-width: 760px; display: grid; gap: 22px; }
  h1 { margin: 0; font-family: 'Archivo', sans-serif; font-stretch: 112%; font-weight: 600; letter-spacing: -0.02em; line-height: 1.02; font-size: ${long ? '72px' : '96px'}; text-wrap: balance; }
  p { margin: 0; font-size: 27px; line-height: 1.45; color: #5C6474; max-width: 42ch; }
  .foot { display: flex; justify-content: space-between; font-family: 'IBM Plex Mono', monospace; font-size: 20px; letter-spacing: 0.04em; color: #5C6474; border-top: 1px solid #CBD1DB; padding-top: 20px; }
  svg { position: absolute; right: 64px; top: 128px; width: 300px; height: 300px; }
  circle { fill: none; stroke: #A9B1BF; stroke-width: 1.5; }
  circle.c { stroke: #1E40D0; stroke-width: 4; }
  .d { fill: #1E40D0; stroke: none; }
</style></head>
<body>
  <svg viewBox="0 0 480 480">
    <circle cx="240" cy="240" r="210"/><circle cx="240" cy="240" r="155"/><circle cx="240" cy="240" r="100"/>
    <circle class="c" cx="240" cy="240" r="46"/>
    <circle class="d" cx="226" cy="232" r="4"/><circle class="d" cx="250" cy="224" r="4"/><circle class="d" cx="246" cy="252" r="4"/><circle class="d" cx="231" cy="257" r="4"/>
  </svg>
  <div class="frame">
    <div class="kicker">${esc(kicker)}</div>
    <div class="main"><h1>${esc(title)}</h1><p>${esc(subtitle)}</p></div>
    <div class="foot"><span>marc-borer.ch</span><span>Senior ICT Systems Architect</span></div>
  </div>
</body></html>`;
}

mkdirSync(OUT, { recursive: true });
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1200, height: 630 }, deviceScaleFactor: 1 });
for (const t of targets) {
  await page.setContent(html(t), { waitUntil: 'load' });
  await page.evaluate(() => document.fonts.ready);
  await page.screenshot({ path: join(OUT, t.file), type: 'png' });
  console.log('wrote', join('public', 'og', t.file));
}
await browser.close();
