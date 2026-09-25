---
title: Architecture
description: Attestree system architecture — ingest gate, signed attestation, fenced winget feed, groups × rings, and the open-core distribution model
---

## System Architecture

Attestree is a fleet deployment control plane for Windows built around a single idea: **attest at ingest, not after install.** Most scanners inspect binaries that are already running across a fleet; Attestree owns the catalog and distribution layer, so every artifact is observed, signed, and policy-checked *before* an endpoint can install it.

The system has two surfaces: a **control plane + endpoint agent** that runs the ingest gate, attestation, and ring-based deployment, and a **public front door** — the marketing site and an open-core community edition.

### Ingest Gate

Every package pulled from a source passes through the gate before it enters the catalog. winget is live today, and Chocolatey is managed under the same control plane. MSI/MST transforms, driver rings, Windows Update as code, and further package managers are on the roadmap.

| Stage | Responsibility |
|-------|----------------|
| **Fetch** | Retrieve the installer and its manifest from the configured source |
| **Installer provenance** | Check the installer signature (PE, MSI, MSIX/APPX) and publisher-certificate continuity against the previous version |
| **Detonation** | Install the package in a sandboxed environment and record what it actually does |
| **SBOM** | Generate a CycloneDX 1.6 SBOM from the observed install (Syft), an observation rather than a declaration |
| **Policy gate** | Evaluate the evidence as policy-as-code and admit or reject |
| **Attestation** | Sign an in-toto statement with SLSA v1 provenance and the SBOM digest (ECDSA P-256) |

### Three Enforcement Points

For a Windows fleet the endpoint is the load-bearing enforcement point, so policy is not checked only once:

1. **Ingest gate**: blocks an artifact before it reaches the catalog.
2. **Reconciliation**: continuous GitOps-style reconciliation against declared desired state, with drift surfaced as telemetry.
3. **Endpoint re-verification**: the agent re-checks signature, hash, and policy at install, and installs only the exact SHA-256 that was approved.

### Fenced winget Feed

Endpoints run from the operator's own attested, spec-compliant winget REST source and are fenced to it. A user can still run a normal `winget install`, but the agent serves only admitted packages, pinned to their approved hash, not the public repository.

### Groups × Rings

```
Source ──► Ingest Gate ──► Signed Attestation ──► Fenced winget Feed
                                                          │
                          Groups decide *what*            ▼
                          Rings decide *which version*    Canary ──► Pilot ──► Broad ──► All
                                                          │
                                                   rollback to any prior version
```

**PC Groups** carry version-free base sets of packages; an endpoint converges to the union of every group it belongs to. **Rings** (canary → pilot → broad → all) resolve each package to the exact attested version at deploy time. Rolling back means going to any prior version: the agent uninstalls the current one and installs the previous. When a rollout starts failing, a rollback is *proposed for the operator to confirm*, not executed automatically. That behaviour ships disabled by default.

An opt-in **unattended update pipeline** ingests, detonates, and promotes new winget versions ring by ring. It halts into a review queue when a publisher's signing certificate changes or an installer arrives unsigned.

### Fleet Inventory & CVE Index

Alongside the deploy path, the agent reports an observed inventory across the package managers a device runs. A **self-hosted fleet CVE index** matches that inventory against the public CVE list (cvelistV5) and the CISA Known Exploited Vulnerabilities catalogue. The data is pulled download-only, with an offline bundle for air-gapped hosts. The whole picture exports as a signed evidence bundle that an auditor verifies offline.

### Control Plane Stack

| Layer | Choice |
|-------|--------|
| **Installer shim** | .NET 10 Native AOT, Windows 11 / Windows Server 2022+ |
| **Endpoint agent** | .NET, self-updating through the same rings, with pause/resume/abort and a local rollback floor |
| **Server** | Docker image with a PostgreSQL sidecar; per-tenant scope enforced as a first-class invariant |
| **Attestation formats** | in-toto Statement v1, SLSA v1 provenance, CycloneDX 1.6, ECDSA P-256; Sigstore as an optional open format |
| **Release signing** | Community-edition images, image SBOM, and the offline bundle verifier are Sigstore-cosign signed |

### Open-Core Distribution

Attestree ships as open-core. The SYSTEM/User **installer shim** and its IPC contract are open source under Apache-2.0; the platform itself is closed-source. The **community edition** is free and self-hosted with Docker Compose. It needs no cloud dependency and is currently in early access. Commercial deployments run as a self-hosted appliance or as a dedicated instance in the customer's own Azure subscription. There is deliberately no shared multi-tenant SaaS.

### Public Front Door

The marketing site at attestree.com is a separate, fully public surface:

| Layer | Choice |
|-------|--------|
| **Framework** | Astro with Tailwind + MDX, static output, build-time OG image generation |
| **Hosting** | Cloudflare Pages (Git-integration deploys, preview deploy per PR) |
| **Waitlist** | Same-origin Cloudflare Pages Function backed by D1 in an EU jurisdiction |
| **Bot defense** | Cloudflare Turnstile with hardened server-side siteverify |
| **Discoverability** | Structured data, `llms.txt`, sitemap with truthful `<lastmod>` |
| **Build security** | SHA-pinned GitHub Actions, least-privilege `GITHUB_TOKEN`, committed lockfile, Dependabot, an `npm audit` CI gate, and `security.txt` |
