import { describe, expect, it, vi } from "vitest";

vi.mock("server-only", () => ({}));

describe("break-even output rounding", () => {
  it("rounds currency to cents and ratios to four decimals", async () => {
    const { calculate } = await import(
      "@/sectorcalc/formulas/pro-v531/break-even-survival-cash-calculator.formula"
    );
    const result = calculate({
      n_monthly_fixed_cash_cost: 10000.123,
      n_monthly_debt_service: 1000.456,
      n_contribution_margin_ratio: 0.333333,
      n_current_monthly_revenue: 50000.789,
      n_unrestricted_cash_balance: 100000.321,
      n_minimum_cash_buffer: 10000.654,
      n_target_survival_months: 6.5,
      n_downside_revenue_factor: 0.777777,
      n_source_confidence_ratio: 0.91234,
      n_uncertainty_multiplier: 1.12345,
    });

    expect(
      Number(result.outputs.out_break_even_monthly_revenue.toFixed(2)),
    ).toBe(result.outputs.out_break_even_monthly_revenue);
    expect(
      Number(result.outputs.out_margin_of_safety_ratio.toFixed(4)),
    ).toBe(result.outputs.out_margin_of_safety_ratio);
  });
});
