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

## Indicator Engine

Ein deklaratives Indikator-Subsystem, das von Strategien und Rule Mining gemeinsam genutzt wird — Indikatoren werden einmal berechnet und wiederverwendet, nicht pro Aufrufer neu berechnet.

- **Deklarative Registry** — Indikatoren werden mit expliziten Abhängigkeiten registriert; ein topologischer Dependency Graph ermittelt die Berechnungsreihenfolge automatisch
- **Inkrementelle Append-Engine** — Neue Bars aktualisieren den Indikatorzustand in konstanter Zeit pro Bar (O(1)), ohne vollständige Neuberechnung der historischen Reihe
- **Bedarfsgesteuerte Lazy Evaluation** — Nur Indikatoren, die von der aktiven Strategie oder dem Mining-Lauf tatsächlich benötigt werden, werden materialisiert, wodurch Speicher- und CPU-Footprint gering bleiben
- **Gemeinsamer Cache** — Live-Trading-Strategien und Rule-Mining-Suchen lesen aus demselben Indikator-Cache, verhindert doppelte Berechnung über Codepfade hinweg

---

## Strategy Fingerprinting

Bevor die Rule-Mining-Engine neue Regeln vorschlägt, profiliert das System zunächst, was jede bestehende Strategie über historische Daten hinweg erfasst, identifiziert Bereiche mit dünner Abdeckung und generiert kuratierte Seed-Kandidaten, die auf diese Lücken abzielen.

- **Historisches Replay-Profiling** — Jede Strategie wird über historische Daten wiedergegeben, um zu erfassen, was sie wo auffängt
- **Per-Strategie-Abdeckung** — Misst, welche Marktbedingungen jede Strategie erkennt, und macht ihren Footprint explizit
- **Strategieübergreifende Overlap-Analyse** — Macht sichtbar, wo Strategien redundant dieselben Gelegenheiten abdecken und wo echte Lücken bleiben
- **Seed-Kandidaten-Generierung** — Wandelt Abdeckungslücken in kuratierte Seed-Kandidaten um, die in die Rule-Mining-Engine einfliessen und die Entdeckung auf unterabgedeckte Marktbedingungen lenken
- **Dashboard-Integration** — Fingerprinting-Läufe erscheinen in einem dedizierten Dashboard mit mehrstufiger Detailansicht (Overview, Coverage, Cross-Strategy, Seeds)

Das Architekturdiagramm zeigt den Live-Runtime-Datenpfad; Fingerprinting arbeitet auf historischem Replay und liegt ausserhalb dieses Pfades — sein Fehlen im Diagramm ist also gewollt.

---

## Rule Mining Engine

Automatisierte Strategieentdeckung kombiniert ML-seeded Kandidatengenerierung, mehrstufige Beam-Suche und Exit-Quality-Scoring:

### Ansatz

Die Engine baut Handelsregeln durch einen phasenweisen Suchprozess auf, mit einer optionalen ML-Vor-Seeding-Phase vorgelagert:

0. **ML Seeding (Optional)** — Ein LightGBM-Modell trainiert auf historischen Trade-Daten, extrahiert Decision Paths als Seed-Kandidaten und selektiert vielversprechende Bedingungskombinationen vor, die die Beam-Suche weiter verfeinert. Seed-Kandidaten können auch aus Strategy Fingerprinting stammen, gezielt auf Abdeckungslücken der bestehenden Strategien
1. **Bedingungsscreening** — Bewertet einzelne Indikatorbedingungen über mehrere Kategorien — preisbasiert, temporale Indikatoren, Event-Flags und Ableitungs- / Trajektorien-Indikatoren, die erfassen, wie sich Indikatorwerte über die Zeit verändern, nicht nur ihre Momentanwerte
2. **Bedingungskombination** — Kombiniert progressiv die Top-Performer zu Multi-Bedingungsregeln, Pruning in jeder Stufe
3. **Exit-Optimierung** — Grid Search über Risikoparameter (Stop Loss, Trailing Stop, Gewinnziele, maximale Haltedauer) zur Findung optimaler Exit-Konfigurationen pro Regel
4. **Temporale Mustererkennung** — Erkundet mehrstufige sequenzielle Muster, bei denen Bedingungen in bestimmter Reihenfolge mit konfigurierbaren Zeitabständen feuern müssen

**Carry-Mode-Simulation** — Ausserhalb der nummerierten Pipeline können Regeln optional mit Multi-Day-Carry-over offener Positionen evaluiert werden, was die Entdeckung von Mustern erlaubt, deren Einstieg intraday ist, deren Exit jedoch über Session-Grenzen hinausreicht.

### Validierung

- **Zeitreihen-Train/Test-Split** mit chronologischer Integrität — erhält die zeitliche Reihenfolge für Walk-Forward-Evaluation
- **Random Train/Test Split** mit reproduzierbarem Seeding — ermöglicht i.i.d.-Validierung für Regeln, bei denen die temporale Struktur weniger tragend ist; der Seed macht Resultate deterministisch wiederholbar
- **Walk-Forward-Kreuzvalidierung** zur Sicherstellung, dass Regeln über Trainingsdaten hinaus generalisieren
- **Trade-Set-Deduplizierung** zur Entfernung redundanter Regeln, die bei denselben Gelegenheiten auslösen
- **Verdachts-Scoring** zur Bestrafung von Regeln, die zu gut erscheinen, um wahr zu sein

### Exit Quality Scoring

Ein zusammengesetzter Scoring-Modus bewertet Regeln anhand ihres Exit-Verhaltens statt nur nach aggregiertem P&L und gewichtet mehrere Dimensionen gleichzeitig:

