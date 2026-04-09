---
title: Komponentenreferenz
description: SmallCapTrader Schlüsselkomponenten — Strategien, Rule Mining, Broker
---

## Handelsstrategien

Mehrere integrierte Strategien für verschiedene Marktsituationen und Erkennungstypen:

| Kategorie | Ansatz |
|-----------|--------|
| **Momentum-Erkennung** | Echtzeit-Identifikation von schnell- und langsamlaufenden Aktien mittels Volumen- und Preisregime-Analyse |
| **Pullback-Einstiege** | Mehrere Strategien für Einstiege bei laufenden Aktien zu günstigen Pullback-Niveaus |
| **Breakout-Muster** | Volumenbestätigte Breakout-Strategien über Konsolidierungs-, Range- und Trend-Setups |
| **Mean-Reversion** | Strategien, die auf technische Schlüssellevel für Support- und Reclaim-Einstiege zielen |
| **Discovered Rules** | Automatisch geschürfte Strategien, nach Validierung aus der Rule-Mining-Engine befördert |

### Erkennungssystem

Die Plattform verwendet einen dualen Erkennungsansatz:

- **Fast Mover-Erkennung** — Überwacht Echtzeit-Preisbewegungen auf schnelle Prozentbewegungen, löst Strategieauswertung bei qualifizierenden Symbolen aus
- **Slow Mover-Erkennung** — Identifiziert Volumenregime-Änderungen bei ruhigeren Aktien, die auf aufkommendes Momentum hindeuten können

### Signal-Arbitrierung

Wenn mehrere Strategien gleichzeitig für dasselbe Symbol auslösen:

- Prioritätsbasierter Signal-Arbiter löst Konflikte
- Strategieübergreifende Korrelationsanalyse verhindert redundante überlappende Trades
- Jedes Signal enthält einen Konfidenz-Score und Strategie-Metadaten
- Per-Strategie-Risikoparameter steuern Positionsgrösse und Exposure
- Erkennungstyp-Filterung stellt sicher, dass Strategien nur bei passendem Aktienverhalten feuern (schnell, langsam oder beides)

---

## Rule Mining Engine

Automatisierte Strategieentdeckung mittels mehrstufiger Beam-Suche:

### Ansatz

Die Engine baut schrittweise Handelsregeln durch einen phasenweisen Suchprozess auf:

1. **Bedingungsscreening** — Bewertet einzelne Indikatorbedingungen über mehrere Kategorien (preisbasiert, temporale Indikatoren, Event-Flags)
2. **Bedingungskombination** — Kombiniert progressiv die Top-Performer zu Multi-Bedingungsregeln, Pruning in jeder Stufe
3. **Exit-Optimierung** — Grid Search über Risikoparameter (Stop Loss, Trailing Stop, Gewinnziele, maximale Haltedauer) zur Findung optimaler Exit-Konfigurationen pro Regel
4. **Temporale Mustererkennung** — Erkundet mehrstufige sequenzielle Muster, bei denen Bedingungen in bestimmter Reihenfolge mit konfigurierbaren Zeitabständen feuern müssen

### Validierung

- **Train/Test Split** mit Zeitreihen-Integrität
- **Walk-Forward-Kreuzvalidierung** zur Sicherstellung, dass Regeln über Trainingsdaten hinaus generalisieren
- **Trade-Set-Deduplizierung** zur Entfernung redundanter Regeln, die bei denselben Gelegenheiten auslösen
- **Verdachts-Scoring** zur Bestrafung von Regeln, die zu gut erscheinen, um wahr zu sein

### Regellebenszyklus

Entdeckte Regeln folgen einem definierten Beförderungspfad:

1. **Entdeckung** — Mining-Engine identifiziert Regelkandidaten
2. **Validierung** — Walk-Forward-Testing bestätigt Generalisierung
3. **Kampagnen-Integration** — Mehrtägige automatisierte Entdeckungsläufe erkunden kontinuierlich neue Muster
4. **Live-Promotion** — Validierte Regeln mit Per-Regel-Exit-Konfigurationen werden zum Live-Trading befördert
5. **Performance-Tracking** — Live-Ergebnisse werden mit Analytik-Aufschlüsselung nach Regel verfolgt
6. **Degradationserkennung & Herabstufung** — Health Scoring vergleicht Backtest- mit Live-Metriken pro Regel; Degradation löst Toast-Benachrichtigungen über alle Dashboard-Seiten aus; unterperformende Regeln können vom Live-Trading herabgestuft werden

