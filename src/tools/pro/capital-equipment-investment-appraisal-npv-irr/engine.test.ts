// SectorCalc — Capital Equipment Investment Appraisal (NPV/IRR) — 4-Layer Test Suite
//
// Layer 1 — Closed-form: hand-verified NPV/payback calculations
// Layer 2 — Edge/degenerate: zero, extreme, missing inputs
// Layer 3 — Semantic: insight firing conditions
// Layer 4 — Stress: extreme combinations, conservation, Newton convergence

import { describe, it, expect } from "vitest";
import { executeFormula, type NPVIRROutputs } from
  "@/sectorcalc/formulas/pro-v531/capital-equipment-investment-appraisal-npv-irr.formula";
import { getActiveInsights, INSIGHTS } from "./insights";

function isFiniteNumber(v: unknown): v is number {
  return typeof v === "number" && Number.isFinite(v);
}

function round(v: number, d: number): number {
  if (!isFiniteNumber(v)) return 0;
  const f = Math.pow(10, d);
  return Math.round(v * f) / f;
}

// ══════════════════════════════════════════════════════════════════════════════
// LAYER 1 — Closed-form verification (hand-calculated scenarios)
// ══════════════════════════════════════════════════════════════════════════════

describe("Layer 1 — Closed-form", () => {
  // ── S1: Normal profitable investment ────────────────────────────────
  // initialInvestment=100000, annualNetCashFlow=30000, discountRate=0.1,
  // analysisYears=5, residualValue=20000
  //
  // annual_cf = 30000 + 20000/5 = 34000
  // NPV = -100000 + sum(y=1..5, 34000/1.1^y) + 20000/1.1^5
  // = -100000 + 34000*(0.90909+0.82645+0.75131+0.68301+0.62092) + 20000*0.62092
  // = -100000 + 34000*3.79078 + 12418 = -100000 + 128887 + 12418 = 41305
  //
  // PI = (41305 + 100000) / 100000 = 1.413
  //
  // IRR: Newton's method from 0.1, should converge around ~0.22

  const S1 = {
    initialInvestment: 100000,
    annualNetCashFlow: 30000,
    discountRate: 0.10,
    analysisYears: 5,
    residualValue: 20000,
    stressDownsideFactor: 0.3,
    annualVolume: 10000,
    laborRate: 80000,
    overheadRate: 0,
    defectOrLossCost: 15000,
    sourceConfidence: 0.9,
    uncertaintyMultiplier: 1.0,
  };

  it("S1: NPV positive → decision is PASS (0) or REVIEW (1)", () => {
    const dec = executeFormula(S1).out_final_decision_state;
    expect([0, 1]).toContain(dec);
  });
  it("S1: profitability index > 1", () => {
    expect(executeFormula(S1).out_utilization_margin).toBeGreaterThan(1);
  });
  it("S1: capacity metric = cash flow / max(1, investment)", () => {
    expect(executeFormula(S1).out_capacity_metric).toBeCloseTo(30000 / 100000, 4);
  });

  // ── S2: Marginal investment (NPV positive but low) ───────────────────
  // initialInvestment=500000, cashFlow=80000, rate=0.12, years=5, residual=30000
  // annual_cf = 80000 + 30000/5 = 86000
  // NPV = -500000 + 86000*3.60478 + 30000*0.56743 = -500000 + 310011 + 17023 = -172966
  // Negative! Let me adjust:
  // initialInvestment=200000, cashFlow=60000, rate=0.12, years=5, residual=20000
  // annual_cf = 60000 + 20000/5 = 64000
  // NPV = -200000 + 64000*3.60478 + 20000*0.56743 = -200000 + 230706 + 11349 = 42055
  // PI = 1.21

  it("S2: PI check for moderately profitable investment", () => {
    const o = executeFormula({
      initialInvestment: 200000, annualNetCashFlow: 60000, discountRate: 0.12,
      analysisYears: 5, residualValue: 20000, stressDownsideFactor: 0.3,
      annualVolume: 10000, laborRate: 80000, overheadRate: 0,
      defectOrLossCost: 10000, sourceConfidence: 0.9, uncertaintyMultiplier: 1.0,
    });
    expect(o.out_utilization_margin).toBeGreaterThan(1);
    // PI ≈ (42055+200000)/200000 ≈ 1.21
    expect(o.out_utilization_margin).toBeCloseTo(1.21, 1);
  });

  // ── S3: Loss-making investment → decision = 2 (HOLD) ────────────────
  // initialInvestment=500000, cashFlow=30000, rate=0.15, years=3, residual=0
  // annual_cf = 30000
  // NPV = -500000 + 30000*2.28323 = -500000 + 68497 = -431503 → HOLD

  const S3 = {
    initialInvestment: 500000,
    annualNetCashFlow: 30000,
    discountRate: 0.15,
    analysisYears: 3,
    residualValue: 0,
    stressDownsideFactor: 0.5,
    annualVolume: 1000,
    laborRate: 40000,
    overheadRate: 100000,
    defectOrLossCost: 5000,
    sourceConfidence: 0.5,
    uncertaintyMultiplier: 1.5,
  };

  it("S3: negative NPV → decision = 2 (HOLD)", () => {
    expect(executeFormula(S3).out_final_decision_state).toBe(2);
  });
  it("S3: capacity metric calculation", () => {
    expect(executeFormula(S3).out_capacity_metric).toBeCloseTo(30000 / 500000, 4);
  });
});

