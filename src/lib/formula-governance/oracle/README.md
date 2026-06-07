# Formula Oracle Baseline (Phase 4–5C)

Independent reference models for **critical** FormulaContracts where `oracleRequired: true`.

## Purpose

Oracles provide a second calculation path that the audit runner compares against the production formula. They are not user-facing and do not replace domain review.

## Registered modules

| Module | Tools |
|---|---|
| `finance-oracles.ts` | loan, mortgage, simple interest, compound interest, profit margin |
| `rent-vs-buy-oracle.ts` | rent vs buy |
| `business-oracles.ts` | break-even, salary cost, cash-flow gap |
| `operations-oracles.ts` | machine time, CNC quote risk (base cost layer) |

## Infrastructure

- **Scenario runtime:** `scenario-runner.ts`
- **Production adapters:** `production-adapters.ts`
- **Comparison runner:** `compare-production-oracle.ts`, `compare-business-operations-oracle.ts`
- **Property tests:** `finance-properties.test.ts`, `rent-vs-buy-properties.test.ts`, `business-operations-properties.test.ts`

## Pending tool IDs

`listPendingOracleToolIds()` returns **[]** after Phase 5C (all 11 contracted critical tools with oracles are registered).

## Adding an oracle

1. Add reference functions to a new or existing oracle module (never import production calculators)
2. Register `toolId → module filename` in `registry.ts`
3. Add production locator entry in `production-formula-locator.ts`
4. Add adapter + comparison scenarios + scenario handlers
5. Mark contract `propertyTestsRegistered: true` and wire runtime scenarios
6. Re-run `npm run audit:formulas`

## Policy

Critical tools with unresolved `missingParameterWarnings` may remain **FAIL** even when oracle/scenario/property gates pass. Production-vs-oracle comparison runs via `auditOracleComparisonForSlug`.
