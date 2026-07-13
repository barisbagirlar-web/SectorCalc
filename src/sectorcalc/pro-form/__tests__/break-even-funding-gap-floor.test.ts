import { describe, expect, it, vi } from "vitest";

vi.mock("server-only", () => ({}));

describe("break-even funding gap floor", () => {
  it("never reports a negative funding requirement", async () => {
    const { calculate } = await import(
      "@/sectorcalc/formulas/pro-v531/break-even-survival-cash-calculator.formula"
    );
    const result = calculate({
      n_monthly_fixed_cash_cost: 10000,
      n_monthly_debt_service: 0,
      n_contribution_margin_ratio: 0.5,
      n_current_monthly_revenue: 100000,
      n_unrestricted_cash_balance: 10000000,
      n_minimum_cash_buffer: 10000,
      n_target_survival_months: 6,
      n_downside_revenue_factor: 1,
      n_source_confidence_ratio: 1,
      n_uncertainty_multiplier: 1,
    });

    expect(result.outputs.out_funding_gap).toBe(0);
  });
});
