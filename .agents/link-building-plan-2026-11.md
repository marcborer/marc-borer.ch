# Link-building plan — marc-borer.ch, November 2026

Made with the `link-building` skill, with `.agents/product-marketing.md` as context. No outreach has been sent. Every draft below is for Marc to approve and send himself.

## 1. Diagnosis

- **Bing:** Bing Webmaster Tools flags "not enough inbound links from high quality domains".
- **Indexing (Search Console and Bing, 2026-11-05):** 14 of the 46 pages are indexed in each. Google reports 8 more as "Crawled – currently not indexed".
- **Traffic:** 34 Google clicks (Aug–Oct); Bing shows 3 clicks and 72 impressions.
- **Search:** a web search for "Marc Borer" returns other Borers, including one in Himmelried, the next village.
- **Gap type:** this is the skill's **foundation gap**: the domain has few links anywhere. The skill's order applies: owned profiles, partners and reclamation before any outreach.
- **Links aren't the only cause.** All 8 crawled-not-indexed pages are case-study sub-pages, last crawled between 29 April and 18 October 2026:
  - cloud infrastructure: architecture (DE and EN), components (EN)
  - SmallCapTrader: architecture and components (DE and EN)
  - CI/CD: components (DE)

  On those crawls the sub-pages had no `<h1>` and no article data, and the CI/CD and cloud ones also had very short descriptions. #28, #34 and the description PR of 2026-11-05 fixed these. Google started validating on 28 October. Give it one recrawl (IndexNow sends Bing the changes; Google picks them up on its own schedule) before treating authority as the reason. Indexed so far are all the case-study overviews plus the home, projects, principles and career pages, and one sub-page (CI/CD architecture, EN).
- **Housekeeping (Bing):** Bing still lists `test.marc-borer.ch`, which no longer resolves in DNS (checked 2026-11-05), and `http://marc-borer.ch/`, which correctly answers 301. Both are harmless. If the test host comes back, keep it out of the index (`noindex` or access protection).

**Target pages:**

| Page | Wins | Queries / prompts |
|------|------|-------------------|
| `/` and `/en/` | Name searches; "who is Marc Borer" in assistants | "Marc Borer", "Marc Borer Attestree", "Marc Borer ICT" |
| `/projects/attestree/` | Attestree, Marc's independent research and open-core project | "who builds Attestree", "attested app patching Windows" |
| `/projects/cloud-infrastructure/` | Advisory work | "Teams Direct Routing Migration Schweiz", "Hybrid Identity Architekt" |

## 2. Assets

What already exists to link to:
- **Case studies:** five, each with architecture and component pages.
- **Principles page:** quotable convictions, such as "Blast radius before feature velocity".
- **`llms-full.txt`:** the whole site for assistants.

What would earn links on its own: the articles in `.agents/content-plan-2026-11.md`. Article #3 (observed SBOM, a definition piece) and #1 (rollout rings for Intune, a how-to) are the link-earning formats the `content-strategy` skill ranks highest. Build those before any guest-post outreach.

## 3. Tactics, in order

### A. Profiles and properties Marc controls (no outreach, this week)

Most of these links are `nofollow` and pass little ranking credit. They matter anyway: they tell search engines and assistants that the same person is behind each profile ("consensus" in the `ai-seo` skill), which is what separates this Marc Borer from the others.

