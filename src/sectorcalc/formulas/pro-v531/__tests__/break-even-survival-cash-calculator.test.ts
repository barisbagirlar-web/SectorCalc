import { describe, expect, it, vi } from "vitest";

vi.mock("server-only", () => ({}));

const healthyInputs = {
  n_initial_investment: "500000",
  n_annual_net_cash_flow: "250000",
  n_discount_rate: "0.4",
  n_analysis_years: "12",
  n_residual_value: "50000",
  n_stress_downside_factor: "0.8",
  n_labor_rate: "80000",
  n_overhead_rate: "30000",
  n_defect_or_loss_cost: "15000",
  n_source_confidence_ratio: "0.95",
  n_uncertainty_multiplier: "2",
};

function expectClose(actual: number | undefined, expected: number, precision = 10): void {
  expect(actual).toBeTypeOf("number");
  expect(actual).toBeCloseTo(expected, precision);
}

describe("Break-Even & Survival Cash Calculator Exact Decimal formula", () => {
  it("produces the certified monthly cash-survival known-answer vector", async () => {
    const { calculate, declaredOutputKeys } = await import(
      "../break-even-survival-cash-calculator.formula"
    );

    const result = calculate(healthyInputs);

    expect(result.status).toBe("OK");
    expect(result.warnings).toEqual([]);
    expect(result.outputKeys).toEqual([...declaredOutputKeys]);
    expect(Object.keys(result.outputs).sort()).toEqual([...declaredOutputKeys].sort());
    expect(Object.keys(result.decimalOutputs ?? {}).sort()).toEqual([...declaredOutputKeys].sort());

    expectClose(result.outputs.out_contribution_margin_ratio, 0.6, 14);
    expectClose(result.outputs.out_monthly_variable_cash_cost, 100000);
    expectClose(result.outputs.out_monthly_contribution, 150000);
    expectClose(result.outputs.out_monthly_fixed_cash_cost, 125000);
    expectClose(result.outputs.out_monthly_net_cash_flow, 25000);
    expectClose(result.outputs.out_break_even_monthly_revenue, 208333.33333333334, 8);
    expectClose(result.outputs.out_monthly_revenue_gap_to_break_even, 41666.666666666664, 8);
    expectClose(result.outputs.out_stressed_monthly_revenue, 200000);
    expectClose(result.outputs.out_stressed_monthly_net_cash_flow, -5000);
    expectClose(result.outputs.out_base_ending_cash, 800000);
    expectClose(result.outputs.out_stressed_ending_cash, 440000);
    expectClose(result.outputs.out_minimum_cash_reserve, 50000);
    expectClose(result.outputs.out_cash_available_above_reserve, 450000);
    expectClose(result.outputs.out_stressed_monthly_burn, 5000);
    expectClose(result.outputs.out_stressed_runway_within_horizon_months, 12);
    expectClose(result.outputs.out_required_opening_cash_for_stress_horizon, 110000);
    expectClose(result.outputs.out_additional_funding_required, 0);
    expectClose(result.outputs.out_source_confidence_ratio, 0.95, 14);
    expectClose(result.outputs.out_cash_uncertainty, 246000);
    expectClose(result.outputs.out_stressed_cash_lower_bound, 194000);
    expectClose(result.outputs.out_stressed_cash_upper_bound, 686000);
    expectClose(result.outputs.out_money_at_risk, 0);
    expect(result.outputs.out_primary_cash_cost_driver).toBe(3);
    expect(result.outputs.out_decision_state).toBe(0);

    for (const [id, exactValue] of Object.entries(result.decimalOutputs ?? {})) {
      expect(Number(exactValue)).toBe(result.outputs[id]);
    }
  });

  it("returns REVIEW when the evidence-adjusted lower bound breaches reserve", async () => {
    const { calculate } = await import(
      "../break-even-survival-cash-calculator.formula"
    );

    const result = calculate({
      ...healthyInputs,
      n_initial_investment: "120000",
      n_annual_net_cash_flow: "180000",
      n_discount_rate: "0.55",
      n_analysis_years: "12",
      n_residual_value: "50000",
      n_stress_downside_factor: "0.6",
      n_source_confidence_ratio: "0.8",
      n_uncertainty_multiplier: "1.25",
    });

    expect(result.status).toBe("REVIEW");
    expect(result.outputs.out_decision_state).toBeGreaterThanOrEqual(1);
    expect(result.outputs.out_money_at_risk).toBeGreaterThan(0);
    expect(result.warnings).not.toEqual([]);
  });

  it("fails closed for an undefined contribution-margin singularity", async () => {
    const { calculate } = await import(
      "../break-even-survival-cash-calculator.formula"
    );

    const result = calculate({
      ...healthyInputs,
      n_discount_rate: "1",
    });

    expect(result.status).toBe("BLOCKED");
    expect(result.outputs).toEqual({});
    expect(result.decimalOutputs).toEqual({});
    expect(result.warnings.join(" ")).toContain("less than 1");
  });

  it("blocks missing, non-finite, and cross-tool normalized inputs", async () => {
    const { calculate } = await import(
      "../break-even-survival-cash-calculator.formula"
    );

    const missing = { ...healthyInputs } as Record<string, string>;
    delete missing.n_labor_rate;
    expect(calculate(missing).status).toBe("BLOCKED");

    expect(calculate({ ...healthyInputs, n_labor_rate: Number.NaN }).status).toBe("BLOCKED");

    const contaminated = calculate({
      ...healthyInputs,
      n_monthly_fixed_cash_cost: "120000",
    });
    expect(contaminated.status).toBe("BLOCKED");
    expect(contaminated.warnings.join(" ")).toContain("Unexpected normalized inputs");
  });

  it("preserves scale homogeneity and never emits non-finite output", async () => {
    const { calculate } = await import(
      "../break-even-survival-cash-calculator.formula"
    );

    const factor = 7;
    const scaled = calculate({
      ...healthyInputs,
      n_initial_investment: String(500000 * factor),
      n_annual_net_cash_flow: String(250000 * factor),
      n_residual_value: String(50000 * factor),
      n_labor_rate: String(80000 * factor),
      n_overhead_rate: String(30000 * factor),
      n_defect_or_loss_cost: String(15000 * factor),
    });

    expect(scaled.status).toBe("OK");
    expectClose(scaled.outputs.out_break_even_monthly_revenue, 208333.33333333334 * factor, 7);
    expectClose(scaled.outputs.out_stressed_cash_lower_bound, 194000 * factor, 7);
    expect(scaled.outputs.out_decision_state).toBe(0);
    expect(Object.values(scaled.outputs).every(Number.isFinite)).toBe(true);
  });
});
