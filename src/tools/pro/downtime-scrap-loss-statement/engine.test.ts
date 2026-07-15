// SectorCalc — Downtime & Scrap Loss Statement — 4-Layer Test Suite
//
// Layer 1 — Closed-form: 3 hand-verified scenarios
// Layer 2 — Edge/degenerate: zero, extreme, missing inputs
// Layer 3 — Semantic: insight firing conditions
// Layer 4 — Stress: extreme combinations, division-by-zero contract

import { describe, it, expect } from "vitest";
import { executeFormula, type DowntimeLossOutputs } from
  "@/sectorcalc/formulas/pro-v531/downtime-scrap-loss-statement.formula";
import { getActiveInsights, INSIGHTS } from "./insights";

function isFiniteNumber(v: unknown): v is number {
  return typeof v === "number" && Number.isFinite(v);
}

// ══════════════════════════════════════════════════════════════════════════════
// LAYER 1 — Closed-form verification (hand-calculated scenarios)
// ══════════════════════════════════════════════════════════════════════════════

describe("Layer 1 — Closed-form", () => {
  // ── S1: Moderate loss ────────────────────────────────────────────────
  // ph=176, ah=152, hr=65, sq=45, uc=85, rh=18, rr=45, mc=120000, drp=2.5, conf=0.8
  //
  // dtHours = 176-152 = 24
  // dtCost = 24*65 = 1560
  // scrapLoss = 45*85 = 3825
  // reworkLoss = 18*45 = 810
  // totalLoss = 1560+3825+810 = 6195
  // uptimeRatio = 152/176 = 0.8636
  // pareto: dtCost(1560) < scrap(3825) => scrap>rework(810)? => driver=1
  // decision: 0.05*120000=6000, 0.15*120000=18000. 6195>6000 => not 0. 6195<18000 => 1

  const S1 = {
    productiveHours: 176, actualHours: 152, hourlyRate: 65,
    scrapQuantity: 45, unitCost: 85,
    reworkHours: 18, reworkRate: 45,
    materialCost: 120000, defectRatePct: 2.5, sourceConfidence: 0.8,
  };

  it("S1: downtime hours = 24", () => {
    expect(executeFormula(S1).out_downtime_hours).toBe(24);
  });
  it("S1: downtime cost = 1560", () => {
    expect(executeFormula(S1).out_downtime_cost).toBeCloseTo(1560, 2);
  });
  it("S1: scrap material loss = 3825", () => {
    expect(executeFormula(S1).out_scrap_material_loss).toBeCloseTo(3825, 2);
  });
  it("S1: rework loss = 810", () => {
    expect(executeFormula(S1).out_rework_loss).toBeCloseTo(810, 2);
  });
  it("S1: total loss = 6195", () => {
    expect(executeFormula(S1).out_total_loss).toBeCloseTo(6195, 2);
  });
  it("S1: uptime ratio = 0.8636", () => {
    expect(executeFormula(S1).out_uptime_ratio).toBeCloseTo(0.8636, 4);
  });
  it("S1: pareto driver = 1 (scrap dominant)", () => {
    expect(executeFormula(S1).out_pareto_driver).toBe(1);
  });
  it("S1: decision state = 1 (review)", () => {
    expect(executeFormula(S1).out_decision_state).toBe(1);
  });
  it("S1: threshold crossing = 1", () => {
    expect(executeFormula(S1).out_threshold_crossing).toBe(1);
  });
  it("S1: fmea trigger = 0 (not escalated)", () => {
    expect(executeFormula(S1).out_fmea_trigger).toBe(0);
  });

  // ── S2: Low loss (within threshold) ───────────────────────────────────
  // ph=176, ah=170, hr=50, sq=5, uc=30, rh=2, rr=35, mc=200000
  //
  // dtHours=6, dtCost=300, scrapLoss=150, reworkLoss=70, totalLoss=520
  // decision: 520 < 0.05*200000=10000 => decision=0

  const S2 = {
    productiveHours: 176, actualHours: 170, hourlyRate: 50,
    scrapQuantity: 5, unitCost: 30,
    reworkHours: 2, reworkRate: 35,
    materialCost: 200000, defectRatePct: 1.5, sourceConfidence: 0.9,
  };

  it("S2: total loss = 520", () => {
    expect(executeFormula(S2).out_total_loss).toBeCloseTo(520, 2);
  });
  it("S2: decision state = 0 (ok)", () => {
    expect(executeFormula(S2).out_decision_state).toBe(0);
  });
  it("S2: threshold crossing = 0", () => {
    expect(executeFormula(S2).out_threshold_crossing).toBe(0);
  });

  // ── S3: High loss (escalate) ──────────────────────────────────────────
  // ph=176, ah=100, hr=80, sq=200, uc=50, rh=40, rr=55, mc=50000
  //
  // dtHours=76, dtCost=6080, scrapLoss=10000, reworkLoss=2200, totalLoss=18280
  // uptimeRatio=100/176=0.5682
  // pareto: dtCost(6080) < scrap(10000) => scrap>rework(2200)? => driver=1
  // decision: 0.15*50000=7500, 18280>7500 => decision=2

  const S3 = {
    productiveHours: 176, actualHours: 100, hourlyRate: 80,
    scrapQuantity: 200, unitCost: 50,
    reworkHours: 40, reworkRate: 55,
    materialCost: 50000, defectRatePct: 5.0, sourceConfidence: 0.6,
  };

  it("S3: downtime hours = 76", () => {
    expect(executeFormula(S3).out_downtime_hours).toBe(76);
  });
  it("S3: downtime cost = 6080", () => {
    expect(executeFormula(S3).out_downtime_cost).toBeCloseTo(6080, 2);
  });
  it("S3: scrap material loss = 10000", () => {
    expect(executeFormula(S3).out_scrap_material_loss).toBeCloseTo(10000, 2);
  });
  it("S3: rework loss = 2200", () => {
    expect(executeFormula(S3).out_rework_loss).toBeCloseTo(2200, 2);
  });
  it("S3: total loss = 18280", () => {
    expect(executeFormula(S3).out_total_loss).toBeCloseTo(18280, 2);
  });
  it("S3: uptime ratio = 0.5682", () => {
    expect(executeFormula(S3).out_uptime_ratio).toBeCloseTo(0.5682, 4);
  });
  it("S3: decision state = 2 (escalate)", () => {
    expect(executeFormula(S3).out_decision_state).toBe(2);
  });
  it("S3: threshold crossing = 1", () => {
    expect(executeFormula(S3).out_threshold_crossing).toBe(1);
  });
  it("S3: fmea trigger = 1", () => {
    expect(executeFormula(S3).out_fmea_trigger).toBe(1);
  });
});

