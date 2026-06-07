// Generates per-project Open Graph images (1200x630 PNG) on-brand with the
// site's dark theme + cyan accent. Run: `node scripts/generate-og.mjs`.
// Self-contained: only depends on `sharp` (already a project dependency).
import sharp from 'sharp';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const outDir = join(__dirname, '..', 'public', 'og');

// Brand tokens (from src/styles/tokens.css)
const BG = '#0F172A';
const BG2 = '#1E293B';
const ACCENT = '#22D3EE';
const TEXT = '#94A3B8';
const HEADING = '#FFFFFF';

const FONT =
  'DM Sans, Segoe UI, -apple-system, BlinkMacSystemFont, Helvetica, Arial, sans-serif';

const esc = (s) =>
  s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

const targets = [
  {
    file: 'attestree.png',
    title: 'Attestree',
    subtitle: 'Supply-chain provenance for Windows fleets — SBOM at ingest',
    tags: ['.NET', 'winget', 'SBOM', 'Sigstore', 'SLSA'],
  },
  {
    file: 'options-gex.png',
    title: 'options-gex',
    subtitle: 'GEX-driven options trading research engine',
    tags: ['Python', 'Alpaca', 'Backtesting', 'Go-live gate'],
  },
];

function tagRects(tags) {
  let x = 90;
  const y = 470;
  const parts = [];
  for (const tag of tags) {
    const w = 34 + tag.length * 13;
    parts.push(`
      <rect x="${x}" y="${y}" width="${w}" height="46" rx="23" fill="${BG2}" stroke="${ACCENT}" stroke-opacity="0.35"/>
      <text x="${x + w / 2}" y="${y + 30}" text-anchor="middle" font-family="${FONT}" font-size="20" fill="${TEXT}">${esc(tag)}</text>`);
    x += w + 18;
  }
  return parts.join('');
}

function svg({ title, subtitle, tags }) {
  return `<svg width="1200" height="630" viewBox="0 0 1200 630" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="${BG}"/>
      <stop offset="100%" stop-color="#0B1120"/>
    </linearGradient>
  </defs>
  <rect width="1200" height="630" fill="url(#bg)"/>
  <rect x="0" y="0" width="12" height="630" fill="${ACCENT}"/>
  <circle cx="1080" cy="120" r="220" fill="${ACCENT}" fill-opacity="0.05"/>
  <text x="90" y="150" font-family="${FONT}" font-size="26" letter-spacing="3" fill="${ACCENT}">MARC BORER</text>
  <text x="90" y="186" font-family="${FONT}" font-size="22" letter-spacing="2" fill="${TEXT}">SENIOR ICT SYSTEMS ARCHITECT</text>
  <text x="90" y="320" font-family="${FONT}" font-size="92" font-weight="700" fill="${HEADING}">${esc(title)}</text>
  <text x="90" y="392" font-family="${FONT}" font-size="34" fill="${TEXT}">${esc(subtitle)}</text>
  ${tagRects(tags)}
  <text x="90" y="588" font-family="${FONT}" font-size="24" fill="${TEXT}">marc-borer.ch</text>
</svg>`;
}

for (const t of targets) {
  const out = join(outDir, t.file);
  await sharp(Buffer.from(svg(t))).png().toFile(out);
  console.log('wrote', out);
}
