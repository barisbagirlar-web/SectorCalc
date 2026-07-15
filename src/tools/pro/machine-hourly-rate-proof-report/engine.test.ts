// SectorCalc — Machine Hourly Rate Proof Report — 4-Layer Test Suite V6.1
// Adapts to executeFormula() from formula.ts (single source of truth).
//
// Layer 1 — Closed-form: 3 hand-verified scenarios (all values pen-and-paper)
// Layer 2 — Edge/degenerate: zero, negative, extreme (Infinity/NaN per documented contract)
// Layer 3 — Semantic: insight firing conditions (z1 insight IDs)
// Layer 4 — Mathematical invariants: conservation, monotonicity, additive identities
// Layer 5 — Stress test: extreme combinations, NaN immunity, division-by-zero contract

import { describe, it, expect } from "vitest";
import { executeFormula, sensitivity, type MachineHourlyRateOutputs } from
  "@/sectorcalc/formulas/pro-v531/machine-hourly-rate-proof-report.formula";
import { getActiveInsights, INSIGHTS } from "./insights";

function isFiniteNumber(v: unknown): v is number {
  return typeof v === "number" && Number.isFinite(v);
}

// ══════════════════════════════════════════════════════════════════════════════
// LAYER 1 — Closed-form verification (hand-calculated scenarios)
// ══════════════════════════════════════════════════════════════════════════════