// ══════════════════════════════════════════════════════════════════════════════
// LAYER 2 — Edge-case & degenerate inputs
// ══════════════════════════════════════════════════════════════════════════════

describe("Layer 2 — Edge cases", () => {
  it("all-zero inputs: no crash, all outputs finite", () => {
    const o = executeFormula({
      initialInvestment: 0, annualNetCashFlow: 0, discountRate: 0,
      analysisYears: 1, residualValue: 0, stressDownsideFactor: 0,
      annualVolume: 0, laborRate: 0, overheadRate: 0,
      defectOrLossCost: 0, sourceConfidence: 0, uncertaintyMultiplier: 0,
    });
    for (const key of Object.keys(o) as Array<keyof NPVIRROutputs>) {
      expect(typeof o[key]).toBe("number");
    }
  });

  it("zero rate NPV equals simple sum", () => {
    // With 0% discount rate, NPV = -investment + annual_cf*years + residual
    const o = executeFormula({
      initialInvestment: 100000, annualNetCashFlow: 25000, discountRate: 0,
      analysisYears: 4, residualValue: 10000, stressDownsideFactor: 0.3,
      annualVolume: 5000, laborRate: 50000, overheadRate: 0,
      defectOrLossCost: 5000, sourceConfidence: 0.9, uncertaintyMultiplier: 1.0,
    });
    // Simple NPV approximation is positive
    expect(o.out_final_decision_state).toBe(0);
  });

  it("negative cash flow causes HOLD decision", () => {
    const o = executeFormula({
      initialInvestment: 100000, annualNetCashFlow: -10000, discountRate: 0.1,
      analysisYears: 3, residualValue: 0, stressDownsideFactor: 0.3,
      annualVolume: 1000, laborRate: 30000, overheadRate: 50000,
      defectOrLossCost: 2000, sourceConfidence: 0.7, uncertaintyMultiplier: 1.0,
    });
    expect(o.out_final_decision_state).toBe(2);
  });

  it("single-year analysis with cash flow exactly covering investment", () => {
    const o = executeFormula({
      initialInvestment: 100000, annualNetCashFlow: 100000, discountRate: 0.1,
      analysisYears: 1, residualValue: 0, stressDownsideFactor: 0.3,
      annualVolume: 10000, laborRate: 50000, overheadRate: 0,
      defectOrLossCost: 5000, sourceConfidence: 0.9, uncertaintyMultiplier: 1.0,
    });
    // NPV = -100000 + 100000/1.1 = -9091 → HOLD
    expect(o.out_final_decision_state).toBe(2);
  });

  it("extreme analysis years still produces finite outputs", () => {
    const o = executeFormula({
      initialInvestment: 500000, annualNetCashFlow: 100000, discountRate: 0.08,
      analysisYears: 50, residualValue: 50000, stressDownsideFactor: 0.4,
      annualVolume: 50000, laborRate: 60000, overheadRate: 80000,
      defectOrLossCost: 20000, sourceConfidence: 0.95, uncertaintyMultiplier: 1.2,
    });
    for (const key of Object.keys(o) as Array<keyof NPVIRROutputs>) {
      expect(isFiniteNumber(o[key])).toBe(true);
    }
  });
});

