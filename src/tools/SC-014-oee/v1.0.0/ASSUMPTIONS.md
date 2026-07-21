# SC-014 — Honest Assumptions (v1.0.0)

| # | Assumption | Accuracy | Risk |
|---|------------|----------|------|
| 1 | OEE = availability * performance * quality | Standard SEMI definition. | Combined/weighted OEE across lines not modeled. |
| 2 | performance = idealCycleTime * totalCount / runTime | Theoretical vs actual output ratio. | Wrong ideal cycle time inflates performance >100%. |
| 3 | No clamping of rates >100% | Bad data surfaces as warnings, never hidden. | UI must render >100% values; this is intentional. |
| 4 | runTime 0 -> performance 0; totalCount 0 -> quality 0 | Degenerate guards; no divide-by-zero. | A zero-run period reports OEE 0, not an error. |
| 5 | plannedProductionTime > 0 | Hard guard; 0 planned time is meaningless. | Throws E_NON_POSITIVE. |
| 6 | Series mean via stats.mean | First real tool use of the stats module. | min/max/trend deferred to SC-019 (percentile/stddev). |
| 7 | World-class 85%, attention 60% | Reference thresholds. | Adjust per industry in reference.ts. |

Warnings derive from the result only (inputs not needed).
Series is engine capability + tests; the single-record form UI (RM-006) does not draw arrays.