| Where | Today (checked 2026-11-05) | Change |
|-------|----------------------------|--------|
| **attestree.com/about/**, "Who builds it" | **Done 2026-11-05** (attestree-site#219). Named "Marc Borer" with no link; the page had no outbound links | Link "Marc Borer" to https://marc-borer.ch/. In attestree.com's `Person` or `Organization` JSON-LD, add `sameAs: https://marc-borer.ch/` for the founder. This is the highest-relevance link available, and it's an unlinked mention on his own site. |
| **GitHub profile** (`marcborer`) | **Done 2026-11-05.** Before: name "Marc Borer", location "Basel", company "@attestree", no bio or website. | Bio "Senior ICT Systems Architect: hybrid identity, Microsoft 365, endpoint lifecycle. Building Attestree, an independent research & open-core project."; website https://marc-borer.ch. Name, location and company unchanged. Applied in Marc's browser with his approval. |
| **GitHub org** (`attestree`) | **Done 2026-11-05.** The website was already https://attestree.com. | Description: attestree.com's one-liner ("Self-hosted third-party patch management for Windows, built on winget, that attests every app version before it ships."). |
| **LinkedIn** | URL `/in/marc-b-6780ab5a/` | **No changes** (owner decision, 2026-11-05). The profile stays as it is; `sameAs` and the CV keep the current URL. |
| **CV PDFs** (`marcborer/cv`) | **Already done:** the header lists marc-borer.ch as plain text (no hyperlinks, by the CV's ATS rule). Linked from the site | Put https://marc-borer.ch in the CV header, so every copy sent points back. |

### B. Unlinked mention reclamation (monthly, 10 minutes)

Search for `"Marc Borer" -site:marc-borer.ch` and `"Attestree" "Marc Borer"`, and set a Google Alert for both. Wherever a page names him in a professional context, ask for a link. The `public-relations` and `cold-email` skills cover the mechanics.

### C. Talks and community pages (next 1–3 months)

**Talks:** speaker pages at meetups and community days link to the speaker's site. They're editorial, relevant and Swiss, which is exactly what Bing is asking for.

- **Venues (researched 2026-11-05):**

  | Venue | Next date | Call for speakers | Fit |
  |-------|-----------|-------------------|-----|
  | [Workplace & Security Ninja User Group Switzerland](https://sessionize.com/wpninja-ug-ch/) | 3 Dec 2026, Microsoft Schweiz, The Circle, Kloten | **Open until 26 Nov 2026, 23:59 CET** | Intune and endpoint management: the best fit, and the first to submit to |
  | Workplace Ninja Summit (Baden, CH) | September each year | Usually spring, on Sessionize; the 2026 call is closed | The large European endpoint conference; submit in 2027 |
  | [Experts Live Switzerland](https://sessionize.com/ELCH26) (Welle7, Bern) | Autumn 2027 | 2026's ran 1 Feb – 31 Mar; expect the same window | Microsoft cloud, security, modern workplace |
  | [Microsoft 365 Community Schweiz](https://www.meetup.com/m365switzerland) (Bern) | Irregular; last listed Oct 2025 | Ask the organisers | Exchange Online and Teams Direct Routing talk |
  | [Security Ninjas CH](https://sessionize.com/securityninjasch) | Check the page | Sessionize | The "attest at ingest" talk |

  No Basel-based Microsoft 365 or Intune user group turned up in the search.
- **Talk topics** come straight from the case studies:
  - "Rollout rings for Windows fleets: what a BIOS update taught us"
  - "Teams Direct Routing migration without an outage"
  - "Attest at ingest: checking software before it reaches the fleet" (Attestree claims only as attestree.com states them; a community stage wants the concept, not a product pitch)

**Session for the Workplace Ninja user group** (Sessionize submission draft, for Marc to adjust and submit). It's about Attestree, his own company, so no employer approval is needed. Every product statement comes from attestree.com's `llms.txt` (2026-11-05). User groups reject sales pitches, so it teaches the technique, with Attestree as the worked example:

> **Title:** Attest at ingest: checking Windows apps before they reach the fleet
>
> **Description:** CVE scanners report after install: by the time a finding shows up in a dashboard, the app is already running on every endpoint. This session moves the check to ingest, before any endpoint installs a new version:
>
> - **Detonate:** each new winget version runs in a disposable sandbox VM, and its footprint is recorded.
> - **Record:** Syft builds a CycloneDX SBOM of what the installer put on disk, and an attestation is recorded against the installer's SHA-256.
> - **Sign:** the verdict becomes a signed in-toto statement that you can verify offline.
> - **Serve:** by default, only an attested version is served, from your own winget source, pinned to that hash.
> - **Roll out:** it reaches the fleet ring by ring: canary, pilot, broad, all.
>
> We walk through the pipeline with Attestree, the platform I build (its Community Edition is free up to 200 endpoints, in early access), and look at which parts carry over to any fleet: rings, a fenced winget source, and checking a signed statement yourself.
>
> **Level:** 300 · **Format:** session, 45 minutes · **Language:** German or English

Before submitting, Marc checks the statements against the current attestree.com (the product changes daily). The Sessionize speaker profile links to https://marc-borer.ch, and the group asks speakers to join its LinkedIn group.

The BIOS-rings talk from the cloud-infrastructure case study stays an option for later, once CTC Analytics agrees.

**Podcasts:** hand off to the `public-relations` skill (podcast guest prep).

### D. Guest articles (after content-plan articles #1–#3 exist)

Write for editorial sites that IT leads read: endpoint-management and Microsoft 365 community blogs, and Swiss IT trade media. The byline links to marc-borer.ch with a plain or branded anchor. Never use "write for us" networks.

**Skipped on purpose:**
- Directories and job boards: the site sells nothing, and a job-board profile would say publicly that he's looking for a role, which the context doc rules out.
- Paid placements: not needed at this scale.

## 4. Prospect list

| Target | Page | Contact | Angle | Cited by engines? |
|--------|------|---------|-------|-------------------|
| attestree.com/about/ | `/` | Marc | Link from his project's own site (live since attestree-site#219) | Assistants already read attestree.com (its `llms.txt`) |
| GitHub `marcborer` | `/` | Marc | Profile website field | Unknown; an identity signal more than a citation source |
| ~~LinkedIn~~ | — | — | No profile changes (owner decision, 2026-11-05) | — |
| CV PDFs | `/` | Marc | Header link | n/a |
| Workplace & Security Ninja User Group CH (3 Dec 2026, call closes 26 Nov) | `/projects/attestree/` | Sessionize submission | Attest at ingest, with Attestree as the example (draft above) | Event and speaker pages are rarely cited, but they are relevant Swiss editorial links |

## 5. Outreach drafts (for approval, not sent)

**Talk proposal** (German first; send to a user group's organisers):

> Betreff: Vortragsvorschlag: Rollout-Ringe für Windows-Flotten
>
> Hallo [Name]
>
> Ich bin Senior ICT Systems Architect in Breitenbach und habe für eine Flotte mit über 500 Intune-Geräten eine automatisierte BIOS- und Compliance-Plattform mit Rollout-Ringen (canary, pilot, broad) gebaut. Daraus würde ich gern einen Vortrag von 30 Minuten machen: wie die Ringe zusammengesetzt sind, wie BIOS-Pakete samt BitLocker-Pause automatisch entstehen und wie die Compliance der ganzen Flotte sichtbar wird.
>
> Die Fallstudie dazu: https://marc-borer.ch/projects/cloud-infrastructure/components/
>
> Passt das in eines eurer nächsten Treffen?
>
> Gruss, Marc Borer

Before sending, Marc confirms the details are public (the content plan's [NEED] items) and that his employer is fine with the talk.

**Mention reclamation** (when a page names him without a link):

> Hi [Name], thanks for mentioning me in [article]. If it helps your readers, the case study behind it is at [URL]; a link there would let them read the details. Either way, thanks. Marc

## 6. Risk notes

- **No ranking-credit links for anything of value:** no paid links, link swaps, private blog networks or paid insertions into old articles.
- **Anchors:** leave the anchor text to the linking site; expect his name or the URL.
- **attestree.com ↔ marc-borer.ch:** one contextual link each way (case study → attestree.com already exists). Not a sitewide footer link with a keyword anchor.
- **Talks and articles:** they describe employer work, so check with CTC Analytics before giving them (an open question in the context doc).

## 7. Measurement

| Metric | Where | 30 days | 90 days |
|--------|-------|---------|---------|
| Owned links live (attestree.com, GitHub profile and org, CV) | Manual check | 4 of 4 | 4 of 4 |
| Referring domains | Search Console → Links; Bing Site Explorer | Baseline recorded | +3 relevant editorial (talk/community/article) |
| Indexed pages | Search Console → Pages; Bing Site Explorer | ≥ 20 of 46 | ≥ 30 of 46 |
| Name query | Google/Bing "Marc Borer" | — | marc-borer.ch on page one |
| Assistant answers | "Who is Marc Borer?" / "Who builds Attestree?" in ChatGPT, Perplexity, Gemini, 3 runs each | Baseline | Names the site or links it |
