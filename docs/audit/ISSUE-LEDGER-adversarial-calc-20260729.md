# Issue Ledger — Adversarial Calculator Close-Out (2026-07-29)

Branch: `fix/adversarial-calc-close-20260729`
Final status: **OPEN = 0 · BLOCKED = 0 · CLOSED = 25**

---

## CLOSED (with evidence)

| ID      | Severity | Fix summary                                                                      | Tests / commands                                               |
| ------- | -------- | -------------------------------------------------------------------------------- | -------------------------------------------------------------- | --- | --- | --- | ------------ |
| ADV-F1  | P0       | `escapeAttr`/`escapeHtml` in `renderDims` + report; missing `&h=` → tampered     | `tests/adversarial-closeout.test.ts`, `tests/sc008-p4.test.ts` |
| ADV-F2  | P0       | Same escape on load path                                                         | same                                                           |
| ADV-F3  | P0       | Dimensions SSOT in mm; unit toggle display-only                                  | adversarial-closeout unit identity                             |
| ADV-F3b | P0       | Closed by F3 (hash stable across unit toggles when SSOT intact)                  | same                                                           |
| ADV-C1  | P0       | Pareto from `r.breakdown` only; deleted dual `buildBreakdown`                    | formula + adversarial conservation                             |
| ADV-A1  | P0       | Fillet table only when `jointType==='fillet'`                                    | SC-001 formula + adversarial                                   |
| ADV-B1  | P1       | Hourly denom = straight + OT hours                                               | SC-010 formula + adversarial                                   |
| ADV-B2  | P1       | `requireInRange(employeeRate,0,0.95)`                                            | formula tests                                                  |
| ADV-G2  | P1       | Country `<select>` + defaults                                                    | labor-pro.html/ts                                              |
| ADV-C2  | P1       | scrap ≥ 0                                                                        | formula tests                                                  |
| ADV-C4  | P1       | `setupMinutes` + `setupHourlyCost` fields                                        | quote HTML/TS + adversarial                                    |
| ADV-D3  | P1       | Empirical P0.13 labeled estimate; 3 dp display                                   | sc008-pro report                                               |
| ADV-D4  | P1       | `specHalf = min(                                                                 | su                                                             | ,   | sl  | )`  | sc008-pro.ts |
| ADV-E1  | P1       | `requirePick` throws                                                             | weld/labor/quote-pro                                           |
| ADV-F4  | P1       | Honest session/UI unlock copy                                                    | professional-ui + lock strings                                 |
| ADV-F5  | P1       | Number coerce on `applyProjectState`                                             | sc008-pro                                                      |
| ADV-G1  | P1       | Softened privacy; guard scans `src/**/*.ts`                                      | guard-claim-honesty PASS                                       |
| ADV-A2  | P2       | Utilization vs governing leg; units in steps                                     | SC-001 formula                                                 |
| ADV-A3  | P2       | Step results include MPa/mm                                                      | SC-001 formula                                                 |
| ADV-B3  | P2       | 0.95 employeeRate ceiling                                                        | formula tests                                                  |
| ADV-C3  | P2       | margin ≥ 0                                                                       | formula tests                                                  |
| ADV-D5  | P2       | Per-component LCG substreams                                                     | formula + golden regen                                         |
| ADV-E2  | P2       | `parseInputNumber` rejects comma                                                 | parse-number tests                                             |
| ADV-F6  | P2       | Integrity share for weld/labor/quote                                             | share-integrity tests                                          |
| ADV-F7  | P0       | Vite redirect preserves `?s=&h=`; share URLs use `/calculator/*` canonical paths | e2e suites/12 + sc008-p4 + adversarial-closeout                |

## Verification executed (this branch)

- `npx vitest run` → **529 passed**
- `npm run typecheck` → PASS
- `npm run build` → PASS (all guards including claim honesty)
- `node scripts/guard-claim-honesty.mjs` → PASS (102 HTML + src TS)
- `npm run lint` → pre-existing broken config (`eslint src/ --ext .js` finds no files) — not introduced by this change

## Out of scope (explicit)

- Cryptographic server-side paywall of CSR calculator engines (not claimed after ADV-F4 copy fix)
- Full Firestore/Paddle credit ledger audit (separate engagement)
