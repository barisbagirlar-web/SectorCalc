# SC-012 — Honest Assumptions (v1.0.0)

| # | Assumption | Accuracy | Risk |
|---|------------|----------|------|
| 1 | `effectiveMaterial = material / (1 - scrapRate)` | Standard yield model; assumes scrap is uniform. | Non-uniform scrap (per-part) not modeled. |
| 2 | Finance charge = simple interest | Not compound; `cost * rate * (days/30)`. | Slight under-charge on very long terms. |
| 3 | `laborHourlyCost` / `machineHourlyCost` are manual inputs | Cross-tool feed from SC-010 / SC-011 is NOT wired (tools stay independent). | User must copy the true rates; stale rates misprice. |
| 4 | Overhead is a flat rate on direct cost | Activity-based costing not modeled. | Over/under-absorption on mixed jobs. |
| 5 | Margin is on sell price (`sell = cost/(1-m)`) | Margin-on-price, not markup-on-cost. | Confusing the two misprices; this tool uses margin-on-price. |
| 6 | `scrapRate < 1`, `targetMargin < 1`, `quantity > 0` | Hard guards; violation throws a structured CalcError. | Inputs must be ratios (0.10), not percent (10). |

Conservation law (runtime-enforced): `totalCost === sum(9 breakdown items)`.
A violation throws `E_CONSERVATION` — the engine refuses to ship a wrong cost.
