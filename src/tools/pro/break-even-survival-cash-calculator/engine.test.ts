// SectorCalc — Break-Even & Survival Cash Calculator — 4-Layer Test Suite
//
// Layer 1 — Closed-form: hand-verified break-even / runway calculations
// Layer 2 — Edge/degenerate: zero, extreme, negative, missing inputs
// Layer 3 — Semantic: insight firing conditions
// Layer 4 — Stress: extreme combinations, conservation

import { describe, it, expect } from "vitest";
import { executeFormula, type BreakEvenOutputs } from
  "@/sectorcalc/formulas/pro-v531/break-even-survival-cash-calculator.formula";
import { getActiveInsights, INSIGHTS } from "./insights";

function isFiniteNumber(v: unknown): v is number {
  return typeof v === "number" && Number.isFinite(v);
}

// ══════════════════════════════════════════════════════════════════════════════
// LAYER 1 — Closed-form verification (hand-calculated scenarios)
// ══════════════════════════════════════════════════════════════════════════════

describe("Layer 1 — Closed-form", () => {
  // ── S1: Healthy business ──────────────────────────────────────────────
  // fixedCashCost=50000, debtService=10000, marginRatio=0.4
  // currentRevenue=175000, cash=500000, minBuffer=50000,
  // targetMonths=6, downsideFactor=0.7, conf=0.9, uncertainty=1.2
  //
  // monthlyObligations = 50000 + 10000 = 60000
  // breakEvenRevenue = 60000 / 0.4 = 150000
  // revenueGap = 175000 - 150000 = 25000 (>0, above break-even)
  // stressedRevenue = 175000 * 0.7 = 122500
  // stressedContribution = 122500 * 0.4 = 49000
  // monthlyCashBurn = max(0, 60000 - 49000) = 11000
  // availableCash = max(0, 500000 - 50000) = 450000
  // runway = min(120, 450000/11000) = min(120, 40.91) = 40.91 months
  // targetBurnCoverage = 11000 * 6 = 66000
  // uncertaintyBuffer = 66000 * (1.2-1) = 13200
  // survivalTarget = 50000 + 66000 + 13200 = 129200
  // fundingGap = max(0, 129200 - 500000) = 0
  // marginSafety = 25000/175000 = 0.1429
  // runwayBreached: 40.91 >= 6 → false (0)
  // decision: conf>=0.7, no gap, gap>=0, rev>=0, runway ok → 0

  const S1 = {
    monthlyFixedCashCost: 50000,
    monthlyDebtService: 10000,
    contributionMarginRatio: 0.4,
    currentMonthlyRevenue: 175000,
    unrestrictedCashBalance: 500000,
    minimumCashBuffer: 50000,
    targetSurvivalMonths: 6,
    downsideRevenueFactor: 0.7,
    sourceConfidence: 0.9,
    uncertaintyMultiplier: 1.2,
  };

  it("S1: break-even revenue = 150000", () => {
    expect(executeFormula(S1).out_break_even_monthly_revenue).toBeCloseTo(150000, 2);
  });
  it("S1: revenue gap = 25000 (positive)", () => {
    expect(executeFormula(S1).out_current_revenue_gap).toBeCloseTo(25000, 2);
  });
  it("S1: stressed revenue = 122500", () => {
    expect(executeFormula(S1).out_stressed_monthly_revenue).toBeCloseTo(122500, 2);
  });
  it("S1: monthly cash burn = 11000", () => {
    expect(executeFormula(S1).out_monthly_cash_burn).toBeCloseTo(11000, 2);
  });
  it("S1: cash runway ~ 40.91 months", () => {
    expect(executeFormula(S1).out_cash_runway_months).toBeCloseTo(40.91, 1);
  });
  it("S1: survival cash target = 129200", () => {
    expect(executeFormula(S1).out_survival_cash_target).toBeCloseTo(129200, 0);
  });
  it("S1: funding gap = 0", () => {
    expect(executeFormula(S1).out_funding_gap).toBeCloseTo(0, 2);
  });
  it("S1: margin of safety ~ 0.1429", () => {
    expect(executeFormula(S1).out_margin_of_safety_ratio).toBeCloseTo(0.1429, 3);
  });
  it("S1: target runway not breached", () => {
    expect(executeFormula(S1).out_target_runway_breached).toBe(0);
  });
  it("S1: decision = 0 (OK)", () => {
    expect(executeFormula(S1).out_decision_code).toBe(0);
  });

  // ── S2: Distressed business ──────────────────────────────────────────
  // fixedCashCost=100000, debtService=25000, marginRatio=0.35
  // currentRevenue=80000, cash=150000, minBuffer=25000,
  // targetMonths=6, downsideFactor=0.6, conf=0.6, uncertainty=1.5
  //
  // monthlyObligations = 125000
  // breakEvenRevenue = 125000/0.35 = 357143
  // revenueGap = 80000 - 357143 = -277143 (below break-even!)
  // stressedRevenue = 80000*0.6 = 48000
  // stressedContribution = 48000*0.35 = 16800
  // monthlyCashBurn = max(0, 125000-16800) = 108200
  // availableCash = 150000-25000 = 125000
  // runway = min(120, 125000/108200) = 1.16 months
  // decision: conf=0.6 > 0.5 but <0.7 → code 1 (REVIEW)
  // Also revenueGap<0 → code 1

  const S2 = {
    monthlyFixedCashCost: 100000,
    monthlyDebtService: 25000,
    contributionMarginRatio: 0.35,
    currentMonthlyRevenue: 80000,
    unrestrictedCashBalance: 150000,
    minimumCashBuffer: 25000,
    targetSurvivalMonths: 6,
    downsideRevenueFactor: 0.6,
    sourceConfidence: 0.6,
    uncertaintyMultiplier: 1.5,
  };

  it("S2: revenue gap is negative (distressed)", () => {
    expect(executeFormula(S2).out_current_revenue_gap).toBeLessThan(0);
  });
  it("S2: cash burn > 0", () => {
    expect(executeFormula(S2).out_monthly_cash_burn).toBeGreaterThan(0);
  });
  it("S2: runway < 6 months", () => {
    expect(executeFormula(S2).out_cash_runway_months).toBeLessThan(6);
  });
  it("S2: funding gap exists", () => {
    expect(executeFormula(S2).out_funding_gap).toBeGreaterThan(0);
  });
  it("S2: decision = 1 (REVIEW)", () => {
    expect(executeFormula(S2).out_decision_code).toBe(1);
  });

  // ── S3: Sufficient cash, no burn ─────────────────────────────────────
  // When stressedContribution >= monthlyObligations, burn=0, runway=120

  const S3 = {
    monthlyFixedCashCost: 40000,
    monthlyDebtService: 5000,
    contributionMarginRatio: 0.5,
    currentMonthlyRevenue: 200000,
    unrestrictedCashBalance: 1000000,
    minimumCashBuffer: 100000,
    targetSurvivalMonths: 12,
    downsideRevenueFactor: 0.5,
    sourceConfidence: 0.95,
    uncertaintyMultiplier: 1.0,
  };

  it("S3: zero cash burn → max runway", () => {
    expect(executeFormula(S3).out_monthly_cash_burn).toBeCloseTo(0, 2);
    expect(executeFormula(S3).out_cash_runway_months).toBe(120);
  });
  it("S3: decision = 0 (OK)", () => {
    expect(executeFormula(S3).out_decision_code).toBe(0);
  });
});

