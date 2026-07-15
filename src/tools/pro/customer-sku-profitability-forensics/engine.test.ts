// SectorCalc — Customer SKU Profitability Forensics — 4-Layer Test Suite
//
// Layer 1 — Closed-form: 3 hand-verified scenarios
// Layer 2 — Edge/degenerate: zero, extreme, missing inputs
// Layer 3 — Semantic: insight firing conditions
// Layer 4 — Stress: extreme combinations, division-by-zero contract

import { describe, it, expect } from "vitest";
import { executeFormula, type SKUProfitOutputs } from
  "@/sectorcalc/formulas/pro-v531/customer-sku-profitability-forensics.formula";
import { getActiveInsights, INSIGHTS } from "./insights";

function isFiniteNumber(v: unknown): v is number {
  return typeof v === "number" && Number.isFinite(v);
}

// ══════════════════════════════════════════════════════════════════════════════
// LAYER 1 — Closed-form verification (hand-calculated scenarios)
// ══════════════════════════════════════════════════════════════════════════════

describe("Layer 1 \u2014 Closed-form", () => {
  // ── S1: Healthy SKU ─────────────────────────────────────────────────
  // price=250, varCost=140, vol=5000, logistics=8%, service=5%, returns=3%,
  // target=25%, labor=35, overhead=15, conf=0.85
  //
  // uc=110, cm=110/250=0.44, lb=250*0.08=20, sb=250*0.05=12.5, rb=250*0.03=7.5
  // nm=110-20-12.5-7.5=70, toxic=0, total=70*5000=350000
  // biggest=20 (logistics, index 0), tmr=0.25, cm=0.44>0.25 => dec=0

  const S1 = {
    unitPrice: 250, unitVariableCost: 140, annualVolume: 5000,
    logisticsCostPct: 8, serviceCostPct: 5, returnRatePct: 3,
    targetMargin: 25, laborRate: 35, overheadRate: 15, sourceConfidence: 0.85,
  };

  it("S1: unit contribution = 110", () => {
    expect(executeFormula(S1).out_unitContribution).toBeCloseTo(110, 2);
  });
  it("S1: contribution margin ratio = 0.44", () => {
    expect(executeFormula(S1).out_contributionMarginRatio).toBeCloseTo(0.44, 4);
  });
  it("S1: logistics burden = 20", () => {
    expect(executeFormula(S1).out_logisticsBurden).toBeCloseTo(20, 2);
  });
  it("S1: service burden = 12.5", () => {
    expect(executeFormula(S1).out_serviceBurden).toBeCloseTo(12.5, 2);
  });
  it("S1: return burden = 7.5", () => {
    expect(executeFormula(S1).out_returnBurden).toBeCloseTo(7.5, 2);
  });
  it("S1: net margin = 70", () => {
    expect(executeFormula(S1).out_netMargin).toBeCloseTo(70, 2);
  });
  it("S1: toxic flag = 0", () => {
    expect(executeFormula(S1).out_toxicFlag).toBe(0);
  });
  it("S1: total annual margin = 350000", () => {
    expect(executeFormula(S1).out_totalAnnualMargin).toBeCloseTo(350000, 2);
  });
  it("S1: biggest burden index = 0 (logistics)", () => {
    expect(executeFormula(S1).out_biggestBurdenIndex).toBe(0);
  });
  it("S1: decision state = 0 (GROW)", () => {
    expect(executeFormula(S1).out_decisionState).toBe(0);
  });
  it("S1: threshold crossing = 0", () => {
    expect(executeFormula(S1).out_thresholdCrossing).toBe(0);
  });
  it("S1: fmea trigger = 0", () => {
    expect(executeFormula(S1).out_fmeaTrigger).toBe(0);
  });

  // ── S2: Toxic SKU ────────────────────────────────────────────────
  // price=100, varCost=120, vol=2000, logistics=8%, service=5%, returns=3%
  // uc=-20, cm=-20/100=-0.20, lb=8, sb=5, rb=3
  // nm=-20-8-5-3=-36, toxic=1, total=-72000
  // tmr=0.25, cm=-0.20 <= 0 => dec=2 (CUT)

  const S2 = {
    unitPrice: 100, unitVariableCost: 120, annualVolume: 2000,
    logisticsCostPct: 8, serviceCostPct: 5, returnRatePct: 3,
    targetMargin: 25, laborRate: 35, overheadRate: 15, sourceConfidence: 0.85,
  };

  it("S2: unit contribution = -20", () => {
    expect(executeFormula(S2).out_unitContribution).toBeCloseTo(-20, 2);
  });
  it("S2: contribution margin ratio = -0.20", () => {
    expect(executeFormula(S2).out_contributionMarginRatio).toBeCloseTo(-0.20, 4);
  });
  it("S2: net margin = -36", () => {
    expect(executeFormula(S2).out_netMargin).toBeCloseTo(-36, 2);
  });
  it("S2: toxic flag = 1", () => {
    expect(executeFormula(S2).out_toxicFlag).toBe(1);
  });
  it("S2: total annual margin = -72000", () => {
    expect(executeFormula(S2).out_totalAnnualMargin).toBeCloseTo(-72000, 2);
  });
  it("S2: decision state = 2 (CUT)", () => {
    expect(executeFormula(S2).out_decisionState).toBe(2);
  });
  it("S2: threshold crossing = 1", () => {
    expect(executeFormula(S2).out_thresholdCrossing).toBe(1);
  });
  it("S2: fmea trigger = 1", () => {
    expect(executeFormula(S2).out_fmeaTrigger).toBe(1);
  });

  // ── S3: Thin margin SKU ──────────────────────────────────────────
  // price=200, varCost=160, vol=3000, logistics=8%, service=5%, returns=3%
  // uc=40, cm=40/200=0.20, lb=16, sb=10, rb=6
  // nm=40-16-10-6=8, toxic=0, total=24000
  // tmr=0.25, 0 < 0.20 < 0.25 => dec=1 (HOLD)

  const S3 = {
    unitPrice: 200, unitVariableCost: 160, annualVolume: 3000,
    logisticsCostPct: 8, serviceCostPct: 5, returnRatePct: 3,
    targetMargin: 25, laborRate: 35, overheadRate: 15, sourceConfidence: 0.85,
  };

  it("S3: unit contribution = 40", () => {
    expect(executeFormula(S3).out_unitContribution).toBeCloseTo(40, 2);
  });
  it("S3: contribution margin ratio = 0.20", () => {
    expect(executeFormula(S3).out_contributionMarginRatio).toBeCloseTo(0.20, 4);
  });
  it("S3: net margin = 8", () => {
    expect(executeFormula(S3).out_netMargin).toBeCloseTo(8, 2);
  });
  it("S3: toxic flag = 0", () => {
    expect(executeFormula(S3).out_toxicFlag).toBe(0);
  });
  it("S3: decision state = 1 (HOLD)", () => {
    expect(executeFormula(S3).out_decisionState).toBe(1);
  });
  it("S3: threshold crossing = 0", () => {
    expect(executeFormula(S3).out_thresholdCrossing).toBe(0);
  });
});

