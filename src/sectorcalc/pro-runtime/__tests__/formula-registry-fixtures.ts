// SectorCalc V5.3.1 — Test-only Formula Registry Fixtures
// These are NOT production formulas. For test verification only.

import { formulaRegistry, FormulaRegistryRecord } from "../formula-registry";

export const TEST_TOOL_KEY = "v531-test-calculator";
export const TEST_TOOL_ID = "v531-test-calculator";

export function createTestFormulaRegistryRecord(
  overrides?: Partial<FormulaRegistryRecord>,
): FormulaRegistryRecord {
  return {
    tool_id: TEST_TOOL_ID,
    tool_key: TEST_TOOL_KEY,
    formula_version: "1.0.0",
    formula_registry_hash: "fr-test-00000001",
    schema_hash_binding: "test-schema-hash-001",
    nodes: [
      {
        formula_id: "f_sum",
        formula_version: "1.0.0",
        schema_hash_binding: "test-schema-hash-001",
        formula_registry_hash: "fr-test-00000001",
        operation: "ADD",
        constant_refs: [],
        input_refs: ["length_norm", "width_norm"],
        output_ref: "result",
        unit_dimension_rule: "LENGTH",
        uncertainty_rule: "NONE",
        sensitivity_rule: "DERIVATIVE",
        fmea_trigger_rule: null,
        acceptance_rule: "result >= 0",
        review_rule: "result < 0",
        rejection_rule: "result is NaN",
        redaction_rule: "PUBLIC_SAFE_REDACTED",
      },
    ],
    internal_trace_policy: "RESTRICTED_CHECKER",
    created_at: "2026-07-03T00:00:00Z",
    approved_at: "2026-07-03T00:00:00Z",
    approved_by: "test",
    ...overrides,
  };
}

export function registerTestFixture(): void {
  const record = createTestFormulaRegistryRecord();

  // Only register if not already registered
  const existing = formulaRegistry.fetch(record.tool_id, record.formula_version);
  if (!existing) {
    formulaRegistry.register(record);
  }
}
