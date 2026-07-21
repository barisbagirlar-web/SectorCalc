# SC-001 — Honest Assumptions (v1.0.0)

| # | Assumption | Accuracy | Risk |
|---|------------|----------|------|
| 1 | `requiredThroat = load / (length * allowableShear)` | Uniform stress along the weld; no eccentricity. | Eccentric / out-of-plane loads need a vector check. |
| 2 | Fillet factor 0.707 (equal-leg 45 deg) | Exact for 45 deg equal-leg. | Skew fillets need cos(half-angle) correction. |
| 3 | Butt "leg" == throat (full penetration) | Simplification; butt welds are sized by penetration, not leg. | Treat butt result as effective throat, not a leg. |
| 4 | Min-leg table = AWS D1.1 Table 2.1 (approx) | Reference estimate, step-interpolated. | Verify against the code edition in force. |
| 5 | Single weld, single load direction | No combined shear + tension. | Combined loading needs interaction formula. |
| 6 | `weldLength/strength/safetyFactor/thickness > 0` | Hard guards; violation throws a structured CalcError. | `designLoadN = 0` is allowed (unloaded check). |

Dimensional engine: the leg is a Quantity (length) and is converted mm -> in via
the unit-converter, so the same number is shown in both systems deterministically.
