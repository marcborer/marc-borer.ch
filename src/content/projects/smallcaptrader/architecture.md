---
title: Architecture
description: SmallCapTrader system architecture and deployment modes
---

## System Architecture

SmallCapTrader follows Clean Architecture with Domain-Driven Design and supports dual-mode deployment — monolithic for development and sharded microservices for production.

### Monolithic Mode

All services run in a single Python process. Simple deployment, minimal inter-component latency.

| Component | Responsibility |
|-----------|---------------|
| **MarketDataService** | WebSocket stream parsing (Alpaca/IB) |
| **Strategy Engine** | Multiple trading strategies evaluating signals |
| **Position Monitor** | Stop-loss, trailing stops, profit targets |
| **Signal Arbiter** | Priority-based conflict resolution across strategies |
| **Notification Service** | Telegram alerts for trades and system events |
| **Scheduler** | Market cap updates, maintenance tasks |

### Sharded Mode

Horizontally scalable architecture. Symbol-range partitioning via Redis pub/sub.

**Processes:**

| Process | Count | Responsibility |
|---------|-------|---------------|
| **sct-stream-router** | 1 | Parses market data WebSocket, routes by symbol range to Redis channels |
| **sct-shard-worker** | N | Runs all strategies for assigned symbol range |
| **sct-tick-recorder** | 1 | Writes all ticks to QuestDB for backtesting replay |
| **sct-backtest-worker** | N | Distributed backtest and rule mining execution |
| **sct-worker** | 1 | Signal consumer + trade execution + position monitoring |

### Data Flow

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

### Data Layer

| Store | Purpose | Access Pattern |
|-------|---------|---------------|
| **PostgreSQL + asyncpg** | Trades, positions, orders, strategies, discovered rules | Relational queries, ACID transactions |
| **QuestDB** | Tick data, OHLCV bars | High-throughput time-series writes (ILP), fast range queries |
| **Redis** | Caching, pub/sub shard channels, real-time state | Sub-millisecond reads, message routing |

### Backend Stack

| Component | Technology | Rationale |
|-----------|-----------|-----------|
| **Language** | Python 3.12+ | Type hints, async/await, ecosystem |
| **Framework** | FastAPI | OpenAPI auto-docs, dependency injection |
| **ASGI Server** | Granian (Rust) | 3-4x faster than Uvicorn |
| **Package Manager** | UV (Rust) | 10-100x faster than pip |
| **ORM** | SQLAlchemy 2.0 | Full async support |
| **Validation** | Pydantic v2 | Field validators, settings management |
| **Linting** | Ruff | Unified tool (black + flake8 + isort) |
| **Logging** | structlog | Structured JSON, async-safe |
| **Data Processing** | Polars, Pandas, NumPy | High-performance analytics |
| **CLI** | Typer + Rich | Administrative tooling |
| **Type Checking** | MyPy (strict) | Static type safety |
| **Testing** | pytest + hypothesis | Unit, integration, property-based |
| **Dependency Management** | Renovate | Automated dependency updates |
| **CI/CD** | GitHub Actions | Lint, typecheck, test on every push/PR |
| **Observability** | OpenTelemetry + Prometheus | Distributed tracing, metrics |

### Frontend Stack

| Component | Technology |
|-----------|-----------|
| **Framework** | Next.js 16 (App Router) |
| **UI** | React 19, Tailwind CSS v4, shadcn/ui |
| **Data Fetching** | TanStack Query v5 |
| **Charts** | Recharts |
| **Icons** | Lucide React |

### Deployment Modes

| Mode | Command | Use Case |
|------|---------|----------|
| **Development** | `docker compose --profile dev up` | Hot reload, single process |
| **Production** | `docker compose --profile prod up` | Optimized monolithic |
| **Sharded** | `docker compose --profile sharded up` | Horizontal scaling (8 containers) |
| **Full Stack** | `docker compose --profile full up` | + Prometheus, Grafana, Jaeger |