describe("Layer 1 \u2014 Closed-form", () => {
  // ── Scenario 1: Textbook case ──────────────────────────────────────────
  // PP=180000, UL=10yr, AH=4000h, W=34cur/h, PD=12kW, EP=0.18, IS=0.20, MR=0.05
  //
  // dep  = 180000/10 = 18000
  // maint= 180000*0.05 = 9000
  // ener = 12*4000*0.18 = 8640
  // lab  = 34*4000 = 136000
  // total= 18000+9000+8640+136000 = 171640
  // prodH = 4000*0.8 = 3200
  // rate = 171640/3200 = 53.6375
  // naive= 171640/4000 = 42.91
  // prem = 53.6375-42.91 = 10.7275
  // eShr = 8640/171640 = 0.05032
  // lShr = 136000/171640 = 0.79236
  // cShr = (18000+9000)/171640 = 0.15730

  const S1 = {
    purchasePrice: 180000, usefulLife: 10, annualHours: 4000,
    wageRate: 34, powerDraw: 12, energyPrice: 0.18,
    idleShare: 0.20, maintenanceRate: 0.05,
  };

  it("S1: depreciation = 18000", () => {
    const o = executeFormula(S1);
    expect(o.out_dep).toBeCloseTo(18000, 2);
  });

  it("S1: maintenance = 9000", () => {
    expect(executeFormula(S1).out_maint).toBeCloseTo(9000, 2);
  });

  it("S1: energy = 8640", () => {
    expect(executeFormula(S1).out_energy).toBeCloseTo(8640, 2);
  });

  it("S1: labor = 136000", () => {
    expect(executeFormula(S1).out_labor).toBeCloseTo(136000, 2);
  });

  it("S1: total annual cost = 171640", () => {
    expect(executeFormula(S1).out_total).toBeCloseTo(171640, 2);
  });

  it("S1: productive hours = 3200", () => {
    expect(executeFormula(S1).out_productiveHours).toBe(3200);
  });

  it("S1: hourly rate = 53.6375", () => {
    expect(executeFormula(S1).out_rate).toBeCloseTo(53.6375, 4);
  });

  it("S1: naive rate = 42.91", () => {
    expect(executeFormula(S1).out_naive).toBeCloseTo(42.91, 2);
  });

  it("S1: idle premium = 10.7275", () => {
    expect(executeFormula(S1).out_premium).toBeCloseTo(10.7275, 4);
  });

  it("S1: energy share = 0.05032", () => {
    expect(executeFormula(S1).out_energyShare).toBeCloseTo(0.05032, 4);
  });

  it("S1: labor share = 0.79236", () => {
    expect(executeFormula(S1).out_laborShare).toBeCloseTo(0.79236, 4);
  });

  it("S1: capital share = 0.15730", () => {
    expect(executeFormula(S1).out_capitalShare).toBeCloseTo(0.15730, 4);
  });

  // ── Scenario 2: Low idle, low maintenance ──────────────────────────────
  // PP=50000, UL=5yr, AH=2000h, W=25, PD=5kW, EP=0.12, IS=0.05, MR=0.02
  // dep=10000, maint=1000, energy=1200, labor=50000
  // total=62200, prodH=1900, rate=32.73684, naive=31.1, prem=1.63684

  const S2 = {
    purchasePrice: 50000, usefulLife: 5, annualHours: 2000,
    wageRate: 25, powerDraw: 5, energyPrice: 0.12,
    idleShare: 0.05, maintenanceRate: 0.02,
  };

  it("S2: total annual cost = 62200", () => {
    expect(executeFormula(S2).out_total).toBeCloseTo(62200, 2);
  });

  it("S2: productive hours = 1900", () => {
    expect(executeFormula(S2).out_productiveHours).toBe(1900);
  });

  it("S2: hourly rate = 32.73684", () => {
    expect(executeFormula(S2).out_rate).toBeCloseTo(32.73684, 4);
  });

  it("S2: idle premium = 1.63684", () => {
    expect(executeFormula(S2).out_premium).toBeCloseTo(1.63684, 4);
  });

  // ── Scenario 3: High idle, high power ──────────────────────────────────
  // PP=1e6, UL=20yr, AH=6000h, W=50, PD=100kW, EP=0.25, IS=0.40, MR=0.10
  // dep=50000, maint=100000, energy=150000, labor=300000
  // total=600000, prodH=3600, rate=166.6667, naive=100, prem=66.6667
  // eShr=0.25, lShr=0.50, cShr=0.25

  const S3 = {
    purchasePrice: 1000000, usefulLife: 20, annualHours: 6000,
    wageRate: 50, powerDraw: 100, energyPrice: 0.25,
    idleShare: 0.40, maintenanceRate: 0.10,
  };

  it("S3: total annual cost = 600000", () => {
    expect(executeFormula(S3).out_total).toBeCloseTo(600000, 2);
  });

  it("S3: productive hours = 3600", () => {
    expect(executeFormula(S3).out_productiveHours).toBe(3600);
  });

  it("S3: hourly rate = 166.6667", () => {
    expect(executeFormula(S3).out_rate).toBeCloseTo(166.6667, 4);
  });

  it("S3: idle premium = 66.6667", () => {
    expect(executeFormula(S3).out_premium).toBeCloseTo(66.6667, 4);
  });

  it("S3: energy share = 0.25", () => {
    expect(executeFormula(S3).out_energyShare).toBeCloseTo(0.25, 4);
  });

  it("S3: capital share = 0.25", () => {
    expect(executeFormula(S3).out_capitalShare).toBeCloseTo(0.25, 4);
  });
});

// ══════════════════════════════════════════════════════════════════════════════
// LAYER 2 — Edge-case & degenerate inputs
// Per z1 contract: degenerate inputs produce Infinity/NaN (not a crash).
// ══════════════════════════════════════════════════════════════════════════════

