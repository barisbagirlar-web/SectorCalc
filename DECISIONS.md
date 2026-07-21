# SECTORCAL — Locked Decisions (ADR wall)

These decisions are **final**. Reopening them requires an explicit written ADR superseding this file — not a Slack "what if" or an AI suggestion.

| # | Decision | Forbidden | Why it stays locked |
|---|----------|-----------|---------------------|
| 1 | JSON Schema **Draft 2020-12** | Draft 7, Draft 4 | One dialect. Ajv 2020. No schema drift. |
| 2 | **Decimal.js** (Decimal128 semantics: precision 34, half-even) | `Number` for money/calc | Floats lie. Money is decimal strings in JSON. |
| 3 | **Paddle** (Merchant of Record) | Stripe | Tax/compliance stays with MoR — not on us. |
| 4 | **Vanilla JS + Lit** (Web Components) | React, Vue, Next.js, Angular | Small surface, standards-based, no framework churn. |
| 5 | **JSON** for all data | Binary, protobuf, custom formats | Debuggable, schema-validated, one interchange. |

## Enforcement layers

1. `.cursorrules` + `.cursor/rules/*` — agents refuse forbidden stacks
2. `AGENTS.md` — human + agent onboarding
3. `package.json` → `sectorcal.forbiddenPackages`
4. `scripts/assert-stack.mjs` — fails build/CI on violations
5. `eslint.config.js` → `no-restricted-imports`
6. `.github/workflows/stack-gate.yml` — CI gate
7. `schemas/*.json` — `$schema` must be 2020-12 (asserted)

## Layout

```
src/money/          Decimal.js money types (strings in JSON)
src/schema/         Ajv 2020-12 validate / JSON codec
src/payments/paddle Paddle MoR only
src/ui/             Lit Web Components only
src/data/           JSON persistence boundary
schemas/            Draft 2020-12 schemas
scripts/assert-stack.mjs
```

## Reject script

If someone proposes a forbidden option: point at this file, decision number, and continue with the locked stack.
