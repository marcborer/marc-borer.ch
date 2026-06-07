---
title: Component Reference
description: options-gex key components — GEX computation, signal rules, backtest engine, and the go-live gate
---

## GEX Computation

The core analytic layer computes dealer gamma exposure from option-chain open interest, locally and transparently — no opaque vendor numbers.

| Output | Meaning |
|--------|---------|
| **Call wall** | Strike with the largest positive gamma concentration above spot |
| **Put wall** | Strike with the largest negative gamma concentration below spot |
| **Gamma flip** | Price level where net dealer gamma crosses zero |
| **Normalized GEX** | Exposure expressed on a comparable scale across tickers and time |

Computation uses a risk-free rate from FRED, and a calibration step compares computed levels against external reference observations and warns on drift.

---

## Signal Rules

Level-driven entry and exit rules evaluate each reconstructed snapshot. Rules are defined per ticker with explicit, sweepable parameters (for example a wall-buffer distance), so behaviour is tunable and reproducible rather than hard-coded.

---

## Backtest Engine

The engine replays reconstructed snapshots through the signal rules and records simulated trades.

- **Baseline controls** — every GEX-rule run is measured against baseline strategies (such as buy-and-hold) so an edge has to be demonstrated, not assumed.
- **Single-parameter sweep** — runs a rule across a range of values for one parameter to test whether performance is stable or a fragile peak.
- **Reporting** — a run summary, a trade list, and a gate verdict render to an operator-facing report.

---

## Go-Live Gate

The decision to ever route a live order is delegated to a six-condition evaluator. A passing verdict on **every** target ticker is the only go signal for Phase 2; anything less keeps the project research-only.

| # | Condition |
|---|-----------|
| **a** | Trade count meets a per-ticker floor **and** the bootstrap confidence interval on per-trade expectancy is strictly positive |
| **b** | Mean expectancy comfortably exceeds the round-trip cost of trading |
| **c** | Maximum drawdown stays under the configured ceiling |
| **d** | Risk-adjusted return clears the best baseline, with an escape clause for buy-and-hold tailwinds |
| **e** | Performance is stable across the parameter sweep |
| **f** | Temporal stability — trades are spread across the window and both halves agree in sign with the full window |

The gate is the project's central discipline: it converts "this looks promising" into a falsifiable, per-condition verdict that has to hold before live execution is unlocked.

---

## Notebooks

Three Jupyter notebooks support inspection workflows:

- **Per-trade inspection** — a GEX-state timeline with trade entries and exits overlaid.
- **Equity curve** — an equity curve with drawdown shading and a separate drawdown panel.
- **Sweep view** — P&L, a Sortino approximation, and max drawdown plotted across a single-parameter sweep.

Each notebook builds its own synthetic in-memory fixture, so it runs end-to-end without credentials. An integration test executes all three and scans the rendered output for credential leaks; `nbstripout` clears output cells on commit.

---

## Tooling & Quality

- **Python 3.12+** with `uv` for dependency management.
- **Reproducibility** — seeded runs make backtests deterministically replayable.
- **Secrets** — SOPS + age for the master key, encrypted-at-rest credentials in Phase 2.
- **Pre-commit** — notebook-output stripping and an `.env`/database commit guard, enforced locally.

---

## Role

Sole designer and implementer: the GEX computation and calibration, the per-ticker signal rules, the backtest engine with baseline controls and parameter sweeps, the falsification-first go-live gate, and the credential-safety and environment-resolution layer that keeps live execution fenced off until the evidence justifies it.