// ══════════════════════════════════════════════════════════════════════════════
// LAYER 2 — Edge-case & degenerate inputs
// ══════════════════════════════════════════════════════════════════════════════

describe("Layer 2 \u2014 Edge cases", () => {
  it("all-zero inputs: netMargin=0, cmRatio=0 (guarded div), no crash", () => {
    const o = executeFormula({
      unitPrice: 0, unitVariableCost: 0, annualVolume: 0,
      logisticsCostPct: 0, serviceCostPct: 0, returnRatePct: 0,
      targetMargin: 0, laborRate: 0, overheadRate: 0, sourceConfidence: 0,
    });
    expect(o.out_unitContribution).toBe(0);
    expect(o.out_contributionMarginRatio).toBe(0); // unitPrice=0 => 0
    expect(o.out_netMargin).toBe(0);
    expect(o.out_toxicFlag).toBe(0);
    expect(o.out_decisionState).toBe(2); // cm=0, not > tmr(0), not > 0 => CUT
  });

  it("negative unit price: cmRatio=0 (guarded), outputs finite", () => {
    const o = executeFormula({
      unitPrice: -100, unitVariableCost: 50, annualVolume: 100,
      logisticsCostPct: 5, serviceCostPct: 3, returnRatePct: 2,
      targetMargin: 10, laborRate: 20, overheadRate: 10, sourceConfidence: 0.5,
    });
    expect(o.out_contributionMarginRatio).toBe(0); // unitPrice <=0 => 0
    expect(isFiniteNumber(o.out_netMargin)).toBe(true);
    expect(o.out_unitContribution).toBe(-150);
  });

  it("extreme large values produce finite results", () => {
    const o = executeFormula({
      unitPrice: 1e6, unitVariableCost: 5e5, annualVolume: 1e7,
      logisticsCostPct: 10, serviceCostPct: 5, returnRatePct: 3,
      targetMargin: 30, laborRate: 100, overheadRate: 20, sourceConfidence: 1,
    });
    for (const key of Object.keys(o) as Array<keyof SKUProfitOutputs>) {
      expect(typeof o[key]).toBe("number");
      expect(o[key]).not.toBeNaN();
    }
  });

  it("100% burdens consume all price: netMargin = -unitVariableCost", () => {
    const o = executeFormula({
      unitPrice: 100, unitVariableCost: 40, annualVolume: 1000,
      logisticsCostPct: 100, serviceCostPct: 0, returnRatePct: 0,
      targetMargin: 25, laborRate: 30, overheadRate: 10, sourceConfidence: 0.8,
    });
    // uc=60, lb=100, net=60-100=-40, toxic=1
    expect(o.out_netMargin).toBeCloseTo(-40, 2);
    expect(o.out_toxicFlag).toBe(1);
  });
});