- **P&L** — Netto-Gewinn und -Verlust
- **Drawdown** — Stärkster Intra-Trade-Drawdown
- **Hold Efficiency** — P&L relativ zur Haltedauer im Trade
- **Exit Type Quality** — Ob der Exit auf ein günstiges Ziel oder einen defensiven Stop traf
- **Peak-to-Exit Giveback** — Wie viel des besten Intra-Trade-Preises vor dem Exit wieder abgegeben wurde

Ein Scoring-Mode-Selector erlaubt die Wahl zwischen P&L-zentrischer und Exit-Quality-zentrischer Evaluation während der Entdeckung.

### Regellebenszyklus

Entdeckte Regeln folgen einem definierten Beförderungspfad:

1. **Entdeckung** — Mining-Engine identifiziert Regelkandidaten
2. **Validierung** — Walk-Forward-Testing bestätigt Generalisierung
3. **Kampagnen-Integration** — Mehrtägige automatisierte Entdeckungsläufe erkunden kontinuierlich neue Muster
4. **Live-Promotion** — Validierte Regeln mit Per-Regel-Exit-Konfigurationen werden zum Live-Trading befördert
5. **Performance-Tracking** — Live-Ergebnisse werden mit Analytik-Aufschlüsselung nach Regel verfolgt
6. **Degradationserkennung & Herabstufung** — Health Scoring vergleicht Backtest- mit Live-Metriken pro Regel; Degradation löst Toast-Benachrichtigungen über alle Dashboard-Seiten aus; unterperformende Regeln können vom Live-Trading herabgestuft werden

### Dashboard-Oberflächen

Das Strategy-Discovery-Dashboard macht Mining-Konfiguration und -Ergebnisse direkt zugänglich:

- **Split-Mode-Selector** mit Ratio-Slider erlaubt die Wahl zwischen Zeitreihen- und Random-Train/Test-Split sowie die Abstimmung des Train/Test-Verhältnisses pro Lauf
- **Carry-Mode-Toggle** steuert, ob Simulationen Positionen über Sessions hinweg halten
- **Kapitalauslastungs-Statistiken** zeigen, wie viel simuliertes Kapital eine Regel einsetzt und wie stark sich ihre Trades zeitlich überlappen
- **Worst-Trade-Analytik** hebt die Ergebnisse im untersten Quantil hervor, sodass Nutzer die Downside-Form neben der Headline-Performance sehen

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
- Dedizierte Backtest-Worker im Sharded-Modus für verteilte Ausführung via Redis Work Queues, mit einer Finalize-Queue, die die asynchrone Ergebnisaggregation getrennt vom API-Prozess abwickelt
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

## Production Correctness

Produktionstauglicher Betrieb hängt davon ab, reale Fehlermodi zu handhaben, die einfache Codepfade und Backtests allein verdecken:

- **WebSocket Auto-Reconnect** — Der Market-Data-Stream reconnectet mit exponential backoff bei transienten Fehlern und bewahrt den Subscription-State über Disconnects hinweg, sodass Live-Strategien ohne manuelles Eingreifen fortfahren
- **Redis Connection Manager** — Auto-Reconnect, Keepalive-Heartbeats und periodische Health Pings halten die Pub/Sub- und Cache-Schicht unter Netzwerkschwankungen verfügbar; Payload-Kompression reduziert die Bandbreite auf high-throughput-Kanälen
- **Strukturelles Buy-Sell-Linking** — Trade-Buchhaltung folgt der tatsächlichen Order-Beziehung zwischen Käufen und Verkäufen statt FIFO-nach-Timestamp, sodass die P&L-Attribution dem Orderbuch-Wahrheitsgehalt entspricht, auch wenn Exits ausserhalb der Einreichungsreihenfolge ausführen
- **Split-adjustierte historische Bars** — Backtests und Live-Preisreferenzen nutzen split-adjustierte Bars des Brokers, was spurious Signale und Preisfehler rund um Corporate Actions verhindert

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
| **Trade Detail** | Entscheidungs-Audit-Trail — Ein-/Ausstiegsbedingungen, die feuerten, Indikator-Snapshots zum Entscheidungszeitpunkt, Candlestick-Visualisierung |
| **Backtest** | Backtests durchführen, Echtzeit-Fortschritt, Per-Strategie-Analysen |
| **Auto-Backtest** | Parameteroptimierungs-Iterationen, Best-Params-Speicherung |
| **Campaign Backtest** | Mehrtägiger Strategievergleich, Per-Tag-Drill-Down, tagesübergreifende Aggregation |
| **Strategy Discovery** | Rule Mining UI, temporale Mustervisualisierung, Regelbeförderung mit Erkennungstyp-Tagging |
| **Fingerprinting** | Run-Liste plus mehrstufige Detailansicht — Overview, Coverage, Cross-Strategy-Overlap und Seed-Kandidaten |
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

Administrative Kommandozeilen-Schnittstelle auf Basis von Typer und Rich für Datenbankverwaltung, Service-Steuerung, operationelle Aufgaben sowie Strategy Fingerprinting — Analyse historischer Läufe und Generierung von Seed-Kandidaten, die in die Rule-Mining-Engine einfliessen.

---

## Codequalität & CI/CD

- **Linting** — Ruff für vereinheitlichte Formatierung und Lint-Prüfungen
- **Type Checking** — MyPy im strikten Modus über das gesamte Backend
- **Testing** — pytest mit Async-Unterstützung, Property-basiertes Testing (hypothesis), Zeit-Mocking und HTTP-Mocking
- **CI-Pipeline** — GitHub Actions führt Lint, Typecheck und vollständige Test-Suite bei jedem Push und Pull Request aus
- **Dependency Management** — Renovate für automatisierte Abhängigkeitsaktualisierungen mit CI-Gating
- **Type Generation** — OpenAPI-gesteuerte TypeScript-Typgenerierung mit CI-Drift-Erkennung
