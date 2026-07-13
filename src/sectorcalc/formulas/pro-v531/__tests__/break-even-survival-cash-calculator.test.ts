import { describe, expect, it, vi } from "vitest";

vi.mock("server-only", () => ({}));

const healthyInputs = {
  n_monthly_fixed_cash_cost: 120000,
  n_monthly_debt_service: 25000,
  n_contribution_margin_ratio: 0.42,
  n_current_monthly_revenue: 420000,
  n_unrestricted_cash_balance: 750000,
  n_minimum_cash_buffer: 100000,
  n_target_survival_months: 6,
  n_downside_revenue_factor: 0.7,
  n_source_confidence_ratio: 0.9,
  n_uncertainty_multiplier: 1.15,
};

describe("Break-Even & Survival Cash Calculator formula", () => {
  it("produces the governed known-answer vector", async () => {
    const { calculate, declaredOutputKeys } = await import(
      "../break-even-survival-cash-calculator.formula"
    );

    const result = calculate(healthyInputs);

    expect(result.status).toBe("OK");
    expect(result.warnings).toEqual([]);
    expect(result.outputKeys).toEqual([...declaredOutputKeys]);
    expect(Object.keys(result.outputs)).toEqual([...declaredOutputKeys]);
    expect(result.outputs.out_break_even_monthly_revenue).toBeCloseTo(345238.1, 1);
    expect(result.outputs.out_current_revenue_gap).toBeCloseTo(74761.9, 1);
    expect(result.outputs.out_stressed_monthly_revenue).toBe(294000);
    expect(result.outputs.out_monthly_cash_burn).toBe(21520);
    expect(result.outputs.out_cash_runway_months).toBeCloseTo(30.2, 1);
    expect(result.outputs.out_uncertainty_cash_buffer).toBe(19368);
    expect(result.outputs.out_survival_cash_target).toBe(248488);
    expect(result.outputs.out_funding_gap).toBe(0);
    expect(result.outputs.out_margin_of_safety_ratio).toBeCloseTo(0.178, 4);
    expect(result.outputs.out_source_confidence_ratio).toBe(0.9);
    expect(result.outputs.out_target_runway_breached).toBe(0);
    expect(result.outputs.out_decision_code).toBe(0);
  });

  it("returns REVIEW when the selected runway cannot be funded", async () => {
    const { calculate } = await import(
      "../break-even-survival-cash-calculator.formula"
    );

    const result = calculate({
      ...healthyInputs,
      n_contribution_margin_ratio: 0.35,
      n_current_monthly_revenue: 250000,
      n_unrestricted_cash_balance: 120000,
      n_minimum_cash_buffer: 50000,
      n_target_survival_months: 12,
      n_downside_revenue_factor: 0.6,
      n_source_confidence_ratio: 0.8,
      n_uncertainty_multiplier: 1.25,
    });

    expect(result.status).toBe("REVIEW");
    expect(result.outputs.out_funding_gap).toBeGreaterThan(0);
    expect(result.outputs.out_target_runway_breached).toBe(1);
    expect(result.outputs.out_decision_code).toBe(1);
    expect(result.warnings.length).toBeGreaterThanOrEqual(3);
  });

  it("blocks a materially unreliable source-confidence decision", async () => {
    const { calculate } = await import(
      "../break-even-survival-cash-calculator.formula"
    );

    const result = calculate({
      ...healthyInputs,
      n_source_confidence_ratio: 0.49,
    });

    expect(result.status).toBe("BLOCKED");
    expect(result.outputs.out_decision_code).toBe(2);
    expect(result.warnings).toContain(
      "Source confidence is below 70%; verify accounting records before commitment.",
    );
  });

  it("blocks invalid contribution margin without non-finite outputs", async () => {
    const { calculate } = await import(
      "../break-even-survival-cash-calculator.formula"
    );

    const result = calculate({
      ...healthyInputs,
      n_contribution_margin_ratio: 0,
    });

    expect(result.status).toBe("BLOCKED");
    expect(result.outputs.out_decision_code).toBe(2);
    expect(Object.values(result.outputs).every(Number.isFinite)).toBe(true);
  });

  it("blocks unexpected normalized inputs to prevent cross-tool contamination", async () => {
    const { calculate } = await import(
      "../break-even-survival-cash-calculator.formula"
    );

    const result = calculate({
      ...healthyInputs,
      n_initial_investment: 500000,
    });

    expect(result.status).toBe("BLOCKED");
    expect(result.warnings.join(" ")).toContain("Unexpected normalized inputs");
  });

  it("handles zero obligations and zero revenue without a false negative margin", async () => {
    const { calculate } = await import(
      "../break-even-survival-cash-calculator.formula"
    );

    const result = calculate({
      ...healthyInputs,
      n_monthly_fixed_cash_cost: 0,
      n_monthly_debt_service: 0,
      n_current_monthly_revenue: 0,
      n_unrestricted_cash_balance: 100000,
      n_minimum_cash_buffer: 100000,
    });

    expect(result.status).toBe("OK");
    expect(result.outputs.out_break_even_monthly_revenue).toBe(0);
    expect(result.outputs.out_monthly_cash_burn).toBe(0);
    expect(result.outputs.out_cash_runway_months).toBe(120);
    expect(result.outputs.out_margin_of_safety_ratio).toBe(0);
  });
});