// ══════════════════════════════════════════════════════════════════════════════
// LAYER 2 — Edge-case & degenerate inputs
// ══════════════════════════════════════════════════════════════════════════════

describe("Layer 2 — Edge cases", () => {
  it("all-zero inputs: costs=0, uptime=0, no crash", () => {
    const o = executeFormula({
      productiveHours: 0, actualHours: 0, hourlyRate: 0,
      scrapQuantity: 0, unitCost: 0,
      reworkHours: 0, reworkRate: 0,
      materialCost: 0, defectRatePct: 0, sourceConfidence: 0,
    });
    expect(o.out_downtime_hours).toBe(0);
    expect(o.out_downtime_cost).toBe(0);
    expect(o.out_scrap_material_loss).toBe(0);
    expect(o.out_rework_loss).toBe(0);
    expect(o.out_total_loss).toBe(0);
    expect(o.out_uptime_ratio).toBe(0);
    // 0 < 0 evaluates to false for both thresholds, so decision falls to 2
    expect(o.out_decision_state).toBe(2);
    expect(o.out_fmea_trigger).toBe(1);
  });

  it("zero scrap but positive rework and downtime: costs computed correctly", () => {
    const o = executeFormula({
      productiveHours: 160, actualHours: 140, hourlyRate: 50,
      scrapQuantity: 0, unitCost: 0,
      reworkHours: 10, reworkRate: 40,
      materialCost: 100000, defectRatePct: 0, sourceConfidence: 0.8,
    });
    expect(o.out_scrap_material_loss).toBe(0);
    expect(o.out_rework_loss).toBe(400);
    expect(o.out_downtime_cost).toBe(1000);
    // pareto: dtCost(1000) > scrap(0) => dtCost(1000) > rework(400)? => driver=0
    expect(o.out_pareto_driver).toBe(0);
  });

  it("extreme large values produce finite results", () => {
    const o = executeFormula({
      productiveHours: 1e6, actualHours: 5e5, hourlyRate: 5000,
      scrapQuantity: 1e6, unitCost: 10000,
      reworkHours: 1e5, reworkRate: 2000,
      materialCost: 1e9, defectRatePct: 10, sourceConfidence: 1,
    });
    for (const key of Object.keys(o) as Array<keyof DowntimeLossOutputs>) {
      expect(typeof o[key]).toBe("number");
      expect(o[key]).not.toBeNaN();
    }
  });

  it("negative quantities produce cost outputs that are finite (guarded)", () => {
    const o = executeFormula({
      productiveHours: -100, actualHours: -120, hourlyRate: -50,
      scrapQuantity: -10, unitCost: -25,
      reworkHours: -5, reworkRate: -30,
      materialCost: -10000, defectRatePct: -1, sourceConfidence: 0.5,
    });
    // Values are finite, even if negative
    expect(isFiniteNumber(o.out_downtime_cost)).toBe(true);
    expect(isFiniteNumber(o.out_scrap_material_loss)).toBe(true);
    expect(isFiniteNumber(o.out_rework_loss)).toBe(true);
    expect(o.out_uptime_ratio).toBe(0); // productiveHours <= 0
  });

  it("actualHours > productiveHours: negative downtime, still finite", () => {
    const o = executeFormula({
      productiveHours: 100, actualHours: 120, hourlyRate: 50,
      scrapQuantity: 0, unitCost: 0,
      reworkHours: 0, reworkRate: 0,
      materialCost: 50000, defectRatePct: 0, sourceConfidence: 0.9,
    });
    expect(o.out_downtime_hours).toBe(-20);
    expect(o.out_downtime_cost).toBe(-1000);
    expect(isFiniteNumber(o.out_total_loss)).toBe(true);
  });
});

