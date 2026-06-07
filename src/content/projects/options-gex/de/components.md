---
title: Komponentenreferenz
description: options-gex Schlüsselkomponenten — GEX-Berechnung, Signal-Regeln, Backtest-Engine und das Go-Live-Gate
---

## GEX-Berechnung

Die analytische Kernschicht berechnet die Gamma-Exposure der Händler aus dem Open Interest der Optionskette — lokal und transparent, ohne undurchsichtige Vendor-Werte.

| Output | Bedeutung |
|--------|-----------|
| **Call Wall** | Strike mit der grössten positiven Gamma-Konzentration über dem Spot |
| **Put Wall** | Strike mit der grössten negativen Gamma-Konzentration unter dem Spot |
| **Gamma Flip** | Preislevel, an dem die Netto-Händler-Gamma null kreuzt |
| **Normalized GEX** | Exposure auf einer vergleichbaren Skala über Ticker und Zeit |

Die Berechnung nutzt eine Risk-Free Rate von FRED, und ein Kalibrierungsschritt vergleicht berechnete Level gegen externe Referenzbeobachtungen und warnt bei Drift.

---

## Signal-Regeln

Level-basierte Ein- und Ausstiegsregeln evaluieren jeden rekonstruierten Snapshot. Regeln werden pro Ticker mit expliziten, sweep-baren Parametern definiert (zum Beispiel eine Wall-Buffer-Distanz), sodass das Verhalten abstimmbar und reproduzierbar ist statt hartkodiert.

---

## Backtest-Engine

Die Engine spielt rekonstruierte Snapshots durch die Signal-Regeln und zeichnet simulierte Trades auf.

- **Baseline-Kontrollen** — jeder GEX-Regel-Lauf wird gegen Baseline-Strategien (etwa Buy-and-Hold) gemessen, sodass ein Edge nachgewiesen werden muss, nicht angenommen.
- **Single-Parameter-Sweep** — führt eine Regel über einen Wertebereich eines Parameters aus, um zu testen, ob die Performance stabil ist oder ein fragiler Peak.
- **Reporting** — eine Run-Zusammenfassung, eine Trade-Liste und ein Gate-Urteil rendern in einen operator-gerichteten Report.

---

## Go-Live-Gate

Die Entscheidung, jemals eine Live-Order zu routen, ist an einen Sechs-Bedingungen-Evaluator delegiert. Ein bestandenes Urteil auf **jedem** Ziel-Ticker ist das einzige Go-Signal für Phase 2; alles darunter hält das Projekt research-only.

| # | Bedingung |
|---|-----------|
| **a** | Trade-Anzahl erreicht einen Per-Ticker-Floor **und** das Bootstrap-Konfidenzintervall der Per-Trade-Expectancy ist strikt positiv |
| **b** | Mittlere Expectancy übersteigt die Round-Trip-Handelskosten deutlich |
| **c** | Maximaler Drawdown bleibt unter der konfigurierten Obergrenze |
| **d** | Risikoadjustierte Rendite schlägt die beste Baseline, mit Escape-Klausel für Buy-and-Hold-Rückenwind |
| **e** | Performance ist über den Parameter-Sweep stabil |
| **f** | Temporale Stabilität — Trades verteilen sich über das Fenster und beide Hälften stimmen im Vorzeichen mit dem Gesamtfenster überein |

Das Gate ist die zentrale Disziplin des Projekts: Es verwandelt „das sieht vielversprechend aus" in ein falsifizierbares Per-Bedingung-Urteil, das halten muss, bevor Live-Ausführung freigeschaltet wird.

---

## Notebooks

Drei Jupyter-Notebooks unterstützen Inspektions-Workflows:

- **Per-Trade-Inspektion** — eine GEX-State-Timeline mit überlagerten Trade-Ein- und -Ausstiegen.
- **Equity-Kurve** — eine Equity-Kurve mit Drawdown-Schattierung und einem separaten Drawdown-Panel.
- **Sweep-Ansicht** — P&L, eine Sortino-Approximation und max. Drawdown über einen Single-Parameter-Sweep geplottet.

Jedes Notebook baut sein eigenes synthetisches In-Memory-Fixture und läuft so end-to-end ohne Credentials. Ein Integrationstest führt alle drei aus und scannt den gerenderten Output auf Credential-Leaks; `nbstripout` entfernt Output-Zellen beim Commit.

---

## Tooling & Qualität

- **Python 3.12+** mit `uv` für das Dependency-Management.
- **Reproduzierbarkeit** — geseedete Läufe machen Backtests deterministisch wiederholbar.
- **Secrets** — SOPS + age für den Master Key, verschlüsselte Credentials at rest in Phase 2.
- **Pre-Commit** — Notebook-Output-Stripping und ein `.env`/Datenbank-Commit-Guard, lokal durchgesetzt.

---

## Rolle

Alleiniger Designer und Umsetzer: die GEX-Berechnung und -Kalibrierung, die Per-Ticker-Signal-Regeln, die Backtest-Engine mit Baseline-Kontrollen und Parameter-Sweeps, das falsifikations-orientierte Go-Live-Gate sowie die Credential-Sicherheits- und Umgebungsauflösungsschicht, die Live-Ausführung abgesperrt hält, bis die Evidenz es rechtfertigt.