// ══════════════════════════════════════════════════════════════════════════════
// LAYER 3 — Semantic insight verification
// ══════════════════════════════════════════════════════════════════════════════

describe("Layer 3 \u2014 Semantic insight rules", () => {
  const CUR = "$";

  it("toxic_sku fires when netMargin < 0", () => {
    const o = executeFormula({
      unitPrice: 80, unitVariableCost: 100, annualVolume: 1000,
      logisticsCostPct: 8, serviceCostPct: 5, returnRatePct: 3,
      targetMargin: 20, laborRate: 30, overheadRate: 10, sourceConfidence: 0.9,
    });
    const active = getActiveInsights(o, {
      unitPrice: 80, unitVariableCost: 100, annualVolume: 1000,
      logisticsCostPct: 8, serviceCostPct: 5, returnRatePct: 3,
      targetMargin: 20, laborRate: 30, overheadRate: 10, sourceConfidence: 0.9,
    }, CUR);
    expect(active.some((a) => a.id === "toxic_sku")).toBe(true);
  });

  it("toxic_sku does not fire when netMargin >= 0", () => {
    const o = executeFormula({
      unitPrice: 250, unitVariableCost: 140, annualVolume: 5000,
      logisticsCostPct: 8, serviceCostPct: 5, returnRatePct: 3,
      targetMargin: 25, laborRate: 35, overheadRate: 15, sourceConfidence: 0.85,
    });
    const active = getActiveInsights(o, {
      unitPrice: 250, unitVariableCost: 140, annualVolume: 5000,
      logisticsCostPct: 8, serviceCostPct: 5, returnRatePct: 3,
      targetMargin: 25, laborRate: 35, overheadRate: 15, sourceConfidence: 0.85,
    }, CUR);
    expect(active.some((a) => a.id === "toxic_sku")).toBe(false);
  });

  it("low_margin_warning fires when cmRatio < target/2", () => {
    // cm=0.20, target=25 => tmr=0.25, target/2=0.125, 0.20 > 0.125 => no
    // Need cm < 12.5%. Make price=200, varCost=175 => uc=25, cm=0.125=12.5%
    // 0.125 is NOT less than 0.125. Need cm < 0.125.
    // Make price=200, varCost=176 => uc=24, cm=0.12 => yes, 0.12 < 0.125
    const o = executeFormula({
      unitPrice: 200, unitVariableCost: 176, annualVolume: 1000,
      logisticsCostPct: 5, serviceCostPct: 3, returnRatePct: 2,
      targetMargin: 25, laborRate: 30, overheadRate: 10, sourceConfidence: 0.9,
    });
    const active = getActiveInsights(o, {
      unitPrice: 200, unitVariableCost: 176, annualVolume: 1000,
      logisticsCostPct: 5, serviceCostPct: 3, returnRatePct: 2,
      targetMargin: 25, laborRate: 30, overheadRate: 10, sourceConfidence: 0.9,
    }, CUR);
    expect(active.some((a) => a.id === "low_margin_warning")).toBe(true);
  });

  it("low_margin_warning does not fire when cmRatio >= target/2", () => {
    const o = executeFormula({
      unitPrice: 250, unitVariableCost: 140, annualVolume: 5000,
      logisticsCostPct: 8, serviceCostPct: 5, returnRatePct: 3,
      targetMargin: 25, laborRate: 35, overheadRate: 15, sourceConfidence: 0.85,
    });
    // cm=0.44, target/2=0.125, 0.44 >= 0.125 => no
    const active = getActiveInsights(o, {
      unitPrice: 250, unitVariableCost: 140, annualVolume: 5000,
      logisticsCostPct: 8, serviceCostPct: 5, returnRatePct: 3,
      targetMargin: 25, laborRate: 35, overheadRate: 15, sourceConfidence: 0.85,
    }, CUR);
    expect(active.some((a) => a.id === "low_margin_warning")).toBe(false);
  });

  it("high_logistics_burden fires when logistics > 50% of net margin", () => {
    // Need logisticsBurden > netMargin * 0.5 with netMargin > 0
    // price=100, varCost=70, uc=30, logistics=15% => lb=15, service=5% => sb=5, returns=2% => rb=2
    // nm=30-15-5-2=8, lb=15 > 8*0.5=4 => yes
    const o = executeFormula({
      unitPrice: 100, unitVariableCost: 70, annualVolume: 1000,
      logisticsCostPct: 15, serviceCostPct: 5, returnRatePct: 2,
      targetMargin: 20, laborRate: 25, overheadRate: 10, sourceConfidence: 0.8,
    });
    const active = getActiveInsights(o, {
      unitPrice: 100, unitVariableCost: 70, annualVolume: 1000,
      logisticsCostPct: 15, serviceCostPct: 5, returnRatePct: 2,
      targetMargin: 20, laborRate: 25, overheadRate: 10, sourceConfidence: 0.8,
    }, CUR);
    expect(active.some((a) => a.id === "high_logistics_burden")).toBe(true);
  });

  it("return_rate_risk fires when returnRatePct > 10", () => {
    const o = executeFormula({
      unitPrice: 100, unitVariableCost: 50, annualVolume: 500,
      logisticsCostPct: 5, serviceCostPct: 3, returnRatePct: 12,
      targetMargin: 20, laborRate: 25, overheadRate: 10, sourceConfidence: 0.8,
    });
    const active = getActiveInsights(o, {
      unitPrice: 100, unitVariableCost: 50, annualVolume: 500,
      logisticsCostPct: 5, serviceCostPct: 3, returnRatePct: 12,
      targetMargin: 20, laborRate: 25, overheadRate: 10, sourceConfidence: 0.8,
    }, CUR);
    expect(active.some((a) => a.id === "return_rate_risk")).toBe(true);
  });

  it("return_rate_risk does not fire when returnRatePct <= 10", () => {
    const o = executeFormula({
      unitPrice: 250, unitVariableCost: 140, annualVolume: 5000,
      logisticsCostPct: 8, serviceCostPct: 5, returnRatePct: 3,
      targetMargin: 25, laborRate: 35, overheadRate: 15, sourceConfidence: 0.85,
    });
    const active = getActiveInsights(o, {
      unitPrice: 250, unitVariableCost: 140, annualVolume: 5000,
      logisticsCostPct: 8, serviceCostPct: 5, returnRatePct: 3,
      targetMargin: 25, laborRate: 35, overheadRate: 15, sourceConfidence: 0.85,
    }, CUR);
    expect(active.some((a) => a.id === "return_rate_risk")).toBe(false);
  });

  it("confidence_warning fires when sourceConfidence < 0.5", () => {
    const o = executeFormula({
      unitPrice: 100, unitVariableCost: 50, annualVolume: 500,
      logisticsCostPct: 5, serviceCostPct: 3, returnRatePct: 2,
      targetMargin: 20, laborRate: 25, overheadRate: 10, sourceConfidence: 0.3,
    });
    const active = getActiveInsights(o, {
      unitPrice: 100, unitVariableCost: 50, annualVolume: 500,
      logisticsCostPct: 5, serviceCostPct: 3, returnRatePct: 2,
      targetMargin: 20, laborRate: 25, overheadRate: 10, sourceConfidence: 0.3,
    }, CUR);
    expect(active.some((a) => a.id === "confidence_warning")).toBe(true);
  });

  it("every insight rule exists", () => {
    const allIds = INSIGHTS.map((r) => r.id);
    expect(allIds).toContain("toxic_sku");
    expect(allIds).toContain("low_margin_warning");
    expect(allIds).toContain("high_logistics_burden");
    expect(allIds).toContain("return_rate_risk");
    expect(allIds).toContain("confidence_warning");
  });
});

