---
title: Architektur
description: SaaS-Plattform CI/CD-Pipeline-Architektur und Deployment-Ablauf
---

## Pipeline-Architektur

Die Deployment-Pipeline folgt einem mehrstufigen Orchestrierungsmuster, ausgelöst durch Bamboo CI/CD:

### Deployment-Ablauf

1. **CI/CD-Trigger** — Orchestrierungsscript empfängt Umgebungsparameter (QA, Dev, Staging, Test, Production)
2. **Repository-Synchronisation** — Git Pull des Ansible-Repositorys für aktuelle Playbooks
3. **Monitoring-Pause** — Uptime-Monitoring-API pausiert Prüfungen während des Deployment-Fensters
4. **VM-Bereitstellung** — Python API-Client verwaltet den VM-Lebenszyklus: Starten, Stoppen, Klonen, Snapshot
5. **Health Checks** — Warten auf SSH- (Linux) und RDP-Verfügbarkeit (Windows) vor dem Fortfahren
6. **Snapshot-Wiederherstellung** — Hyper-V Snapshot-Wiederherstellung für einen sauberen Umgebungszustand
7. **Linux-Konfiguration** — Ansible Playbooks konfigurieren Elasticsearch, Redis, RabbitMQ, HAProxy
8. **Windows-Konfiguration** — Ansible Playbooks deployen Applikations-Dienste, Rendering-Engines, Monitoring-Agenten
9. **Kundenbereitstellung** — Automatisierte Mandanten-Erstellung mit umgebungsspezifischen Anmeldedaten
10. **Testausführung** — xUnit Test Runner mit automatisierter Testdatengenerierung
11. **Ergebnissammlung** — Testergebnisse werden aggregiert und an die CI/CD-Plattform zurückgemeldet
12. **Metriken-Push** — Deployment-Zeitdaten werden via Netcat an Graphite für Grafana-Dashboards gesendet
13. **Monitoring-Wiederaufnahme** — Uptime-Monitoring wird wieder aktiviert

### Umgebungstopologie

Jede Deployment-Umgebung betreibt eine mehrstufige Architektur:

| Schicht | Komponenten | Technologie |
|---------|------------|-------------|
| **Load Balancer** | HAProxy + Keepalived | VRRP-basierte HA, SSL-Terminierung |
| **Anwendung** | Plattform-Dienste (11+ Microservices) | Windows, IIS |
| **Suche** | Elasticsearch-Cluster (3+ Knoten) | Kibana zur Visualisierung |
| **Cache** | Redis-Instanzen | Mehrere Datenbanken pro Umgebung |
| **Messaging** | RabbitMQ | Multi-Node-Cluster |
| **Workflow** | Apache Camunda | BPMN-Prozess-Engine |
| **Logging** | ELK Stack | Filebeat, Metricbeat, Winlogbeat, Heartbeat |
| **Monitoring** | Nagios NRPE | Remote Health Checks |
| **Speicher** | Samba/CIFS | Dateifreigabe und Asset-Speicherung |

### Umgebungen

| Umgebung | Zweck | Instanzen |
|----------|-------|-----------|
| **QA (x5)** | Paralleles QA-Testing | 5 isolierte Umgebungen |
| **Development** | Entwicklung | Einzelinstanz |
| **Test** | Load-Balanced Testing | Dual-Instanz mit Pool-Zuweisung |
| **Staging** | Staging | Multi-Mandant-Kundenkonfigurationen |
| **Production** | Produktion | Cloud-Produktion |

### Ansible-Architektur

Die Infrastruktur ist als geschichtete Ansible-Codebasis organisiert:

- **Inventories** — Hostdefinitionen pro Umgebung
- **Group Variables** — Umgebungsspezifische Konfiguration (Ports, Anmeldedaten, Feature Flags)
- **Roles (30+)** — Wiederverwendbare Infrastrukturkomponenten (Elasticsearch, Redis, HAProxy, Applikations-Services, etc.)
- **Playbooks** — Orchestrierung durch Kombination von Roles für jede Umgebung
- **Vault** — Verschlüsselte Geheimnisse (SSL-Zertifikate, Anmeldedaten, Kerberos Keytabs)

### Ausführungskonfiguration

- **Forks**: 50 (parallele Ansible-Ausführung über Hosts hinweg)
- **Transport**: SSH (Linux), WinRM über HTTPS (Windows)
- **Secrets**: Ansible Vault verschlüsselte Dateien
- **Inventory**: Statische Dateien mit umgebungsspezifischen Group Variables
