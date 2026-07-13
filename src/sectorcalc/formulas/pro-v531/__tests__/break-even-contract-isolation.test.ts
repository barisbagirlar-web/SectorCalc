import { readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it, vi } from "vitest";

vi.mock("server-only", () => ({}));

interface SchemaInputRecord {
  id: string;
}

interface SchemaNormalizedInputRecord {
  id: string;
}

interface SchemaOutputRecord {
  id: string;
}

interface BreakEvenSchemaRecord {
  tool_id: string;
  tool_key: string;
  metadata: { formula_version: string };
  engine_rules: { strict_formula_schema_contract?: boolean };
  inputs: SchemaInputRecord[];
  normalized_inputs: SchemaNormalizedInputRecord[];
  outputs: SchemaOutputRecord[];
}

const EXPECTED_RAW_INPUT_IDS = [
  "monthly_fixed_cash_cost",
  "monthly_debt_service",
  "contribution_margin_ratio",
  "current_monthly_revenue",
  "unrestricted_cash_balance",
  "minimum_cash_buffer",
  "target_survival_months",
  "downside_revenue_factor",
  "source_confidence_ratio",
  "uncertainty_multiplier",
].sort();

const EXPECTED_NORMALIZED_INPUT_IDS = [
  "n_monthly_fixed_cash_cost",
  "n_monthly_debt_service",
  "n_contribution_margin_ratio",
  "n_current_monthly_revenue",
  "n_unrestricted_cash_balance",
  "n_minimum_cash_buffer",
  "n_target_survival_months",
  "n_downside_revenue_factor",
  "n_source_confidence_ratio",
  "n_uncertainty_multiplier",
].sort();

const EXPECTED_OUTPUT_IDS = [
  "out_break_even_monthly_revenue",
  "out_current_revenue_gap",
  "out_stressed_monthly_revenue",
  "out_monthly_cash_burn",
  "out_cash_runway_months",
  "out_survival_cash_target",
  "out_funding_gap",
  "out_margin_of_safety_ratio",
  "out_source_confidence_ratio",
  "out_uncertainty_cash_buffer",
  "out_target_runway_breached",
  "out_decision_code",
].sort();

const FORBIDDEN_CROSS_TOOL_IDS = [
  "initial_investment",
  "annual_net_cash_flow",
  "discount_rate",
  "analysis_years",
  "residual_value",
  "stress_downside_factor",
  "annual_volume",
  "labor_rate",
  "overhead_rate",
  "defect_or_loss_cost",
  "out_normalized_demand",
  "out_reference_deviation",
  "out_derating_factor",
  "out_demand_metric",
  "out_capacity_metric",
  "out_utilization_margin",
  "out_expanded_uncertainty",
  "out_sensitivity_driver",
  "out_fmea_trigger",
  "out_money_at_risk",
  "out_scenario_delta",
  "out_audit_hash_payload",
  "out_evidence_completeness",
  "out_threshold_crossing",
  "out_final_decision_state",
];

function loadSchema(): BreakEvenSchemaRecord {
  const schemaPath = path.join(
    process.cwd(),
    "src/sectorcalc/schemas/pro-v531/break-even-survival-cash-calculator.schema.json",
  );
  return JSON.parse(readFileSync(schemaPath, "utf8")) as BreakEvenSchemaRecord;
}

describe("Break-Even & Survival Cash cross-tool isolation", () => {
  it("contains only the declared domain inputs and outputs", () => {
    const schema = loadSchema();
    const rawInputIds = schema.inputs.map((item) => item.id).sort();
    const normalizedInputIds = schema.normalized_inputs
      .map((item) => item.id)
      .sort();
    const outputIds = schema.outputs.map((item) => item.id).sort();
    const serialized = JSON.stringify(schema);

    expect(schema.tool_id).toBe("PRO_031");
    expect(schema.tool_key).toBe("break-even-survival-cash-calculator");
    expect(schema.metadata.formula_version).toBe("5.3.1-pro-baris.3");
    expect(schema.engine_rules.strict_formula_schema_contract).toBe(true);
    expect(rawInputIds).toEqual(EXPECTED_RAW_INPUT_IDS);
    expect(normalizedInputIds).toEqual(EXPECTED_NORMALIZED_INPUT_IDS);
    expect(outputIds).toEqual(EXPECTED_OUTPUT_IDS);

    for (const forbiddenId of FORBIDDEN_CROSS_TOOL_IDS) {
      expect(serialized).not.toContain(`"${forbiddenId}"`);
    }
  });

  it("keeps schema, formula, samples, registry, and runtime result in one contract", async () => {
    const schema = loadSchema();
    const formula = await import(
      "../break-even-survival-cash-calculator.formula"
    );
    const { formulaRegistry } = await import(
      "@/sectorcalc/pro-runtime/formula-registry"
    );
    await import("../baris-formula-registry");

    const result = formula.calculate(formula.sampleInputs);
    const registry = formulaRegistry.fetch("PRO_031", formula.formulaVersion);
    const decisionCode = result.outputs.out_decision_code;

    expect(formula.toolKey).toBe(schema.tool_key);
    expect(formula.formulaVersion).toBe(schema.metadata.formula_version);
    expect([...formula.requiredInputKeys].sort()).toEqual(
      EXPECTED_NORMALIZED_INPUT_IDS,
    );
    expect(Object.keys(formula.sampleInputs).sort()).toEqual(
      EXPECTED_NORMALIZED_INPUT_IDS,
    );
    expect([...formula.declaredOutputKeys].sort()).toEqual(
      EXPECTED_OUTPUT_IDS,
    );
    expect([...result.outputKeys].sort()).toEqual(EXPECTED_OUTPUT_IDS);
    expect(Object.keys(result.outputs).sort()).toEqual(EXPECTED_OUTPUT_IDS);
    expect(Object.values(result.outputs).every(Number.isFinite)).toBe(true);
    expect(result.status).toBe(
      decisionCode === 0 ? "OK" : decisionCode === 1 ? "REVIEW" : "BLOCKED",
    );
    expect(registry).not.toBeNull();
    expect(registry?.tool_key).toBe(schema.tool_key);
    expect(registry?.formula_version).toBe(schema.metadata.formula_version);
    expect(registry?.nodes.map((node) => node.output_ref).sort()).toEqual(
      EXPECTED_OUTPUT_IDS,
    );
  });

  it("keeps every strict report entry bound to a declared schema output", async () => {
    const schema = loadSchema();
    const schemaOutputIds = new Set(schema.outputs.map((item) => item.id));
    const { getProReportContractOverride } = await import(
      "@/sectorcalc/pro-report/pro-report-contract-overrides"
    );
    const reportContract = getProReportContractOverride(schema.tool_key);

    expect(reportContract).not.toBeNull();
    expect(reportContract?.strict).toBe(true);
    for (const section of reportContract?.sections ?? []) {
      for (const entry of section.entries) {
        expect(schemaOutputIds.has(entry.sourceOutputId)).toBe(true);
        expect(entry.businessLabel).not.toMatch(
          /absorbed overhead|fmea trigger|annual revenue/i,
        );
      }
    }
  });
});
