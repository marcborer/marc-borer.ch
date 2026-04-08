---
title: Komponentenreferenz
description: Intune Config-as-Code, BIOS-Compliance, MFA-Migration, Partner-Portal und E-Mail-Archivierungsautomatisierung
---

## Intune Configuration-as-Code

*GitOps-basierte Gerätekonfigurationsverwaltung*

### Funktionsweise

- **Configuration-as-Code** — Gerätekonfigurationen als JSON-Dateien in Git versioniert und über Pull Requests verwaltet
- **Automatische Validierung** — PowerShell-Tests prüfen Syntax, Pflichtfelder und Strukturkonformität vor jedem Deployment
- **CI/CD-Pipeline** — Mehrstufige Pipeline mit Validierung, Genehmigung, Deployment und Post-Deployment-Checks
- **Graph API Deployment** — Automatische Erstellung und Aktualisierung von Intune Configuration Profiles via Service Principal
- **Gruppenbasierte Zuweisung** — Konfigurationsprofile werden automatisch rollenbasiert den richtigen Gruppen zugewiesen

---

## Automatisierte Endpoint-Compliance-Plattform

*Vollautomatisierte BIOS- und Compliance-Lifecycle-Plattform für eine Intune-verwaltete Geräteflotte*

### Funktionsweise

- **Geräte-Inventarisierung** — Proactive Remediation sammelt täglich Hardware- und Applikationsinventar von Intune-verwalteten Geräten und sendet es an eine Azure Function
- **Azure Function (Logs Ingestion API)** — Empfängt Inventardaten, validiert Geräteidentität, formatiert und routet Daten an Azure Monitor via DCE/DCR-Architektur
- **BIOS-Versionstracking** — Azure Automation Runbook fragt OEM-Kataloge ab, extrahiert aktuelle BIOS-Versionen und speist sie in Log Analytics für Compliance-Vergleiche
- **BIOS-Deployment** — Automatisierte Intune Win32-Paketgenerierung mit dynamischer Katalogintegration und BitLocker Suspend/Resume-Orchestrierung
- **Orchestrierung** — Dynamische Gruppen, ringbasiertes Rollout (Canary, Pilot, Broad), Paket-Supersedenz via Graph API
- **Analytik** — Azure Monitor Workbooks für Compliance-Dashboards und proaktive Alarmierung

### Ergebnis

- **Unternehmensweite Compliance-Sichtbarkeit** — Echtzeit-Überblick über den Compliance-Status der gesamten Geräteflotte
- **Automatisierter BIOS-Lifecycle** — Von manuellen Updates zu vollautomatischer Paketierung, Verteilung und Validierung
- **Proaktive statt reaktive Wartung** — Automatische Alarmierung ersetzt manuelles Monitoring und reduziert Reaktionszeiten

---

## MFA-Migration zu Cloud-nativer Authentifizierung

*Migration von On-Premises-Authentifizierung zu Cloud-nativer Multi-Faktor-Authentifizierung*

### Problem

Das Unternehmen nutzte eine On-Premises-Authentifizierungsinfrastruktur für Multi-Faktor-Authentifizierung.
Dieses Setup erforderte dedizierte Serverinfrastruktur und schuf eine Abhängigkeit von
veralteten Komponenten, deren Abkündigung bevorstand.

### Durchgeführte Arbeiten

- **Konfigurationssicherung** — Vollständige Sicherung der bestehenden Authentifizierungskonfiguration vor jeglichen Änderungen
- **Authentifizierungs-Routing** — Anpassung der Authentifizierungsrichtlinien zur gestaffelten Umleitung an Cloud-MFA bei gleichzeitiger Beibehaltung der On-Premises-MFA für nicht migrierte Benutzer
- **Gestaffeltes Rollout** — Gruppenbasierte Migration zur präzisen Steuerung des Migrationsfortschritts
- **Password Hash Sync** — Aktivierung als Voraussetzung für Cloud-Authentifizierung
- **MFA-Datenmigration** — Übertragung der bestehenden MFA-Registrierungsdaten in die Cloud-Plattform
- **Test & Validierung** — Systematische Überprüfung aller Zugriffsszenarien für migrierte und nicht migrierte Benutzer in jeder Phase

---

## Partner-Portal-Verwaltungssystem

*Automatisierte Bereitstellung und Verwaltung von externen Partner-Datenfreigaben*

### Funktionsweise

- **Interaktives Management-Tool** — Menügesteuertes PowerShell-System zur Erstellung hierarchischer Ordnerstrukturen für externe Partner
- **Verzeichnisdienst-Integration** — Automatische Erstellung von Sicherheitsgruppen mit abgestuften Zugriffsebenen
- **Benutzerverwaltung** — Automatisierte Bereitstellung externer Partner-Benutzerkonten
- **Replikationsüberwachung** — Automatisches Warten auf Verzeichnisreplikation vor Berechtigungszuweisung
- **Protokollierung** — Vollständige Audit-Trail aller Operationen in tagesbasierten Logdateien

---

## E-Mail-Archivierungsautomatisierung

*Sichere, automatisierte E-Mail-Archivierung auf verschlüsseltem Speicher für Compliance*

Entwicklung eines PowerShell-basierten Automatisierungstools zur sicheren Archivierung von
E-Mails auf verschlüsselte Wechselmedien — zur Erfüllung gesetzlicher und
Compliance-Anforderungen für die E-Mail-Aufbewahrung.

- **Medienerkennung** — Automatische Identifikation des vorgesehenen Speichermediums mit Polling und Benutzeraufforderung
- **Verschlüsselung** — Prüfung des Verschlüsselungsstatus; bei Bedarf wird die Laufwerksverschlüsselung automatisch initiiert
- **Netzwerkverifizierung** — Validierung der Verzeichnisdienst-Konnektivität vor Verschlüsselungsvorgängen, mit Wiederholungslogik
- **Archivtransfer** — Kopie der E-Mail-Archive auf das verschlüsselte Medium mittels BITS-Transfer mit Fortschrittsanzeige
- **Integritätsprüfung** — SHA-256-Hash-Vergleich zwischen Quelle und Ziel zur Bestätigung der Archivintegrität; automatische Wiederholung bei Abweichung
- **Code-signiert** — Script mit Zertifikat signiert für Execution Policy-Konformität
