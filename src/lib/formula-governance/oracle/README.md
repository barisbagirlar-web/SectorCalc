# Formula Oracle Baseline (Phase 3+)

Independent reference models for **critical** FormulaContracts where `oracleRequired: true`.

## Purpose

Oracles provide a second calculation path that the audit runner compares against the production formula. They are not user-facing and do not replace domain review.

## Phase 3 status

- Registry: `registry.ts` — `ORACLE_FILES` (implemented) + `ORACLE_PENDING_TOOL_IDS` (awaiting implementation)
- **11 critical tools** marked pending (including rent vs buy)
- Implementations: **not yet added** (Phase 4)
- Rent vs Buy: `rent-vs-buy-oracle.ts` — planned

## Pending tool IDs

Use `listPendingOracleToolIds()` from the governance index. As of Phase 3:

- `free-traffic.rent-vs-buy-calculator`
- `free-traffic.loan-payment-calculator`
- `free-traffic.mortgage-calculator`
- `free-traffic.interest-calculator`
- `free-traffic.compound-interest-calculator`
- `free-traffic.profit-margin-calculator`
- `free-traffic.break-even-calculator`
- `free-traffic.salary-cost-calculator`
- `free-traffic.cash-flow-gap-calculator`
- `free-traffic.machine-time-calculator`
- `revenue-premium.cnc-quote-risk-analyzer`

## Adding an oracle

1. Create `src/lib/formula-governance/oracle/<tool>-oracle.ts`
2. Register the file in `registry.ts` under `ORACLE_FILES`
3. Remove the tool from pending (automatic once file exists and is registered)
4. Wire comparison tests in `src/lib/formula-governance/__tests__/`
5. Re-run `npm run audit:formulas -- --strict`

## Policy

Critical tools with `oracleRequired: true` **cannot PASS** until an oracle is registered and tests pass.
