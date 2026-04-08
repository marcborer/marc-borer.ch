---
title: Architektur
description: SmallCapTrader Systemarchitektur und Deployment-Modi
---

## Systemarchitektur

SmallCapTrader folgt der Clean Architecture mit Domain-Driven Design und unterstützt einen dualen Deployment-Modus — monolithisch für die Entwicklung und Sharded Microservices für die Produktion.

### Monolithischer Modus

Alle Dienste laufen in einem einzigen Python-Prozess. Einfaches Deployment, minimale Inter-Komponenten-Latenz.

| Komponente | Verantwortlichkeit |
|-----------|-------------------|
| **MarketDataService** | WebSocket-Stream-Parsing (Alpaca/IB) |
| **Strategy Engine** | Mehrere Handelsstrategien evaluieren Signale |
| **Position Monitor** | Stop-Loss, Trailing Stops, Gewinnziele |
| **Signal Arbiter** | Prioritätsbasierte Konfliktlösung über Strategien hinweg |
| **Notification Service** | Telegram-Benachrichtigungen für Trades und Systemereignisse |
| **Scheduler** | Marktkapitalisierungs-Updates, Wartungsaufgaben |

### Sharded-Modus

Horizontal skalierbare Architektur. Symbol-Range-Partitionierung via Redis Pub/Sub.

**Prozesse:**

| Prozess | Anzahl | Verantwortlichkeit |
|---------|--------|-------------------|
| **sct-stream-router** | 1 | Parst Marktdaten-WebSocket, routet nach Symbol-Range an Redis-Kanäle |
| **sct-shard-worker** | N | Führt alle Strategien für zugewiesenen Symbol-Range aus |
| **sct-tick-recorder** | 1 | Schreibt alle Ticks nach QuestDB für Backtest-Replay |
| **sct-backtest-worker** | N | Verteilte Backtest- und Rule-Mining-Ausführung |
| **sct-worker** | 1 | Signal-Consumer + Trade-Ausführung + Positions-Monitoring |

### Datenfluss

```
Market Data WebSocket
    │
    ▼
Stream Router ─── parses trades/bars
    │
    ├──► Redis channel: shard_a
    ├──► Redis channel: shard_b
    ├──► Redis channel: shard_c
    └──► Redis channel: shard_n ...
           │
           ▼
    Shard Workers ─── evaluate all strategies
           │
           ├──► Validated signals → Signal Consumer
           │                           │
           │                           ▼
           │                    Broker Execution
           │                    (Alpaca / IB)
           │
           └──► Strategy state → PostgreSQL
```

### Datenschicht

| Speicher | Zweck | Zugriffsmuster |
|----------|-------|---------------|
| **PostgreSQL + asyncpg** | Trades, Positionen, Orders, Strategien, entdeckte Regeln | Relationale Abfragen, ACID-Transaktionen |
| **QuestDB** | Tick-Daten, OHLCV-Bars | Hochdurchsatz-Zeitreihen-Schreibvorgänge (ILP), schnelle Bereichsabfragen |
| **Redis** | Caching, Pub/Sub-Shard-Kanäle, Echtzeit-Status | Sub-Millisekunden-Lesezugriffe, Nachrichtenrouting |

### Backend-Stack

| Komponente | Technologie | Begründung |
|-----------|-----------|-----------|
| **Sprache** | Python 3.12+ | Type Hints, async/await, Ökosystem |
| **Framework** | FastAPI | OpenAPI Auto-Docs, Dependency Injection |
| **ASGI Server** | Granian (Rust) | 3-4x schneller als Uvicorn |
| **Package Manager** | UV (Rust) | 10-100x schneller als pip |
| **ORM** | SQLAlchemy 2.0 | Volle Async-Unterstützung |
| **Validierung** | Pydantic v2 | Field Validators, Settings Management |
| **Linting** | Ruff | Vereinheitlichtes Tool (black + flake8 + isort) |
| **Logging** | structlog | Strukturiertes JSON, async-sicher |
| **Datenverarbeitung** | Polars, Pandas, NumPy | Hochperformante Analytik |
| **CLI** | Typer + Rich | Administrative Werkzeuge |
| **Type Checking** | MyPy (strikt) | Statische Typsicherheit |
| **Testing** | pytest + hypothesis | Unit-, Integrations-, Property-basierte Tests |
| **Dependency Management** | Renovate | Automatisierte Abhängigkeitsaktualisierungen |
| **CI/CD** | GitHub Actions | Lint, Typecheck, Tests bei jedem Push/PR |
| **Observability** | OpenTelemetry + Prometheus | Distributed Tracing, Metriken |

### Frontend-Stack

| Komponente | Technologie |
|-----------|-----------|
| **Framework** | Next.js 16 (App Router) |
| **UI** | React 19, Tailwind CSS v4, shadcn/ui |
| **Data Fetching** | TanStack Query v5 |
| **Charts** | Recharts |
| **Icons** | Lucide React |

### Deployment-Modi

| Modus | Befehl | Anwendungsfall |
|-------|--------|---------------|
| **Entwicklung** | `docker compose --profile dev up` | Hot Reload, Einzelprozess |
| **Produktion** | `docker compose --profile prod up` | Optimierter Monolith |
| **Sharded** | `docker compose --profile sharded up` | Horizontale Skalierung (8 Container) |
| **Full Stack** | `docker compose --profile full up` | + Prometheus, Grafana, Jaeger |
