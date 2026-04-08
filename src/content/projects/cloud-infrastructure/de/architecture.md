---
title: Architektur
description: Exchange & Teams Migration, Hybrid Identity und SIEM — Architekturentscheidungen und Systemdesign
---

## Exchange Online & Teams Migration

*Migration einer unternehmenskritischen Messaging-Plattform in eine Cloud-basierte Architektur mit Voice-Integration*

### Problem

Das Unternehmen betrieb eine veraltete On-Premises Messaging- und Telefonie-Infrastruktur,
die sich dem End of Support näherte. Die fragmentierte Konfiguration verursachte erhöhten
Betriebsaufwand und begrenzte die Skalierbarkeit.

### Ansatz

Zwei-Phasen-Migrationsstrategie — Telefonie zuerst, Postfächer danach (kleinerer Blast Radius, baut operatives Vertrauen auf vor der grösseren Migration):

- **Teams Calling** — Direct Routing mit SBC-Hochverfügbarkeit (gewählt gegenüber Calling Plan aufgrund Kostensteuerung, Nummernportabilität und bestehender SBC-Investition)
- **Exchange Online** — Bridge-Architektur für Hybrid-Koexistenz (ermöglicht gestaffelte Migration ohne Ausfallzeit bei gleichzeitigem Erhalt des Mail-Flows zwischen On-Premises und Cloud)
- **Öffentliche Ordner** — Modernisiert und migriert mittels PowerShell-Automatisierungspipeline
- **Sicherheitsverbesserung** — Lizenz-Upgrade für erweiterte Bedrohungsabwehr (ATP, Attack Simulation, Safe Attachments/Links)

### Gelöste Herausforderungen

- **Voice-Interoperabilität** — IVR-Kompatibilitätsprobleme durch Anpassung der Media-Bypass- und Early-Media-Konfiguration gelöst
- **Hybrid-Koexistenz** — Bridge-basierte Migration mit korrekten Mail-Flow-Connectors und E-Mail-Authentifizierung (SPF/DKIM/DMARC)
- **Anbieterbewertung** — Strukturierte Evaluation der SIP-Trunk-Anbieter unter Berücksichtigung von Nummernportierungsrisiken

### Ergebnis

- **Vollständige Migration ohne Ausfallzeit** — Unternehmensweite Umstellung auf Exchange Online und Teams mit durchgehendem Betrieb
- **Einheitliche Kommunikationsplattform** — Messaging, Telefonie und Collaboration auf einer Plattform konsolidiert
- **Erhöhte Sicherheitslage** — Advanced Threat Protection, Attack Simulation und Safe Attachments/Links unternehmensweit aktiviert
- **Anbieterunabhängigkeit** — Direct Routing ermöglicht flexiblen Anbieterwechsel ohne Plattformänderung

---

## Hybrid Identity & User Lifecycle Automation

*Vollständig standardisierte Automatisierung von Mitarbeiter-Onboarding und -Offboarding*

### Funktionsweise

- **Self-Service-Portal** — HR-initiierte Bereitstellung über ein Low-Code-Portal
- **On-Premises-Orchestrierung** — PowerShell-Pipeline für Active Directory-Kontobereitstellung, Fileshare-Berechtigungen und Cloud-Gruppenmitgliedschaften
- **Cloud-Onboarding** — Automatische Postfachkonfiguration, Lizenzierung und Telefonnummernzuweisung via Azure Automation und Graph API
- **Lifecycle-Management** — Standardisierter Onboarding- und Offboarding-Prozess über alle IT-Systeme, ausgelöst durch eine einzelne HR-Aktion

---

## Zentrale Log-Aggregation und Anomalieerkennung

*Unternehmensweite SIEM-Plattform mit Elastic Stack*

### Problem

Sicherheitsrelevante Ereignisse — fehlgeschlagene Anmeldungen, Kontosperrungen,
Authentifizierungsversuche, Anwendungsfehler — waren über die gesamte Serverflotte
verstreut, ohne Möglichkeit zur Korrelation oder Alarmierung bei Mustern. Bedrohungen
wie Password-Spray-Angriffe blieben ohne zentrale Sichtbarkeit unsichtbar.

### Funktionsweise

- **Infrastruktur** — Elasticsearch-Logstash-Kibana-Cluster in Hochverfügbarkeitskonfiguration
- **Datenerfassung** — Multi-Source-Sammlung: Anwendungslogs, Performance-Metriken, Windows-Events und Uptime-Monitoring
- **Sicherheits-Dashboards** — Korrelation von Kontosperrungen mit Anmeldefehlermustern zur Echtzeiterkennung von Password-Spray-Angriffen, Brute-Force-Versuchen und anomalem Authentifizierungsverhalten
- **Betriebsüberwachung** — Performance-Metriken, Uptime-Monitoring und Compliance-Reporting über die gesamte Serverflotte

### Ergebnis

- **Zentrale Sicherheitssichtbarkeit** — Von verteilten, nicht korrelierbaren Logs zu unternehmensweiter Echtzeit-Bedrohungserkennung
- **Automatisierte Erkennung** — Password-Spray-Angriffe, Brute-Force-Versuche und anomales Authentifizierungsverhalten werden in Echtzeit erkannt
- **Betriebliche Transparenz** — Korrelation von Performance-Daten, Verfügbarkeit und Sicherheitsereignissen über die gesamte Infrastruktur
