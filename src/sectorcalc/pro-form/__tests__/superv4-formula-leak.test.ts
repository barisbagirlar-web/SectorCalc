// SuperV4 Formula Leak and Brand Safety Tests

import { describe, it, expect } from "vitest";
import { validateSuperV4Schema } from "../schema-adapter";
import type { SuperV4Schema } from "../contract-types";

function makeSchema(overrides?: Partial<SuperV4Schema>): SuperV4Schema {
  return {
    tool_id: "leak-test",
    tool_key: "leak-test",
    tool_name: "Leak Test",
    category: "Safety",
    scope: "test",
    primary_operation: "detect",
    decision_context: {},
    irreversible_commitment_metric: "result",
    standards: [],
    standards_clause_map: [],
    reference_status: "VERIFIED",
    risk_level: "HIGH",
    brand_safety_policy: {},
    calculation_basis: {},
    unit_system: {},
    unit_conversion_contract: { conversion_registry: {} },
    inputs: [
      {
        id: "input_a",
        name: "Input A",
        symbol: "A",
        type: "number",
        required: true,
        criticality: "HIGH",
        quantity_kind: "DIMENSIONLESS",
        unit_selectable: false,
        allowed_display_units: [],
        base_unit: null,
        normalized_id: "input_a_norm",
        default: null,
        default_policy: "NO_DEFAULT",
        source_status: "VERIFIED",
        evidence_requirement: "Required",
        reference_values: [],
        formula_bindings: ["f_result"],
        output_bindings: ["result"],
        help_text: "",
      },
    ],
    normalized_inputs: [
      { id: "input_a_norm", from_input: "input_a", quantity_kind: "DIMENSIONLESS", base_unit: "" },
    ],
    reference_value_policy: {},
    form_runtime_binding: {
      renderer: "UniversalIndustrialDecisionForm",
      schema_generation_runtime: "offline",
      llm_runtime_usage: "FORBIDDEN",
      client_formula_execution: "FORBIDDEN",
      server_execution_required: true,
      state_management_required: true,
      dynamic_ui_contract_required: true,
      json_schema_form_substrate_allowed: false,
      generic_json_schema_form_alone_sufficient: false,
      state_domains: [],
      state_transitions: [],
      execute_request_contract: {},
      execute_response_contract: {},
    },
    precision_policy: {},
    physical_bounds_policy: {},
    validation_contract: {},
    derating_contract: {},
    formulas: [
      { id: "f_result", uses: ["input_a_norm"], output: "result", proof_role: "calculation" },
    ],
    outputs: [
      { id: "result", name: "Result", value: null, public_explanation: "Output", decision_use: "Primary" },
    ],
    output_formatting: {},
    engine_rules: {},
    uncertainty_model: {},
    safety_factor_gauges: [],
    decision_interpretation_contract: {},
    business_impact_contract: {},
    proof_pack: {},
    audit_trail_contract: { hash_algorithm: "SHA-256" },
    export_contract: {},
    ui_contract: {
      target_renderer: "UniversalIndustrialDecisionForm",
      profile_modes: ["quick", "engineering", "cost", "audit"],
      input_groups: [
        { id: "general", title: "General", description: "", mode_visibility: ["quick", "engineering", "cost", "audit"], fields: ["input_a"] },
      ],
      sticky_decision_cockpit: true,
      mobile_bottom_action_bar: true,
      normalized_preview_required: true,
      reference_values_visible: true,
      evidence_controls_required: true,
      semantic_error_summary_required: true,
      safety_factor_gauges_required: true,
      hidden_risk_panel_required: true,
      business_impact_panel_required: true,
      standards_clause_panel_required: true,
      protected_methodology_panel_required: true,
      audit_seal_panel_required: true,
      accessibility: {},
    },
    reference_code: {},
    test_plan: {},
    red_team_review: {},
    metadata: { schema_version: "1.0.0", formula_version: "1.0.0" },
    ...overrides,
  };
}

describe("Formula Leak Prevention", () => {
  it("1. public_formula_expression field is blocked", () => {
    const schema: Record<string, unknown> = {
      ...makeSchema() as unknown as Record<string, unknown>,
    };
    (schema.formulas as Array<Record<string, unknown>>)[0].public_formula_expression = "A * 2.5 + offset";
    const result = validateSuperV4Schema(schema);
    expect(result.ok).toBe(false);
  });

  it("2. expression field is blocked", () => {
    const schema: Record<string, unknown> = {
      ...makeSchema() as unknown as Record<string, unknown>,
    };
    (schema.formulas as Array<Record<string, unknown>>)[0].expression = "A * 2.5 + offset";
    const result = validateSuperV4Schema(schema);
    expect(result.ok).toBe(false);
  });

  it("3. formula using raw input ID leaks input structure", () => {
    const schema: Record<string, unknown> = {
      ...makeSchema() as unknown as Record<string, unknown>,
    };
    (schema.formulas as Array<Record<string, unknown>>)[0].uses = ["input_a"];
    const result = validateSuperV4Schema(schema);
    expect(result.ok).toBe(false);
  });

  it("4. normalized input IDs are safe to expose", () => {
    const schema = makeSchema();
    const result = validateSuperV4Schema(schema);
    expect(result.ok).toBe(true);
  });

  it("5. formula output without declared output is blocked", () => {
    const schema: Record<string, unknown> = {
      ...makeSchema() as unknown as Record<string, unknown>,
    };
    (schema.formulas as Array<Record<string, unknown>>)[0].output = "hidden_output";
    const result = validateSuperV4Schema(schema);
    expect(result.ok).toBe(false);
  });
});

describe("Brand Safety", () => {
  it("1. third-party brand in tool_name is blocked", () => {
    const schema = makeSchema({ tool_name: "ANSYS Fluent Simulation" });
    const result = validateSuperV4Schema(schema);
    expect(result.ok).toBe(false);
  });

  it("2. third-party brand in description is blocked", () => {
    const schema: Record<string, unknown> = {
      ...makeSchema() as unknown as Record<string, unknown>,
    };
    (schema.decision_context as Record<string, unknown>).note = "Compatible with SolidWorks models";
    const result = validateSuperV4Schema(schema);
    expect(result.ok).toBe(false);
  });

  it("3. legal proof claim in output is blocked", () => {
    const schema = makeSchema();
    (schema.outputs[0] as unknown as Record<string, unknown>).public_explanation = "This output is certified compliant and legally binding";
    const result = validateSuperV4Schema(schema);
    expect(result.ok).toBe(false);
  });

  it("4. paid standard table marker is blocked", () => {
    const schema = makeSchema();
    (schema.reference_code as Record<string, unknown>).source = "Values reproduced from ASTM E23 Table 1";
    const result = validateSuperV4Schema(schema);
    expect(result.ok).toBe(false);
  });

  it("5. regulatory approval claim is blocked", () => {
    const schema = makeSchema();
    schema.tool_name = "Regulatory approved calculation engine";
    const result = validateSuperV4Schema(schema);
    expect(result.ok).toBe(false);
  });
});
