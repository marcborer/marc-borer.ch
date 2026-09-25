---
title: Architektur
description: Attestree Systemarchitektur — Ingest Gate, signierte Attestierung, eingezäunter winget-Feed, Groups × Rings und das Open-Core-Distributionsmodell
---

## Systemarchitektur

Attestree ist eine Deployment-Control-Plane für Windows-Flotten, aufgebaut um eine einzige Idee: **beim Ingest attestieren, nicht nach der Installation.** Die meisten Scanner untersuchen Binaries, die bereits flottenweit laufen. Attestree besitzt die Katalog- und Distributionsschicht, sodass jedes Artefakt beobachtet, signiert und gegen die Richtlinie geprüft wird, *bevor* ein Endpunkt es installieren kann.

Das System hat zwei Oberflächen: eine **Control Plane + Endpoint-Agent**, die Ingest Gate, Attestierung und ring-basiertes Deployment betreibt, und eine **öffentliche Eingangstür** aus Marketing-Website und Open-Core Community Edition.

### Ingest Gate

Jedes aus einer Quelle geladene Paket durchläuft das Gate, bevor es in den Katalog gelangt. winget ist heute live, und Chocolatey wird unter derselben Control Plane verwaltet. MSI/MST-Transforms, Treiber-Rings, Windows Update as Code und weitere Paketmanager stehen auf der Roadmap.

| Stufe | Verantwortlichkeit |
|-------|--------------------|
| **Fetch** | Installer und Manifest aus der konfigurierten Quelle laden |
| **Installer-Provenance** | Installer-Signatur (PE, MSI, MSIX/APPX) und Kontinuität des Publisher-Zertifikats gegenüber der Vorversion prüfen |
| **Detonation** | Paket in einer Sandbox installieren und festhalten, was es tatsächlich tut |
| **SBOM** | CycloneDX-1.6-SBOM aus der beobachteten Installation erzeugen (Syft); eine Beobachtung, keine Deklaration |
| **Policy Gate** | Evidenz als Policy-as-Code evaluieren und aufnehmen oder ablehnen |
| **Attestierung** | in-toto-Statement mit SLSA-v1-Provenance und SBOM-Digest signieren (ECDSA P-256) |

### Drei Durchsetzungspunkte

In einer Windows-Flotte ist der Endpunkt der tragende Durchsetzungspunkt. Die Richtlinie wird deshalb nicht nur einmal geprüft:

1. **Ingest Gate**: blockiert ein Artefakt, bevor es den Katalog erreicht.
2. **Reconciliation**: kontinuierlicher GitOps-Abgleich gegen den deklarierten Soll-Zustand; Drift erscheint als Telemetrie.
3. **Endpoint-Re-Verifikation**: Der Agent prüft Signatur, Hash und Richtlinie bei der Installation erneut und installiert nur exakt den freigegebenen SHA-256.

### Eingezäunter winget-Feed

Endpunkte beziehen Pakete aus der eigenen, attestierten, spezifikationskonformen winget-REST-Quelle des Betreibers und sind auf diese eingezäunt. Ein Benutzer kann weiterhin ein normales `winget install` ausführen, der Agent liefert aber nur aufgenommene Pakete, gepinnt auf ihren freigegebenen Hash, nicht das öffentliche Repository.

### Groups × Rings

```
Quelle ──► Ingest Gate ──► Signierte Attestierung ──► Eingezäunter winget-Feed
                                                              │
                          Groups bestimmen *was*              ▼
                          Rings bestimmen *welche Version*    Canary ──► Pilot ──► Broad ──► All
                                                              │
                                                  Rollback auf jede frühere Version
```

**PC-Groups** tragen versionsfreie Basis-Sets von Paketen; ein Endpunkt konvergiert zur Vereinigung aller Groups, denen er angehört. **Rings** (canary → pilot → broad → all) lösen jedes Paket beim Deploy auf die exakt attestierte Version auf. Ein Rollback führt auf jede frühere Version zurück: Der Agent deinstalliert die aktuelle und installiert die vorherige. Beginnt ein Rollout zu scheitern, wird ein Rollback *zur Bestätigung durch den Operator vorgeschlagen*, nicht automatisch ausgeführt. Dieses Verhalten ist standardmässig deaktiviert.

Eine optionale **unbeaufsichtigte Update-Pipeline** nimmt neue winget-Versionen auf, detoniert sie und befördert sie Ring für Ring. Sie stoppt in einer Review-Queue, wenn sich das Signaturzertifikat eines Publishers ändert oder ein Installer unsigniert eintrifft.

### Flotteninventar & CVE-Index

Parallel zum Deploy-Pfad meldet der Agent ein beobachtetes Inventar über die Paketmanager eines Geräts. Ein **selbst gehosteter Flotten-CVE-Index** gleicht dieses Inventar mit der öffentlichen CVE-Liste (cvelistV5) und dem CISA-Katalog der Known Exploited Vulnerabilities ab. Die Daten werden ausschliesslich heruntergeladen; für Air-Gapped-Hosts gibt es ein Offline-Bundle. Das Gesamtbild lässt sich als signiertes Evidenz-Bundle exportieren, das ein Auditor offline verifiziert.

### Control-Plane-Stack

| Schicht | Wahl |
|---------|------|
| **Installer-Shim** | .NET 10 Native AOT, Windows 11 / Windows Server 2022+ |
| **Endpoint-Agent** | .NET, aktualisiert sich selbst über dieselben Rings, mit Pause/Resume/Abort und lokalem Rollback-Floor |
| **Server** | Docker-Image mit PostgreSQL-Sidecar; Per-Tenant-Scope als erstklassige Invariante |
| **Attestierungsformate** | in-toto Statement v1, SLSA-v1-Provenance, CycloneDX 1.6, ECDSA P-256; Sigstore als optionales offenes Format |
| **Release-Signierung** | Community-Edition-Images, Image-SBOM und der Offline-Bundle-Verifier sind Sigstore-cosign-signiert |

### Open-Core-Distribution

Attestree ist Open-Core. Der SYSTEM/User-**Installer-Shim** und sein IPC-Vertrag sind Open Source unter Apache-2.0; die Plattform selbst ist Closed-Source. Die **Community Edition** ist kostenlos und wird mit Docker Compose selbst gehostet. Sie kommt ohne Cloud-Abhängigkeit aus und befindet sich derzeit im Early Access. Kommerzielle Deployments laufen als selbst gehostete Appliance oder als dedizierte Instanz im eigenen Azure-Abonnement des Kunden. Ein geteiltes Multi-Tenant-SaaS gibt es bewusst nicht.

### Öffentliche Eingangstür

Die Marketing-Website unter attestree.com ist eine separate, vollständig öffentliche Oberfläche:

| Schicht | Wahl |
|---------|------|
| **Framework** | Astro mit Tailwind + MDX, statischer Output, OG-Bilder zur Build-Zeit generiert |
| **Hosting** | Cloudflare Pages (Git-Integration-Deploys, Preview-Deploy pro PR) |
| **Warteliste** | Same-Origin Cloudflare Pages Function mit D1 in einer EU-Jurisdiktion |
| **Bot-Abwehr** | Cloudflare Turnstile mit gehärteter serverseitiger Siteverify |
| **Auffindbarkeit** | Structured Data, `llms.txt`, Sitemap mit wahrheitsgetreuem `<lastmod>` |
| **Build-Sicherheit** | SHA-gepinnte GitHub Actions, least-privilege `GITHUB_TOKEN`, committetes Lockfile, Dependabot, ein `npm audit` CI-Gate und `security.txt` |
