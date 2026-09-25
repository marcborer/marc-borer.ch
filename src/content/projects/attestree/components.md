---
title: Component Reference
description: Attestree key components — ingest evidence, attestation, fenced feed, groups × rings, update pipeline, CVE index, and the open-core edition
---

## Ingest Evidence

The ingest gate does not trust what a package *claims*; it records what the installer *does*. Each admission decision rests on evidence gathered before any endpoint sees the artifact.

| Evidence | What it establishes |
|----------|---------------------|
| **Installer signature** | PE, MSI, and MSIX/APPX signatures are checked; a signature that appears or disappears between versions halts the release |
| **Publisher continuity** | A changed signing certificate for the same publisher is surfaced, not silently accepted |
| **Sandboxed detonation** | The package is really installed in an isolated environment and its behaviour recorded |
| **Observed SBOM** | A CycloneDX 1.6 SBOM generated from the observed install (Syft), not taken from the publisher's word |
| **Policy decision** | Policy-as-code evaluates the evidence; the same policy is re-applied by the endpoint agent at install |

The admit/reject decision is reproducible and reviewable: every verdict links back to the evidence it was made on.

---

## Attestation & Evidence Bundles

Admission is not a side effect; it produces evidence.

- **Signed in-toto statement**: every admitted artifact gets an in-toto Statement v1 carrying SLSA v1 provenance and the SBOM digest, signed with ECDSA P-256 against the operator's root of trust.
- **Native, not wrapped**: signing, SBOM generation, and policy are built in. No external cosign wrapper, separate SBOM tool, or admission controller is needed. Sigstore (keyless signing, Rekor transparency log) is supported as an open format, not a dependency.
- **Independently verifiable**: an auditor verifies a receipt with one CLI call or a short script, without trusting the deploying party.
- **Evidence-bundle export**: the full evidence set exports as a signed bundle and verifies offline. The export works in the free edition; hardware-attested key custody (HSM / vTPM-bound roots) is on the commercial roadmap.

This closes the gap the status quo leaves open: when an artifact ships because "the CDN said so," nobody can answer the auditor's question months later. With Attestree, the answer is a signed record.

---

## Fenced winget Feed

- **Your own source**: a spec-compliant winget REST source serving only admitted packages.
- **Fenced endpoints**: the agent locks endpoints to that source; a normal `winget install` resolves against the approved catalog, not the public repository.
- **Hash-pinned**: endpoints install only the exact SHA-256 that was approved.

---

## Groups × Rings

Groups decide *what*; rings decide *which version*.

| Ring | Role |
|------|------|
| **Canary** | First, smallest exposure; catches breakage early |
| **Pilot** | Wider validation cohort |
| **Broad** | Majority of the fleet |
| **All** | Full rollout |

- **PC Groups**: version-free base sets of packages; an endpoint converges to the union of its groups.
- **Bulk promotion**: operators review approved artifacts and bulk-promote them into a ring in one action. Every promotion is a signed event.
- **Rollback to any prior version**: the agent uninstalls the current version and installs the previous one.
- **Confirm-gated rollback proposals**: a rollout that starts failing produces a rollback *proposal* for the operator to confirm. This ships disabled by default, and auto-execution stays fenced.

---

## Unattended Update Pipeline

An opt-in pipeline keeps winget packages current without giving up the gate:

- New upstream versions are ingested, detonated, and promoted ring by ring.
- The pipeline **halts into a review queue** when a publisher's signing certificate changes or an installer arrives unsigned.
- The endpoint agent updates itself through the same rings, with pause, resume, abort, and a local rollback floor.

---

## Fleet Inventory & CVE Index

- **Observed inventory**: winget and Chocolatey are managed end to end (inventory and deploy); Scoop inventory is collected but not counted as a managed manager.
- **Self-hosted CVE index**: observed inventory matched against the public CVE list (cvelistV5) and the CISA KEV catalogue, pulled download-only.
- **Air-gap friendly**: an offline index bundle serves hosts without outbound access.

---

## Open-Core Edition

Attestree is open-core, with a deliberate license boundary.

| Component | License / Distribution |
|-----------|------------------------|
| **Installer shim + IPC contract** | Apache-2.0 (open source) |
| **Platform control plane** | Closed-source, commercial |
| **Community edition** | Free, self-hosted Docker Compose stack with no cloud dependency; Sigstore-cosign signed images; early access |
| **Commercial topology** | Self-hosted appliance or a dedicated instance in the customer's own Azure subscription; no shared multi-tenant SaaS |

The license boundary is enforced mechanically in the build, so closed-source code cannot be relicensed by accident. A `git mv` of a project between the open and closed trees fails the build rather than quietly changing its license.

The community edition is built to be operated, not just demoed:

- **Accounts**: four policy-enforced roles, TOTP two-factor, and a break-glass recovery CLI. SSO is included in every commercial tier rather than sold as an upsell.
- **Enrollment**: first-run setup token and enrollment tokens minted from the URL agents will actually use.
- **Runbooks**: backup/restore, downgrade/rollback with a rollback ledger, and a Caddy TLS overlay for a trusted HTTPS front end.

---

## Marketing Site

The public site at attestree.com presents product pages, buyer segments, compliance mappings (for example NIS2), research essays, practical guides such as locking a fleet to a private winget source, and a waitlist.

- **Static Astro** build with Tailwind + MDX, deployed to Cloudflare Pages (preview deploy per PR), with build-time OG images, structured data, and `llms.txt`.
- **Waitlist** runs as a same-origin Cloudflare Pages Function backed by D1 in an EU jurisdiction, with hardened Turnstile verification and documented data-handling.
- **Source-of-truth discipline**: site copy is re-synced against each platform release, with an explicit shipped-vs-roadmap split. Claims the product does not yet back, such as WDAC enforcement, are removed rather than hedged.
- **Build-security baseline**: SHA-pinned actions, least-privilege token, committed lockfile, Dependabot, an `npm audit` CI gate, and `security.txt`.

---

## Role

End-to-end architecture and implementation: the ingest-evidence and attestation model, the fenced feed, the groups × rings deployment lifecycle, the unattended update pipeline, the fleet inventory and CVE index, the open-core license-segregation strategy, and the public marketing site and community-edition distribution. The platform is engineered to a compliance-grade bar so the architecture stays open to larger regulated deployments as scope grows.