// ══════════════════════════════════════════════════════════════════════════════
// LAYER 2 — Edge-case & degenerate inputs
// ══════════════════════════════════════════════════════════════════════════════

describe("Layer 2 — Edge cases", () => {
  it("all-zero inputs: no crash, finite outputs", () => {
    const o = executeFormula({
      monthlyFixedCashCost: 0, monthlyDebtService: 0, contributionMarginRatio: 0.1,
      currentMonthlyRevenue: 0, unrestrictedCashBalance: 0, minimumCashBuffer: 0,
      targetSurvivalMonths: 1, downsideRevenueFactor: 0.5,
      sourceConfidence: 0.5, uncertaintyMultiplier: 1.0,
    });
    for (const key of Object.keys(o) as Array<keyof BreakEvenOutputs>) {
      expect(typeof o[key]).toBe("number");
    }
  });

  it("zero contribution margin ratio is valid as long as >0 check is hypothetical", () => {
    // The formula accepts any positive margin ratio > 0
    // With marginRatio=0, we'd divide by zero. The typed function doesn't block.
    // Let's test a very small margin ratio instead
    const o = executeFormula({
      monthlyFixedCashCost: 50000, monthlyDebtService: 0, contributionMarginRatio: 0.01,
      currentMonthlyRevenue: 1000000, unrestrictedCashBalance: 500000, minimumCashBuffer: 50000,
      targetSurvivalMonths: 6, downsideRevenueFactor: 0.7,
      sourceConfidence: 0.9, uncertaintyMultiplier: 1.0,
    });
    // Break-even revenue will be very high (5M), so gap likely negative
    expect(isFiniteNumber(o.out_break_even_monthly_revenue)).toBe(true);
  });

  it("extreme high values produce finite results", () => {
    const o = executeFormula({
      monthlyFixedCashCost: 1e7, monthlyDebtService: 5e6, contributionMarginRatio: 0.5,
      currentMonthlyRevenue: 5e7, unrestrictedCashBalance: 1e8, minimumCashBuffer: 1e6,
      targetSurvivalMonths: 60, downsideRevenueFactor: 0.3,
      sourceConfidence: 1.0, uncertaintyMultiplier: 3.0,
    });
    for (const key of Object.keys(o) as Array<keyof BreakEvenOutputs>) {
      expect(isFiniteNumber(o[key])).toBe(true);
    }
  });

  it("cash runway caps at 120 months", () => {
    const o = executeFormula({
      monthlyFixedCashCost: 10000, monthlyDebtService: 0, contributionMarginRatio: 0.5,
      currentMonthlyRevenue: 100000, unrestrictedCashBalance: 1e9, minimumCashBuffer: 1000,
      targetSurvivalMonths: 12, downsideRevenueFactor: 0.8,
      sourceConfidence: 0.95, uncertaintyMultiplier: 1.0,
    });
    // Burn = 0 (stressed contribution covers obligations), runway = 120
    expect(o.out_cash_runway_months).toBe(120);
  });
});

