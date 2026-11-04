# Article plan — marc-borer.ch, November 2026

A plan, not a publishing schedule. It was made with the `content-strategy` skill from the case studies already on the site, with `.agents/product-marketing.md` as context. No keyword export, Search Console data or customer interviews were available. The scores below are judgement, and the "adds" lines are hypotheses to check against the current top results before drafting each piece.

## Why articles

The case studies prove depth but answer no question anyone types into a search box or an assistant. Dated, first-hand articles by a named author are what search and AI assistants cite. Each article should feed one of the three goals:

| Goal | What an article does for it |
|------|-----------------------------|
| Senior architecture role | Shows judgement on real decisions, in a form a hiring manager can read in five minutes |
| Advisory work | Answers the question an IT lead has before calling someone ("how do we do X without an outage?") |
| Attestree early access | Explains the problem Attestree solves in general terms, then points to attestree.com |

## Pillars

1. **Change without outages** (rollout rings, blast radius) — the site's signature idea and its recurring drawing. Feeds all three goals.
2. **Microsoft 365 and hybrid identity architecture** — Exchange Online and Teams migration, hybrid identity, MFA, SIEM. Feeds the role and advisory goals.
3. **Software supply chain for Windows fleets** — attest at ingest, observed SBOMs, signed statements. Feeds Attestree, inside the attestree.com boundary.

## Priority articles

Scores: customer impact 40 %, fit with the goals 30 %, search potential 20 %, effort 10 % (higher = less effort). All on a 1–10 scale.

| # | Article (DE first) | Pillar | Type | Impact | Fit | Search | Effort | Total |
|---|--------------------|--------|------|-------:|----:|-------:|-------:|------:|
| 1 | Rollout-Ringe für Windows-Flotten: BIOS-Updates mit Intune in Stufen | 1 | Searchable how-to (hub) | 8 | 9 | 7 | 7 | **8.0** |
| 2 | Exchange und Telefonie zu Teams Direct Routing migrieren, ohne Unterbruch | 2 | Searchable how-to / case write-up | 8 | 8 | 7 | 7 | **7.7** |
| 3 | Attest at ingest: was eine beobachtete SBOM ist und warum sie vor dem Rollout entsteht | 3 | Definition / explainer (link-earning) | 7 | 9 | 6 | 6 | **7.3** |
| 4 | Hybrid ist eine Strategie, kein Zwischenschritt | 2 | Shareable thought leadership | 6 | 8 | 4 | 8 | **6.4** |
| 5 | Password Spraying erkennen: Kontosperren und Fehlanmeldungen im Elastic Stack korrelieren | 2 | Searchable how-to | 6 | 6 | 7 | 6 | **6.2** |

The mix is three searchable, one definition and one shareable piece, close to the skill's 60/30/10 split for a new section. Write them in this order.

### 1 · Rollout rings for Windows fleets: staged BIOS updates with Intune
- **Working titles:** "Rollout-Ringe für Windows-Flotten: BIOS-Updates mit Intune in Stufen" / "Rollout rings for Windows fleets: staging BIOS updates with Intune"
- **Queries [check volume]:** "Intune BIOS update", "Intune deployment rings", "BIOS Update Intune BitLocker", "Win32 app supersedence Graph API"
- **Buyer stage:** implementation
- **Adds (hypothesis):** a working end-to-end architecture, not a feature walkthrough: Proactive Remediation inventory → Azure Function on the Logs Ingestion API (DCE/DCR) → Log Analytics; a runbook reading OEM catalogs for the current BIOS version; Win32 packages generated automatically, with BitLocker suspended and resumed around the flash; dynamic groups for canary, pilot and broad; supersedence through Graph. Source: `src/content/projects/cloud-infrastructure/components.md`.
- **Ring criteria to state plainly:** who goes into canary, how long each ring soaks, and what stops a promotion. **[NEED: the actual soak times and stop criteria you used]**
- **Hub role:** the pillar-1 hub. Article 3 and the Attestree case study link back to it for the ring idea.
- **CTA:** advisory ("planning rings for your own fleet? write to me"); a line pointing to Attestree for third-party apps.