describe("Layer 2 \u2014 Edge cases", () => {
  it("all-zero inputs: out_total = Infinity (dep=Infinity propagates)", () => {
    const o = executeFormula({
      purchasePrice: 0, usefulLife: 0, annualHours: 0,
      wageRate: 0, powerDraw: 0, energyPrice: 0,
      idleShare: 0, maintenanceRate: 0,
    });
    // Infinity is the documented contract — no crash
    expect(o.out_dep).toBe(Infinity);
    expect(o.out_rate).toBe(Infinity);
    // Infinity propagates through addition
    expect(o.out_total).toBe(Infinity);
  });

  it("zero useful life returns Infinity for depreciation (documented)", () => {
    const o = executeFormula({
      purchasePrice: 180000, usefulLife: 0, annualHours: 4000,
      wageRate: 34, powerDraw: 12, energyPrice: 0.18,
      idleShare: 0.20, maintenanceRate: 0.05,
    });
    expect(o.out_dep).toBe(Infinity);
    // Other outputs still finite
    expect(isFiniteNumber(o.out_maint)).toBe(true);
    expect(isFiniteNumber(o.out_energy)).toBe(true);
    expect(isFiniteNumber(o.out_labor)).toBe(true);
  });

  it("zero annual hours: rate and naive are Infinity (documented)", () => {
    const o = executeFormula({
      purchasePrice: 180000, usefulLife: 10, annualHours: 0,
      wageRate: 34, powerDraw: 12, energyPrice: 0.18,
      idleShare: 0.20, maintenanceRate: 0.05,
    });
    expect(o.out_rate).toBe(Infinity);
    expect(o.out_naive).toBe(Infinity);
    expect(o.out_premium).toBe(Infinity);
    // Cost components still finite
    expect(o.out_dep).toBe(18000);
    expect(o.out_total).toBeGreaterThan(0);
  });

  it("negative inputs do not crash", () => {
    const o = executeFormula({
      purchasePrice: -10000, usefulLife: 10, annualHours: 4000,
      wageRate: 34, powerDraw: 12, energyPrice: 0.18,
      idleShare: 0.20, maintenanceRate: 0.05,
    });
    expect(o.out_maint).toBe(-500);
    expect(isFiniteNumber(o.out_rate)).toBe(true);
    expect(o.out_rate).not.toBeNaN();
  });

  it("idle share = 0.95 is handled", () => {
    const o = executeFormula({
      purchasePrice: 180000, usefulLife: 10, annualHours: 4000,
      wageRate: 34, powerDraw: 12, energyPrice: 0.18,
      idleShare: 0.95, maintenanceRate: 0.05,
    });
    expect(o.out_productiveHours).toBeCloseTo(200, 10);
    expect(isFiniteNumber(o.out_rate)).toBe(true);
  });

  it("extreme values do not throw", () => {
    const o = executeFormula({
      purchasePrice: 5e8, usefulLife: 40, annualHours: 8760,
      wageRate: 2000, powerDraw: 5000, energyPrice: 5,
      idleShare: 0.5, maintenanceRate: 0.6,
    });
    expect(isFiniteNumber(o.out_rate)).toBe(true);
    expect(isFiniteNumber(o.out_dep)).toBe(true);
    expect(isFiniteNumber(o.out_total)).toBe(true);
  });
});

// ══════════════════════════════════════════════════════════════════════════════
// LAYER 3 — Semantic insight verification (z1 insight IDs)
// ══════════════════════════════════════════════════════════════════════════════

