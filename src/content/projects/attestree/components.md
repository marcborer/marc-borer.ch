---
title: Component Reference
description: Attestree key components — policy gate, attestation, rings, inventory, and the open-core edition
---

## Policy Dimensions

The ingest gate evaluates every artifact across independent policy dimensions. An artifact is admitted only when it satisfies all of them; any failure routes it to rejection with a reason, never to a fleet ring.

| Dimension | What it enforces |
|-----------|------------------|
| **Provenance** | Build provenance and signatures chain to a trusted root |
| **SBOM** | A CycloneDX bill of materials is present and verified |
| **SLSA level** | Artifact meets a configured minimum SLSA build level |
| **CVE severity** | No component exceeds the configured maximum severity |
| **License** | Every component license is on the allow-list |

A typical policy reads as configuration — a managed-key trust root, a minimum SLSA level, a CVE ceiling, and an explicit license allow-list — so the admit/reject decision is reproducible and reviewable.

---

## Attestation & Receipts

Admission is not a side effect; it produces evidence.

- **Signed receipt** — Each admitted artifact carries a receipt recording the verified provenance, the attached SBOM, and the SLSA level.
- **Independently verifiable** — Receipts verify against a public key, so an auditor can confirm "who approved this artifact, and on what basis" without trusting the deploying party.
- **Roadmap to Sigstore** — Managed signing keys today; Sigstore-rooted verification with TUF metadata is on the roadmap.

This closes the gap the status quo leaves open: when an artifact ships because "the CDN said so," nobody can answer the auditor's question months later. With Attestree, the answer is a signed record.

---

## Promotion Rings

Deployment is staged, not all-at-once.

| Ring | Role |
|------|------|
| **Canary** | First, smallest exposure — catches breakage early |
| **Pilot** | Wider validation cohort |
| **Broad** | Majority of the fleet |
| **All** | Full rollout |

- **Bulk and per-row promotion** — operators promote, clear soak, or roll back at the ring or individual-package level.
- **Operator-editable soak floors** — minimum dwell time per ring before promotion is allowed, configurable per tenant.
- **Auto-rollback** — a failure signal pauses or reverses promotion via a single signed policy change.

---

## Attested Inventory

A unified inventory across every package manager a device runs, replacing per-tool reconciliation.

- **Cross-package-manager rollup** — one normalized view keyed by canonical artifact identity.
- **Server-side classification** — packages are classified (managed, attested, MSI-installed, and so on) so the long tail is visible, not just the winget-managed slice.
- **CVE matrix** — reported inventory reconciled against NVD / OSV / MSRC.
- **Signed export** — the auditor reads the same signed bundle the operator does.

---

## Open-Core Edition

Attestree is open-core, with a deliberate license boundary.

| Component | License / Distribution |
|-----------|------------------------|
| **Installer shim + IPC contract** | Apache-2.0 (open source) |
| **Platform control plane** | Closed-source, commercial |
| **Community edition** | Cosign-signed Docker image, free for small fleets, self-hosted |
| **Commercial topology** | Multi-tenant SaaS or self-hosted appliance from the same bundle |

The license boundary is enforced mechanically in the build, so closed-source code cannot be relicensed by accident — a `git mv` of a project between the open and closed trees fails the build rather than quietly changing its license.

---

## Marketing Site

The public site at attestree.com presents buyer segments, product pages, pricing, research, and a waitlist.

- **Static Astro** build with Tailwind + MDX, deployed to Cloudflare Pages (preview deploy per PR).
- **Waitlist** runs as a same-origin Cloudflare Pages Function backed by D1 in an EU jurisdiction, with Turnstile bot defense and documented data-handling.
- **Build-security baseline** — SHA-pinned actions, least-privilege token, committed lockfile, Dependabot, and an `npm audit` CI gate.

---

## Role

End-to-end architecture and implementation: the ingest-gate and attestation model, the ring-promotion lifecycle, the cross-package-manager inventory primitive, the open-core license-segregation strategy, and the public marketing site and community-edition distribution. The platform is engineered to a compliance-grade bar so the architecture stays open to larger regulated deployments as scope grows.
