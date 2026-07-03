// Test: Schema strictness — validation guards per V5.3 Section 12 PASS 1

import { describe, it, expect } from "vitest";
import { validateSuperV4Schema } from "../schema-adapter";

function validMinimalSchema(): Record<string, unknown> {
  return {
    tool_id: "test-tool",
    tool_key: "test-tool",
    tool_name: "Test Tool",
    category: "general",
    scope: "general",
    primary_operation: "calculation",
    decision_context: "engineering",
    irreversible_commitment_metric: "cost",
    standards: [],
    standards_clause_map: {},
    reference_status: "VERIFIED",
    risk_level: "LOW",
    brand_safety_policy: "STRICT",
    calculation_basis: "analytical",
    unit_system: "SI",
    unit_conversion_contract: {
      unit_system: "SI",
      conversion_registry: {},
    },
    inputs: [],
    normalized_inputs: [],
    physical_bounds_policy: "STRICT",
    validation_contract: {},
    derating_contract: {},
    formulas: [],
    outputs: [],
    output_formatting: {},
    engine_rules: {},
    uncertainty_model: null,
    safety_factor_gauges: [],
    decision_interpretation_contract: {},
    business_impact_contract: {},
    proof_pack: {},
    audit_trail_contract: { hash_algorithm: "SHA-256" },
    export_contract: {},
    ui_contract: {},
    reference_code: {},
    test_plan: {},
    red_team_review: {},
    metadata: {
      title: "Test Tool",
      description: "A minimal valid tool for testing",
      category: "general",
      schema_version: "1.0.0",
      formula_version: "1.0.0",
      sector: "general",
      tool_type: "pro",
    },
  };
}

describe("Schema strictness PASS 1", () => {
  it("accepts valid minimal schema", () => {
    const result = validateSuperV4Schema(validMinimalSchema());
    expect(result.ok).toBe(true);
  });

  it("rejects schema with missing tool_id", () => {
    const s = validMinimalSchema();
    delete s.tool_id;
    const result = validateSuperV4Schema(s);
    expect(result.ok).toBe(false);
  });

  it("rejects schema with unknown top-level key", () => {
    const s = validMinimalSchema();
    s.llm_enabled = true;
    const result = validateSuperV4Schema(s);
    expect(result.ok).toBe(false);
  });

  it("rejects schema with NaN values", () => {
    const s = validMinimalSchema();
    s.inputs = [{
      id: "test_input",
      name: "Test Input",
      unit_si: "m",
      unit_display: "m",
      unit_selectable: false,
      allowed_display_units: ["m"],
      value_type: "number",
      physical_hard_bounds: {
        min: NaN,
        max: 100,
        unit: "m",
        violation_behavior: "BLOCK",
        semantic_error_message: "Invalid",
      },
    }];
    const result = validateSuperV4Schema(s);
    expect(result.ok).toBe(false);
  });

  it("rejects schema with llm_enabled true in engine_rules", () => {
    const s = validMinimalSchema();
    s.engine_rules = { llm_enabled: true };
    const result = validateSuperV4Schema(s);
    expect(result.ok).toBe(false);
  });

  it("rejects schema with formula expression field exposed", () => {
    const s = validMinimalSchema();
    s.formulas = [
      { id: "f1", uses: [], output: "out", expression: "a + b" },
    ];
    const result = validateSuperV4Schema(s);
    expect(result.ok).toBe(false);
  });

  it("rejects unit-selectable input without allowed_display_units", () => {
    const s = validMinimalSchema();
    s.inputs = [{
      id: "test_input",
      name: "Test Input",
      unit_si: "m",
      unit_display: "ft",
      unit_selectable: true,
      allowed_display_units: [],
      value_type: "number",
    }];
    const result = validateSuperV4Schema(s);
    expect(result.ok).toBe(false);
  });
});
