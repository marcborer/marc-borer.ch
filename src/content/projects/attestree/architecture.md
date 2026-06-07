---
title: Architecture
description: Attestree system architecture — ingest gate, attestation, rings, and the open-core distribution model
---

## System Architecture

Attestree is a software supply-chain platform for Windows fleets built around a single idea: **verify provenance at ingest, not after install.** Most scanners inspect binaries that are already deployed across a fleet; Attestree owns the catalog and distribution layer, so policy is enforced *before* an artifact ever reaches an endpoint.

The system has two surfaces: a **control plane + agent** that runs the ingest gate, attestation, and ring-promoted deployment, and a **public front door** — the marketing site and an open-core community edition.

### Ingest Gate

Every package pulled from a source — winget today, with additional package managers and custom MSI/MST on the roadmap — passes through a policy gate before admission.

| Stage | Responsibility |
|-------|----------------|
| **Fetch** | Retrieve the artifact and its metadata from the configured source |
| **Provenance check** | Verify build provenance and signatures against trusted roots |
| **SBOM** | Attach / verify a CycloneDX software bill of materials |
| **Policy evaluation** | Enforce minimum SLSA level, CVE-severity ceiling, and license allow-list |
| **Decision** | Admit (with a signed receipt) or reject — rejected artifacts never reach a ring |

### Ring-Promoted Deployment

Admitted artifacts roll out through promotion rings rather than fleet-wide at once, so a bad package is contained to a small blast radius and can be rolled back with a single policy change.

```
Source ──► Ingest Gate ──► Signed Attestation
                                  │
                                  ▼
                          Canary ──► Pilot ──► Broad ──► All
                                  │
                          auto-rollback on failure signal
```

### Attested Inventory

Alongside the deploy path, Attestree maintains a unified, attested inventory across every package manager a device runs — a single rollup instead of reconciling per-tool outputs. A CVE matrix reconciles reported inventory against public vulnerability feeds (NVD / OSV / MSRC), and the whole picture exports as a signed bundle an auditor can verify independently.

### Control Plane Stack

| Layer | Choice |
|-------|--------|
| **Server runtime** | Windows Server 2025 |
| **Client / agent** | Windows 11, .NET, AOT-compiled agent + installer shim |
| **Operational store** | PostgreSQL with per-tenant scope enforced as a first-class invariant |
| **Distribution** | OCI-compatible registries |
| **Attestation** | Signed receipts; managed signing keys today, Sigstore-rooted verification on the roadmap |

### Open-Core Distribution

Attestree ships as open-core. The SYSTEM/User **installer shim** and its IPC contract are open source under Apache-2.0; the platform itself is closed-source. A **community edition** is published as a cosign-signed Docker image for self-hosting, with the commercial control plane available as multi-tenant SaaS or a self-hosted appliance built from the same bundle.

### Public Front Door

The marketing site at attestree.com is a separate, fully public surface:

| Layer | Choice |
|-------|--------|
| **Framework** | Astro with Tailwind (via PostCSS) + MDX, static output |
| **Hosting** | Cloudflare Pages (Git-integration deploys, preview deploy per PR) |
| **Waitlist** | Same-origin Cloudflare Pages Function backed by D1 in an EU jurisdiction |
| **Bot defense** | Cloudflare Turnstile |
| **Build security** | SHA-pinned GitHub Actions, least-privilege `GITHUB_TOKEN`, committed lockfile, Dependabot, and an `npm audit` CI gate |
