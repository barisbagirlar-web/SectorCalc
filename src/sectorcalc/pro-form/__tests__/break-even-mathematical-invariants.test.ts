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

describe("break-even survival cash mathematical invariants", () => {
  it("higher fixed cash cost cannot reduce break-even revenue or cash burn", async () => {
    const { calculate } = await import(
      "@/sectorcalc/formulas/pro-v531/break-even-survival-cash-calculator.formula"
    );
    const lower = calculate(base);
    const higher = calculate({
      ...base,
      n_monthly_fixed_cash_cost: base.n_monthly_fixed_cash_cost + 50000,
    });

    expect(higher.outputs.out_break_even_monthly_revenue).toBeGreaterThan(
      lower.outputs.out_break_even_monthly_revenue,
    );
    expect(higher.outputs.out_monthly_cash_burn).toBeGreaterThanOrEqual(
      lower.outputs.out_monthly_cash_burn,
    );
  });

  it("higher contribution margin cannot increase break-even revenue", async () => {
    const { calculate } = await import(
      "@/sectorcalc/formulas/pro-v531/break-even-survival-cash-calculator.formula"
    );
    const lowerMargin = calculate({
      ...base,
      n_contribution_margin_ratio: 0.3,
    });
    const higherMargin = calculate({
      ...base,
      n_contribution_margin_ratio: 0.6,
    });

    expect(higherMargin.outputs.out_break_even_monthly_revenue).toBeLessThan(
      lowerMargin.outputs.out_break_even_monthly_revenue,
    );
  });

  it("higher unrestricted cash cannot reduce runway or increase funding gap", async () => {
    const { calculate } = await import(
      "@/sectorcalc/formulas/pro-v531/break-even-survival-cash-calculator.formula"
    );
    const lowerCash = calculate({
      ...base,
      n_unrestricted_cash_balance: 150000,
    });
    const higherCash = calculate({
      ...base,
      n_unrestricted_cash_balance: 900000,
    });

    expect(higherCash.outputs.out_cash_runway_months).toBeGreaterThanOrEqual(
      lowerCash.outputs.out_cash_runway_months,
    );
    expect(higherCash.outputs.out_funding_gap).toBeLessThanOrEqual(
      lowerCash.outputs.out_funding_gap,
    );
  });

  it("higher uncertainty coverage cannot reduce the survival cash target", async () => {
    const { calculate } = await import(
      "@/sectorcalc/formulas/pro-v531/break-even-survival-cash-calculator.formula"
    );
    const lower = calculate({ ...base, n_uncertainty_multiplier: 1 });
    const higher = calculate({ ...base, n_uncertainty_multiplier: 1.5 });

    expect(higher.outputs.out_survival_cash_target).toBeGreaterThanOrEqual(
      lower.outputs.out_survival_cash_target,
    );
    expect(higher.outputs.out_uncertainty_cash_buffer).toBeGreaterThan(
      lower.outputs.out_uncertainty_cash_buffer,
    );
  });

  it("more severe revenue loss cannot increase stressed revenue", async () => {
    const { calculate } = await import(
      "@/sectorcalc/formulas/pro-v531/break-even-survival-cash-calculator.formula"
    );
    const severe = calculate({ ...base, n_downside_revenue_factor: 0.4 });
    const mild = calculate({ ...base, n_downside_revenue_factor: 0.9 });

    expect(severe.outputs.out_stressed_monthly_revenue).toBeLessThan(
      mild.outputs.out_stressed_monthly_revenue,
    );
    expect(severe.outputs.out_monthly_cash_burn).toBeGreaterThanOrEqual(
      mild.outputs.out_monthly_cash_burn,
    );
  });
});
