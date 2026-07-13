import { readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import type { SuperV4Schema } from "../contract-types";
import {
  createInitialUniversalFormState,
  universalFormMachineReducer,
} from "../form-state-machine";

function buildRatioSchema(): SuperV4Schema {
  return {
    tool_id: "TEST_RATIO_INIT",
    tool_key: "ratio-initialization-test",
    tool_name: "Ratio Initialization Test",
    category: "Quality",
    scope: "Verify canonical examples are converted to the selected display unit.",
    primary_operation: "ratio_initialization_test",
    decision_context: {},
    irreversible_commitment_metric: "none",
    standards: [],
    standards_clause_map: [],
    reference_status: "CONTEXT_ONLY",
    risk_level: "LOW",
    brand_safety_policy: {},
    calculation_basis: {},
    unit_system: {},
    unit_conversion_contract: {
      conversion_registry: {
        dimensionless: {
          base_unit: "ratio",
          unit_family: "DIMENSIONLESS",
          units: [
            { unit: "ratio", factor: 1 },
            { unit: "percent", factor: 0.01 },
          ],
        },
      },
    },
    inputs: [
      {
        id: "discount_rate",
        name: "Discount Rate",
        quantity_kind: "dimensionless",
        unit_selectable: true,
        base_unit: "ratio",
        allowed_display_units: ["percent", "ratio"],
        normalized_id: "n_discount_rate",
        type: "number",
        required: true,
        criticality: "CRITICAL",
        physical_hard_bounds: {
          min: 0,
          max: 1,
          unit: "ratio",
          violation_behavior: "BLOCK",
        },
        engineering_reference_range: {
          min: 0.02,
          max: 0.35,
          unit: "ratio",
          source: "test",
        },
        default_policy: "NO_DEFAULT",
        default_value: null,
        example_value: 0.185,
        evidence_requirement: {
          required: false,
          accepted_evidence: ["user-provided value"],
        },
        user_help_text: "Test ratio initialization.",
      },
    ],
    normalized_inputs: [
      {
        id: "n_discount_rate",
        from_input: "discount_rate",
        quantity_kind: "dimensionless",
        base_unit: "ratio",
      },
    ],
    reference_value_policy: {},
    form_runtime_binding: {
      renderer: "UniversalIndustrialDecisionForm",
      llm_runtime_usage: "FORBIDDEN",
      client_formula_execution: "FORBIDDEN",
      server_execution_required: true,
      state_management_required: true,
      execute_response_contract: { redaction_status: "PUBLIC_SAFE_REDACTED" },
    },
    physical_bounds_policy: {},
    validation_contract: {},
    derating_contract: { rules: [] },
    precision_policy: {},
    formulas: [],
    outputs: [],
    output_formatting: {},
    decision_interpretation_contract: {},
    business_impact_contract: {},
    engine_rules: {},
    uncertainty_model: {},
    safety_factor_gauges: [],
    proof_pack: {},
    audit_trail_contract: {},
    export_contract: {},
    ui_contract: {
      target_renderer: "UniversalIndustrialDecisionForm",
      profile_modes: ["quick", "engineering", "cost", "audit"],
      input_groups: [
        {
          id: "inputs",
          title: "Inputs",
          advanced: false,
          fields: ["discount_rate"],
        },
      ],
      accessibility: {},
    },
    reference_code: {},
    test_plan: {},
    red_team_review: {},
    metadata: { schema_version: "5.3.1", formula_version: "test" },
  } as unknown as SuperV4Schema;
}

function loadBreakEvenSchema(): SuperV4Schema {
  const schemaPath = path.join(
    process.cwd(),
    "src/sectorcalc/schemas/pro-v531/break-even-survival-cash-calculator.schema.json",
  );
  return JSON.parse(readFileSync(schemaPath, "utf8")) as SuperV4Schema;
}

describe("form input initialization unit safety", () => {
  it("converts a canonical ratio example to percent for the first display unit", () => {
    const initialized = universalFormMachineReducer(
      createInitialUniversalFormState("engineering"),
      { type: "INIT_SCHEMA", schema: buildRatioSchema() },
    );

    expect(initialized.selectedUnitState.discount_rate).toBe("percent");
    expect(initialized.rawInputState.discount_rate).toBeCloseTo(18.5, 10);
  });

  it("uses the same unit-safe path after reset", () => {
    const initialized = universalFormMachineReducer(
      createInitialUniversalFormState("engineering"),
      { type: "INIT_SCHEMA", schema: buildRatioSchema() },
    );
    const validated = universalFormMachineReducer(initialized, {
      type: "VALIDATE_SCHEMA_CONTRACT",
      errors: [],
    });
    const reset = universalFormMachineReducer(validated, {
      type: "RESET_INPUTS",
    });

    expect(reset.selectedUnitState.discount_rate).toBe("percent");
    expect(reset.rawInputState.discount_rate).toBeCloseTo(18.5, 10);
    expect(reset.evidenceState.discount_rate).toBeDefined();
  });

  it("initializes actual break-even ratios as 42%, 70%, and 90%", () => {
    const initialized = universalFormMachineReducer(
      createInitialUniversalFormState("engineering"),
      { type: "INIT_SCHEMA", schema: loadBreakEvenSchema() },
    );

    expect(initialized.selectedUnitState.contribution_margin_ratio).toBe(
      "percent",
    );
    expect(initialized.rawInputState.contribution_margin_ratio).toBeCloseTo(
      42,
      10,
    );
    expect(initialized.rawInputState.downside_revenue_factor).toBeCloseTo(
      70,
      10,
    );
    expect(initialized.rawInputState.source_confidence_ratio).toBeCloseTo(
      90,
      10,
    );
  });
});
