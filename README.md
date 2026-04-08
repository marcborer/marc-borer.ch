# marc-borer.ch

Personal portfolio website for Marc Borer — Senior ICT Systems Architect specializing in enterprise infrastructure, hybrid cloud & identity solutions, and automation.

## Tech Stack

- [Astro 6](https://astro.build/) — static site generator
- Vanilla CSS with custom properties (dark/light theme)
- i18n — German (default) + English (`/en/`)
- Self-hosted WOFF2 fonts (DM Sans + Syne)
- Google Analytics 4 with GDPR/nDSG cookie consent
- GitHub Pages deployment

## Features

- Bilingual (DE/EN) with language switcher and hreflang
- 35 pages across two languages
- 3 project case studies with architecture diagrams, sub-pages, and sidebar navigation
- Competency map with 5 architectural domains and depth indicators
- Architectural principles page
- Experience timeline
- Dark/light mode with FOUC-free toggle
- Responsive design with mobile navigation (hamburger at 900px)
- Custom bilingual 404 page

## SEO & Web Standards

- XML sitemap via `@astrojs/sitemap`
- Per-page canonical tags
- Hreflang alternate links (with asymmetric slug support)
- JSON-LD structured data (Person + WebSite schema)
- Per-page OG images (PNG, 1200x630)
- Unique meta descriptions
- robots.txt

## Accessibility

- Skip-to-content link (WCAG 2.4.1)
- Keyboard-navigable interactive elements
- `focus-visible` outline styles
- Semantic HTML landmarks

## Development

```bash
npm install
npm run dev
```

## Build

```bash
npm run build    # outputs to dist/
npm run preview  # preview the build locally
```

## Deployment

Automatically deployed to GitHub Pages via GitHub Actions on push to `main`.

Site: [marc-borer.ch](https://marc-borer.ch)