// ══════════════════════════════════════════════════════════════════════════════
// LAYER 3 — Semantic insight verification
// ══════════════════════════════════════════════════════════════════════════════

describe("Layer 3 — Semantic insight rules", () => {
  const CUR = "$";

  it("critical_downtime fires when downtime > 50% of total AND uptime < 0.85", () => {
    // Make downtime dominant: high dtCost, low scrap/rework
    const o = executeFormula({
      productiveHours: 176, actualHours: 100, hourlyRate: 100,
      scrapQuantity: 5, unitCost: 10,
      reworkHours: 2, reworkRate: 10,
      materialCost: 50000, defectRatePct: 2, sourceConfidence: 0.9,
    });
    // dtHours=76, dtCost=7600, scrap=50, rework=20, total=7670
    // dtCost/total = 7600/7670 = 99.1% > 50%
    // uptime=100/176=0.568 < 0.85
    const active = getActiveInsights(o, {
      productiveHours: 176, actualHours: 100, hourlyRate: 100,
      scrapQuantity: 5, unitCost: 10,
      reworkHours: 2, reworkRate: 10,
      materialCost: 50000, defectRatePct: 2, sourceConfidence: 0.9,
    }, CUR);
    expect(active.some((a) => a.id === "critical_downtime")).toBe(true);
  });

  it("critical_downtime does not fire when uptime >= 0.85", () => {
    const o = executeFormula({
      productiveHours: 176, actualHours: 160, hourlyRate: 100,
      scrapQuantity: 5, unitCost: 10,
      reworkHours: 2, reworkRate: 10,
      materialCost: 50000, defectRatePct: 2, sourceConfidence: 0.9,
    });
    // uptime=160/176=0.909 >= 0.85
    const active = getActiveInsights(o, {
      productiveHours: 176, actualHours: 160, hourlyRate: 100,
      scrapQuantity: 5, unitCost: 10,
      reworkHours: 2, reworkRate: 10,
      materialCost: 50000, defectRatePct: 2, sourceConfidence: 0.9,
    }, CUR);
    expect(active.some((a) => a.id === "critical_downtime")).toBe(false);
  });

  it("scrap_dominant_loss fires when scrap > rework AND scrap > downtime", () => {
    const o = executeFormula({
      productiveHours: 176, actualHours: 160, hourlyRate: 50,
      scrapQuantity: 100, unitCost: 100,
      reworkHours: 10, reworkRate: 20,
      materialCost: 50000, defectRatePct: 3, sourceConfidence: 0.8,
    });
    // scrap=10000 > rework=200 AND scrap=10000 > dtCost=800
    const active = getActiveInsights(o, {
      productiveHours: 176, actualHours: 160, hourlyRate: 50,
      scrapQuantity: 100, unitCost: 100,
      reworkHours: 10, reworkRate: 20,
      materialCost: 50000, defectRatePct: 3, sourceConfidence: 0.8,
    }, CUR);
    expect(active.some((a) => a.id === "scrap_dominant_loss")).toBe(true);
  });

  it("scrap_dominant_loss does not fire when rework > scrap", () => {
    const o = executeFormula({
      productiveHours: 176, actualHours: 160, hourlyRate: 50,
      scrapQuantity: 5, unitCost: 10,
      reworkHours: 100, reworkRate: 100,
      materialCost: 50000, defectRatePct: 2, sourceConfidence: 0.7,
    });
    const active = getActiveInsights(o, {
      productiveHours: 176, actualHours: 160, hourlyRate: 50,
      scrapQuantity: 5, unitCost: 10,
      reworkHours: 100, reworkRate: 100,
      materialCost: 50000, defectRatePct: 2, sourceConfidence: 0.7,
    }, CUR);
    expect(active.some((a) => a.id === "scrap_dominant_loss")).toBe(false);
  });

  it("escalate_loss fires when decisionState >= 2", () => {
    const o = executeFormula({
      productiveHours: 176, actualHours: 100, hourlyRate: 80,
      scrapQuantity: 200, unitCost: 50,
      reworkHours: 40, reworkRate: 55,
      materialCost: 50000, defectRatePct: 5, sourceConfidence: 0.6,
    });
    // decision=2 (matches S3 from Layer 1)
    const active = getActiveInsights(o, {
      productiveHours: 176, actualHours: 100, hourlyRate: 80,
      scrapQuantity: 200, unitCost: 50,
      reworkHours: 40, reworkRate: 55,
      materialCost: 50000, defectRatePct: 5, sourceConfidence: 0.6,
    }, CUR);
    expect(active.some((a) => a.id === "escalate_loss")).toBe(true);
  });

  it("escalate_loss does not fire when decisionState < 2", () => {
    const o = executeFormula(S2_defaults());
    const active = getActiveInsights(o, S2_defaults(), CUR);
    expect(active.some((a) => a.id === "escalate_loss")).toBe(false);
  });

  it("high_uptime fires when uptimeRatio > 0.95", () => {
    const o = executeFormula({
      productiveHours: 176, actualHours: 172, hourlyRate: 50,
      scrapQuantity: 5, unitCost: 10,
      reworkHours: 2, reworkRate: 20,
      materialCost: 50000, defectRatePct: 1, sourceConfidence: 0.95,
    });
    // uptime=172/176=0.977 > 0.95
    const active = getActiveInsights(o, {
      productiveHours: 176, actualHours: 172, hourlyRate: 50,
      scrapQuantity: 5, unitCost: 10,
      reworkHours: 2, reworkRate: 20,
      materialCost: 50000, defectRatePct: 1, sourceConfidence: 0.95,
    }, CUR);
    expect(active.some((a) => a.id === "high_uptime")).toBe(true);
  });

  it("confidence_warning fires when sourceConfidence < 0.5", () => {
    const o = executeFormula({
      productiveHours: 176, actualHours: 152, hourlyRate: 65,
      scrapQuantity: 45, unitCost: 85,
      reworkHours: 18, reworkRate: 45,
      materialCost: 120000, defectRatePct: 2.5, sourceConfidence: 0.3,
    });
    const active = getActiveInsights(o, {
      productiveHours: 176, actualHours: 152, hourlyRate: 65,
      scrapQuantity: 45, unitCost: 85,
      reworkHours: 18, reworkRate: 45,
      materialCost: 120000, defectRatePct: 2.5, sourceConfidence: 0.3,
    }, CUR);
    expect(active.some((a) => a.id === "confidence_warning")).toBe(true);
  });

  it("every insight rule exists", () => {
    const allIds = INSIGHTS.map((r) => r.id);
    expect(allIds).toContain("critical_downtime");
    expect(allIds).toContain("scrap_dominant_loss");
    expect(allIds).toContain("escalate_loss");
    expect(allIds).toContain("high_uptime");
    expect(allIds).toContain("confidence_warning");
  });
});