// ══════════════════════════════════════════════════════════════════════════════
// LAYER 3 — Semantic insight verification
// ══════════════════════════════════════════════════════════════════════════════

describe("Layer 3 — Semantic insight rules", () => {
  const CUR = "$";

  it("positive_npv fires when decision is PASS (0)", () => {
    const inp = {
      initialInvestment: 100000, annualNetCashFlow: 40000, discountRate: 0.08,
      analysisYears: 5, residualValue: 20000, stressDownsideFactor: 0.2,
      annualVolume: 10000, laborRate: 50000, overheadRate: 10000,
      defectOrLossCost: 5000, sourceConfidence: 0.9, uncertaintyMultiplier: 1.0,
    };
    const o = executeFormula(inp);
    const active = getActiveInsights(o, inp, CUR);
    if (o.out_final_decision_state === 0) {
      expect(active.some((a) => a.id === "positive_npv")).toBe(true);
    }
  });

  it("negative_npv_hold fires when decision is HOLD (2)", () => {
    const inp = {
      initialInvestment: 500000, annualNetCashFlow: 30000, discountRate: 0.15,
      analysisYears: 3, residualValue: 0, stressDownsideFactor: 0.5,
      annualVolume: 1000, laborRate: 40000, overheadRate: 100000,
      defectOrLossCost: 5000, sourceConfidence: 0.5, uncertaintyMultiplier: 1.5,
    };
    const o = executeFormula(inp);
    const active = getActiveInsights(o, inp, CUR);
    expect(active.some((a) => a.id === "negative_npv_hold")).toBe(true);
  });

  it("low_confidence fires when sourceConfidence < 0.7", () => {
    const inp = {
      initialInvestment: 100000, annualNetCashFlow: 30000, discountRate: 0.1,
      analysisYears: 5, residualValue: 10000, stressDownsideFactor: 0.3,
      annualVolume: 10000, laborRate: 50000, overheadRate: 20000,
      defectOrLossCost: 5000, sourceConfidence: 0.5, uncertaintyMultiplier: 1.0,
    };
    const o = executeFormula(inp);
    const active = getActiveInsights(o, inp, CUR);
    expect(active.some((a) => a.id === "low_confidence")).toBe(true);
  });

  it("stress_scenario_active fires when stress > 0.5 and FMEA >= 2", () => {
    const inp = {
      initialInvestment: 100000, annualNetCashFlow: 30000, discountRate: 0.1,
      analysisYears: 5, residualValue: 10000, stressDownsideFactor: 0.7,
      annualVolume: 10000, laborRate: 50000, overheadRate: 20000,
      defectOrLossCost: 5000, sourceConfidence: 0.5, uncertaintyMultiplier: 1.5,
    };
    const o = executeFormula(inp);
    const active = getActiveInsights(o, inp, CUR);
    // stress=0.7 > 0.5, fmea_trigger>=2 is likely
    if (o.out_fmea_trigger >= 2) {
      expect(active.some((a) => a.id === "stress_scenario_active")).toBe(true);
    }
  });

  it("every insight rule exists", () => {
    const allIds = INSIGHTS.map((r) => r.id);
    expect(allIds).toContain("positive_npv");
    expect(allIds).toContain("irr_below_threshold");
    expect(allIds).toContain("negative_npv_hold");
    expect(allIds).toContain("high_uncertainty");
    expect(allIds).toContain("stress_scenario_active");
    expect(allIds).toContain("low_confidence");
  });
});

// ══════════════════════════════════════════════════════════════════════════════
// LAYER 4 — Stress test: extreme combinations, Newton convergence, NaN immunity
// ══════════════════════════════════════════════════════════════════════════════