### 2 · Migrating Exchange and telephony to Teams Direct Routing without an interruption
- **Working titles:** "Exchange und Telefonie zu Teams Direct Routing migrieren, ohne Unterbruch" / "Moving Exchange and telephony to Teams Direct Routing without an outage"
- **Queries [check volume]:** "Teams Direct Routing vs Calling Plan", "Teams Direct Routing Schweiz", "Teams Direct Routing IVR early media", "Exchange Hybrid Migration"
- **Buyer stage:** consideration → implementation
- **Adds (hypothesis):** the decision order and why: telephony first, mailboxes second, to build confidence on the smaller change. Also covered: Direct Routing over Calling Plan for cost, number portability and the existing SBC; the IVR fix through media bypass and early media; SIP trunk provider evaluation around number-porting risk; SPF, DKIM and DMARC during coexistence. 300+ mailboxes with no service interruption. Source: `src/content/projects/cloud-infrastructure/architecture.md`.
- **Swiss angle:** number porting and SIP trunks in Switzerland. **[NEED: what you can say publicly about providers and porting without naming the employer's contracts]**
- **CTA:** advisory and role.

### 3 · Attest at ingest: what an observed SBOM is
- **Working titles:** "Attest at ingest: was eine beobachtete SBOM ist" / "Observed vs declared SBOM: checking Windows software before it rolls out"
- **Queries [check volume]:** "observed SBOM", "SBOM third-party Windows apps", "winget security", "in-toto attestation"
- **Buyer stage:** awareness → consideration (Attestree)
- **Format:** definition first, in two or three sentences that work on their own (assistants lift those), then the reasoning. A glossary-style page earns links (`content-strategy` cites about 1.5× the page-share average).
- **Adds (hypothesis):** the difference between the SBOM a vendor declares and the one you record by installing the version in a sandbox, and why the check belongs before rollout rather than after install. Principle 02, "Evidence before trust", is the argument.
- **Boundary:** every Attestree statement must come from attestree.com (`.agents/product-marketing.md` hard constraints). Explain the concept in general terms, and keep Attestree to a closing paragraph and the "Get early access" link.
- **CTA:** early access on attestree.com.

### 4 · Hybrid is a strategy, not a stopgap
- **Working titles:** "Hybrid ist eine Strategie, kein Zwischenschritt" / "Hybrid identity is a strategy, not a waypoint"
- **Type:** shareable opinion, built from principle 04 with three examples: the Exchange bridge architecture, hybrid identity with HR-triggered on- and offboarding, and the staged MFA move to the cloud (Password Hash Sync first, MFA routed per staged group).
- **Adds (hypothesis):** most writing treats hybrid as a phase on the way to cloud-only. This one argues the opposite from projects that were run that way on purpose.
- **Distribution:** LinkedIn first; it is the piece most likely to be shared.
- **CTA:** role.

### 5 · Detecting password spraying: correlating lockouts and failed sign-ins in the Elastic Stack
- **Working titles:** "Password Spraying erkennen: Kontosperren und Fehlanmeldungen korrelieren" / "Spotting password spraying by correlating lockouts and failed logons"
- **Queries [check volume]:** "password spray detection", "Kibana password spray", "Windows Event 4625 4740 correlation"
- **Adds (hypothesis):** the correlation itself (account lockouts against failed-logon patterns across sites) as it ran in production, with the dashboard logic. **[NEED: what of the detection logic is safe to publish]**
- **CTA:** advisory.

## Cluster map

```
Change without outages (hub: #1 rollout rings)
├── #3 observed SBOM ──────────── Attestree case study ── attestree.com
└── principle 01 (blast radius)

Microsoft 365 & hybrid identity
├── #2 Teams Direct Routing migration ── cloud-infrastructure case study
├── #4 hybrid as strategy ──────────── principle 04
└── #5 password spray detection ────── principle 05 (observability)
```

Every article links to its case study and its principle, and the case study links back. One article links to attestree.com (#3); the others mention Attestree once at most.

## Format and production

- **German first, English alongside.** Same structure in both, and the English version is written in English rather than translated line by line.
- **Per article:** 10 title candidates before drafting; five editing passes (structure, clarity, evidence, line edit, title and description); visible publish date and "last revised" date; the author named and linked to the homepage.
- **Answer blocks:** each section opens with its answer in 40–60 words, then the detail (`ai-seo`).
- **Before drafting:** run each query in Google and one assistant, and read the top three results. Rewrite the "Adds" line as one sentence that names what this article has that they lack, or drop the article.
- **Cadence:** one article every four to six weeks is sustainable alongside Attestree. #1 first.

## Site changes the section needs (later PR)

- Routes `/artikel/` (DE) and `/en/articles/` (EN) as an index plus one page per article, added to `routeMap` in `src/i18n/utils.ts` like the other translated slugs.
- An Astro content collection (`src/content/articles/{de,en}/`) with frontmatter `title`, `description`, `date`, `updated` and `translationKey`. `HreflangLinks.astro` must pair the language versions through `translationKey`, because article slugs differ by language.
- `BlogPosting` JSON-LD per article: `author` and `publisher` → `https://marc-borer.ch/#person`, `datePublished`, `dateModified`, `inLanguage`.
- A nav entry once two or more articles exist; a line per article in `public/llms.txt`; an OG image per article via `npm run og`.

## Distribution (create once, distribute twice)

- **LinkedIn post** per article on publish day, with the target phrase in the first words (`social`, `ai-seo` LinkedIn reference). A second post two to three weeks later lifts one section.
- **Case studies** get a "Read more" link to their article.
- **Attestree:** article #3 is the one piece attestree.com could link to, if it wants to.
- **Borrowed audiences:** pitch #2 or #4 to a Swiss IT community or podcast once both are live (`public-relations`).

## Open questions

1. The three **[NEED]** items above: ring soak times and stop criteria, what can be said about SIP providers and porting, and how much SIEM detection logic is safe to publish.
2. Does CTC Analytics AG need to approve articles that describe work done there?
3. Is one article every four to six weeks realistic, or should the plan stop at #1–#3?
