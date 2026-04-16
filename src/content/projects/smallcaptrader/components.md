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

## Indicator Engine

A declarative indicator subsystem shared across strategies and rule mining — indicators are computed once and reused, not recomputed per caller.

- **Declarative registry** — Indicators are registered with explicit dependencies; a topological dependency graph resolves compute order automatically
- **Incremental append engine** — New bars update indicator state in constant time per bar (O(1)), without full recomputation of historical series
- **Demand-based lazy evaluation** — Only indicators actually needed by the active strategy or mining run are materialized, keeping memory and CPU footprint lean
- **Shared cache** — Live-trading strategies and rule-mining searches read from the same indicator cache, preventing duplicate computation across paths

---

## Strategy Fingerprinting

Before the rule-mining engine proposes new rules, the system first profiles what each existing strategy catches across historical data, identifies where coverage is thin, and generates curated seed candidates targeting those gaps.

- **Historical replay profiling** — Each strategy is replayed across historical data to capture what it catches and where
- **Per-strategy coverage** — Measures which market conditions each strategy detects, making its footprint explicit
- **Cross-strategy overlap analysis** — Surfaces where strategies redundantly cover the same opportunities versus where genuine gaps remain
- **Seed-candidate generation** — Turns coverage gaps into curated seed candidates that feed the rule-mining engine, directing discovery toward under-covered market conditions
- **Dashboard integration** — Fingerprinting runs appear in a dedicated dashboard with a multi-tab run-detail view (overview, coverage, cross-strategy, seeds)

The architecture diagram shows the live runtime data path; fingerprinting operates on historical replay and sits outside that path, so its absence from the diagram is by design.

---

## Rule Mining Engine

Automated strategy discovery combining ML-seeded candidate generation, multi-phase beam search, and exit-quality scoring:

### Approach

The engine builds trading rules through a phased search process, with an optional ML pre-seeding phase upstream:

0. **ML Seeding (Optional)** — A LightGBM model trains on historical trade data, extracts decision paths as seed candidates, and pre-selects promising condition combinations for the beam search to refine. Seed candidates can also arrive from Strategy Fingerprinting, targeting coverage gaps the existing strategies leave behind
1. **Condition Screening** — Evaluates individual indicator conditions across multiple categories — price-based, temporal indicators, event flags, and derivative / trajectory indicators that capture how indicator values change over time rather than only instantaneous levels
2. **Condition Combination** — Progressively combines top-performing conditions into multi-condition rules, pruning at each stage
3. **Exit Optimization** — Grid search across risk parameters (stop loss, trailing stop, profit targets, max hold time) to find optimal exit configurations per rule
4. **Temporal Pattern Discovery** — Explores multi-phase sequential patterns where conditions must fire in a specific order with configurable timing gaps

**Carry-mode simulation** — Outside the numbered pipeline, rules can optionally be evaluated with multi-day carry-over of open positions, enabling discovery of patterns whose entry is intraday but whose exit spans session boundaries.

### Validation

- **Time-series train/test split** with chronological integrity — preserves temporal ordering for walk-forward evaluation
- **Random train/test split** with reproducible seeding — enables i.i.d. validation for rules where temporal structure is less load-bearing; the seed makes results deterministically replayable
- **Walk-forward cross-validation** to ensure rules generalize beyond training data
- **Trade-set deduplication** to remove redundant rules that trigger on the same opportunities
- **Suspicion scoring** to penalize rules that appear too good to be true

### Exit Quality Scoring

A composite scoring mode evaluates rules by exit behavior rather than aggregate P&L alone, weighing multiple dimensions simultaneously:

- **P&L** — Net profit and loss
- **Drawdown** — Worst intra-trade drawdown
- **Hold efficiency** — P&L relative to time in the trade
- **Exit type quality** — Whether the exit hit a favorable target versus a defensive stop
- **Peak-to-exit giveback** — How much of the best intra-trade price was surrendered before exit

A scoring-mode selector lets users choose between P&L-centric and exit-quality-centric evaluation during discovery.

### Rule Lifecycle

Discovered rules follow a defined promotion path:

1. **Discovery** — Mining engine surfaces candidate rules
2. **Validation** — Walk-forward testing confirms generalization
3. **Campaign Integration** — Multi-day automated discovery runs continuously explore new patterns
4. **Live Promotion** — Validated rules with per-rule exit configurations are promoted to live trading
5. **Performance Tracking** — Live results are tracked with analytics breakdown by rule
6. **Degradation Detection & Demotion** — Health scoring compares backtest vs live metrics per rule; degradation triggers toast notifications across all dashboard pages; underperforming rules can be demoted from live trading