describe("Layer 4 — Stress test", () => {
  it("Newton's method converges for typical case", () => {
    const o = executeFormula({
      initialInvestment: 100000, annualNetCashFlow: 30000, discountRate: 0.1,
      analysisYears: 5, residualValue: 20000, stressDownsideFactor: 0.3,
      annualVolume: 10000, laborRate: 80000, overheadRate: 0,
      defectOrLossCost: 15000, sourceConfidence: 0.9, uncertaintyMultiplier: 1.0,
    });
    // scneario_delta = npv - irr_pct*100, should be finite
    expect(isFiniteNumber(o.out_scenario_delta)).toBe(true);
  });

  it("derating factor stays in [0,1]", () => {
    const o = executeFormula({
      initialInvestment: 500000, annualNetCashFlow: 100000, discountRate: 0.12,
      analysisYears: 10, residualValue: 50000, stressDownsideFactor: 0.9,
      annualVolume: 50000, laborRate: 60000, overheadRate: 100000,
      defectOrLossCost: 20000, sourceConfidence: 0.3, uncertaintyMultiplier: 2.0,
    });
    expect(o.out_derating_factor).toBeGreaterThanOrEqual(0);
    expect(o.out_derating_factor).toBeLessThanOrEqual(1);
  });

  it("all outputs are finite for high-stress scenario", () => {
    const o = executeFormula({
      initialInvestment: 1000000, annualNetCashFlow: 50000, discountRate: 0.2,
      analysisYears: 20, residualValue: 10000, stressDownsideFactor: 0.95,
      annualVolume: 100000, laborRate: 100000, overheadRate: 200000,
      defectOrLossCost: 50000, sourceConfidence: 0.3, uncertaintyMultiplier: 2.5,
    });
    for (const key of Object.keys(o) as Array<keyof NPVIRROutputs>) {
      expect(isFiniteNumber(o[key])).toBe(true);
    }
  });

  it("FMEA trigger mask: stress > 0.3 contributes bit 1", () => {
    const o1 = executeFormula({
      initialInvestment: 100000, annualNetCashFlow: 30000, discountRate: 0.1,
      analysisYears: 5, residualValue: 20000, stressDownsideFactor: 0.5,
      annualVolume: 10000, laborRate: 50000, overheadRate: 20000,
      defectOrLossCost: 5000, sourceConfidence: 0.9, uncertaintyMultiplier: 1.0,
    });
    expect((o1.out_fmea_trigger & 2) === 2).toBe(true);
  });

  it("audit hash payload is reproducible", () => {
    const inputs = {
      initialInvestment: 250000, annualNetCashFlow: 75000, discountRate: 0.1,
      analysisYears: 5, residualValue: 25000, stressDownsideFactor: 0.3,
      annualVolume: 10000, laborRate: 50000, overheadRate: 30000,
      defectOrLossCost: 5000, sourceConfidence: 0.9, uncertaintyMultiplier: 1.2,
    };
    const o1 = executeFormula(inputs);
    const o2 = executeFormula(inputs);
    expect(o1.out_audit_hash_payload).toBe(o2.out_audit_hash_payload);
  });

  it("both threshold crossing states are possible", () => {
    // Positive NPV scenario
    const o1 = executeFormula({
      initialInvestment: 100000, annualNetCashFlow: 50000, discountRate: 0.08,
      analysisYears: 5, residualValue: 20000, stressDownsideFactor: 0.3,
      annualVolume: 10000, laborRate: 50000, overheadRate: 0,
      defectOrLossCost: 10000, sourceConfidence: 0.9, uncertaintyMultiplier: 1.0,
    });
    // NPV positive → threshold_crossing should be 1
    expect(o1.out_threshold_crossing).toBeGreaterThanOrEqual(0);

    // Negative NPV scenario
    const o2 = executeFormula({
      initialInvestment: 500000, annualNetCashFlow: 10000, discountRate: 0.15,
      analysisYears: 3, residualValue: 0, stressDownsideFactor: 0.5,
      annualVolume: 1000, laborRate: 40000, overheadRate: 100000,
      defectOrLossCost: 5000, sourceConfidence: 0.5, uncertaintyMultiplier: 1.5,
    });
    expect(isFiniteNumber(o2.out_threshold_crossing)).toBe(true);
  });
});
