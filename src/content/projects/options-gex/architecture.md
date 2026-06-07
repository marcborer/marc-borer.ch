---
title: Architecture
description: options-gex system architecture — research pipeline, phased design, and credential safety
---

## System Architecture

options-gex is a research engine for gamma-exposure-driven (GEX) options trading. Dealer gamma positioning shapes intraday price behaviour around key strike levels — the call wall, the put wall, and the gamma flip — and the tool's premise is **falsification first**: build the full pipeline to pull raw option chains, compute GEX transparently, and prove whether GEX-derived rules actually beat naive baselines *before* any capital is at risk.

### Phased Design

The system is split into two phases with a hard gate between them.

| Phase | Scope |
|-------|-------|
| **Phase 1 — Research** | Library + CLI surface. No live execution, no dashboard, no Compose stack. Pull chains, compute GEX, backtest, evaluate the gate. |
| **Phase 2 — Live (gated)** | Live order routing, observability stack, and Compose deployment. Unlocked only once backtest results survive the gate on every target ticker. |

Phase 2 does not exist operationally until Phase 1's evidence clears the gate. A failing verdict is treated as a falsification, and the project stays research-only.

### Data Flow

```
Option chains (Alpaca)  ──┐
                          ├──► Snapshot reconstruction ──► GEX computation
Risk-free rate (FRED) ────┘                                     │
                                                                ▼
                                            Signal rules (level-driven entries/exits)
                                                                │
                                                                ▼
                              Backtest engine ──► Baselines + single-parameter sweep
                                                                │
                                                                ▼
                                              6-condition go-live gate ──► verdict
```

### Module Layout

| Module | Responsibility |
|--------|----------------|
| **data.chain** | Reconstruct point-in-time chain snapshots from historical option data |
| **gex** | Compute GEX levels and calibrate against external reference observations |
| **signals** | Per-ticker entry/exit rules and their parameters |
| **backtest** | Engine, baseline controls, parameter sweep, and the go-live gate |
| **reporting** | Run summary, trade list, and per-condition gate verdict rendering |
| **config.env** | Paper/live environment resolution and credential masking |

### Storage

| Store | Use |
|-------|-----|
| **SQLite** | Local research store for Phase 1 snapshots and runs |
| **PostgreSQL** | Phase 2 operational store; schema managed with Alembic migrations |

The CLI does not auto-migrate — schema changes are operator-driven, applied explicitly through Alembic.

### Environment & Safety

Live trading is fenced behind layered controls rather than a single switch.

- **Dual-signal live gate** — live execution requires **both** `ALPACA_ENV=live` in the environment **and** an explicit `--live` flag on the invocation. Either signal alone resolves to paper context.
- **Non-suppressible banner** — a banner naming the active environment prints to stderr before any API call.
- **Encrypted credentials** — Phase 2 stores credentials encrypted at rest with a master key; the master key itself lives in an age-encrypted file managed through SOPS, with a paper-backed disaster-recovery recipient.
- **Log masking** — a logging filter masks system-loaded credentials so secrets never reach the logs.
- **Commit guards** — pre-commit hooks strip notebook outputs (`nbstripout`) and refuse to commit `.env*` or database files.
