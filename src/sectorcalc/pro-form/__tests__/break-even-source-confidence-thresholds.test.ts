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
  n_uncertainty_multiplier: 1.15,
};

describe("break-even source confidence thresholds", () => {
  it("returns GO at 70% when all financial thresholds pass", async () => {
    const { calculate } = await import(
      "@/sectorcalc/formulas/pro-v531/break-even-survival-cash-calculator.formula"
    );
    expect(
      calculate({ ...base, n_source_confidence_ratio: 0.7 }).status,
    ).toBe("OK");
  });

  it("returns REVIEW below 70% and BLOCK below 50%", async () => {
    const { calculate } = await import(
      "@/sectorcalc/formulas/pro-v531/break-even-survival-cash-calculator.formula"
    );
    expect(
      calculate({ ...base, n_source_confidence_ratio: 0.69 }).status,
    ).toBe("REVIEW");
    expect(
      calculate({ ...base, n_source_confidence_ratio: 0.49 }).status,
    ).toBe("BLOCKED");
  });
});
