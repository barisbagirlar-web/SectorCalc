import { describe, expect, it, vi } from "vitest";

vi.mock("server-only", () => ({}));

const base = {
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

describe("break-even warning conditions", () => {
  it("does not warn merely because a funded downside burn exists", async () => {
    const { calculate } = await import(
      "@/sectorcalc/formulas/pro-v531/break-even-survival-cash-calculator.formula"
    );
    const result = calculate(base);

    expect(result.outputs.out_monthly_cash_burn).toBeGreaterThan(0);
    expect(result.warnings).toEqual([]);
  });

  it("warns for revenue shortfall, runway breach, funding gap, and low confidence", async () => {
    const { calculate } = await import(
      "@/sectorcalc/formulas/pro-v531/break-even-survival-cash-calculator.formula"
    );
    const result = calculate({
      ...base,
      n_current_monthly_revenue: 100000,
      n_unrestricted_cash_balance: 100000,
      n_source_confidence_ratio: 0.6,
    });

    expect(result.warnings.join(" ")).toContain("below the calculated break-even");
    expect(result.warnings.join(" ")).toContain("does not cover the selected target runway");
    expect(result.warnings.join(" ")).toContain("funding gap remains");
    expect(result.warnings.join(" ")).toContain("below 70%");
  });
});