describe("Layer 3 \u2014 Semantic insight rules", () => {
  it("idle_burden fires when premium/rate > 0.15", () => {
    const o = executeFormula({
      purchasePrice: 1000000, usefulLife: 20, annualHours: 6000,
      wageRate: 50, powerDraw: 100, energyPrice: 0.25,
      idleShare: 0.40, maintenanceRate: 0.10,
    });
    const active = getActiveInsights(o, {
      purchasePrice: 1000000, usefulLife: 20, annualHours: 6000,
      wageRate: 50, powerDraw: 100, energyPrice: 0.25,
      idleShare: 0.40, maintenanceRate: 0.10,
    }, "$");
    expect(active.some((a) => a.id === "idle_burden")).toBe(true);
  });

  it("idle_burden does not fire when premium/rate <= 0.15", () => {
    const o = executeFormula({
      purchasePrice: 180000, usefulLife: 10, annualHours: 4000,
      wageRate: 34, powerDraw: 12, energyPrice: 0.18,
      idleShare: 0.05, maintenanceRate: 0.05,
    });
    const active = getActiveInsights(o, {
      purchasePrice: 180000, usefulLife: 10, annualHours: 4000,
      wageRate: 34, powerDraw: 12, energyPrice: 0.18,
      idleShare: 0.05, maintenanceRate: 0.05,
    }, "$");
    expect(active.some((a) => a.id === "idle_burden")).toBe(false);
  });

  it("energy_high fires when energy share > 0.15", () => {
    const o = executeFormula({
      purchasePrice: 50000, usefulLife: 5, annualHours: 2000,
      wageRate: 15, powerDraw: 50, energyPrice: 0.30,
      idleShare: 0.10, maintenanceRate: 0.02,
    });
    const active = getActiveInsights(o, {
      purchasePrice: 50000, usefulLife: 5, annualHours: 2000,
      wageRate: 15, powerDraw: 50, energyPrice: 0.30,
      idleShare: 0.10, maintenanceRate: 0.02,
    }, "$");
    expect(active.some((a) => a.id === "energy_high")).toBe(true);
  });

  it("energy_high does not fire when energy share <= 0.15", () => {
    const o = executeFormula({
      purchasePrice: 180000, usefulLife: 10, annualHours: 4000,
      wageRate: 34, powerDraw: 12, energyPrice: 0.18,
      idleShare: 0.20, maintenanceRate: 0.05,
    });
    const active = getActiveInsights(o, {
      purchasePrice: 180000, usefulLife: 10, annualHours: 4000,
      wageRate: 34, powerDraw: 12, energyPrice: 0.18,
      idleShare: 0.20, maintenanceRate: 0.05,
    }, "$");
    expect(active.some((a) => a.id === "energy_high")).toBe(false);
  });

  it("labor_dominant fires when labor share > 0.60", () => {
    const o = executeFormula({
      purchasePrice: 50000, usefulLife: 5, annualHours: 2000,
      wageRate: 50, powerDraw: 5, energyPrice: 0.12,
      idleShare: 0.10, maintenanceRate: 0.02,
    });
    const active = getActiveInsights(o, {
      purchasePrice: 50000, usefulLife: 5, annualHours: 2000,
      wageRate: 50, powerDraw: 5, energyPrice: 0.12,
      idleShare: 0.10, maintenanceRate: 0.02,
    }, "$");
    expect(active.some((a) => a.id === "labor_dominant")).toBe(true);
  });

  it("labor_dominant does not fire when labor share <= 0.60", () => {
    const o = executeFormula({
      purchasePrice: 1000000, usefulLife: 20, annualHours: 6000,
      wageRate: 25, powerDraw: 100, energyPrice: 0.25,
      idleShare: 0.40, maintenanceRate: 0.10,
    });
    const active = getActiveInsights(o, {
      purchasePrice: 1000000, usefulLife: 20, annualHours: 6000,
      wageRate: 25, powerDraw: 100, energyPrice: 0.25,
      idleShare: 0.40, maintenanceRate: 0.10,
    }, "$");
    expect(active.some((a) => a.id === "labor_dominant")).toBe(false);
  });

  it("capital_light fires when capital share < 0.15", () => {
    const o = executeFormula({
      purchasePrice: 50000, usefulLife: 5, annualHours: 4000,
      wageRate: 50, powerDraw: 5, energyPrice: 0.12,
      idleShare: 0.10, maintenanceRate: 0.01,
    });
    const active = getActiveInsights(o, {
      purchasePrice: 50000, usefulLife: 5, annualHours: 4000,
      wageRate: 50, powerDraw: 5, energyPrice: 0.12,
      idleShare: 0.10, maintenanceRate: 0.01,
    }, "$");
    expect(active.some((a) => a.id === "capital_light")).toBe(true);
  });

  it("capital_light does not fire when capital share >= 0.15", () => {
    const o = executeFormula({
      purchasePrice: 1000000, usefulLife: 10, annualHours: 6000,
      wageRate: 25, powerDraw: 100, energyPrice: 0.25,
      idleShare: 0.30, maintenanceRate: 0.15,
    });
    const active = getActiveInsights(o, {
      purchasePrice: 1000000, usefulLife: 10, annualHours: 6000,
      wageRate: 25, powerDraw: 100, energyPrice: 0.25,
      idleShare: 0.30, maintenanceRate: 0.15,
    }, "$");
    expect(active.some((a) => a.id === "capital_light")).toBe(false);
  });

  it("near_cap_hours fires when annual hours > 6000", () => {
    const o = executeFormula({
      purchasePrice: 180000, usefulLife: 10, annualHours: 7000,
      wageRate: 34, powerDraw: 12, energyPrice: 0.18,
      idleShare: 0.20, maintenanceRate: 0.05,
    });
    const active = getActiveInsights(o, {
      purchasePrice: 180000, usefulLife: 10, annualHours: 7000,
      wageRate: 34, powerDraw: 12, energyPrice: 0.18,
      idleShare: 0.20, maintenanceRate: 0.05,
    }, "$");
    expect(active.some((a) => a.id === "near_cap_hours")).toBe(true);
  });

  it("near_cap_hours does not fire when annual hours <= 6000", () => {
    const o = executeFormula({
      purchasePrice: 180000, usefulLife: 10, annualHours: 4000,
      wageRate: 34, powerDraw: 12, energyPrice: 0.18,
      idleShare: 0.20, maintenanceRate: 0.05,
    });
    const active = getActiveInsights(o, {
      purchasePrice: 180000, usefulLife: 10, annualHours: 4000,
      wageRate: 34, powerDraw: 12, energyPrice: 0.18,
      idleShare: 0.20, maintenanceRate: 0.05,
    }, "$");
    expect(active.some((a) => a.id === "near_cap_hours")).toBe(false);
  });

  it("every insight rule exists and is reachable", () => {
    const allIds = INSIGHTS.map((r) => r.id);
    expect(allIds).toContain("idle_burden");
    expect(allIds).toContain("energy_high");
    expect(allIds).toContain("labor_dominant");
    expect(allIds).toContain("capital_light");
    expect(allIds).toContain("near_cap_hours");
  });
});