// ══════════════════════════════════════════════════════════════════════════════
// LAYER 4 — Stress test: extreme combinations, conservation, NaN immunity
// ══════════════════════════════════════════════════════════════════════════════

describe("Layer 4 \u2014 Stress test", () => {
  it("conservation: netMargin = unitContribution - all burdens", () => {
    const o = executeFormula({
      unitPrice: 300, unitVariableCost: 180, annualVolume: 4000,
      logisticsCostPct: 10, serviceCostPct: 4, returnRatePct: 2,
      targetMargin: 30, laborRate: 40, overheadRate: 15, sourceConfidence: 0.9,
    });
    const uc = o.out_unitContribution;
    const totalBurdens = o.out_logisticsBurden + o.out_serviceBurden + o.out_returnBurden;
    expect(o.out_netMargin).toBeCloseTo(uc - totalBurdens, 4);
  });

  it("conservation: totalAnnualMargin = netMargin * annualVolume", () => {
    const o = executeFormula({
      unitPrice: 200, unitVariableCost: 120, annualVolume: 2500,
      logisticsCostPct: 6, serviceCostPct: 3, returnRatePct: 2,
      targetMargin: 20, laborRate: 30, overheadRate: 10, sourceConfidence: 0.85,
    });
    expect(o.out_totalAnnualMargin).toBeCloseTo(o.out_netMargin * 2500, 4);
  });

  it("zero unitPrice produces zero cmRatio (no crash)", () => {
    const o = executeFormula({
      unitPrice: 0, unitVariableCost: 50, annualVolume: 100,
      logisticsCostPct: 5, serviceCostPct: 3, returnRatePct: 2,
      targetMargin: 10, laborRate: 20, overheadRate: 10, sourceConfidence: 0.5,
    });
    expect(o.out_contributionMarginRatio).toBe(0);
    expect(o.out_unitContribution).toBe(-50);
    expect(o.out_toxicFlag).toBe(1);
  });

  it("decision state matches expected ordinal logic", () => {
    // GROW (0): cm > targetMargin/100
    const grow = executeFormula({
      unitPrice: 200, unitVariableCost: 100, annualVolume: 1000,
      logisticsCostPct: 5, serviceCostPct: 3, returnRatePct: 2,
      targetMargin: 20, laborRate: 25, overheadRate: 10, sourceConfidence: 0.8,
    });
    // uc=100, cm=0.5 > 0.2 => GROW
    expect(grow.out_decisionState).toBe(0);

    // HOLD (1): 0 < cm <= targetMargin/100
    const hold = executeFormula({
      unitPrice: 200, unitVariableCost: 170, annualVolume: 1000,
      logisticsCostPct: 5, serviceCostPct: 3, returnRatePct: 2,
      targetMargin: 20, laborRate: 25, overheadRate: 10, sourceConfidence: 0.8,
    });
    // uc=30, cm=0.15 > 0, 0.15 < 0.20 => HOLD
    expect(hold.out_decisionState).toBe(1);

    // CUT (2): cm <= 0
    const cut = executeFormula({
      unitPrice: 200, unitVariableCost: 220, annualVolume: 1000,
      logisticsCostPct: 5, serviceCostPct: 3, returnRatePct: 2,
      targetMargin: 20, laborRate: 25, overheadRate: 10, sourceConfidence: 0.8,
    });
    // uc=-20, cm=-0.1 <= 0 => CUT
    expect(cut.out_decisionState).toBe(2);
  });

  it("biggestBurdenIndex identifies the largest burden correctly", () => {
    // logistics=10, service=5, returns=2 => logistics biggest
    const logBig = executeFormula({
      unitPrice: 200, unitVariableCost: 100, annualVolume: 1000,
      logisticsCostPct: 10, serviceCostPct: 5, returnRatePct: 2,
      targetMargin: 20, laborRate: 25, overheadRate: 10, sourceConfidence: 0.8,
    });
    // lb=20, sb=10, rb=4 => index 0
    expect(logBig.out_biggestBurdenIndex).toBe(0);

    // service=20, logistics=5, returns=2 => service biggest
    const svcBig = executeFormula({
      unitPrice: 200, unitVariableCost: 100, annualVolume: 1000,
      logisticsCostPct: 5, serviceCostPct: 20, returnRatePct: 2,
      targetMargin: 20, laborRate: 25, overheadRate: 10, sourceConfidence: 0.8,
    });
    // lb=10, sb=40, rb=4 => index 1
    expect(svcBig.out_biggestBurdenIndex).toBe(1);

    // returns=15, logistics=5, service=3 => returns biggest
    const retBig = executeFormula({
      unitPrice: 200, unitVariableCost: 100, annualVolume: 1000,
      logisticsCostPct: 5, serviceCostPct: 3, returnRatePct: 15,
      targetMargin: 20, laborRate: 25, overheadRate: 10, sourceConfidence: 0.8,
    });
    // lb=10, sb=6, rb=30 => index 2
    expect(retBig.out_biggestBurdenIndex).toBe(2);
  });
});
