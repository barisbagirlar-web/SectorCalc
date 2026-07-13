import { describe, expect, it, vi } from "vitest";

vi.mock("server-only", () => ({}));

const base = {
  n_monthly_fixed_cash_cost: 10000,
  n_monthly_debt_service: 1000,
  n_contribution_margin_ratio: 0.5,
  n_current_monthly_revenue: 50000,
  n_unrestricted_cash_balance: 100000,
  n_minimum_cash_buffer: 10000,
  n_downside_revenue_factor: 0.8,
  n_source_confidence_ratio: 0.9,
  n_uncertainty_multiplier: 1.1,
};

describe("break-even target runway boundaries", () => {
  it("accepts positive months through 120 and blocks invalid horizons", async () => {
    const { calculate } = await import(
      "@/sectorcalc/formulas/pro-v531/break-even-survival-cash-calculator.formula"
    );

    expect(calculate({ ...base, n_target_survival_months: 0.1 }).status).not.toBe(
      "BLOCKED",
    );
    expect(calculate({ ...base, n_target_survival_months: 120 }).status).not.toBe(
      "BLOCKED",
    );
    expect(calculate({ ...base, n_target_survival_months: 0 }).status).toBe(
      "BLOCKED",
    );
    expect(calculate({ ...base, n_target_survival_months: 120.1 }).status).toBe(
      "BLOCKED",
    );
  });
});