// ══════════════════════════════════════════════════════════════════════════════
// LAYER 4 — Mathematical invariants (engineering judgment tests)
// ══════════════════════════════════════════════════════════════════════════════

describe("Layer 4 \u2014 Mathematical invariants", () => {
  const BASE = {
    purchasePrice: 180000, usefulLife: 10, annualHours: 4000,
    wageRate: 34, powerDraw: 12, energyPrice: 0.18,
    idleShare: 0.20, maintenanceRate: 0.05,
  };

  it("higher purchase price increases rate (monotonic)", () => {
    const r1 = executeFormula({ ...BASE, purchasePrice: 100000 }).out_rate;
    const r2 = executeFormula({ ...BASE, purchasePrice: 200000 }).out_rate;
    expect(r2).toBeGreaterThan(r1);
  });

  it("higher idle share increases rate (monotonic)", () => {
    const r1 = executeFormula({ ...BASE, idleShare: 0.1 }).out_rate;
    const r2 = executeFormula({ ...BASE, idleShare: 0.3 }).out_rate;
    expect(r2).toBeGreaterThan(r1);
  });

  it("longer useful life decreases rate", () => {
    const r1 = executeFormula({ ...BASE, usefulLife: 5 }).out_rate;
    const r2 = executeFormula({ ...BASE, usefulLife: 15 }).out_rate;
    expect(r2).toBeLessThan(r1);
  });

  it("rate >= naive always (idle premium is non-negative)", () => {
    const scenarios = [
      { ...BASE, idleShare: 0 },
      { ...BASE, idleShare: 0.2 },
      { ...BASE, idleShare: 0.5 },
    ];
    for (const s of scenarios) {
      const o = executeFormula(s);
      expect(o.out_rate).toBeGreaterThanOrEqual(o.out_naive);
    }
  });

  it("shares sum to approximately 1.0", () => {
    const o = executeFormula(BASE);
    const sum = o.out_energyShare + o.out_laborShare + o.out_capitalShare;
    expect(sum).toBeCloseTo(1.0, 4);
  });

  it("0 idle share => rate == naive", () => {
    const o = executeFormula({ ...BASE, idleShare: 0 });
    expect(o.out_rate).toBeCloseTo(o.out_naive, 6);
    expect(o.out_premium).toBeCloseTo(0, 6);
  });

  it("total = dep + maint + energy + labor (additive identity)", () => {
    const o = executeFormula(BASE);
    const sum = o.out_dep + o.out_maint + o.out_energy + o.out_labor;
    expect(sum).toBeCloseTo(o.out_total, 2);
  });

  it("hourly rate = total / productive hours", () => {
    const o = executeFormula(BASE);
    const computed = o.out_total / o.out_productiveHours;
    expect(computed).toBeCloseTo(o.out_rate, 4);
  });

  it("naive rate = total / planned hours", () => {
    const o = executeFormula(BASE);
    const computed = o.out_total / BASE.annualHours;
    expect(computed).toBeCloseTo(o.out_naive, 4);
  });

  it("idle premium = rate - naive", () => {
    const o = executeFormula(BASE);
    expect(o.out_premium).toBeCloseTo(o.out_rate - o.out_naive, 4);
  });
});

