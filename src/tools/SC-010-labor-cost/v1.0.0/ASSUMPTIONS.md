# SC-010 — Honest Assumptions (v1.0.0)

Every assumption below is documented with its accuracy and risk.
Nothing is hidden; the engine warns where an assumption bites.

| # | Assumption | Accuracy | Risk |
|---|------------|----------|------|
| 1 | `gross = net / (1 - employeeRate)` | Approximate — flat income-tax model; progressive brackets not modeled. | Deviation grows at high income. |
| 2 | `weeksPerMonth = 4.33` (52/12) | Standard ISO approach; real month length varies. | +/-2% in Jan/Feb/31-day months. |
| 3 | Country employer/employee rates | Reference estimates close to law, not exact; expect yearly updates. | Update on legal change. |
| 4 | `annualBonus / 12` | Even spread; real payment timing not modeled. | Insufficient for cash-flow planning. |
| 5 | `recruitmentCost / (tenure*12)` | Linear amortization; reality may be front-loaded. | First months under-state true burn. |
| 6 | `overtimeMultiplier >= 1` | Law-aligned floor (TR >= 1.5); model is generic. | Country-specific multiplier varies. |
| 7 | `tenureYears > 0`, `hoursPerWeek > 0`, `employeeRate < 1` | Hard guards; violating throws a structured CalcError. | Short contracts need manual tuning. |
| 8 | Currency is a LABEL, not converted | No FX conversion (live rates are non-deterministic; would break reproducibility). | Cross-currency comparison needs a separate deterministic rate input. |

Conservation law (runtime-enforced): `trueMonthlyCost === sum(breakdown)`.
A violation throws `E_CONSERVATION` — the engine refuses to ship a wrong total.
