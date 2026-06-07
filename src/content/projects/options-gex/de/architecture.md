---
title: Architektur
description: options-gex Systemarchitektur — Research-Pipeline, phasiertes Design und Credential-Sicherheit
---

## Systemarchitektur

options-gex ist eine Research-Engine für Gamma-Exposure-getriebenen (GEX) Optionshandel. Die Gamma-Positionierung der Händler prägt das Intraday-Preisverhalten rund um zentrale Strike-Level — die Call Wall, die Put Wall und den Gamma Flip — und die Prämisse des Tools ist **Falsifikation zuerst**: die vollständige Pipeline bauen, um rohe Optionsketten zu laden, GEX transparent zu berechnen und nachzuweisen, ob GEX-basierte Regeln naive Baselines tatsächlich schlagen, *bevor* Kapital im Risiko steht.

### Phasiertes Design

Das System ist in zwei Phasen mit einem harten Gate dazwischen geteilt.

| Phase | Umfang |
|-------|--------|
| **Phase 1 — Research** | Library- + CLI-Oberfläche. Keine Live-Ausführung, kein Dashboard, kein Compose-Stack. Ketten laden, GEX berechnen, backtesten, Gate evaluieren. |
| **Phase 2 — Live (gated)** | Live-Order-Routing, Observability-Stack und Compose-Deployment. Wird erst freigeschaltet, sobald Backtest-Ergebnisse das Gate auf jedem Ziel-Ticker bestehen. |

Phase 2 existiert operativ nicht, bis die Evidenz aus Phase 1 das Gate passiert. Ein negatives Urteil gilt als Falsifikation, und das Projekt bleibt research-only.

### Datenfluss

```
Optionsketten (Alpaca) ──┐
                         ├──► Snapshot-Rekonstruktion ──► GEX-Berechnung
Risk-Free Rate (FRED) ───┘                                     │
                                                               ▼
                                          Signal-Regeln (level-basierte Ein-/Ausstiege)
                                                               │
                                                               ▼
                            Backtest-Engine ──► Baselines + Single-Parameter-Sweep
                                                               │
                                                               ▼
                                            6-Bedingungen-Go-Live-Gate ──► Urteil
```

### Modul-Layout

| Modul | Verantwortlichkeit |
|-------|--------------------|
| **data.chain** | Point-in-Time-Ketten-Snapshots aus historischen Optionsdaten rekonstruieren |
| **gex** | GEX-Level berechnen und gegen externe Referenzbeobachtungen kalibrieren |
| **signals** | Per-Ticker-Ein-/Ausstiegsregeln und ihre Parameter |
| **backtest** | Engine, Baseline-Kontrollen, Parameter-Sweep und das Go-Live-Gate |
| **reporting** | Run-Zusammenfassung, Trade-Liste und Per-Bedingung-Gate-Urteil rendern |
| **config.env** | Paper/Live-Umgebungsauflösung und Credential-Maskierung |

### Speicher

| Store | Verwendung |
|-------|------------|
| **SQLite** | Lokaler Research-Store für Phase-1-Snapshots und -Läufe |
| **PostgreSQL** | Phase-2-Operativ-Store; Schema mit Alembic-Migrationen verwaltet |

Die CLI migriert nicht automatisch — Schemaänderungen sind operator-getrieben und werden explizit über Alembic angewendet.

### Umgebung & Sicherheit

Live-Trading ist hinter mehrschichtigen Kontrollen abgesichert statt hinter einem einzelnen Schalter.

- **Dual-Signal-Live-Gate** — Live-Ausführung erfordert **sowohl** `ALPACA_ENV=live` in der Umgebung **als auch** ein explizites `--live`-Flag beim Aufruf. Jedes Signal allein löst zu Paper-Kontext auf.
- **Nicht unterdrückbares Banner** — ein Banner, das die aktive Umgebung benennt, wird vor jedem API-Aufruf auf stderr ausgegeben.
- **Verschlüsselte Credentials** — Phase 2 speichert Credentials verschlüsselt at rest mit einem Master Key; der Master Key selbst liegt in einer age-verschlüsselten Datei, verwaltet über SOPS, mit einem papiergesicherten Disaster-Recovery-Empfänger.
- **Log-Maskierung** — ein Logging-Filter maskiert system-geladene Credentials, sodass Secrets nie in die Logs gelangen.
- **Commit-Guards** — Pre-Commit-Hooks entfernen Notebook-Outputs (`nbstripout`) und verweigern das Committen von `.env*`- oder Datenbankdateien.