---

## Exit Engine

Zentralisierte Exit-Logik, die über alle Strategien und beförderte Regeln geteilt wird:

- **Stop Loss** — Fester prozentualer Stop Loss
- **Trailing Stop** — Dynamischer Stop, der der Preisbewegung folgt
- **Skalierte Gewinnziele** — Mehrstufige Teilgewinnmitnahme auf konfigurierbaren Niveaus
- **Zeitbasierte Exits** — Maximale Haltedauer-Durchsetzung
- **Preisaktualitäts-Validierung** — Stale-Price-Guards verhindern Exit-Entscheidungen auf Basis veralteter Marktdaten; Kauforders verwenden frische Redis-Tick-Preise mit automatischem Fallback

Jede Strategie und beförderte Regel kann ihre eigene Exit-Konfiguration definieren, was feingranulares Risikomanagement ohne globales Fallback-Verhalten ermöglicht.

---

## Broker-Schnittstelle

Abstraktes `BaseBroker`-Interface ermöglicht nahtlosen Wechsel via Konfiguration.

### Alpaca

| Feature | Unterstützung |
|---------|---------|
| Order-Typen | Market, Limit |
| Paper Trading | Ja (Standard in Dev) |
| Datenfeed | SIP (Echtzeit) |
| Bruchteils-Aktien | Ja |
| Extended Hours | Ja |
| Streaming | WebSocket |

### Interactive Brokers

| Feature | Unterstützung |
|---------|---------|
| Order-Typen | Market, Limit, Stop, Trailing Stop (nativ) |
| Paper Trading | Nein |
| Märkte | Aktien, Futures, Forex, Optionen |
| Bruchteils-Aktien | Nein |
| Verbindung | TCP zu IB Gateway/TWS |

---

## Backtest Engine

Verteiltes Backtesting mit Parameteroptimierung:

- Durchläuft Parameterkombinationen über alle Strategien parallel
- Dedizierte Backtest-Worker im Sharded-Modus für verteilte Ausführung via Redis Work Queues
- Tick-Daten-Replay aus QuestDB ermöglicht High-Fidelity-Backtesting gegen historische Marktbedingungen
- Ergebnisse mit Per-Strategie-Analysen gespeichert
- Bestperformende Konfigurationen können auf Live-Trading angewandt werden
- Echtzeit-Fortschrittsstreaming via WebSocket zum Frontend-Dashboard

### Kampagnen-Backtesting

Mehrtägige Strategievergleichs-Infrastruktur:

- Aggregiert Performance über beliebige Datumsbereiche in einem einzelnen Vorgang
- Per-Datum-Daten-Precaching für Worker-Effizienz
- Tagesübergreifende Aggregation zeigt Strategiekonsistenz und Parameterstabilität
- Teilfehler-Behandlung — Kampagnen laufen weiter, wenn einzelne Tage fehlschlagen
- Unterstützt mehrere Discovery-Modi für verschiedene Marktverhaltentypen

---

## Frontend-Seiten

