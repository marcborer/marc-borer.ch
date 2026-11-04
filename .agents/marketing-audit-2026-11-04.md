# marc-borer.ch — marketing audit, 2026-11-04

Ran the [marketingskills](https://github.com/coreyhaines31/marketingskills) `seo-audit`, `ai-seo`, `schema` and `cro` skills (v2.14.0, installed in `.claude/skills/`) against a local `npm run build` of all 47 pages, with `.agents/product-marketing.md` as the context. There was no Search Console, live traffic or AI-answer data, so this covers what the build output can show. Anything about rankings or citations is still to be measured.

## Summary

The site's technical foundation is strong: static HTML, a self-canonical on every page, reciprocal hreflang, a sitemap, `robots.txt` with deliberate AI-crawler rules, `llms.txt`, per-page OG images, semantic landmarks. The audit found four defects, all fixed in this change:

1. **`x-default` hreflang pointed at four pages that do not exist** (`/skills/`, `/principles/`, `/privacy/`, `/legal-notice/`) on the English pages with translated slugs.
2. **20 case-study pages had no `<h1>`**: every architecture and component reference page, in both languages.
3. **11 pages reused the homepage description**: both CI/CD and cloud-infrastructure case studies and all four legal pages.
4. **The person was not one entity in the structured data**: Person schema on the homepage only, no `@id`, the case studies' `author` nodes unlinked, and `attestree.com` listed under `sameAs` (that property is for profiles of the same person, not a product site).

What will grow reach from here is content and presence, not more technical fixes. Those changes need your decisions; they are listed below.

## Fixed in this change

| # | Issue | Impact | Evidence | Fix |
|---|-------|--------|----------|-----|
| 1 | `x-default` on `/en/skills/`, `/en/principles/`, `/en/privacy/`, `/en/legal-notice/` pointed to `/skills/` etc., which 404 | High: a broken hreflang target wastes crawl and can drop that alternate pair | `HreflangLinks.astro` passed the untranslated base path to the DE locale | `x-default` now goes through `getTranslatedPath(…, 'de')`; all 46 pages' hreflang targets resolve |
| 2 | No `<h1>` on the 20 `/architecture/` and `/components/` pages | Medium: no primary heading for search or screen readers; the page opened on a sub-topic `<h2>` | Rendered markdown starts at `##` | `DocLayout` renders an eyebrow (project) and an `<h1>` (the active sidebar label, e.g. "Architecture") on prose pages; optional `heading` prop overrides it. Screenshots: light/dark, desktop/phone checked |
| 3 | Homepage description reused on 11 pages | Medium: duplicate snippets; Google rewrites them | Pages passed no `description` | Own title and description for the CI/CD and cloud-infrastructure case studies and the four legal pages (DE + EN, 146–159 characters) |
| 4 | CI/CD case study title 73 characters | Low: truncated in results | — | "SaaS Platform CI/CD & Infrastructure Automation — Marc Borer" (60) |
| 5 | Legal page titles without the name ("Impressum", "Privacy Policy") | Low | — | "Impressum — Marc Borer" etc. |
| 6 | Structured data did not tie the person together | Medium for entity recognition by search and AI assistants | Person only on `/` and `/en/`, no `@id` | Homepage: `@graph` of `ProfilePage` → `Person` (`#person`, now with `worksFor` CTC Analytics AG and Attestree, `knowsLanguage`, `description`) and `WebSite` (`#website`, `publisher` → person). Other pages: `WebSite` with a named `publisher` reference. Case studies' `author` carries `@id: …/#person`. `attestree.com` moved from `sameAs` to `worksFor` |
| 7 | `llms.txt` listed three of the five case studies | Low | SmallCapTrader and options-gex missing | Both added |

The static audit now reports no broken hreflang target and one `<h1>` on every page except `404.html`, which deliberately carries one per language.

## Decisions, 2026-11-04 (follow-up PR)

| # | Decision | Done |
|---|----------|------|
| 1 | Allow `Google-Extended` so Gemini can cite the site | Removed from the blocked list in `robots.txt`, with the reason in a comment. If Cloudflare's AI Crawl Control blocks it at the edge, allow it there too |
| 2 | Correct the hosting service in the privacy policy | "Cloudflare Workers" in `/datenschutz/` and `/en/privacy/` §3; revision date moved to November 2026 |
| 3 | Email in the hero | "E-Mail schreiben" / "Write an email" button beside the CV button |
| 4 | Link "Now: Attestree" | The spec-strip value links to the Attestree case study |
| 5 | Say what you are open to | A senior architecture role, advisory work, Attestree early access for IT teams: contact page intro, homepage contact band and contact page description |
| 6 | Plan an article section | `.agents/content-plan-2026-11.md` (plan only) |
| 8 | Freshness | "Stand" / "Last revised" with month and year in each case study's sidebar, from `src/data/case-study-revisions.json` |
| — | Shorter descriptions | Homepage and the Attestree and options-gex pages trimmed to about 160 characters, wording kept |

## Your decisions (as raised in the audit)

### 1. `Google-Extended` also blocks Gemini grounding (ai-seo)
`robots.txt` says the per-bot blocks cover "training-only" crawlers, and the top of the file says AI assistants answering a question may read and cite the site. `Google-Extended` is not training-only: per Google it also governs **grounding in the Gemini app** (it does not affect Google Search or AI Overviews). As written, Gemini may not cite the site when answering a question. Either keep the block on purpose and correct the comment, or drop `Google-Extended` from the list if citations in Gemini matter more than the training opt-out.

### 2. The privacy policy names the wrong host
`/datenschutz/` and `/en/privacy/` §3 say the site is hosted on **Cloudflare Pages**; since #21 it runs on **Cloudflare Workers** static assets. Same processor (Cloudflare, Inc.), but the policy should name the service that actually runs. Legal text, so left for you.

### 3. Give the contact action a place in the hero (cro)
The only conversion is an email. The hero offers "View projects" and "CV (PDF)"; the email appears only in the contact band at the bottom, the nav and the footer. `section.writeEmail` ("E-Mail schreiben" / "Write an email") already exists in `ui.ts` and is used nowhere. Option: a third, quieter hero button (`mailto:`), or replace "View projects" there, since the project register follows directly below.

### 4. Link "Now: Attestree" in the spec strip (cro, internal linking)
The hero spec strip says "Now — Attestree: attested app patching for Windows fleets" as plain text. Linking it to `/projects/attestree/` gives the strongest case study a second entry point from the most-viewed page.

### 5. Say what you are open to (product-marketing open question 1)
Contact copy invites "a professional exchange". Visitors can't tell whether you are open to a role, advisory work or Attestree design partners. One line on `/contact/` saying which would qualify the emails you get. This depends on your goals, so it is not drafted.

### 6. Start a small writing section (content-strategy, ai-seo)
This is the biggest lever left. The site has no dated articles, and AI engines and search reward first-hand, dated, attributed explanations. The case studies already hold the material. Three to five evergreen pieces, each owning one question:
- "Rollout rings for Intune: canary, pilot, broad, all" (from the BIOS lifecycle platform)
- "Hybrid identity as a strategy, not a stopgap" (from principle 04)
- "Attest at ingest, not after install: what an observed SBOM is" (from the Attestree case study, within what attestree.com states)
- "Migrating Exchange and telephony to Teams Direct Routing without an interruption"

German first, English alongside; each with a visible date, author, and `Article` schema referencing `#person`.

### 7. Make the off-site profiles agree (ai-seo: presence and consensus)
Assistants check that third-party profiles describe a person the same way. Align the LinkedIn headline and the GitHub profile README with the site's one-liner, and link back to `marc-borer.ch`. The LinkedIn URL (`/in/marc-b-6780ab5a/`) does not contain your name. A custom URL such as `/in/marcborer/` helps people and engines match it; update `sameAs` in `BaseLayout.astro` if it changes.

### 8. Show freshness on the case studies (ai-seo)
The footer stamp ("Stand: Oktober 2026") is site-wide. A "last revised" line per case study, plus `dateModified` once articles exist, tells readers and engines which facts are current. This matters most for Attestree, which changes daily.

## Low priority

- **Descriptions over 160 characters** on the homepage (178 DE / 188 EN) and most case studies (up to 237). Google cuts them off at about 155–160; the wording is yours, so they are untouched.
- **German homepage title is the English one.** "Marc Borer — Senior ICT Systems Architect" serves both languages. Fine if the job title is how people search in German too.
- **`SoftwareApplication` markup** on the Attestree, SmallCapTrader and options-gex case studies is not eligible for Google's software rich result: that needs `offers` and a rating or review. It still describes the projects to other consumers. Don't add an offer or rating that attestree.com does not publish.
- **Sitemap has no `lastmod` and no hreflang alternates.** HTML hreflang is enough. Don't add sitemap alternates unless they handle the four translated slugs, because conflicting signals make Google drop the pair.
- **404 language switcher** links to `/en/404/`, which itself 404s. Harmless.
- **Breadcrumbs** (`BreadcrumbList`) for case-study pages are an option, ideally with a visible breadcrumb trail to match.

## Measure next

1. Verify `marc-borer.ch` in Google Search Console and Bing Webmaster Tools; submit `sitemap-index.xml`. Bing's index feeds Copilot.
2. Run 10–15 prompts monthly across ChatGPT, Perplexity, Gemini and Google AI Mode, 3–5 runs each, and log the cited rate. Examples: "Marc Borer", "ICT Systems Architect Breitenbach", "Hybrid Identity Architekt Schweiz", "attested app patching Windows", "Who builds Attestree?". See `.claude/skills/ai-seo/references/prompt-portfolio.md`.
3. In Cloudflare Web Analytics, watch referrers from AI assistants and the `mailto:` and CV link use.