function S2_defaults() {
  return {
    productiveHours: 176, actualHours: 170, hourlyRate: 50,
    scrapQuantity: 5, unitCost: 30,
    reworkHours: 2, reworkRate: 35,
    materialCost: 200000, defectRatePct: 1.5, sourceConfidence: 0.9,
  };
}

// ══════════════════════════════════════════════════════════════════════════════
// LAYER 4 — Stress test: extreme combinations, conservation, NaN immunity
// ══════════════════════════════════════════════════════════════════════════════

describe("Layer 4 — Stress test", () => {
  it("conservation: totalLoss = downtimeCost + scrapLoss + reworkLoss", () => {
    const o = executeFormula({
      productiveHours: 200, actualHours: 160, hourlyRate: 75,
      scrapQuantity: 50, unitCost: 100,
      reworkHours: 20, reworkRate: 50,
      materialCost: 80000, defectRatePct: 3, sourceConfidence: 0.85,
    });
    const sumParts = o.out_downtime_cost + o.out_scrap_material_loss + o.out_rework_loss;
    expect(o.out_total_loss).toBeCloseTo(sumParts, 4);
  });

  it("downtime cost split equals total loss", () => {
    const o = executeFormula({
      productiveHours: 300, actualHours: 240, hourlyRate: 60,
      scrapQuantity: 80, unitCost: 40,
      reworkHours: 30, reworkRate: 35,
      materialCost: 100000, defectRatePct: 4, sourceConfidence: 0.9,
    });
    const sumParts = o.out_downtime_cost + o.out_scrap_material_loss + o.out_rework_loss;
    expect(sumParts).toBeCloseTo(o.out_total_loss, 4);
  });

  it("zero productiveHours produces uptimeRatio=0 (no crash)", () => {
    const o = executeFormula({
      productiveHours: 0, actualHours: 50, hourlyRate: 60,
      scrapQuantity: 10, unitCost: 20,
      reworkHours: 5, reworkRate: 30,
      materialCost: 10000, defectRatePct: 2, sourceConfidence: 0.7,
    });
    expect(o.out_uptime_ratio).toBe(0);
    // Costs are still computed
    expect(isFiniteNumber(o.out_downtime_cost)).toBe(true);
    expect(isFiniteNumber(o.out_total_loss)).toBe(true);
  });

  it("mixed zero/non-zero inputs produce consistent results", () => {
    const o = executeFormula({
      productiveHours: 176, actualHours: 176, hourlyRate: 50,
      scrapQuantity: 0, unitCost: 0,
      reworkHours: 0, reworkRate: 0,
      materialCost: 10000, defectRatePct: 0, sourceConfidence: 0.5,
    });
    expect(o.out_total_loss).toBe(0);
    expect(o.out_uptime_ratio).toBe(1);
    expect(o.out_decision_state).toBe(0);
  });
});
