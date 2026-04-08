---
title: Component Reference
description: SmallCapTrader key components — strategies, rule mining, brokers
---

## Trading Strategies

Multiple built-in strategies covering different market conditions and detection types:

| Category | Approach |
|----------|----------|
| **Momentum Detection** | Real-time identification of fast-moving and slow-moving stocks using volume and price regime analysis |
| **Pullback Entries** | Multiple strategies for entering running stocks at favorable pullback levels |
| **Breakout Patterns** | Volume-confirmed breakout strategies across consolidation, range, and trend setups |
| **Mean-Reversion** | Strategies targeting key technical levels for support and reclaim entries |
| **Discovered Rules** | Auto-mined strategies promoted from the rule-mining engine after validation |

### Detection System

The platform uses a dual detection approach:

- **Fast Mover Detection** — Monitors real-time price action for rapid percentage moves, triggering strategy evaluation on qualifying symbols
- **Slow Mover Detection** — Identifies volume regime changes in quieter stocks that may signal emerging momentum

### Signal Arbitration

When multiple strategies fire on the same symbol simultaneously:

- Priority-based signal arbiter resolves conflicts
- Cross-strategy correlation analytics prevent redundant overlapping trades
- Each signal includes confidence score and strategy metadata
- Per-strategy risk parameters control position sizing and exposure
- Detection-type filtering ensures strategies only fire on matching stock behavior (fast, slow, or both)

---

## Rule Mining Engine

Automated strategy discovery using a multi-phase beam search:

### Approach

The engine progressively builds trading rules through a phased search process:

1. **Condition Screening** — Evaluates individual indicator conditions across multiple categories (price-based, temporal indicators, event flags)
2. **Condition Combination** — Progressively combines top-performing conditions into multi-condition rules, pruning at each stage
3. **Exit Optimization** — Grid search across risk parameters (stop loss, trailing stop, profit targets, max hold time) to find optimal exit configurations per rule
4. **Temporal Pattern Discovery** — Explores multi-phase sequential patterns where conditions must fire in a specific order with configurable timing gaps

### Validation

- **Train/test split** with time-series integrity
- **Walk-forward cross-validation** to ensure rules generalize beyond training data
- **Trade-set deduplication** to remove redundant rules that trigger on the same opportunities
- **Suspicion scoring** to penalize rules that appear too good to be true

### Rule Lifecycle

Discovered rules follow a defined promotion path:

1. **Discovery** — Mining engine surfaces candidate rules
2. **Validation** — Walk-forward testing confirms generalization
3. **Campaign Integration** — Multi-day automated discovery runs continuously explore new patterns
4. **Live Promotion** — Validated rules with per-rule exit configurations are promoted to live trading
5. **Performance Tracking** — Live results are tracked with analytics breakdown by rule

---

## Exit Engine

Centralized exit logic shared across all strategies and promoted rules:

- **Stop Loss** — Fixed percentage-based stop loss
- **Trailing Stop** — Dynamic stop that follows price movement
- **Scaled Profit Targets** — Multi-tier partial profit taking at configurable levels
- **Time-Based Exits** — Maximum hold duration enforcement

Each strategy and promoted rule can define its own exit configuration, enabling fine-grained risk management without global fallback behavior.

---

## Broker Interface

Abstract `BaseBroker` interface enables seamless switching via configuration.

### Alpaca

| Feature | Support |
|---------|---------|
| Order types | Market, Limit |
| Paper trading | Yes (default in dev) |
| Data feed | SIP (real-time) |
| Fractional shares | Yes |
| Extended hours | Yes |
| Streaming | WebSocket |

### Interactive Brokers

| Feature | Support |
|---------|---------|
| Order types | Market, Limit, Stop, Trailing Stop (native) |
| Paper trading | No |
| Markets | Stocks, Futures, Forex, Options |
| Fractional shares | No |
| Connection | TCP to IB Gateway/TWS |

---

## Backtest Engine

Distributed backtesting with parameter optimization:

- Sweeps parameter combinations across all strategies in parallel
- Dedicated backtest workers in sharded mode for distributed execution via Redis work queues
- Tick data replay from QuestDB enables high-fidelity backtesting against historical market conditions
- Results stored with per-strategy analytics
- Best-performing configurations can be applied to live trading
- Real-time progress streaming via WebSocket to the frontend dashboard

### Campaign Backtesting

Multi-day strategy comparison infrastructure:

- Aggregates performance across arbitrary date ranges in a single operation
- Per-date data pre-caching for worker efficiency
- Cross-day aggregation surfaces strategy consistency and parameter stability
- Partial failure handling — campaigns continue if individual dates fail
- Supports multiple discovery modes for different market behavior types

---

## Frontend Pages

| Page | Purpose |
|------|---------|
| **Dashboard** | Portfolio overview, recent trades, market snapshot |
| **Market** | Fast movers, slow movers, stock search, real-time quotes |
| **Portfolio** | Position tracking, P&L analysis |
| **Trading** | Order entry, order book, trade history |
| **Strategies** | Enable/disable, parameter configuration |
| **Analytics** | Performance charts, equity curves, breakdown by rule and strategy |
| **Backtest** | Run backtests, real-time progress, per-strategy analytics |
| **Auto-Backtest** | Parameter optimization iterations, best-params storage |
| **Campaign Backtest** | Multi-day strategy comparison, per-day drill-down, cross-day aggregation |
| **Strategy Discovery** | Rule mining UI, temporal pattern visualization, promote rules with detection-type tagging |
| **Settings** | Risk management, notifications, broker config, scheduler |

---

## Database Schema (Key Tables)

### Trading

| Table | Purpose |
|-------|---------|
| `trades` | Executed trades with entry/exit prices, P&L |
| `positions` | Open position tracking |
| `orders` | Order history (submitted, filled, cancelled) |

### Backtesting

| Table | Purpose |
|-------|---------|
| `backtest_runs` | Backtest sessions with performance summary |
| `backtest_trades` | Per-trade results within a backtest |

### Rule Mining

| Table | Purpose |
|-------|---------|
| `discovered_rules` | Mined rules with conditions, exit config, score, live status |

---

## Authentication & Security

- JWT-based authentication with access and refresh tokens
- Extended session support for persistent dashboard access
- Protected API routes requiring bearer tokens
- PDT (Pattern Day Trader) compliance tracking

---

## CLI Tooling

Administrative command-line interface built with Typer and Rich for database management, service control, and operational tasks.

---

## Code Quality & CI/CD

- **Linting** — Ruff for unified formatting and lint checks
- **Type Checking** — MyPy in strict mode across the entire backend
- **Testing** — pytest with async support, property-based testing (hypothesis), time mocking, and HTTP mocking
- **CI Pipeline** — GitHub Actions runs lint, typecheck, and full test suite on every push and pull request
- **Dependency Management** — Renovate for automated dependency updates with CI gating
