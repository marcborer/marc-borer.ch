---
title: Architektur
description: Attestree Systemarchitektur — Ingest Gate, Attestierung, Rings und das Open-Core-Distributionsmodell
---

## Systemarchitektur

Attestree ist eine Software-Supply-Chain-Plattform für Windows-Flotten, aufgebaut um eine einzige Idee: **Provenance beim Ingest prüfen, nicht nach der Installation.** Die meisten Scanner untersuchen Binaries, die bereits flottenweit ausgerollt sind; Attestree besitzt die Katalog- und Distributionsschicht, sodass Richtlinien durchgesetzt werden, *bevor* ein Artefakt überhaupt einen Endpunkt erreicht.

Das System hat zwei Oberflächen: eine **Control Plane + Agent**, die Ingest Gate, Attestierung und ring-basiertes Deployment betreibt, und eine **öffentliche Eingangstür** — die Marketing-Website und eine Open-Core Community Edition.

### Ingest Gate

Jedes aus einer Quelle geladene Paket — heute winget, mit weiteren Paketmanagern und Custom-MSI/MST auf der Roadmap — durchläuft vor der Aufnahme ein Policy Gate.

| Stufe | Verantwortlichkeit |
|-------|--------------------|
| **Fetch** | Artefakt und Metadaten aus der konfigurierten Quelle laden |
| **Provenance-Prüfung** | Build-Provenance und Signaturen gegen vertrauenswürdige Roots verifizieren |
| **SBOM** | CycloneDX Software Bill of Materials anhängen / verifizieren |
| **Policy-Evaluierung** | Mindest-SLSA-Level, CVE-Schweregrad-Obergrenze und Lizenz-Allow-List durchsetzen |
| **Entscheidung** | Aufnehmen (mit signiertem Receipt) oder ablehnen — abgelehnte Artefakte erreichen keinen Ring |

### Ring-basiertes Deployment

Aufgenommene Artefakte werden über Promotion-Rings ausgerollt statt flottenweit auf einmal, sodass ein fehlerhaftes Paket auf einen kleinen Blast-Radius begrenzt bleibt und mit einer einzigen Policy-Änderung zurückgerollt werden kann.

```
Quelle ──► Ingest Gate ──► Signierte Attestierung
                                  │
                                  ▼
                          Canary ──► Pilot ──► Broad ──► All
                                  │
                          Auto-Rollback bei Fehlersignal
```

### Attestiertes Inventar

Parallel zum Deploy-Pfad pflegt Attestree ein einheitliches, attestiertes Inventar über jeden Paketmanager, den ein Gerät betreibt — ein einziges Rollup statt der Abstimmung einzelner Tool-Ausgaben. Eine CVE-Matrix gleicht das gemeldete Inventar gegen öffentliche Schwachstellen-Feeds (NVD / OSV / MSRC) ab, und das Gesamtbild lässt sich als signiertes Bundle exportieren, das ein Auditor unabhängig verifizieren kann.

### Control-Plane-Stack

| Schicht | Wahl |
|---------|------|
| **Server-Runtime** | Windows Server 2025 |
| **Client / Agent** | Windows 11, .NET, AOT-kompilierter Agent + Installer-Shim |
| **Operativer Store** | PostgreSQL mit Per-Tenant-Scope als erstklassiger Invariante |
| **Distribution** | OCI-kompatible Registries |
| **Attestierung** | Signierte Receipts; heute verwaltete Signaturschlüssel, Sigstore-verankerte Verifikation auf der Roadmap |

### Open-Core-Distribution

Attestree ist Open-Core. Der SYSTEM/User-**Installer-Shim** und sein IPC-Vertrag sind Open Source unter Apache-2.0; die Plattform selbst ist Closed-Source. Eine **Community Edition** wird als cosign-signiertes Docker-Image zum Self-Hosting veröffentlicht, während die kommerzielle Control Plane als Multi-Tenant-SaaS oder als selbst gehostete Appliance aus demselben Bundle verfügbar ist.

### Öffentliche Eingangstür

Die Marketing-Website unter attestree.com ist eine separate, vollständig öffentliche Oberfläche:

| Schicht | Wahl |
|---------|------|
| **Framework** | Astro mit Tailwind (via PostCSS) + MDX, statischer Output |
| **Hosting** | Cloudflare Pages (Git-Integration-Deploys, Preview-Deploy pro PR) |
| **Warteliste** | Same-Origin Cloudflare Pages Function mit D1 in einer EU-Jurisdiktion |
| **Bot-Abwehr** | Cloudflare Turnstile |
| **Build-Sicherheit** | SHA-gepinnte GitHub Actions, least-privilege `GITHUB_TOKEN`, committetes Lockfile, Dependabot und ein `npm audit` CI-Gate |
