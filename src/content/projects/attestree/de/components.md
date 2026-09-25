---
title: Komponentenreferenz
description: Attestree Schlüsselkomponenten — Ingest-Evidenz, Attestierung, eingezäunter Feed, Groups × Rings, Update-Pipeline, CVE-Index und die Open-Core Edition
---

## Ingest-Evidenz

Das Ingest Gate vertraut nicht darauf, was ein Paket *behauptet*; es hält fest, was der Installer *tut*. Jede Aufnahmeentscheidung stützt sich auf Evidenz, die gesammelt wird, bevor ein Endpunkt das Artefakt sieht.

| Evidenz | Was sie belegt |
|---------|----------------|
| **Installer-Signatur** | PE-, MSI- und MSIX/APPX-Signaturen werden geprüft; eine Signatur, die zwischen Versionen auftaucht oder verschwindet, stoppt das Release |
| **Publisher-Kontinuität** | Ein geändertes Signaturzertifikat desselben Publishers wird sichtbar gemacht, nicht still akzeptiert |
| **Sandbox-Detonation** | Das Paket wird in einer isolierten Umgebung tatsächlich installiert und sein Verhalten aufgezeichnet |
| **Beobachtete SBOM** | Eine CycloneDX-1.6-SBOM aus der beobachteten Installation (Syft), nicht aus den Angaben des Publishers |
| **Policy-Entscheidung** | Policy-as-Code evaluiert die Evidenz; dieselbe Richtlinie wendet der Endpoint-Agent bei der Installation erneut an |

Die Aufnahme-/Ablehnungsentscheidung ist reproduzierbar und überprüfbar: Jedes Verdikt verweist auf die Evidenz, auf der es beruht.

---

## Attestierung & Evidenz-Bundles

Die Aufnahme ist kein Nebeneffekt; sie erzeugt Evidenz.

- **Signiertes in-toto-Statement**: Jedes aufgenommene Artefakt erhält ein in-toto Statement v1 mit SLSA-v1-Provenance und SBOM-Digest, signiert mit ECDSA P-256 gegen den Root of Trust des Betreibers.
- **Nativ, nicht umhüllt**: Signierung, SBOM-Erzeugung und Richtlinie sind eingebaut. Es braucht keinen externen cosign-Wrapper, kein separates SBOM-Tool und keinen Admission Controller. Sigstore (Keyless Signing, Rekor-Transparency-Log) wird als offenes Format unterstützt, ist aber keine Abhängigkeit.
- **Unabhängig verifizierbar**: Ein Auditor verifiziert ein Receipt mit einem CLI-Aufruf oder einem kurzen Skript, ohne der ausrollenden Partei vertrauen zu müssen.
- **Export von Evidenz-Bundles**: Die gesamte Evidenz lässt sich als signiertes Bundle exportieren und offline verifizieren. Der Export funktioniert in der freien Edition; hardwaregestützte Schlüsselverwahrung (HSM / vTPM-gebundene Roots) steht auf der kommerziellen Roadmap.

Das schliesst die Lücke, die der Status quo offenlässt: Wenn ein Artefakt ausgeliefert wird, „weil das CDN es sagte", kann Monate später niemand die Frage des Auditors beantworten. Mit Attestree ist die Antwort ein signierter Datensatz.

---

## Eingezäunter winget-Feed

- **Eigene Quelle**: eine spezifikationskonforme winget-REST-Quelle, die nur aufgenommene Pakete ausliefert.
- **Eingezäunte Endpunkte**: Der Agent bindet Endpunkte an diese Quelle; ein normales `winget install` löst gegen den freigegebenen Katalog auf, nicht gegen das öffentliche Repository.
- **Hash-gepinnt**: Endpunkte installieren nur exakt den freigegebenen SHA-256.

---

## Groups × Rings

Groups bestimmen *was*; Rings bestimmen *welche Version*.

| Ring | Rolle |
|------|-------|
| **Canary** | Erste, kleinste Exposition; erkennt Defekte früh |
| **Pilot** | Breitere Validierungskohorte |
| **Broad** | Mehrheit der Flotte |
| **All** | Vollständiger Rollout |

- **PC-Groups**: versionsfreie Basis-Sets von Paketen; ein Endpunkt konvergiert zur Vereinigung seiner Groups.
- **Bulk-Promotion**: Operatoren prüfen freigegebene Artefakte und befördern sie in einer Aktion in einen Ring. Jede Promotion ist ein signiertes Ereignis.
- **Rollback auf jede frühere Version**: Der Agent deinstalliert die aktuelle Version und installiert die vorherige.
- **Bestätigungspflichtige Rollback-Vorschläge**: Ein Rollout, der zu scheitern beginnt, erzeugt einen Rollback-*Vorschlag*, den der Operator bestätigt. Das ist standardmässig deaktiviert, und die automatische Ausführung bleibt eingezäunt.