// ══════════════════════════════════════════════════════════════════════════════
// LAYER 5 — Stress test: extreme combinations, conservation, NaN immunity
// ══════════════════════════════════════════════════════════════════════════════

describe("Layer 5 \u2014 Stress test (360-degree)", () => {
  const BASE = {
    purchasePrice: 180000, usefulLife: 10, annualHours: 4000,
    wageRate: 34, powerDraw: 12, energyPrice: 0.18,
    idleShare: 0.20, maintenanceRate: 0.05,
  };

  // ── Conservation identity across multiple scenarios ────────────────────

  const CONSERVATION_SCENARIOS = [
    { purchasePrice: 180000, usefulLife: 10, annualHours: 4000, wageRate: 34, powerDraw: 12, energyPrice: 0.18, idleShare: 0.2, maintenanceRate: 0.05 },
    { purchasePrice: 50000, usefulLife: 5, annualHours: 2000, wageRate: 25, powerDraw: 5, energyPrice: 0.12, idleShare: 0.05, maintenanceRate: 0.02 },
    { purchasePrice: 1000000, usefulLife: 20, annualHours: 6000, wageRate: 50, powerDraw: 100, energyPrice: 0.25, idleShare: 0.4, maintenanceRate: 0.1 },
    { purchasePrice: 1, usefulLife: 0.5, annualHours: 1, wageRate: 0.01, powerDraw: 0.001, energyPrice: 0.001, idleShare: 0, maintenanceRate: 0 },
  ];

  for (let i = 0; i < CONSERVATION_SCENARIOS.length; i++) {
    const scenario = CONSERVATION_SCENARIOS[i];
    it(`conservation identity holds for scenario ${i + 1}`, () => {
      const o = executeFormula(scenario);
      const sum = o.out_energyShare + o.out_laborShare + o.out_capitalShare;
      expect(sum).toBeCloseTo(1.0, 10);
    });
  }

  // ── Extreme combinations: NaN immunity for finite scenarios ────────────
  // The z1 contract returns NaN for share keys when total=0 (documented).
  // For total != 0, all keys must be finite.

  it("extreme case 1 (large values) produces no NaN", () => {
    const o = executeFormula({
      purchasePrice: 1e12, usefulLife: 1e-6, annualHours: 1e-6,
      wageRate: 1e6, powerDraw: 1e6, energyPrice: 1e3,
      idleShare: 0, maintenanceRate: 0,
    });
    for (const key of Object.keys(o) as Array<keyof MachineHourlyRateOutputs>) {
      expect(typeof o[key]).toBe("number");
      expect(o[key]).not.toBeNaN();
    }
  });

  it("extreme case 2 (zero cost components) produces NaN only for share keys (total=0)", () => {
    const o = executeFormula({
      purchasePrice: 0, usefulLife: 100, annualHours: 100,
      wageRate: 0, powerDraw: 0, energyPrice: 0,
      idleShare: 0.5, maintenanceRate: 0.1,
    });
    // When total=0, shares are NaN per documented contract
    expect(o.out_energyShare).toBeNaN();
    expect(o.out_laborShare).toBeNaN();
    expect(o.out_capitalShare).toBeNaN();
    // All other keys must be finite
    const shareKeys = new Set(["out_energyShare", "out_laborShare", "out_capitalShare"]);
    for (const key of Object.keys(o) as Array<keyof MachineHourlyRateOutputs>) {
      if (!shareKeys.has(key)) {
        expect(typeof o[key]).toBe("number");
        expect(o[key]).not.toBeNaN();
      }
    }
  });

  it("extreme case 3 (negative values) produces NaN only for share keys (total < 0)", () => {
    const o = executeFormula({
      purchasePrice: -1e6, usefulLife: 10, annualHours: 4000,
      wageRate: -50, powerDraw: 12, energyPrice: 0.18,
      idleShare: 0.2, maintenanceRate: 0.05,
    });
    // When total<0, shares are NaN per documented contract
    expect(o.out_energyShare).toBeNaN();
    expect(o.out_laborShare).toBeNaN();
    expect(o.out_capitalShare).toBeNaN();
    // All other keys must be finite
    const shareKeys = new Set(["out_energyShare", "out_laborShare", "out_capitalShare"]);
    for (const key of Object.keys(o) as Array<keyof MachineHourlyRateOutputs>) {
      if (!shareKeys.has(key)) {
        expect(typeof o[key]).toBe("number");
        expect(o[key]).not.toBeNaN();
      }
    }
  });

  // ── Monotonicity: sensitivity derivative sign ──────────────────────────

  it("increasing any positive input increases total annual cost (monotonic)", () => {
    const params: Array<keyof typeof BASE> = ["purchasePrice", "annualHours", "wageRate", "powerDraw", "energyPrice", "maintenanceRate"];
    for (const p of params) {
      const r1 = executeFormula({ ...BASE, [p]: BASE[p] });
      const r2 = executeFormula({ ...BASE, [p]: (BASE[p] as number) * 1.5 });
      expect(r2.out_total).toBeGreaterThanOrEqual(r1.out_total);
    }
  });

  it("increasing idle share decreases productive hours", () => {
    const r1 = executeFormula({ ...BASE, idleShare: 0.1 });
    const r2 = executeFormula({ ...BASE, idleShare: 0.3 });
    expect(r2.out_productiveHours).toBeLessThan(r1.out_productiveHours);
  });

  it("increasing idle share always increases hourly rate", () => {
    for (let is = 0.05; is < 0.9; is += 0.1) {
      const prev = executeFormula({ ...BASE, idleShare: is - 0.05 });
      const curr = executeFormula({ ...BASE, idleShare: is });
      expect(curr.out_rate).toBeGreaterThanOrEqual(prev.out_rate);
    }
  });

  // ── Sensitivity function ──────────────────────────────────────────────

  it("sensitivity returns a non-negative impact for every driver", () => {
    const drivers: Array<keyof typeof BASE> = [
      "purchasePrice", "usefulLife", "annualHours", "wageRate",
      "powerDraw", "energyPrice", "idleShare", "maintenanceRate",
    ];
    for (const d of drivers) {
      const imp = sensitivity(BASE, d);
      expect(typeof imp).toBe("number");
      expect(imp).toBeGreaterThanOrEqual(0);
    }
  });

  it("sensitivity with 0% change returns 0", () => {
    const imp = sensitivity(BASE, "purchasePrice", 0);
    expect(imp).toBe(0);
  });
});
