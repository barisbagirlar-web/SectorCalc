import { describe, expect, it, vi } from "vitest";

vi.mock("server-only", () => ({}));

describe("break-even input immutability", () => {
  it("does not mutate the provided normalized input object", async () => {
    const { calculate } = await import(
      "@/sectorcalc/formulas/pro-v531/break-even-survival-cash-calculator.formula"
    );
    const inputs = {
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
    const before = structuredClone(inputs);

    calculate(inputs);

    expect(inputs).toEqual(before);
  });
});
