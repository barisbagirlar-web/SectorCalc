# Formula Oracle Baseline (Phase 4)

Independent reference models for **critical** FormulaContracts where `oracleRequired: true`.

## Purpose

Oracles provide a second calculation path that the audit runner compares against the production formula. They are not user-facing and do not replace domain review.

## Phase 4 status

- **Finance module:** `finance-oracles.ts` + `oracle-types.ts`
- **Registered (5):** loan, mortgage, simple interest, compound interest, profit margin
- **Scenario runtime:** `scenario-runner.ts` executes `present: true` specs against oracles
- **Property tests:** `finance-properties.test.ts` (fast-check)

## Pending tool IDs (6)

Use `listPendingOracleToolIds()`:

- `free-traffic.rent-vs-buy-calculator` (module registered, file not implemented)
- `free-traffic.break-even-calculator`
- `free-traffic.salary-cost-calculator`
- `free-traffic.cash-flow-gap-calculator`
- `free-traffic.machine-time-calculator`
- `revenue-premium.cnc-quote-risk-analyzer`

## Adding an oracle

1. Add reference functions to a new or existing oracle module (never import production calculators)
2. Register `toolId → module filename` in `registry.ts` under `ORACLE_MODULE_BY_TOOL`
3. Add scenario handlers in `scenario-runner.ts` if runtime scenarios are required
4. Wire property tests in `__tests__/`
5. Re-run `npm run audit:formulas`

## Policy

Critical tools with `oracleRequired: true` **cannot PASS** until oracle is registered, property tests are marked, and scenario runtime passes where declared.

Production-vs-oracle comparison is Phase 5.
