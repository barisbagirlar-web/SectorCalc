import { describe, expect, it, vi } from "vitest";

vi.mock("server-only", () => ({}));

const base = {
  n_monthly_fixed_cash_cost: 10000,
  n_monthly_debt_service: 1000,
  n_contribution_margin_ratio: 0.5,
  n_current_monthly_revenue: 50000,
  n_unrestricted_cash_balance: 100000,
  n_minimum_cash_buffer: 10000,
  n_target_survival_months: 6,
  n_downside_revenue_factor: 0.8,
  n_source_confidence_ratio: 0.9,
};

describe("break-even uncertainty multiplier boundaries", () => {
  it("accepts 1 through 3 and blocks outside the governed range", async () => {
    const { calculate } = await import(
      "@/sectorcalc/formulas/pro-v531/break-even-survival-cash-calculator.formula"
    );

    expect(calculate({ ...base, n_uncertainty_multiplier: 1 }).status).not.toBe(
      "BLOCKED",
    );
    expect(calculate({ ...base, n_uncertainty_multiplier: 3 }).status).not.toBe(
      "BLOCKED",
    );
    expect(calculate({ ...base, n_uncertainty_multiplier: 0.99 }).status).toBe(
      "BLOCKED",
    );
    expect(calculate({ ...base, n_uncertainty_multiplier: 3.01 }).status).toBe(
      "BLOCKED",
    );
  });
});
