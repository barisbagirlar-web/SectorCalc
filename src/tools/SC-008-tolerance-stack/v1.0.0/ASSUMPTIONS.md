# SC-008 — Honest Assumptions (v1.0.0)

| # | Assumption | Accuracy | Risk |
|---|------------|----------|------|
| 1 | Worst-case = arithmetic sum of bilateral tolerances | Guaranteed bound; independent of distribution. | Over-pessimistic for capable, independent processes. |
| 2 | RSS = sqrt(sum(tol^2)) | Exact for independent, centered, equal-capability contributors at the RSS convention. | Correlation / bias violate the model. |
| 3 | Monte Carlo uses seeded Decimal LCG + Acklam inverse-CDF | Deterministic; same seed + iterations -> identical report. | LCG period is adequate for engineering MC, not cryptographic. |
| 4 | Normal std = tol / (3*cpk) (default cpk -> 3) | Common process-capability mapping of bilateral tol to sigma. | Wrong cpk widens/narrows the simulated spread. |
| 5 | Uniform samples the full +/- tol interval | Flat density inside the tolerance band. | Real scrap/inspect truncations are not modeled. |
| 6 | Defect ppm is empirical (out-of-spec / runs) | No normal-CDF approximation; reports what the sample did. | Low iteration counts make ppm noisy. |
| 7 | Pareto shares are RSS (tol^2 / sum tol^2) | Ranks leverage under the RSS model. | Non-RSS contributors (bias, correlation) need a different ranking. |
| 8 | No clamping of rates or Cpk | Bad stacks surface as INCAPABLE / WORST_CASE_OUT. | UI must show uncomfortable numbers. |

`target` is accepted on the input schema for future centering analysis; v1.0.0 does not use it in the engine.
