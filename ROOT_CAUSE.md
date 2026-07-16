# ROOT CAUSE ANALYSIS — Calculation Engine Systemic Failure

## ROOT_CAUSE=Schema-formula storage value mismatch + orphan golden fixture in hash directory

### Root Cause 1: Schema `formula_storage` Value Mismatch
- **File**: `src/sectorcalc/schemas/pro-v531/break-even-survival-cash-calculator.schema.json:44`
- **Broken value**: `"formula_storage": "PRIVATE_SERVER_SIDE_FORMULA_MODULE"`
- **Expected value**: `"PRIVATE_SERVER_SIDE_FORMULA_REGISTRY_REQUIRED_FOR_LIVE_EXECUTION"`
- **Impact**: Schema validation test (`schema-validate.test.ts:58`) expected the registry value but found `FORMULA_MODULE`. Test fails with:
  ```
  Expected: "PRIVATE_SERVER_SIDE_FORMULA_REGISTRY_REQUIRED_FOR_LIVE_EXECUTION"
  Received: "PRIVATE_SERVER_SIDE_FORMULA_MODULE"
  ```
- **Root cause type**: Schema drift — this schema was created before the `formula_storage` enum was updated to its final value.

### Root Cause 2: Orphan Golden Fixture in Hash Directory
- **File**: `tests/golden/free-v531/machining-cost-per-part-mandated.golden.json`
- **Problem**: This fixture used `tool_key: "machining-cost-per-part"` (same as the real fixture) but had **different inputs**. The golden test runner discovered 51 fixtures (expected 50) and found a hash file for `machining-cost-per-part` only. Since the `-mandated` fixture had no corresponding `.hashes.json` file, it was silently executed but its hashes didn't match the expected ones from the real fixture.
- **Impact**: Golden test reported 4 HASH_MISMATCH errors for `machining-cost-per-part`:
  ```
  HASH_MISMATCH:machining-cost-per-part:normalized_input_hash:expected=fnv1a32:81476c54:actual=fnv1a32:4c917875
  HASH_MISMATCH:machining-cost-per-part:output_hash:expected=fnv1a32:a0b6fb24:actual=fnv1a32:79a0547c
  HASH_MISMATCH:machining-cost-per-part:public_response_hash:expected=fnv1a32:388a4a35:actual=fnv1a32:0dc51de8
  HASH_MISMATCH:machining-cost-per-part:audit_seal_stable_hash:expected=fnv1a32:ecfb017d:actual=fnv1a32:7d7075a4
  ```
- **Root cause type**: Two golden fixtures with the same `tool_key` but different inputs — the second fixture overwrites the first's hash comparison results.

### Root Cause 3: Missing `requiredInputKeys` on 18 of 20 PRO formula modules
- **Impact**: The schema↔formula parity guard cannot auto-verify 18 tools. These tools have `calculate()` but no `requiredInputKeys` export, meaning their input contract is not explicitly declared.
- **Note**: The API pipeline (`route.ts:164-183`) still validates inputs against the schema, so execution is safe. But the auto-derived parity check is incomplete for these 18 tools.

## BROKEN_COMMIT=Not a single-commit regression; cumulative schema drift over multiple feature branches

| Root Cause | Introduced When | Fix |
|---|---|---|
| Schema `formula_storage` mismatch | break-even schema created before v5.4 schema enum update | Updated to `PRIVATE_SERVER_SIDE_FORMULA_REGISTRY_REQUIRED_FOR_LIVE_EXECUTION` |
| Orphan `-mandated` golden fixture | Added in `feat: install 50 free-v531 formulas with golden test hardening` (c3b9568a6) | Moved to `tests/free-tools/` as standalone value-verification test |

## ENGINE_DIRECT_3TOOL=PASS

Three PRO tools verified via vitest engine-direct test (no React, no UI, no API):
1. `break-even-survival-cash-calculator` — sampleInputs → OK, all finite ✓
2. `machine-hourly-rate-proof-report` — sampleInputs → OK, all finite ✓
3. `loss-making-job-detector` — sampleInputs → OK, all finite ✓

Plus all 20 PRO + 50 FREE tools verified.

## FINAL REPORT SUMMARY

| Metric | Value |
|---|---|
| ROOT_CAUSE | Schema-formula storage mismatch + orphan golden fixture |
| BROKEN_COMMIT | Cumulative (not single commit) |
| ENGINE_DIRECT_3TOOL | PASS |
| TOOLS_TOTAL | 70 (20 PRO + 50 FREE) |
| GOLDEN_PASS | 50/50 fixtures, 200/200 hashes |
| GOLDEN_FAIL | 0 |
| ORACLE_PENDING | 0 (all tools have at least one fixture) |
| NAN_GUARD | ACTIVE (verified at engine:37 + API:402-406) |
| PARITY_TEST | ACTIVE (verified for break-even; 18 tools lack requiredInputKeys) |
| TYPECHECK | PRE-EXISTING_ERRORS (document-intelligence, xlsx — unrelated) |
| TESTS | 585 tests, 80 files, all PASS |
| PR_URL | (not yet created) |