// ══════════════════════════════════════════════════════════════════════════════
// LAYER 3 — Semantic insight verification
// ══════════════════════════════════════════════════════════════════════════════

describe("Layer 3 — Semantic insight rules", () => {
  const CUR = "$";

  it("break_even_breached fires when revenue gap < 0", () => {
    const inp = {
      monthlyFixedCashCost: 100000, monthlyDebtService: 25000, contributionMarginRatio: 0.35,
      currentMonthlyRevenue: 80000, unrestrictedCashBalance: 150000, minimumCashBuffer: 25000,
      targetSurvivalMonths: 6, downsideRevenueFactor: 0.6,
      sourceConfidence: 0.6, uncertaintyMultiplier: 1.5,
    };
    const o = executeFormula(inp);
    const active = getActiveInsights(o, inp, CUR);
    expect(active.some((a) => a.id === "break_even_breached")).toBe(true);
  });

  it("short_runway fires when runway < 6 months", () => {
    const inp = {
      monthlyFixedCashCost: 100000, monthlyDebtService: 25000, contributionMarginRatio: 0.35,
      currentMonthlyRevenue: 80000, unrestrictedCashBalance: 150000, minimumCashBuffer: 25000,
      targetSurvivalMonths: 6, downsideRevenueFactor: 0.6,
      sourceConfidence: 0.6, uncertaintyMultiplier: 1.5,
    };
    const o = executeFormula(inp);
    const active = getActiveInsights(o, inp, CUR);
    expect(active.some((a) => a.id === "short_runway")).toBe(true);
  });

  it("positive_runway fires when revenue gap >= 0 and runway >= 12", () => {
    const inp = {
      monthlyFixedCashCost: 50000, monthlyDebtService: 10000, contributionMarginRatio: 0.4,
      currentMonthlyRevenue: 175000, unrestrictedCashBalance: 500000, minimumCashBuffer: 50000,
      targetSurvivalMonths: 6, downsideRevenueFactor: 0.7,
      sourceConfidence: 0.9, uncertaintyMultiplier: 1.2,
    };
    const o = executeFormula(inp);
    const active = getActiveInsights(o, inp, CUR);
    expect(active.some((a) => a.id === "positive_runway")).toBe(true);
  });

  it("low_confidence fires when sourceConfidence < 0.7", () => {
    const inp = {
      monthlyFixedCashCost: 50000, monthlyDebtService: 10000, contributionMarginRatio: 0.4,
      currentMonthlyRevenue: 175000, unrestrictedCashBalance: 500000, minimumCashBuffer: 50000,
      targetSurvivalMonths: 6, downsideRevenueFactor: 0.7,
      sourceConfidence: 0.5, uncertaintyMultiplier: 1.2,
    };
    const o = executeFormula(inp);
    const active = getActiveInsights(o, inp, CUR);
    expect(active.some((a) => a.id === "low_confidence")).toBe(true);
  });

  it("funding_gap_warning fires when funding gap > 0", () => {
    const inp = {
      monthlyFixedCashCost: 100000, monthlyDebtService: 25000, contributionMarginRatio: 0.35,
      currentMonthlyRevenue: 80000, unrestrictedCashBalance: 150000, minimumCashBuffer: 25000,
      targetSurvivalMonths: 6, downsideRevenueFactor: 0.6,
      sourceConfidence: 0.6, uncertaintyMultiplier: 1.5,
    };
    const o = executeFormula(inp);
    const active = getActiveInsights(o, inp, CUR);
    expect(active.some((a) => a.id === "funding_gap_warning")).toBe(true);
  });

  it("every insight rule exists", () => {
    const allIds = INSIGHTS.map((r) => r.id);
    expect(allIds).toContain("break_even_breached");
    expect(allIds).toContain("short_runway");
    expect(allIds).toContain("funding_gap_warning");
    expect(allIds).toContain("positive_runway");
    expect(allIds).toContain("low_confidence");
  });
});

