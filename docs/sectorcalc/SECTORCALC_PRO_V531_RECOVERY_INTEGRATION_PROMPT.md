# SectorCalc PRO V5.3.1 — Baris Schema Recovery Integration Prompt

> **Integration Contract — Fail-Closed**
>
> This file is the single source of truth for integrating `pro_tools_baris_` (45 PRO schemas)
> into the SectorCalc V5.3.1 runtime. Every step below is mandatory.
> No step may be skipped, stubbed, or fake-PASSed.

---

## 1. Identity

- `pro_tools_baris_` is a **schema-only package** (45 JSON schema files).
- It is NOT a running calculation engine.
- It requires a private server-side formula registry for live execution.
- Public formula expressions are intentionally redacted.
- Runtime LLM usage is FORBIDDEN.

## 2. Schema Import

Copy every file from `pro_tools_baris_/schemas/*.schema.json` into:
```
src/sectorcalc/schemas/pro-v531/
```
Preserve original filenames. Do not rename, reorder, or modify.

## 3. Schema Validation

For each of the 45 schema files, verify:
- Valid JSON parse
- All 40 approved top-level keys present
- No unknown top-level keys
- English-only visible text (no Turkish/other)
- No public formula expression exposure
- Brand safety policy compliant (no third-party brand claims)
- `calculation_basis.basis_type === "PROTECTED_SERVER_FORMULA_GRAPH_WITH_PUBLIC_SAFE_SCHEMA_CONTRACT"`
- No certification/legal-proof claims

## 4. Runtime Reverse Engineering (READ — do not modify)

Read and understand the following existing V5.3.1 runtime files:

| File | Purpose |
|------|---------|
| `src/sectorcalc/pro-runtime/formula-registry.ts` | Private Formula Registry class |
| `src/sectorcalc/pro-runtime/deterministic-formula-engine.ts` | Server-only deterministic engine |
| `src/sectorcalc/pro-runtime/proof-pack-builder.ts` | Public-safe proof pack builder |
| `src/sectorcalc/pro-runtime/audit-seal-service.ts` | Audit seal (schema+formula+input+output hash) |
| `src/sectorcalc/formulas/pro-v531/pro-v531-formula-registry.ts` | Existing pro formula registry (138 tools) |
| `src/sectorcalc/formulas/pro-v531/sc_001_*.formula.ts` | Example of a working pro formula file |

## 5. Formula Readiness Classification — NO FAKE FORMULAS

Do NOT create formula files that synthesise standard tables, coefficients, clause numbers,
vendor datasheets, or emission factors.

Classify each of the 45 tools into exactly one category:

### LIVE_ENGINE_READY
- Formula uses only open/public arithmetic, financial, or physical relationships
- No restricted standard tables, proprietary coefficients, or vendor data required
- Example: break-even analysis, margin calculation, depreciation, cost allocation

### BLOCKED_SOURCE_REQUIRED
- Formula requires standard-specific tables, coefficients, or reference values
- Examples: API 520 orifice coefficients, ASME VIII allowable stress, VDI 2230 tightening factors,
  ISO 286 tolerance grades, CBAM emission factors, AWS D1.1 weld values, EC3 buckling curves
- These tools CANNOT produce correct results without the source reference value
- Mark them BLOCKED — do NOT invent values

### BLOCKED_RUNTIME_CONTRACT_MISMATCH
- Tool has structural requirements that don't fit the current registry/engine contract
- Example: multi-pass workflow, file upload processing, external API dependency
- These are not errors — they are design-scope gaps for future expansion

## 6. Forbidden Actions

- ❌ Creating formula files with invented standard values
- ❌ Client-side formula execution
- ❌ Public formula expression in schemas or UI
- ❌ Reproducing paid standard tables
- ❌ Certification/legal-proof/third-party-brand claims
- ❌ Silent skip, TODO, stub, fake PASS
- ❌ Any Turkish or non-English text in code

## 7. Build Guard Scripts

Create the following 7 guard scripts in `scripts/`:

| Script | Purpose |
|--------|---------|
| `validate-pro-v531-baris-schemas.mjs` | JSON parse, 40 top-level keys, English-only, brand safety |
| `guard-pro-v531-baris-formula-leak.mjs` | No formula expressions in public schema files |
| `guard-pro-v531-baris-no-client-formula-execution.mjs` | No formula execution in client bundle |
| `guard-pro-v531-baris-non-english.mjs` | No Turkish/non-English visible text |
| `guard-pro-v531-baris-routes.mjs` | Route structure valid |
| `guard-pro-v531-baris-registry-binding.mjs` | Schema files exist and are registered |
| `guard-pro-v531-baris-readiness.mjs` | Classification report — LIVE/BLOCKED counts |

## 8. Tests

Create `tests/pro-v531-baris/` with fail-closed tests:
- Schema file count = 45
- Each schema parses as valid JSON
- Required top-level keys present
- LIVE_ENGINE_READY tools have corresponding formula stubs
- BLOCKED_SOURCE_REQUIRED tools have classification records

## 9. Validation Gate

Run ALL of the following commands. Claimed-but-not-run = FAIL.

```bash
git status --short
find pro_tools_baris_/schemas -name '*.schema.json' | wc -l
node scripts/validate-pro-v531-baris-schemas.mjs
node scripts/guard-pro-v531-baris-formula-leak.mjs
node scripts/guard-pro-v531-baris-no-client-formula-execution.mjs
node scripts/guard-pro-v531-baris-non-english.mjs
node scripts/guard-pro-v531-baris-routes.mjs
node scripts/guard-pro-v531-baris-registry-binding.mjs
node scripts/guard-pro-v531-baris-readiness.mjs
npm run typecheck
npm run lint
npm run build
npm run guard:root-only
npm test -- --run tests/pro-v531-baris
```

## 10. Final Report Format

```
RESULT: PASS | FAIL
CHANGED_FILES:
- <file>
CRITERIA:
- <criterion>: PASS|FAIL|BLOCKED
  COMMAND: <actual command>
  OUTPUT:
  <actual output>
BLOCKERS:
- <path + exact reason> | NONE
LIVE_ENGINE_READY_TOOLS:
- <tool_key> | NONE
BLOCKED_SOURCE_REQUIRED_TOOLS:
- <tool_key>: <missing source/evidence reason> | NONE
BLOCKED_RUNTIME_CONTRACT_MISMATCH_TOOLS:
- <tool_key>: <contract mismatch reason> | NONE
```

---
