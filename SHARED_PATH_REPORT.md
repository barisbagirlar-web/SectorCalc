# Shared Calculation Path — Structured Report

## 1. Formula Registry Loader (registry entries → runtime)

| Component | File | Line | Role |
|---|---|---|---|
| Static module imports | `src/sectorcalc/formulas/pro-v531/resolve-formula-module.ts` | 11-32 | Imports all 20 PRO formula modules statically |
| ToolKey → module map | `src/sectorcalc/formulas/pro-v531/resolve-formula-module.ts` | 43-48 | Builds `moduleByToolKey` Map |
| Public resolver | `src/sectorcalc/formulas/pro-v531/resolve-formula-module.ts` | 50-52 | `resolveFormulaModule(toolKey)` — primary lookup |
| Free tool registry | `src/sectorcalc/formulas/free-v531/index.ts` | 54-153 | `freeV531FormulaRegistry` Record mapping 50 free tools |
| Free tool registry loader | `src/sectorcalc/formulas/free-v531/registry.ts` | 1-50 | Imports all 50 free formula modules |

## 2. Safe AST Evaluator (no eval/new Function)

| Component | File | Line | Role |
|---|---|---|---|
| executeOperation | `src/sectorcalc/pro-runtime/deterministic-formula-engine.ts` | 36-137 | Switch-based typed operation dispatch — **NO eval. NO new Function.** |
| executeFormulaGraph | `src/sectorcalc/pro-runtime/deterministic-formula-engine.ts` | 139-240 | Iterative graph resolver with dependency ordering |
| FormulaRegistry class | `src/sectorcalc/pro-runtime/formula-registry.ts` | 47-100 | Registry store with register/fetch/fetchBySchemaHash |

## 3. Schema → Form Input Mapping Layer

| Component | File | Line | Role |
|---|---|---|---|
| API route entry point | `src/app/api/pro-calculator/execute/route.ts` | 659-963 | `POST` handler — full pipeline |
| Tool key resolution | `src/app/api/pro-calculator/execute/route.ts` | 66-77 | `resolveToolKey()` — extracts tool_key from body |
| Schema resolution | `src/app/api/pro-calculator/execute/route.ts` | 682-694 | `resolveApprovedToolSchema()` then `getFreeToolSchema()` fallback |
| Pass 1: static control | `src/app/api/pro-calculator/execute/route.ts` | 85-99 | Schema validation via `validateSuperV4Schema()` |
| Raw input → numeric | `src/app/api/pro-calculator/execute/route.ts` | 123-151 | Extracts numeric values, rejects non-finite |
| Input completeness | `src/app/api/pro-calculator/execute/route.ts` | 164-183 | Checks `required=true` inputs, returns INPUT_KEY_MISSING |
| Unknown input guard | `src/app/api/pro-calculator/execute/route.ts` | 156-162 | Returns INPUT_KEY_UNKNOWN for unexpected keys |
| Unit normalization | `src/app/api/pro-calculator/execute/route.ts` | 198-207 | `normalizeInputs()` with unit conversion |
| Physical bounds check | `src/app/api/pro-calculator/execute/route.ts` | 209-238 | `checkPhysicalBounds()` + `hasBlockingViolation()` |
| Normalized → engine inputs | `src/app/api/pro-calculator/execute/route.ts` | 339-354 | Maps schema normalized_id → engine flatNormInputs |

## 4. Formula Module Execution & Result Formatting

| Component | File | Line | Role |
|---|---|---|---|
| Formula module binding | `src/app/api/pro-calculator/execute/route.ts` | 369-380 | Calls `resolveFormulaModule()` + `validateFormulaModuleBinding()` |
| Formula execution | `src/app/api/pro-calculator/execute/route.ts` | 382-425 | `formulaModule.calculate(flatNormInputs)` → output mapping |
| Fallback: formula graph | `src/app/api/pro-calculator/execute/route.ts` | 428-462 | `executeFormulaGraph()` for registry-based tools |
| NaN/Infinity output guard | `src/app/api/pro-calculator/execute/route.ts` | 402-406 | `Number.isFinite(val)` check before status assignment |
| Derating engine | `src/app/api/pro-calculator/execute/route.ts` | 300-333 | `applyDerating()` validation |
| Sensitivity analysis | `src/app/api/pro-calculator/execute/route.ts` | 498-512 | `analyzeSensitivity()` for input→output sensitivity |
| Decision engine | `src/app/api/pro-calculator/execute/route.ts` | 514-525 | `computeDecision()` → primary_decision |
| Public redaction | `src/app/api/pro-calculator/execute/route.ts` | 579-657 | `pass3PublicControl()` → `redactPublicResponse()` |
| Audit seal | `src/app/api/pro-calculator/execute/route.ts` | 625-632 | `createAuditSeal()` with input/output/schema hashes |

## 5. Shared Path Integrity — Verified

| Guard | Location | Status |
|---|---|---|
| No eval / no new Function | `deterministic-formula-engine.ts:36` | VERIFIED — typed switch dispatch |
| NaN/Infinity in engine | `deterministic-formula-engine.ts:37` | VERIFIED — `Number.isFinite(i)` filter |
| NaN/Infinity in API outputs | `route.ts:402-406` | VERIFIED — `Number.isFinite(val)` check |
| Input completeness | `route.ts:164-183` | VERIFIED — required field check |
| Unknown input rejection | `route.ts:156-162` | VERIFIED — INPUT_KEY_UNKNOWN |
| Non-finite input rejection | `route.ts:126-128` | VERIFIED — NON_FINITE_INPUT |
| Schema-formula contract | `route.ts:373-390` | VERIFIED — binding + result validation |
