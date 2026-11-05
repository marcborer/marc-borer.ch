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
| `/projects/attestree/` | The founder story behind Attestree | "who builds Attestree", "attested app patching Windows" |
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
| **attestree.com/about/**, "Who builds it" | Names "Marc Borer" with no link; the page has no outbound links | Link "Marc Borer" to https://marc-borer.ch/. In attestree.com's `Person` or `Organization` JSON-LD, add `sameAs: https://marc-borer.ch/` for the founder. This is the highest-relevance link available, and it's an unlinked mention on his own site. |
| **GitHub profile** (`marcborer`) | No name, website, bio or location set | Name "Marc Borer"; website https://marc-borer.ch; location "Breitenbach, Switzerland"; bio = the site's one-liner. Optionally a profile README repo (`marcborer/marcborer`) with a short intro and the link. |
| **GitHub org** (`attestree`) | No website or description | Website https://attestree.com, plus a one-line description. |
| **LinkedIn** | URL `/in/marc-b-6780ab5a/` | Custom URL with the name; website field → marc-borer.ch; headline and About consistent with the site. Then update `sameAs` in `src/layouts/BaseLayout.astro`. |
| **CV PDFs** (`marcborer/cv`) | Linked from the site | Put https://marc-borer.ch in the CV header, so every copy sent points back. |

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

**Session for the Workplace Ninja user group** (Sessionize submission draft, for Marc to adjust and submit; every fact is in `src/content/projects/cloud-infrastructure/components.md`):

> **Title:** Rollout rings for BIOS updates: an automated BIOS and compliance lifecycle with Intune
>
> **Description:** BIOS updates are the fleet change nobody wants to do by hand and nobody wants to push to everyone at once. For a fleet of more than 500 Intune-managed devices, I turned them into a pipeline with three parts:
>
> - **Inventory:** Proactive Remediations collect hardware and application inventory every day and send it through an Azure Function and the Logs Ingestion API into Log Analytics.
> - **Packaging:** an Azure Automation runbook reads the OEM catalogs for the current BIOS versions, and Win32 packages are generated automatically, with BitLocker suspended and resumed around the flash.
> - **Rollout:** dynamic groups take each update through canary, pilot and broad, supersedence is handled through Graph, and Azure Monitor workbooks show the fleet's compliance at a glance.
>
> This session walks through the architecture, how the rings are cut and when a version moves on, and the trade-offs behind each piece.
>
> **Level:** 300 · **Format:** session, 45 minutes · **Language:** German or English

Before submitting, Marc fills in the ring timings and promotion criteria (the content plan's [NEED] item) and confirms the talk is fine with his employer. The Sessionize speaker profile links to https://marc-borer.ch, and the group asks speakers to join its LinkedIn group.

**Podcasts:** hand off to the `public-relations` skill (podcast guest prep).

### D. Guest articles (after content-plan articles #1–#3 exist)

Write for editorial sites that IT leads read: endpoint-management and Microsoft 365 community blogs, and Swiss IT trade media. The byline links to marc-borer.ch with a plain or branded anchor. Never use "write for us" networks.

**Skipped on purpose:**
- Directories and job boards: the site sells nothing, and a job-board profile would say publicly that he's looking for a role, which the context doc rules out.
- Paid placements: not needed at this scale.

## 4. Prospect list

| Target | Page | Contact | Angle | Cited by engines? |
|--------|------|---------|-------|-------------------|
| attestree.com/about/ | `/` | Marc | Founder link on his own product site | Assistants already read attestree.com (its `llms.txt`) |
| GitHub `marcborer` | `/` | Marc | Profile website field | Unknown; an identity signal more than a citation source |
| LinkedIn | `/` | Marc | Website field, custom URL | LinkedIn is among the most-cited domains for professional queries (`ai-seo` LinkedIn reference) |
| CV PDFs | `/` | Marc | Header link | n/a |
| Workplace & Security Ninja User Group CH (3 Dec 2026, call closes 26 Nov) | `/projects/cloud-infrastructure/` | Sessionize submission | Rollout rings for BIOS updates (draft above) | Event and speaker pages are rarely cited, but they are relevant Swiss editorial links |

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
| Owned links live (attestree.com, GitHub ×2, LinkedIn, CV) | Manual check | 5 of 5 | 5 of 5 |
| Referring domains | Search Console → Links; Bing Site Explorer | Baseline recorded | +3 relevant editorial (talk/community/article) |
| Indexed pages | Search Console → Pages; Bing Site Explorer | ≥ 20 of 46 | ≥ 30 of 46 |
| Name query | Google/Bing "Marc Borer" | — | marc-borer.ch on page one |
| Assistant answers | "Who is Marc Borer?" / "Who builds Attestree?" in ChatGPT, Perplexity, Gemini, 3 runs each | Baseline | Names the site or links it |
