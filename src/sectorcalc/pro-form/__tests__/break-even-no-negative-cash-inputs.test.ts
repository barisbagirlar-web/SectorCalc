import { describe, expect, it, vi } from "vitest";

vi.mock("server-only", () => ({}));

describe("break-even negative cash input guard", () => {
  it("blocks a negative unrestricted cash balance", async () => {
    const { calculate } = await import(
      "@/sectorcalc/formulas/pro-v531/break-even-survival-cash-calculator.formula"
    );
    const result = calculate({
      n_monthly_fixed_cash_cost: 10000,
      n_monthly_debt_service: 1000,
      n_contribution_margin_ratio: 0.5,
      n_current_monthly_revenue: 50000,
      n_unrestricted_cash_balance: -1,
      n_minimum_cash_buffer: 10000,
      n_target_survival_months: 6,
      n_downside_revenue_factor: 0.8,
      n_source_confidence_ratio: 0.9,
      n_uncertainty_multiplier: 1.1,
    });

    expect(result.status).toBe("BLOCKED");
    expect(result.outputs.out_decision_code).toBe(2);
  });
});
