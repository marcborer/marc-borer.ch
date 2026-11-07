# Product Marketing Context

**Document version:** v3
**Last updated:** 2026-11-05

> Read by every skill in `.claude/skills/` before it writes or audits anything for marc-borer.ch.
> Drafted from the site itself (`src/i18n/ui.ts`, `src/data/*.json`, the case studies, `public/llms.txt`, `README.md`). Lines marked **[confirm]** are inferences the site does not state; check them before a skill treats them as fact. The open questions at the end are the gaps the site cannot answer.

## Hard constraints (read first)

- **Attestree claims stop at attestree.com.** Copy about Attestree says only what [attestree.com](https://attestree.com) states publicly (`README.md`, `public/llms.txt`). No roadmap, customer, pricing or performance claims beyond it.
- **Two languages, German first.** German (Swiss usage: `ss`, never `ß`) is the default at `/`; English lives under `/en/`. Every copy change lands in both, and the four translated slugs (`/kompetenzen/` ↔ `/en/skills/`, `/grundsaetze/` ↔ `/en/principles/`, `/impressum/` ↔ `/en/legal-notice/`, `/datenschutz/` ↔ `/en/privacy/`) go through `routeMap` in `src/i18n/utils.ts`.
- **No tracking beyond Cloudflare Web Analytics.** It is cookieless and the site has no consent banner; anything that sets a cookie, adds a pixel or fingerprints a visitor breaks the privacy policy (`/datenschutz/`) and needs one. Conversion tracking here means counting `mailto:` and CV clicks in Cloudflare, nothing more.
- **AI crawlers: search yes, training no.** `public/robots.txt` allows search and answer engines and blocks training-only crawlers (`Content-Signal: search=yes, ai-input=yes, ai-train=no`). Keep that split. `Google-Extended` is allowed on purpose: it also governs Gemini app grounding, and citations in Gemini were judged worth more than that one opt-out.
- **Attestree is an independent research & open-core project here, not a company Marc founded.** On marc-borer.ch and the CV, say "Unabhängiges Forschungs- & Open-Core-Projekt: Attestree" / "Independent research & open-core project: Attestree"; never "Gründer", "founder", "Eigenes Unternehmen" or "own company" (owner decision, 2026-11-05). attestree.com keeps its own wording.
- **No changes to Marc's LinkedIn profile** (owner decision, 2026-11-05). Skills may suggest LinkedIn posts, never profile edits.
- **Never say publicly that Marc is looking for a role.** His employer can read the site. The role goal is served by the evidence (case studies, CV), never by copy such as "open to a new role". Contact copy names advisory work and Attestree early access only (owner decision, 2026-11-04).
- **No invented proof.** No testimonials, logos, awards or numbers that are not already on the site or in the CV.

## Product Overview

**One-liner:** Marc Borer, Senior ICT Systems Architect in Breitenbach (SO), Switzerland: hybrid identity, Microsoft 365, endpoint lifecycle and, with Attestree, attested software delivery for Windows fleets.
**What it does:** The site is Marc's professional profile and portfolio. It shows how he designs and runs business-critical Microsoft infrastructure (hybrid identity, Exchange Online and Teams, Intune and endpoint lifecycle, SIEM) and how he built Attestree, an app-patching control plane that attests every winget, Chocolatey and Scoop version before it rolls out in rings. Five case studies, each with an architecture and a component page, carry the evidence.
**Product category:** Personal site of a senior infrastructure / systems architect (searched as: "ICT Systems Architect Schweiz", "Microsoft 365 Architekt", "Hybrid Identity Architect", "Intune endpoint lifecycle", "Marc Borer"), plus Attestree, his independent research and open-core project (software supply chain security, app patching for Windows fleets).
**Product type:** Personal professional site / portfolio (not a services storefront; there is no offer, price or booking page).
**Business model:** None on the site itself. It wins three things: a senior architecture role, advisory work, and IT teams for Attestree's early access (owner decision, 2026-11-04). Only the last two are stated publicly; see the hard constraint below.

## Target Audience

**Target companies [confirm]:** Swiss and DACH mid-size to enterprise organisations running Microsoft 365 and Windows fleets (the evidence: a laboratory-automation company with about 180 employees, 100+ servers, 300+ mailboxes, 500+ Intune devices), and IT teams evaluating Attestree.
**Decision-makers [confirm]:**
- Hiring managers and CIO/CTO/Head of IT looking for a senior architect
- IT leads and platform/security engineers evaluating Attestree or its approach
- Technical peers and recruiters checking depth before a conversation
**Primary use case:** Verify that Marc can own architecture for business-critical Microsoft infrastructure end to end, from evaluation and decision to rollout and operations, and see the evidence.
**Jobs to be done:**
- "Show me this person has done the thing, at a scale like ours, with the decisions explained."
- "Tell me quickly what Attestree is and who is behind it."
- "Give me a direct way to reach him, in German or English."
**Use cases:**
- A hiring manager reads the homepage, one case study and the CV PDF, then emails
- An IT lead follows a link about attested app patching, reads the Attestree case study, then goes to attestree.com
- A peer or journalist checks the principles page to understand how he thinks

## Personas

| Persona | Cares about | Challenge | Value we promise |
|---------|-------------|-----------|------------------|
| Hiring manager / Head of IT **[confirm]** | Ownership, judgement, delivery without outages | Telling real architecture ownership from CV keywords | Case studies with problem, approach, decisions and numbers; architecture ownership since 2019 |
| CIO / CTO **[confirm]** | Risk, governance, cost, stakeholder alignment | Changes that break the fleet; audit questions nobody can answer | Ring-based rollout, evidence before trust, decisions that can be shown to an auditor |
| IT lead / platform or security engineer (Attestree) | Patch speed versus supply-chain risk on Windows fleets | Third-party apps installed "because the CDN said so" | Software checked before rollout: detonated, given an observed SBOM, signed, rolled out in rings |
| Technical peer / recruiter | Depth, stack, recency | Thin portfolios | Component references, diagrams and tech stacks per project |

## Problems & Pain Points

**Core problem:** Business-critical infrastructure changes reach the whole fleet at once, and nobody can later prove why a given piece of software was trusted.
**Why alternatives fall short:**
- Scanners inspect binaries already running across the fleet, after the fact (Attestree case study)
- Manual, unstaged rollouts turn one bad update into a fleet-wide incident
- Generalist admins or project-based contractors leave without the architecture decisions written down **[confirm]**
**What it costs them:** Outages of messaging and telephony, failed fleet-wide updates, audit findings, months of uncertainty about what is installed.
**Emotional tension:** Fear of the fleet-wide failure; the auditor's question nobody can answer months later.

## Competitive Landscape

**Direct [confirm]:** Other senior Microsoft 365 / infrastructure architects and freelance consultants in Switzerland — usually show certifications and logos, rarely the decisions and architecture behind them.
**Secondary:** Microsoft partners and IT service providers (MSPs) — deliver projects, but the architecture ownership leaves with the project team.
**Indirect:** Hiring a generalist admin, or doing nothing and patching by hand — cheaper until the first fleet-wide failure.
For Attestree: positioning against patch-management and scanning tools belongs to attestree.com, not this site.

## Differentiation

**Key differentiators:**
- Architecture ownership across the whole lifecycle: evaluation, decision, implementation, stable operations
- Evidence on the page: five case studies with architecture and component pages, diagrams, numbers
- Builds what he preaches: Attestree turns his ring-based rollout and evidence-before-trust practice into a product
- Hybrid by intent ("Hybrid is a strategy, not a compromise")
- Bilingual, German native and English C2
**How we do it differently:** Every change goes through rings (canary, pilot, broad, all); software is checked before rollout, not scanned after; the destructive step stays with a person.
**Why that's better:** Smaller blast radius, decisions that can be shown to an auditor, no service interruption through migrations (Exchange Online and Teams Direct Routing migration with no interruption).
**Why customers choose us [confirm]:** The case studies answer the depth question before the first call.

## Objections

| Objection | Response |
|-----------|----------|
| "Is he still available, now that he is building Attestree?" | For advisory work, yes, and the contact copy says so; IT teams can get early access to Attestree. Availability for a role is never stated on the site. |
| "Industrial company, not our industry." | The work is industry-neutral Microsoft infrastructure at a stated scale (180 employees, 300+ mailboxes, 500+ devices); the decisions transfer. |
| "Mostly one employer since 2019." | Architecture ownership across messaging, identity, endpoints and security at that employer, plus a SaaS platform before it and a product of his own since 2026. |

**Anti-persona [confirm]:** Anyone looking for first-level support, a reseller, or a quick licence purchase; organisations without Microsoft infrastructure.

## Switching Dynamics

**Push:** A failed or risky fleet-wide change; an audit question about installed software; an end-of-support platform.
**Pull:** Evidence-first case studies; ring-based rollout as a habit; an architect who built the tool for this.
**Habit:** "Our admins patch by hand and it has been fine"; the incumbent IT service provider.
**Anxiety:** Committing to one person's judgement; disruption during migration.

## Customer Language

**How they describe the problem [confirm — no customer quotes on the site yet]:**
- "We can't say what's installed on our fleet or why it was trusted."
- "The last update broke half the clients."
**How they describe us:** No verbatim quotes yet. Collect from LinkedIn recommendations or emails (with permission) before using any.
**Words to use:** architecture ownership, evidence, attested, rollout rings (canary, pilot, broad, all), blast radius, hybrid identity, endpoint lifecycle, observed SBOM, signed statement, fleet, decision, operations.
**Words to avoid:** hype and filler ("seamless", "cutting-edge", "best-in-class", "passionate", "leverage"); "guarantee"; Attestree claims that attestree.com does not make.
**Glossary:**

| Term | Meaning |
|------|---------|
| Attestree | Marc's app-patching control plane for Windows fleets; open-core with a free Community Edition |
| Rollout rings | Staged delivery: canary → pilot → broad → all; the site's recurring drawing (`RingMark`) |
| Attest at ingest | Check a software version when it enters the catalog, before any endpoint can install it |
| Observed SBOM | The software bill of materials recorded by running the installer in a sandbox, not the one the vendor declares |
| Detonation | Installing a version in a short-lived sandbox VM to observe what it does |
| Hybrid identity | Coexisting on-premises Active Directory and Entra ID, by design |

## Brand Voice

| Attribute | Means | Doesn't mean | Example line |
|-----------|-------|--------------|--------------|
| Evidence-first | Every claim points to a project, number or decision | Boasting, adjectives instead of proof | "Six domains, each with evidence." |
| Precise and plain | Short declaratives, exact technical terms, colons over dashes | Jargon for its own sake, marketing filler | "Infrastructure that can show its work." |
| Calm authority | States convictions learned in operations | Hedging, or overclaiming | "The destructive step stays with a person." |
| Engineer's humility | Says what is built and what is on the roadmap | Selling the roadmap as done | "Your own apps are partly built … but no endpoint installs one yet." |

**Tone by context:**
- Support / contact: direct and brief ("For questions on infrastructure architecture, software supply chains or Attestree, an email is enough. German or English.")
- Launch (Attestree news): factual, what changed and what it means for a fleet; link to attestree.com
- Errors (404): short, bilingual, a way back
- Sales / career: evidence and scale, never superlatives
- Social (LinkedIn): one decision or lesson per post, from a real project
**Terms we own:** "Infrastructure that can show its work", "evidence before trust", "blast radius before feature velocity", "attest at ingest, not after install".
**Never use (and why):** "ß" (Swiss German site); invented metrics (breaks the evidence voice); "we" for the person (the site speaks as "I").

## Proof Points

**Metrics:** 12 years across operations, architecture and product engineering; architecture ownership since 2019; 300+ mailboxes migrated to Exchange Online and Teams Direct Routing with no service interruption; endpoint compliance and BIOS lifecycle platform for 500+ Intune-managed devices; infrastructure of about 180 employees and 100+ servers.
**Customers:** None named (employment work). CTC Analytics AG (employer since 2019) and Picturepark / Vision Information Transaction AG (2014–2017) are named on the career page.
**Testimonials:** None on the site. **[confirm]** whether LinkedIn recommendations may be quoted.
**Value themes:**

| Theme | Proof |
|-------|-------|
| Changes without outages | Exchange Online and Teams migration with no service interruption; ring-based rollout everywhere |
| Evidence before trust | Attestree: detonation, observed SBOM, signed in-toto statement before rollout |
| Visibility first | Central SIEM on the Elastic Stack; compliance dashboards |
| Automation where it repeats | Ansible/Bamboo CI/CD platform; automated on- and offboarding |

## Goals

**Business goal:** Win (1) a senior architecture role, (2) advisory work on Microsoft infrastructure, hybrid identity and software supply chains, and (3) IT teams for Attestree's early access. Owner decision, 2026-11-04; all three are open at once, but only (2) and (3) appear in the copy.
**Conversion action:** An email to mb@marc-borer.ch (hero button, contact band, contact page). Secondary: CV PDF download, the Attestree case study and attestree.com ("Get early access"), LinkedIn connection.
**Current metrics:** Unknown here; Cloudflare Web Analytics holds visits and referrers.

## Paid Ads (optional)

Not applicable: the site runs no ads.

## Learnings
*Decisions and tested lessons. Newest first. Keep it to about 20 active entries.*

| Date | Learning | Evidence | Applies to | Status |
|------|----------|----------|------------|--------|
| 2026-11-05 | Attestree is "an independent research & open-core project" on marc-borer.ch and the CV, not "founder" / "own company"; LinkedIn stays untouched | Owner decision | copywriting, copy-editing, social, link-building | active |
| 2026-11-04 | Contact copy names advisory work and Attestree early access; it never says Marc is open to a role, because his employer can read the site | Owner decision (#29) | copywriting, cro, content-strategy, social | active |
| 2026-11-04 | `Google-Extended` is allowed so Gemini can cite the site; the other training crawlers stay blocked | Owner decision; `robots.txt` comment | ai-seo | active |
| 2026-10 | Attestree copy is limited to what attestree.com states publicly | Owner decision (`README.md`, `llms.txt`) | copywriting, copy-editing, ai-seo, social | active |
| 2026-10 | AI answer engines may read and cite the site; training crawlers are blocked | Owner decision (`robots.txt`, PR #23) | ai-seo, seo-audit | active |

## Open questions

1. Which audience comes first when they conflict: employers, advisory clients or Attestree prospects?
2. Does CTC Analytics AG need to approve articles about work done there?
3. May LinkedIn recommendations or client quotes be used as testimonials?
4. Which search phrases matter (German first?), and is Search Console set up for `marc-borer.ch`?
5. The article plan (`.agents/content-plan-2026-11.md`) has three [NEED] items: ring soak times and stop criteria, what can be said about SIP providers and porting, and how much SIEM detection logic is safe to publish.

## Changelog
*Newest first. One line per revision: what changed and why.*
- v3 (2026-11-05) — Attestree framed as an independent research & open-core project on marc-borer.ch and the CV (no founder/own-company wording); no LinkedIn profile changes. Both added as hard constraints and Learnings.
- v2 (2026-11-04) — Goals set by the owner (role, advisory, Attestree early access), with the role goal kept off the public copy as a hard constraint; objection on availability answered; Google-Extended decision and contact goal logged in Learnings; open questions updated for the article plan.
- v1 (2026-11-04) — Initial context, auto-drafted from the site with the marketingskills `product-marketing` skill; inferences marked [confirm].