### Dashboard Surfaces

The Strategy Discovery dashboard exposes mining configuration and results in-place:

- **Split-mode selector** with a ratio slider lets users choose between time-series and random train/test split and tune the train/test ratio per run
- **Carry-mode toggle** controls whether simulations carry positions across sessions
- **Capital-utilization statistics** surface how much simulated capital a rule deploys and how concurrently its trades overlap
- **Worst-trade analytics** highlight the bottom-quantile outcomes so users see downside shape alongside headline performance

---

## Exit Engine

Centralized exit logic shared across all strategies and promoted rules:

- **Stop Loss** — Fixed percentage-based stop loss
- **Trailing Stop** — Dynamic stop that follows price movement
- **Scaled Profit Targets** — Multi-tier partial profit taking at configurable levels
- **Time-Based Exits** — Maximum hold duration enforcement
- **Price Freshness Validation** — Stale price guards prevent exit decisions on outdated market data; buy orders use fresh Redis tick prices with automatic fallback

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
- Dedicated backtest workers in sharded mode for distributed execution via Redis work queues, with a finalize queue handling asynchronous result aggregation separately from the API process
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

## Production Correctness

Production-grade operation depends on handling real-world failure modes that simple code paths and backtests alone hide:

- **WebSocket Auto-Reconnect** — The market-data stream reconnects with exponential backoff on transient failure, preserving subscription state across disconnects so live strategies resume without manual intervention
- **Redis Connection Manager** — Auto-reconnect, keepalive heartbeats, and periodic health pings keep the pub/sub and cache layer available under network wobble; payload compression reduces bandwidth on high-throughput channels
- **Structural Buy-Sell Linking** — Trade accounting follows the actual order relationship between buys and sells rather than FIFO-by-timestamp, so P&L attribution matches the order-book truth even when exits fill out of submission order
- **Split-Adjusted Historical Bars** — Backtests and live price references use split-adjusted bars from the broker, preventing spurious signals and pricing errors around corporate actions

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
| **Trade Detail** | Decision audit trail — entry/exit conditions that fired, indicator snapshots at decision time, candlestick visualization |
| **Backtest** | Run backtests, real-time progress, per-strategy analytics |
| **Auto-Backtest** | Parameter optimization iterations, best-params storage |
| **Campaign Backtest** | Multi-day strategy comparison, per-day drill-down, cross-day aggregation |
| **Strategy Discovery** | Rule mining UI, temporal pattern visualization, promote rules with detection-type tagging |
| **Fingerprinting** | Run list plus multi-tab run-detail view — overview, coverage, cross-strategy overlap, and seed candidates |
| **Position Monitor** | Live exit state tracking, stop distances, profit target progress, WebSocket updates |
| **Rule Lifecycle** | Health scoring, degradation detection, survival analysis, rule demotion |
| **Settings** | Risk management, notifications, broker config, scheduler |

---

## Notification System

Live notification bell wired to backend WebSocket events with severity-tiered delivery:

| Severity | Delivery | Event Types |
|----------|----------|-------------|
| **Critical** | Toast + bell | Order fills, stop-loss triggers, kill switch activations |
| **Warning** | Bell only | Alert triggers, rule health changes |
| **Info** | Bell only | Order submissions, mover detections, pattern discoveries |

- Hybrid read/dismiss model — opening the dropdown marks notifications as read; individual items can be dismissed
- Redis-backed persistence with automatic TTL expiration for transient event data
- Backfill on reconnect ensures no events are missed during connection interruptions
- WebSocket connection status indicator on the bell icon (connected/reconnecting)

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

Administrative command-line interface built with Typer and Rich for database management, service control, operational tasks, and strategy fingerprinting — analyzing historical runs and generating seed candidates that feed the rule-mining engine.

---

## Code Quality & CI/CD

- **Linting** — Ruff for unified formatting and lint checks
- **Type Checking** — MyPy in strict mode across the entire backend
- **Testing** — pytest with async support, property-based testing (hypothesis), time mocking, and HTTP mocking
- **CI Pipeline** — GitHub Actions runs lint, typecheck, and full test suite on every push and pull request
- **Dependency Management** — Renovate for automated dependency updates with CI gating
- **Type Generation** — OpenAPI-driven TypeScript type generation with CI drift detection
