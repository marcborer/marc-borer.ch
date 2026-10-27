# marc-borer.ch

Personal site of Marc Borer, Senior ICT Systems Architect: hybrid identity, Microsoft 365, endpoint lifecycle and, with Attestree, attested software delivery for Windows fleets.

## Design

The site is set like a specification sheet: ruled hairlines, monospaced metadata in the margins, wide-set grotesk headings and one drawing that recurs, the rollout rings (canary → pilot → broad → all). Tokens live in `src/styles/tokens.css` (cool paper and ink, one cobalt accent, a mirrored dark theme); shared primitives in `src/styles/global.css`.

- Type: Archivo (display, width axis), IBM Plex Sans (body), IBM Plex Mono (metadata and code), self-hosted as WOFF2
- Themes: light and dark follow the OS; the toggle stores an override in `localStorage`
- Drawing: `src/components/RingMark.astro` (hero, 404, favicon, OG images)

## Tech Stack

- [Astro 7](https://astro.build/), static output
- Vanilla CSS with custom properties
- i18n: German (default) and English under `/en/`
- Cloudflare Web Analytics (cookieless, no consent banner)
- Cloudflare Pages, deployed by `wrangler pages deploy` from GitHub Actions

## Content

- 47 pages across two languages
- 5 case studies (Attestree, enterprise cloud & hybrid infrastructure, CI/CD automation, SmallCapTrader, options-gex), each with an architecture and a component page
- Skills (6 domains with evidence links), principles, career timeline, contact
- Bilingual 404

Case-study copy for Attestree is kept to what [attestree.com](https://attestree.com) states publicly.

## SEO & Web Standards

- XML sitemap via `@astrojs/sitemap`, per-page canonical, hreflang alternates (asymmetric slugs supported)
- JSON-LD (Person + WebSite), per-page OG images (1200×630), unique meta descriptions, `robots.txt`

## Accessibility

- Skip link, keyboard-reachable controls, visible focus, semantic landmarks, reduced-motion respected

## Development

```bash
npm install
npm run dev
```

## Build

```bash
npm run build    # fetches fonts, then builds to dist/
npm run preview
```

### Fonts

`scripts/fetch-fonts.mjs` downloads the families configured at the top of the file from Google Fonts into `public/fonts/` and writes `src/styles/fonts.css`. It runs before every build and falls back to the committed files when offline.

### Open Graph images

`npm run og` renders `public/og/*.png` with headless Chromium so they use the real fonts. Needs Playwright: `npm i -D playwright && npx playwright install chromium`, or point `PLAYWRIGHT_MODULE` at an existing install.

## Deployment

Hosted on **Cloudflare Pages**. `.github/workflows/deploy.yml` builds on every push and pull request and deploys with `wrangler pages deploy` (Direct Upload): `main` to production, pull requests from this repository to a preview URL. `wrangler.toml` names the project and the `dist/` output; `public/_headers` sets the response headers (CSP, HSTS, caching).

One-time setup:

1. Create the Pages project as Direct Upload: `npx wrangler pages project create marc-borer-ch --production-branch=main` (or dashboard → Workers & Pages → Create → Pages → Upload assets). A project of the same name connected to Git must be deleted first.
2. Repository secrets: `CLOUDFLARE_API_TOKEN` (API token with Account → Cloudflare Pages → Edit) and `CLOUDFLARE_ACCOUNT_ID`.
3. Custom domains on the project: `marc-borer.ch` and `www.marc-borer.ch` (zone on Cloudflare DNS, Microsoft 365 mail records DNS-only) plus a redirect rule `www` → apex.
4. Web Analytics: enable it on the Pages project (Cloudflare injects the beacon), or create a Web Analytics site and store its token as the repository variable `CF_BEACON_TOKEN` so the build renders the beacon itself.

[![Build and deploy](https://github.com/marcborer/marc-borer.ch/actions/workflows/deploy.yml/badge.svg?branch=main)](https://github.com/marcborer/marc-borer.ch/actions/workflows/deploy.yml)

Site: [marc-borer.ch](https://marc-borer.ch)
