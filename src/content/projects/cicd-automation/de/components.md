---
title: Komponentenreferenz
description: Schlüsselkomponenten der SaaS-Plattform CI/CD-Pipeline
---

## Kern-Orchestrierung

### BambooDeploy.sh

Einstiegspunkt für alle Deployments, aufgerufen durch die CI/CD-Plattform. Aufgaben:

- Parsen der Umgebungsparameter (Plattformziel, Version, Optionen)
- Git-Repository-Synchronisation
- Ansible Playbook-Aufruf mit korrektem Inventory und Vault-Anmeldedaten
- Uptime-Monitoring Pause/Wiederaufnahme via API
- Fehlerbehandlung und Deployment-Statusbericht

### MetricsFormatAndSend.sh

Post-Deployment-Metriksammlungsskript (Python). Aufgaben:

- Parsen der Deployment-Logs nach Phasendauern
- Berechnung von Zeitmetriken pro Phase
- Senden der Metriken an Graphite (Port 2003 via Netcat)
- Ausführung von Windows-Testsuites via WinRM
- Push von Deployment-Metriken an Grafana-Dashboards

### Cloud-Provider API-Client

Python-Client, der die Cloud-Provider REST API kapselt. Operationen:

| Operation | Beschreibung |
|-----------|-------------|
| `start` | VM per UUID einschalten |
| `stop` | Kontrolliertes Herunterfahren |
| `clone` | Kopie einer bestehenden VM erstellen |
| `snapshot` | Zeitpunktbezogenen Snapshot erstellen |
| `status` | VM-Status abfragen (running, stopped, etc.) |
| `list` | VMs mit Metadaten auflisten |

Wird von Ansible Playbooks verwendet, um den VM-Lebenszyklus programmatisch während Deployments zu verwalten.

---

## Ansible Roles (Auswahl)

### Infrastruktur-Roles

| Role | Zweck |
|------|-------|
| **elasticsearch** | Elasticsearch-Cluster-Deployment und -Konfiguration (Multi-Node-Cluster) |
| **redis** | Redis-Instanz-Bereitstellung (mehrere Datenbanken pro Umgebung) |
| **rabbitmq** | RabbitMQ Message Queue Cluster-Setup |
| **haproxy** | Load Balancer-Konfiguration mit SSL-Terminierung und Backend-Definitionen |
| **keepalived** | VRRP-basierte HA für HAProxy (Virtual IP Failover) |
| **logstash** | Log-Verarbeitungs-Pipeline-Konfiguration |
| **kibana** | Kibana-Dashboard-Deployment |
| **nagios-nrpe** | Nagios Remote Plugin Executor für Health Monitoring |
| **postfix** | Mail-Service-Konfiguration |

### Anwendungs-Roles

| Role | Zweck |
|------|-------|
| **application** | Kern-Anwendungs-Deployment (Multi-Service) |
| **cloudmanager** | Management-Konsolen-Deployment |
| **servicesuite** | Service Suite: Dateifreigabe, Mail, Speicher, Asset-Management, Aufgabenverarbeitung, Datenextraktion |
| **rendering** | Rendering-Dienste: Bild-, Video-, Dokument-, Audio-Verarbeitung |
| **tika** | Apache Tika für Dokumentinhaltextraktion (Solr-basiert) |

### Monitoring- & Logging-Roles

| Role | Zweck |
|------|-------|
| **filebeat** | Anwendungs-Log-Versand an ELK |
| **metricbeat** | Performance-Metrik-Sammlung |
| **winlogbeat** | Windows Event Log-Versand |
| **heartbeat** | Uptime-Monitoring |
| **graphite-powershell** | Windows-Metrik-Sammlung für Graphite |

### Plattform-Roles

| Role | Zweck |
|------|-------|
| **common** | Basis-OS-Konfiguration, NTP, DNS, SELinux-Policies |
| **domain-join** | Active Directory-Domänenmitgliedschaft für Windows/Linux |
| **samba** | CIFS/SMB-Dateifreigabe |
| **artifactory** | Maven-Repository für Build-Artefakte |
| **foreman** | OS-Bereitstellung und Inventarverwaltung |

---

## Snapshot-Verwaltung

### Hyper-V-Integration

Snapshot-Operationen zielen auf lokale Hyper-V-Hosts für schnellen Umgebungs-Reset:

- **Save**: Aktuellen Zustand vor dem Deployment erfassen
- **Restore**: Umgebung auf bekannten guten Zustand zurücksetzen (Minuten statt Stunden manueller Neuaufbau)
- **Clone**: Neue Umgebungen aus Golden Images erstellen

Verwaltung über dedizierte physische Hyper-V-Server.

### Cloud-Provider Snapshots

Cloud-seitige Snapshot-Verwaltung via Python API-Client:

- VM-Level-Snapshots für Cloud-gehostete Umgebungen
- Verwendet für QA-Umgebungs-Reset zwischen Testläufen
- In die CI/CD-Deployment-Pipeline integriert

---

## Testautomatisierung

### Testausführungsablauf

1. **Kundenbereitstellung** — Automatisierte Erstellung von Test-Mandanten mit eindeutigen Anmeldedaten
2. **Testdatengenerierung** — Beispiel-Assets, Metadaten und Benutzerkonten werden befüllt
3. **xUnit Runner** — C#/.NET-Testsuites werden gegen die bereitgestellte Umgebung ausgeführt
4. **Ergebnissammlung** — Testergebnisse werden aggregiert und an die CI/CD-Plattform gemeldet
5. **Bereinigung** — Umgebungszustand wird basierend auf dem Testergebnis beibehalten oder zurückgesetzt

### Testumgebungen

- **Test**: Dual-Instanz-Pool mit zustandsbehafteter Zuweisung (verhindert Testkollisionen)
- **QA (x5)**: Fünf parallele Umgebungen ermöglichen gleichzeitige Testläufe über Teams hinweg

---

## Sicherheit

### Anmeldedatenverwaltung

- **Ansible Vault** — Verschlüsselte YAML-Dateien für Passwörter, API-Schlüssel, Zertifikate
- **Kerberos Keytabs** — Service-Account-Authentifizierung für AD-integrierte Dienste
- **SSL-Zertifikate** — Via Vault verwaltet, auf HAProxy und Anwendungsserver deployt
- **WinRM HTTPS** — Verschlüsselte Remote-Verwaltung für Windows-Hosts

### Netzwerksicherheit

- **SELinux-Policies** — Benutzerdefinierte Policies für Linux-Dienste
- **Firewall-Regeln** — Role-spezifische iptables-Konfiguration
- **CIFS/SMB** — Authentifizierte Dateifreigabe mit AD-Anmeldedaten
