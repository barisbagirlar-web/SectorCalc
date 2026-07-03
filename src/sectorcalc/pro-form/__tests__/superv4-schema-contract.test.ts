// SuperV4 Schema Contract Tests

import { describe, it, expect } from "vitest";
import { validateSuperV4Schema } from "../schema-adapter";
import type { SuperV4Schema } from "../contract-types";

function validMinimalSchema(): SuperV4Schema {
  return {
    tool_id: "test-tool",
    tool_key: "test-tool",
    tool_name: "Test Tool",
    category: "General",
    scope: "general",
    primary_operation: "calculate",
    decision_context: {},
    irreversible_commitment_metric: "result",
    standards: [],
    standards_clause_map: [],
    reference_status: "UNVERIFIED",
    risk_level: "MEDIUM",
    brand_safety_policy: {},
    calculation_basis: {},
    unit_system: {},
    unit_conversion_contract: {
      conversion_registry: {
        LENGTH: {
          base_unit: "m",
          unit_family: "LENGTH",
          units: [
            { unit: "m", factor: 1 },
            { unit: "mm", factor: 0.001 },
            { unit: "in", factor: 0.0254 },
          ],
        },
      },
    },
    inputs: [
      {
        id: "length",
        name: "Length",
        symbol: "L",
        type: "number",
        required: true,
        criticality: "HIGH",
        quantity_kind: "LENGTH",
        unit_selectable: true,
        allowed_display_units: ["m", "mm", "in"],
        base_unit: "m",
        normalized_id: "length_norm",
        default: null,
        default_policy: "NO_DEFAULT",
        source_status: "VERIFIED",
        evidence_requirement: "Required for calculation",
        reference_values: [],
        formula_bindings: ["f_result"],
        output_bindings: ["result"],
        help_text: "Enter length",
      },
    ],
    normalized_inputs: [
      { id: "length_norm", from_input: "length", quantity_kind: "LENGTH", base_unit: "m" },
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
      { id: "f_result", uses: ["length_norm"], output: "result", proof_role: "calculation" },
    ],
    outputs: [
      { id: "result", name: "Result", value: null, public_explanation: "Calculation result", decision_use: "Primary" },
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
        { id: "general", title: "General", description: "", mode_visibility: ["quick", "engineering", "cost", "audit"], fields: ["length"] },
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
  };
}

describe("validateSuperV4Schema", () => {
  it("1. valid SuperV4 schema passes validation", () => {
    const result = validateSuperV4Schema(validMinimalSchema());
    expect(result.ok).toBe(true);
  });

  it("2. missing required top-level key rejects", () => {
    const schema: Record<string, unknown> = { ...validMinimalSchema() as unknown as Record<string, unknown> };
    delete schema.tool_id;
    const result = validateSuperV4Schema(schema);
    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.errors).toContain("Missing required top-level key: tool_id");
    }
  });

  it("3. extra top-level key rejects", () => {
    const schema: Record<string, unknown> = { ...validMinimalSchema() as unknown as Record<string, unknown>, extra_key: "value" };
    const result = validateSuperV4Schema(schema);
    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.errors).toContain("Unknown top-level key: extra_key");
    }
  });

  it("4. missing input ID rejects", () => {
    const schema = validMinimalSchema();
    (schema as unknown as Record<string, unknown>).inputs = [{ name: "no-id" }];
    const result = validateSuperV4Schema(schema);
    expect(result.ok).toBe(false);
  });

  it("5. duplicate input ID rejects", () => {
    const schema = validMinimalSchema();
    const inputs = schema.inputs as unknown as Array<Record<string, unknown>>;
    inputs.push({ ...inputs[0] });
    const result = validateSuperV4Schema(schema);
    expect(result.ok).toBe(false);
  });

  it("6. orphan UI field rejects", () => {
    const schema = validMinimalSchema();
    schema.ui_contract.input_groups[0].fields.push("nonexistent_input");
    const result = validateSuperV4Schema(schema);
    expect(result.ok).toBe(false);
  });

  it("7. formula using raw input ID rejects", () => {
    const schema = validMinimalSchema();
    (schema.formulas[0] as unknown as Record<string, unknown>).uses = ["length"];
    const result = validateSuperV4Schema(schema);
    expect(result.ok).toBe(false);
  });

  it("8. formula output not mapped to declared output rejects", () => {
    const schema = validMinimalSchema();
    (schema.formulas[0] as unknown as Record<string, unknown>).output = "undefined_output";
    const result = validateSuperV4Schema(schema);
    expect(result.ok).toBe(false);
  });

  it("9. orphan formula (not bound to any input) rejects", () => {
    const schema = validMinimalSchema();
    (schema.formulas[0] as unknown as Record<string, unknown>).uses = [];
    // Clear bindings by replacing the array
    (schema.inputs[0] as unknown as Record<string, unknown>).formula_bindings = [];
    const result = validateSuperV4Schema(schema);
    expect(result.ok).toBe(false);
  });

  it("10. unit-selectable input without allowed_display_units rejects", () => {
    const schema = validMinimalSchema();
    (schema.inputs[0] as unknown as Record<string, unknown>).allowed_display_units = [];
    const result = validateSuperV4Schema(schema);
    expect(result.ok).toBe(false);
  });

  it("11. public formula expression in schema rejects", () => {
    const schema = validMinimalSchema();
    (schema.formulas[0] as unknown as Record<string, unknown>).public_formula_expression = "L * 2";
    const result = validateSuperV4Schema(schema);
    expect(result.ok).toBe(false);
  });

  it("12. expression field in formula rejects", () => {
    const schema = validMinimalSchema();
    (schema.formulas[0] as unknown as Record<string, unknown>).expression = "L * 2";
    const result = validateSuperV4Schema(schema);
    expect(result.ok).toBe(false);
  });

  it("13. third-party brand text in schema rejects", () => {
    const schema = validMinimalSchema();
    schema.tool_name = "Calculated with SolidWorks engine";
    const result = validateSuperV4Schema(schema);
    expect(result.ok).toBe(false);
  });

  it("14. legal proof claim in schema rejects", () => {
    const schema = validMinimalSchema();
    (schema.outputs[0] as unknown as Record<string, unknown>).public_explanation = "This is a legally binding certified compliance result";
    const result = validateSuperV4Schema(schema);
    expect(result.ok).toBe(false);
  });

  it("15. paid standard table reproduction marker rejects", () => {
    const schema = validMinimalSchema();
    (schema.reference_code as unknown as Record<string, unknown>).note = "See Table 3.1 reproduced from ASME VIII";
    const result = validateSuperV4Schema(schema);
    expect(result.ok).toBe(false);
  });

  it("16. critical input without physical_hard_bounds rejects", () => {
    const schema = validMinimalSchema();
    (schema.inputs[0] as unknown as Record<string, unknown>).criticality = "CRITICAL";
    (schema.inputs[0] as unknown as Record<string, unknown>).physical_hard_bounds = undefined;
    const result = validateSuperV4Schema(schema);
    expect(result.ok).toBe(false);
  });

  it("17. NaN/Infinity in schema rejects", () => {
    const schema = validMinimalSchema();
    (schema.outputs[0] as unknown as Record<string, unknown>).threshold = "NaN";
    const result = validateSuperV4Schema(schema);
    expect(result.ok).toBe(false);
  });

  it("18. non-null object required", () => {
    const result = validateSuperV4Schema(null);
    expect(result.ok).toBe(false);
  });

  it("19. schema version from metadata is accessible", () => {
    const result = validateSuperV4Schema(validMinimalSchema());
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.schema.metadata.schema_version).toBe("1.0.0");
      expect(result.schema.metadata.formula_version).toBe("1.0.0");
    }
  });

  it("20. conversion registry with invalid factor rejects", () => {
    const schema = validMinimalSchema();
    schema.unit_conversion_contract.conversion_registry = {
      LENGTH: {
        base_unit: "m",
        unit_family: "LENGTH",
        units: [
          { unit: "mm", factor: NaN },
        ],
      },
    };
    const result = validateSuperV4Schema(schema);
    expect(result.ok).toBe(false);
  });
});
