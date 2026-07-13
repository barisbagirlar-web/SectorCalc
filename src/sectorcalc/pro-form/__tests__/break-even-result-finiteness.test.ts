import { describe, expect, it, vi } from "vitest";

vi.mock("server-only", () => ({}));

const vectors = [
  {
    n_monthly_fixed_cash_cost: 0,
    n_monthly_debt_service: 0,
    n_contribution_margin_ratio: 0.0001,
    n_current_monthly_revenue: 0,
    n_unrestricted_cash_balance: 0,
    n_minimum_cash_buffer: 0,
    n_target_survival_months: 0.1,
    n_downside_revenue_factor: 0,
    n_source_confidence_ratio: 0,
    n_uncertainty_multiplier: 1,
  },
  {
    n_monthly_fixed_cash_cost: 1000000000,
    n_monthly_debt_service: 1000000000,
    n_contribution_margin_ratio: 1,
    n_current_monthly_revenue: 10000000000,
    n_unrestricted_cash_balance: 10000000000,
    n_minimum_cash_buffer: 10000000000,
    n_target_survival_months: 120,
    n_downside_revenue_factor: 1,
    n_source_confidence_ratio: 1,
    n_uncertainty_multiplier: 3,
  },
];

describe("break-even output finiteness", () => {
  it.each(vectors)("produces only finite output values", async (inputs) => {
    const { calculate } = await import(
      "@/sectorcalc/formulas/pro-v531/break-even-survival-cash-calculator.formula"
    );
    const result = calculate(inputs);

    expect(Object.values(result.outputs).every(Number.isFinite)).toBe(true);
  });
});
