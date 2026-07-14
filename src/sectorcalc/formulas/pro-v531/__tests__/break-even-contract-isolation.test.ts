import { describe, expect, it, vi } from "vitest";

vi.mock("server-only", () => ({}));

const EXPECTED_RAW_INPUT_IDS = [
  "initial_investment",
  "annual_net_cash_flow",
  "discount_rate",
  "analysis_years",
  "residual_value",
  "stress_downside_factor",
  "labor_rate",
  "overhead_rate",
  "defect_or_loss_cost",
  "source_confidence_ratio",
  "uncertainty_multiplier",
].sort();

const EXPECTED_NORMALIZED_INPUT_IDS = EXPECTED_RAW_INPUT_IDS
  .map((id) => `n_${id}`)
  .sort();

const EXPECTED_OUTPUT_IDS = [
  "out_contribution_margin_ratio",
  "out_monthly_variable_cash_cost",
  "out_monthly_contribution",
  "out_monthly_fixed_cash_cost",
  "out_monthly_net_cash_flow",
  "out_break_even_monthly_revenue",
  "out_monthly_revenue_gap_to_break_even",
  "out_stressed_monthly_revenue",
  "out_stressed_monthly_net_cash_flow",
  "out_base_ending_cash",
  "out_stressed_ending_cash",
  "out_minimum_cash_reserve",
  "out_cash_available_above_reserve",
  "out_stressed_monthly_burn",
  "out_stressed_runway_within_horizon_months",
  "out_required_opening_cash_for_stress_horizon",
  "out_additional_funding_required",
  "out_source_confidence_ratio",
  "out_cash_uncertainty",
  "out_stressed_cash_lower_bound",
  "out_stressed_cash_upper_bound",
  "out_money_at_risk",
  "out_primary_cash_cost_driver",
  "out_decision_state",
].sort();

const FORBIDDEN_GENERIC_OUTPUT_IDS = [
  "out_normalized_demand",
  "out_reference_deviation",
  "out_derating_factor",
  "out_demand_metric",
  "out_capacity_metric",
  "out_utilization_margin",
  "out_expanded_uncertainty",
  "out_sensitivity_driver",
  "out_fmea_trigger",
  "out_scenario_delta",
  "out_audit_hash_payload",
  "out_evidence_completeness",
  "out_threshold_crossing",
  "out_final_decision_state",
];

describe("Break-Even & Survival Cash Exact Decimal contract isolation", () => {
  it("resolves only the declared monthly cash-survival inputs and outputs", async () => {
    const { resolveApprovedToolSchema, clearSchemaCache } = await import(
      "@/sectorcalc/runtime/resolve-approved-tool-schema"
    );
    clearSchemaCache();
    const resolved = resolveApprovedToolSchema(
      "break-even-survival-cash-calculator",
    );
    expect(resolved.ok).toBe(true);
    if (!resolved.ok) throw new Error(resolved.errors.join(" | "));

    const schema = resolved.schema;
    expect(schema.tool_id).toBe("PRO_031");
    expect(schema.tool_key).toBe("break-even-survival-cash-calculator");
    expect(schema.metadata.formula_version).toBe("2.0.0");
    expect(schema.metadata.schema_version).toBe("5.3.1-pro-cash-survival.1");
    expect(schema.calculation_basis.model_id).toBe(
      "PRO_MONTHLY_CASH_SURVIVAL_BREAK_EVEN_V2",
    );
    expect(schema.calculation_basis.investment_appraisal_excluded).toContain(
      "NPV_AND_IRR",
    );

    expect(schema.inputs.map((input) => input.id).sort()).toEqual(
      EXPECTED_RAW_INPUT_IDS,
    );
    expect(
      schema.normalized_inputs.map((input) => input.id).sort(),
    ).toEqual(EXPECTED_NORMALIZED_INPUT_IDS);
    expect(schema.outputs.map((output) => output.id).sort()).toEqual(
      EXPECTED_OUTPUT_IDS,
    );

    for (const forbidden of FORBIDDEN_GENERIC_OUTPUT_IDS) {
      expect(schema.outputs.some((output) => output.id === forbidden)).toBe(false);
    }

    expect(schema.inputs.find((input) => input.id === "analysis_years")).toMatchObject({
      name: "Forecast Horizon Months",
      type: "integer",
      base_unit: "month",
      default_policy: "NO_DEFAULT",
      default_value: null,
    });
    expect(schema.inputs.find((input) => input.id === "labor_rate")).toMatchObject({
      name: "Monthly Payroll Cash Cost",
      base_unit: "currency_unit/month",
      default_policy: "NO_DEFAULT",
      default_value: null,
    });
  });

  it("keeps formula inputs, samples, exact output namespace, and certification in one contract", async () => {
    const formula = await import(
      "../break-even-survival-cash-calculator.formula"
    );
    const { resolveApprovedToolSchema, clearSchemaCache } = await import(
      "@/sectorcalc/runtime/resolve-approved-tool-schema"
    );
    const { verifyFormulaModuleCertification } = await import(
      "../pro-formula-verification-manifest"
    );

    clearSchemaCache();
    const resolved = resolveApprovedToolSchema(formula.toolKey);
    expect(resolved.ok).toBe(true);
    if (!resolved.ok) throw new Error(resolved.errors.join(" | "));

    const result = formula.calculate(formula.sampleInputs);
    expect(formula.formulaVersion).toBe(resolved.schema.metadata.formula_version);
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
    expect(Object.keys(result.decimalOutputs ?? {}).sort()).toEqual(
      EXPECTED_OUTPUT_IDS,
    );
    expect(Object.values(result.outputs).every(Number.isFinite)).toBe(true);

    expect(
      verifyFormulaModuleCertification(
        formula,
        resolved.schema.metadata.formula_version,
        resolved.schema.metadata.schema_version,
      ).ok,
    ).toBe(true);
  });

  it("keeps every strict report entry bound to a declared Exact Decimal output", async () => {
    const { resolveApprovedToolSchema, clearSchemaCache } = await import(
      "@/sectorcalc/runtime/resolve-approved-tool-schema"
    );
    const { getProReportContractOverride } = await import(
      "@/sectorcalc/pro-report/pro-report-contract-overrides"
    );

    clearSchemaCache();
    const resolved = resolveApprovedToolSchema(
      "break-even-survival-cash-calculator",
    );
    expect(resolved.ok).toBe(true);
    if (!resolved.ok) throw new Error(resolved.errors.join(" | "));

    const outputIds = new Set(resolved.schema.outputs.map((output) => output.id));
    const contract = getProReportContractOverride(resolved.schema.tool_key);
    expect(contract).not.toBeNull();
    expect(contract?.strict).toBe(true);

    const entries = contract?.sections.flatMap((section) => section.entries) ?? [];
    expect(entries.length).toBeGreaterThanOrEqual(12);
    for (const entry of entries) {
      expect(outputIds.has(entry.sourceOutputId)).toBe(true);
      expect(entry.businessLabel).not.toMatch(
        /absorbed overhead|fmea trigger|annual net cash flow|initial investment/i,
      );
    }
  });
});
