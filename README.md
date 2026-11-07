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
- Cloudflare Workers (static assets), deployed by Workers Builds on every push

## Content

- 47 pages across two languages
- 5 case studies (Attestree, enterprise cloud & hybrid infrastructure, CI/CD automation, SmallCapTrader, options-gex), each with an architecture and a component page
- Skills (6 domains with evidence links), principles, career timeline, contact
- Bilingual 404

Case-study copy for Attestree is kept to what [attestree.com](https://attestree.com) states publicly.

## SEO & Web Standards

- XML sitemap via `@astrojs/sitemap`, per-page canonical, hreflang alternates (asymmetric slugs supported)
- JSON-LD (ProfilePage + Person + WebSite, linked by `@id`), per-page OG images (1200×630), unique meta descriptions, `robots.txt`, `llms.txt`
- [IndexNow](https://www.indexnow.org/) key `ab16d2a2fe205b649b3f5d9e876f429e`, served at `/ab16d2a2fe205b649b3f5d9e876f429e.txt` (`public/`). It proves to Bing, Yandex and the other IndexNow engines that a URL submission comes from the site owner. The key is public by design; to rotate it, replace the file and its name.

  Submission is automatic. After every push to `main`, `.github/workflows/indexnow.yml` takes four steps:

  1. It builds the commit before and after the push.
  2. It finds the pages whose HTML changed, ignoring the generator tag and the hashed `/_astro/` names. Pages that left the sitemap count too.
  3. It waits until `/version.txt`, the commit the live site was built from, reports the push.
  4. It submits those URLs (`scripts/indexnow.mjs`). A push that changes no page submits nothing. If the deploy doesn't land within 15 minutes, the run fails.

  To submit every page by hand, for example after rotating the key:

  ```bash
  npm run build
  node scripts/indexnow.mjs --new dist
  ```

## Marketing

Twelve marketing skills from [coreyhaines31/marketingskills](https://github.com/coreyhaines31/marketingskills) (SEO, AI search, schema, copy, CRO, content, PR, social) are installed in `.claude/skills/` for Claude Code; see `.claude/skills/README.md`. They all read `.agents/product-marketing.md`, the site's positioning, audience, voice and constraints. The latest audit is `.agents/marketing-audit-2026-11-04.md`.

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

`scripts/fetch-fonts.mjs` downloads the families configured at the top of the file from Google Fonts into `public/fonts/` and writes `src/styles/fonts.css` and `src/data/font-preloads.json`, the preload links `BaseLayout.astro` renders. Each file is named by a hash of its bytes, so the names stay the same whichever URL format Google Fonts answers with and change only when a font does (`/fonts/*` is cached as immutable). It runs before every build and falls back to the committed files when offline or when any download fails.

### Open Graph images

`npm run og` renders `public/og/*.png` with headless Chromium so they use the real fonts. Needs Playwright: `npm i -D playwright && npx playwright install chromium`, or point `PLAYWRIGHT_MODULE` at an existing install.

## Deployment

Hosted on **Cloudflare Workers** as static assets. **Workers Builds** is connected to this repository: every push to `main` runs `npm run build` and `npx wrangler deploy` for production, and every pull request gets a preview URL. `wrangler.toml` holds the Worker config (`[assets]` serves `dist/`, `/404.html` for unknown paths); `public/_headers` sets the response headers (CSP, HSTS, caching). GitHub Actions (`.github/workflows/ci.yml`) only proves that a change builds.

One-time setup in the Cloudflare dashboard (Workers & Pages → the `marc-borer-ch` Worker):

1. Settings → Build: repository `marcborer/marc-borer.ch`, production branch `main`, build command `npm run build`, deploy command `npx wrangler deploy`, root `/`. Node comes from `.nvmrc`.
2. Settings → Domains & Routes: add `marc-borer.ch` and `www.marc-borer.ch` (the zone must be on Cloudflare DNS; keep the Microsoft 365 mail records DNS-only), then a redirect rule `www` → apex.
3. Web Analytics: enable it for the Worker if the dashboard offers it, or create a Web Analytics site and set its token as the build variable `PUBLIC_CF_BEACON_TOKEN` (Settings → Build → Variables) so the build renders the beacon itself.

## Security

Report a vulnerability to mb@marc-borer.ch; scope and details are in [`SECURITY.md`](SECURITY.md). The same contact is served at [`/.well-known/security.txt`](https://marc-borer.ch/.well-known/security.txt) (RFC 9116). Its `Expires` date is **2027-11-01**: move it a year ahead before then (`public/.well-known/security.txt`).

## License

- **Code:** MIT. This covers the components, layouts and templates as code, the styles, the scripts and the configuration.
- **Content:** © Marc Borer, all rights reserved. This covers the text in both languages, the case studies, the diagrams and the images.

The split and the exact paths are in [`LICENSE`](LICENSE). The self-hosted fonts are under the SIL Open Font License 1.1 ([`THIRD-PARTY-NOTICES.md`](THIRD-PARTY-NOTICES.md)), and the marketing skills under MIT (`.claude/skills/LICENSE-marketingskills`).

[![CI](https://github.com/marcborer/marc-borer.ch/actions/workflows/ci.yml/badge.svg?branch=main)](https://github.com/marcborer/marc-borer.ch/actions/workflows/ci.yml)

Site: [marc-borer.ch](https://marc-borer.ch)