---

## Unbeaufsichtigte Update-Pipeline

Eine optionale Pipeline hält winget-Pakete aktuell, ohne das Gate aufzugeben:

- Neue Upstream-Versionen werden aufgenommen, detoniert und Ring für Ring befördert.
- Die Pipeline **stoppt in einer Review-Queue**, wenn sich das Signaturzertifikat eines Publishers ändert oder ein Installer unsigniert eintrifft.
- Der Endpoint-Agent aktualisiert sich selbst über dieselben Rings, mit Pause, Resume, Abort und lokalem Rollback-Floor.

---

## Flotteninventar & CVE-Index

- **Beobachtetes Inventar**: winget und Chocolatey werden durchgängig verwaltet (Inventar und Deployment); Scoop-Inventar wird erfasst, zählt aber nicht als verwalteter Paketmanager.
- **Selbst gehosteter CVE-Index**: Das beobachtete Inventar wird mit der öffentlichen CVE-Liste (cvelistV5) und dem CISA-KEV-Katalog abgeglichen; die Daten werden ausschliesslich heruntergeladen.
- **Air-Gap-tauglich**: Ein Offline-Index-Bundle versorgt Hosts ohne ausgehenden Zugriff.

---

## Open-Core Edition

Attestree ist Open-Core, mit einer bewussten Lizenzgrenze.

| Komponente | Lizenz / Distribution |
|------------|-----------------------|
| **Installer-Shim + IPC-Vertrag** | Apache-2.0 (Open Source) |
| **Plattform-Control-Plane** | Closed-Source, kommerziell |
| **Community Edition** | Kostenloser, selbst gehosteter Docker-Compose-Stack ohne Cloud-Abhängigkeit; Sigstore-cosign-signierte Images; Early Access |
| **Kommerzielle Topologie** | Selbst gehostete Appliance oder dedizierte Instanz im eigenen Azure-Abonnement des Kunden; kein geteiltes Multi-Tenant-SaaS |

Die Lizenzgrenze wird mechanisch im Build durchgesetzt, sodass Closed-Source-Code nicht versehentlich umlizenziert werden kann. Ein `git mv` eines Projekts zwischen dem offenen und dem geschlossenen Baum lässt den Build fehlschlagen, statt seine Lizenz still zu ändern.

Die Community Edition ist für den Betrieb gebaut, nicht nur für die Demo:

- **Konten**: vier richtliniengestützte Rollen, TOTP-Zwei-Faktor und ein Break-Glass-Recovery-CLI. SSO ist in jeder kommerziellen Stufe enthalten und kein Upsell.
- **Enrollment**: Setup-Token beim ersten Start und Enrollment-Tokens, die aus der URL erzeugt werden, die Agents tatsächlich verwenden.
- **Runbooks**: Backup/Restore, Downgrade/Rollback mit Rollback-Ledger und ein Caddy-TLS-Overlay für ein vertrauenswürdiges HTTPS-Frontend.

---

## Marketing-Website

Die öffentliche Website unter attestree.com präsentiert Produktseiten, Käufersegmente, Compliance-Zuordnungen (etwa NIS2), Research-Essays, praktische Anleitungen, etwa zum Einzäunen einer Flotte auf eine private winget-Quelle, und eine Warteliste.

- **Statischer Astro-Build** mit Tailwind + MDX, deployt auf Cloudflare Pages (Preview-Deploy pro PR), mit zur Build-Zeit generierten OG-Bildern, Structured Data und `llms.txt`.
- **Warteliste** läuft als Same-Origin Cloudflare Pages Function mit D1 in einer EU-Jurisdiktion, mit gehärteter Turnstile-Verifikation und dokumentierter Datenverarbeitung.
- **Source-of-Truth-Disziplin**: Die Website-Texte werden bei jedem Plattform-Release neu abgeglichen, mit einer expliziten Trennung zwischen ausgeliefert und Roadmap. Aussagen, die das Produkt noch nicht belegt, etwa WDAC-Durchsetzung, werden entfernt statt relativiert.
- **Build-Security-Baseline**: SHA-gepinnte Actions, least-privilege Token, committetes Lockfile, Dependabot, ein `npm audit` CI-Gate und `security.txt`.

---

## Rolle

Architektur und Umsetzung end-to-end: das Ingest-Evidenz- und Attestierungsmodell, der eingezäunte Feed, der Groups-×-Rings-Deployment-Lebenszyklus, die unbeaufsichtigte Update-Pipeline, Flotteninventar und CVE-Index, die Open-Core-Strategie zur Lizenz-Segregation sowie die öffentliche Marketing-Website und die Community-Edition-Distribution. Die Plattform ist auf ein Compliance-taugliches Niveau ausgelegt, damit die Architektur offen bleibt für grössere regulierte Deployments, wenn der Umfang wächst.