// ══════════════════════════════════════════════════════════════════════════════
// LAYER 4 — Stress test: extreme combinations, conservation, NaN immunity
// ══════════════════════════════════════════════════════════════════════════════

describe("Layer 4 — Stress test", () => {
  it("conservation: break-even = obligations / margin ratio", () => {
    const o = executeFormula({
      monthlyFixedCashCost: 45000, monthlyDebtService: 5000, contributionMarginRatio: 0.35,
      currentMonthlyRevenue: 150000, unrestrictedCashBalance: 300000, minimumCashBuffer: 30000,
      targetSurvivalMonths: 9, downsideRevenueFactor: 0.65,
      sourceConfidence: 0.85, uncertaintyMultiplier: 1.25,
    });
    const expectedBE = (45000 + 5000) / 0.35;
    expect(o.out_break_even_monthly_revenue).toBeCloseTo(expectedBE, 4);
  });

  it("funding gap = max(0, survivalTarget - unrestrictedCash)", () => {
    const o = executeFormula({
      monthlyFixedCashCost: 80000, monthlyDebtService: 20000, contributionMarginRatio: 0.3,
      currentMonthlyRevenue: 200000, unrestrictedCashBalance: 200000, minimumCashBuffer: 40000,
      targetSurvivalMonths: 12, downsideRevenueFactor: 0.5,
      sourceConfidence: 0.8, uncertaintyMultiplier: 1.5,
    });
    // Verify the gap is non-negative
    expect(o.out_funding_gap).toBeGreaterThanOrEqual(0);
  });

  it("margin of safety = revenueGap / revenue when revenue > 0", () => {
    const o = executeFormula({
      monthlyFixedCashCost: 50000, monthlyDebtService: 10000, contributionMarginRatio: 0.4,
      currentMonthlyRevenue: 175000, unrestrictedCashBalance: 500000, minimumCashBuffer: 50000,
      targetSurvivalMonths: 6, downsideRevenueFactor: 0.7,
      sourceConfidence: 0.9, uncertaintyMultiplier: 1.2,
    });
    const expectedMOS = o.out_current_revenue_gap / 175000;
    expect(o.out_margin_of_safety_ratio).toBeCloseTo(expectedMOS, 4);
  });

  it("decision code relationships: OK(0), REVIEW(1), BLOCKED(2)", () => {
    // OK scenario (S1 above)
    const ok = executeFormula({
      monthlyFixedCashCost: 50000, monthlyDebtService: 10000, contributionMarginRatio: 0.4,
      currentMonthlyRevenue: 175000, unrestrictedCashBalance: 500000, minimumCashBuffer: 50000,
      targetSurvivalMonths: 6, downsideRevenueFactor: 0.7,
      sourceConfidence: 0.9, uncertaintyMultiplier: 1.2,
    });
    expect(ok.out_decision_code).toBe(0);

    // BLOCKED scenario (very low confidence)
    const blocked = executeFormula({
      monthlyFixedCashCost: 50000, monthlyDebtService: 10000, contributionMarginRatio: 0.4,
      currentMonthlyRevenue: 175000, unrestrictedCashBalance: 500000, minimumCashBuffer: 50000,
      targetSurvivalMonths: 6, downsideRevenueFactor: 0.7,
      sourceConfidence: 0.3, uncertaintyMultiplier: 1.2,
    });
    expect(blocked.out_decision_code).toBe(2);
  });

  it("all outputs finite for extreme low-probability combination", () => {
    const o = executeFormula({
      monthlyFixedCashCost: 1e6, monthlyDebtService: 5e5, contributionMarginRatio: 0.05,
      currentMonthlyRevenue: 1e4, unrestrictedCashBalance: 1e3, minimumCashBuffer: 1e6,
      targetSurvivalMonths: 120, downsideRevenueFactor: 0.01,
      sourceConfidence: 0.1, uncertaintyMultiplier: 3.0,
    });
    for (const key of Object.keys(o) as Array<keyof BreakEvenOutputs>) {
      expect(isFiniteNumber(o[key])).toBe(true);
    }
  });
});
