---
title: Komponentenreferenz
description: Attestree Schlüsselkomponenten — Policy Gate, Attestierung, Rings, Inventar und die Open-Core Edition
---

## Policy-Dimensionen

Das Ingest Gate evaluiert jedes Artefakt über unabhängige Policy-Dimensionen. Ein Artefakt wird nur aufgenommen, wenn es alle erfüllt; jeder Fehlschlag führt zur Ablehnung mit Begründung, niemals zu einem Flotten-Ring.

| Dimension | Was sie durchsetzt |
|-----------|--------------------|
| **Provenance** | Build-Provenance und Signaturen verketten zu einem vertrauenswürdigen Root |
| **SBOM** | Eine CycloneDX Bill of Materials ist vorhanden und verifiziert |
| **SLSA-Level** | Artefakt erfüllt ein konfiguriertes Mindest-SLSA-Build-Level |
| **CVE-Schweregrad** | Keine Komponente überschreitet den konfigurierten Maximalschweregrad |
| **Lizenz** | Jede Komponentenlizenz steht auf der Allow-List |

Eine typische Policy liest sich als Konfiguration — ein verwalteter Trust-Root, ein Mindest-SLSA-Level, eine CVE-Obergrenze und eine explizite Lizenz-Allow-List — sodass die Aufnahme-/Ablehnungsentscheidung reproduzierbar und überprüfbar ist.

---

## Attestierung & Receipts

Die Aufnahme ist kein Nebeneffekt; sie erzeugt Evidenz.

- **Signiertes Receipt** — Jedes aufgenommene Artefakt trägt ein Receipt, das die verifizierte Provenance, die angehängte SBOM und das SLSA-Level festhält.
- **Unabhängig verifizierbar** — Receipts verifizieren gegen einen öffentlichen Schlüssel, sodass ein Auditor bestätigen kann, „wer dieses Artefakt auf welcher Grundlage freigegeben hat" — ohne der ausrollenden Partei vertrauen zu müssen.
- **Roadmap zu Sigstore** — Heute verwaltete Signaturschlüssel; Sigstore-verankerte Verifikation mit TUF-Metadaten ist auf der Roadmap.

Das schliesst die Lücke, die der Status quo offenlässt: Wenn ein Artefakt ausgeliefert wird, „weil das CDN es sagte", kann Monate später niemand die Frage des Auditors beantworten. Mit Attestree ist die Antwort ein signierter Datensatz.

---

## Promotion-Rings

Das Deployment ist gestaffelt, nicht alles auf einmal.

| Ring | Rolle |
|------|-------|
| **Canary** | Erste, kleinste Exposition — erkennt Defekte früh |
| **Pilot** | Breitere Validierungskohorte |
| **Broad** | Mehrheit der Flotte |
| **All** | Vollständiger Rollout |

- **Bulk- und Per-Row-Promotion** — Operatoren befördern, setzen Soak zurück oder rollen auf Ring- oder einzelner Paketebene zurück.
- **Operator-editierbare Soak-Floors** — minimale Verweildauer pro Ring vor erlaubter Promotion, pro Tenant konfigurierbar.
- **Auto-Rollback** — ein Fehlersignal pausiert oder kehrt die Promotion über eine einzige signierte Policy-Änderung um.

---

## Attestiertes Inventar

Ein einheitliches Inventar über jeden Paketmanager, den ein Gerät betreibt, ersetzt die Per-Tool-Abstimmung.

- **Paketmanager-übergreifendes Rollup** — eine normalisierte Sicht, gekeyt nach kanonischer Artefakt-Identität.
- **Serverseitige Klassifikation** — Pakete werden klassifiziert (verwaltet, attestiert, MSI-installiert usw.), sodass der Long Tail sichtbar ist, nicht nur die winget-verwaltete Teilmenge.
- **CVE-Matrix** — gemeldetes Inventar abgeglichen gegen NVD / OSV / MSRC.
- **Signierter Export** — der Auditor liest dasselbe signierte Bundle wie der Operator.

---

## Open-Core Edition

Attestree ist Open-Core, mit einer bewussten Lizenzgrenze.

| Komponente | Lizenz / Distribution |
|------------|-----------------------|
| **Installer-Shim + IPC-Vertrag** | Apache-2.0 (Open Source) |
| **Plattform-Control-Plane** | Closed-Source, kommerziell |
| **Community Edition** | Cosign-signiertes Docker-Image, frei für kleine Flotten, self-hosted |
| **Kommerzielle Topologie** | Multi-Tenant-SaaS oder selbst gehostete Appliance aus demselben Bundle |

Die Lizenzgrenze wird mechanisch im Build durchgesetzt, sodass Closed-Source-Code nicht versehentlich umlizenziert werden kann — ein `git mv` eines Projekts zwischen dem offenen und dem geschlossenen Baum lässt den Build fehlschlagen, statt seine Lizenz still zu ändern.

---

## Marketing-Website

Die öffentliche Website unter attestree.com präsentiert Käufersegmente, Produktseiten, Preise, Research und eine Warteliste.

- **Statischer Astro-**Build mit Tailwind + MDX, deployt auf Cloudflare Pages (Preview-Deploy pro PR).
- **Warteliste** läuft als Same-Origin Cloudflare Pages Function mit D1 in einer EU-Jurisdiktion, mit Turnstile-Bot-Abwehr und dokumentierter Datenverarbeitung.
- **Build-Security-Baseline** — SHA-gepinnte Actions, least-privilege Token, committetes Lockfile, Dependabot und ein `npm audit` CI-Gate.

---

## Rolle

Architektur und Umsetzung end-to-end: das Ingest-Gate- und Attestierungsmodell, der Ring-Promotion-Lebenszyklus, die paketmanager-übergreifende Inventar-Primitive, die Open-Core-Strategie zur Lizenz-Segregation sowie die öffentliche Marketing-Website und die Community-Edition-Distribution. Die Plattform ist auf ein Compliance-taugliches Niveau ausgelegt, damit die Architektur offen bleibt für grössere regulierte Deployments, wenn der Umfang wächst.