| Seite | Zweck |
|-------|-------|
| **Dashboard** | Portfolio-Übersicht, letzte Trades, Markt-Snapshot |
| **Market** | Fast Movers, Slow Movers, Aktiensuche, Echtzeit-Kurse |
| **Portfolio** | Positions-Tracking, PnL-Analyse |
| **Trading** | Ordererfassung, Orderbuch, Trade-Verlauf |
| **Strategies** | Aktivieren/Deaktivieren, Parameterkonfiguration |
| **Analytics** | Performance-Charts, Equity-Kurven, Aufschlüsselung nach Regel und Strategie |
| **Backtest** | Backtests durchführen, Echtzeit-Fortschritt, Per-Strategie-Analysen |
| **Auto-Backtest** | Parameteroptimierungs-Iterationen, Best-Params-Speicherung |
| **Campaign Backtest** | Mehrtägiger Strategievergleich, Per-Tag-Drill-Down, tagesübergreifende Aggregation |
| **Strategy Discovery** | Rule Mining UI, temporale Mustervisualisierung, Regelbeförderung mit Erkennungstyp-Tagging |
| **Position Monitor** | Live-Exit-State-Tracking, Stop-Distanzen, Gewinnziel-Fortschritt, WebSocket-Updates |
| **Rule Lifecycle** | Health Scoring, Degradationserkennung, Überlebensanalyse, Regel-Herabstufung |
| **Settings** | Risikomanagement, Benachrichtigungen, Broker-Konfiguration, Scheduler |

---

## Benachrichtigungssystem

Live-Benachrichtigungsglocke, die an Backend-WebSocket-Events angebunden ist, mit schweregrad-gestufter Zustellung:

| Schweregrad | Zustellung | Event-Typen |
|-------------|------------|-------------|
| **Kritisch** | Toast + Glocke | Order-Fills, Stop-Loss-Auslösungen, Kill-Switch-Aktivierungen |
| **Warnung** | Nur Glocke | Alert-Auslösungen, Regel-Gesundheitsänderungen |
| **Info** | Nur Glocke | Order-Einreichungen, Mover-Erkennungen, Muster-Entdeckungen |

- Hybrides Lesen/Verwerfen-Modell — Öffnen des Dropdowns markiert Benachrichtigungen als gelesen; einzelne Einträge können verworfen werden
- Redis-gestützte Persistenz mit automatischem TTL-Ablauf für transiente Event-Daten
- Backfill bei Wiederverbindung stellt sicher, dass keine Events während Verbindungsunterbrechungen verloren gehen
- WebSocket-Verbindungsstatus-Anzeige am Glockensymbol (verbunden/wiederverbindend)

---

## Datenbankschema (Schlüsseltabellen)

### Trading

| Tabelle | Zweck |
|---------|-------|
| `trades` | Ausgeführte Trades mit Einstiegs-/Ausstiegspreisen, PnL |
| `positions` | Offenes Positions-Tracking |
| `orders` | Order-Verlauf (eingereicht, ausgeführt, storniert) |

### Backtesting

| Tabelle | Zweck |
|---------|-------|
| `backtest_runs` | Backtest-Sitzungen mit Performance-Zusammenfassung |
| `backtest_trades` | Per-Trade-Ergebnisse innerhalb eines Backtests |

### Rule Mining

| Tabelle | Zweck |
|---------|-------|
| `discovered_rules` | Gefundene Regeln mit Bedingungen, Exit-Konfiguration, Score, Live-Status |

---

## Authentifizierung & Sicherheit

- JWT-basierte Authentifizierung mit Access- und Refresh-Tokens
- Erweiterte Sitzungsunterstützung für persistenten Dashboard-Zugang
- Geschützte API-Routen mit Bearer-Token-Anforderung
- PDT (Pattern Day Trader) Compliance-Tracking

---

## CLI-Werkzeuge

Administrative Kommandozeilen-Schnittstelle auf Basis von Typer und Rich für Datenbankverwaltung, Service-Steuerung und operationelle Aufgaben.

---

## Codequalität & CI/CD

- **Linting** — Ruff für vereinheitlichte Formatierung und Lint-Prüfungen
- **Type Checking** — MyPy im strikten Modus über das gesamte Backend
- **Testing** — pytest mit Async-Unterstützung, Property-basiertes Testing (hypothesis), Zeit-Mocking und HTTP-Mocking
- **CI-Pipeline** — GitHub Actions führt Lint, Typecheck und vollständige Test-Suite bei jedem Push und Pull Request aus
- **Dependency Management** — Renovate für automatisierte Abhängigkeitsaktualisierungen mit CI-Gating
- **Type Generation** — OpenAPI-gesteuerte TypeScript-Typgenerierung mit CI-Drift-Erkennung
