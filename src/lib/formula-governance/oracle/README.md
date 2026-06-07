# Formula Oracle Baseline (Phase 3)

Independent reference models for **critical** FormulaContracts where `oracleRequired: true`.

## Purpose

Oracles provide a second calculation path that the audit runner compares against the production formula. They are not user-facing and do not replace domain review.

## Phase 1 status

- Registry: `registry.ts` — lists expected oracle files per `toolId`
- Implementations: **not yet added** (Phase 3)
- Rent vs Buy: `rent-vs-buy-oracle.ts` — planned

## Adding an oracle

1. Create `src/lib/formula-governance/oracle/<tool>-oracle.ts`
2. Register the file in `registry.ts` under `ORACLE_FILES`
3. Wire comparison tests in `src/lib/formula-governance/__tests__/`
4. Re-run `npm run audit:formulas -- --strict`

## Policy

Critical tools with `oracleRequired: true` **cannot PASS** until an oracle is registered and tests pass.
