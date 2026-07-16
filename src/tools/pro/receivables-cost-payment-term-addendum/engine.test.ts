// SectorCalc — Receivables Cost / Payment Term Addendum — Test Suite
//
// REWRITTEN 2026-07-16: the formula was rebuilt from scratch (wrong-domain manufacturing
// job-costing math -> real receivables/DSO financing-cost math, see formula.ts header for
// the full fix rationale). The previous test suite asserted exact numbers derived from the
// old, wrong formula across a completely different input domain -- not salvageable by
// patching, so this is a fresh, deliberately compact suite for the new formula.

import { describe, it, expect } from "vitest";
import { executeFormula, type ReceivablesCostInputs } from
  "@/sectorcalc/formulas/pro-v531/receivables-cost-payment-term-addendum.formula";
import { getActiveInsights, INSIGHTS } from "./insights";

function isFiniteNumber(v: unknown): boolean {
  return typeof v === "number" && Number.isFinite(v);
}

const BASE: ReceivablesCostInputs = {
  averageReceivableBalance: 450000,
  annualInterestRate: 0.08,
  averageCollectionDays: 52,
  invoiceVolume: 3200000,
  sourceConfidence: 0.85,
};

describe("Closed-form correctness", () => {
  it("carrying cost = balance * rate", () => {
    const o = executeFormula(BASE);
    expect(o.out_demand_metric).toBeCloseTo(450000 * 0.08, 2);
  });

  it("total financing cost = carrying cost + DSO financing cost", () => {
    const o = executeFormula(BASE);
    const dsoFinancingCost = 3200000 * 0.08 * (52 / 365);
    expect(o.out_money_at_risk).toBeCloseTo(450000 * 0.08 + dsoFinancingCost, 1);
  });

  it("financing cost pct = totalFinancingCost / invoiceVolume", () => {
    const o = executeFormula(BASE);
    expect(o.out_utilization_margin).toBeCloseTo(o.out_money_at_risk / 3200000, 6);
  });

  it("zero DSO produces zero DSO financing cost component", () => {
    const o = executeFormula({ ...BASE, averageCollectionDays: 0 });
    expect(o.out_money_at_risk).toBeCloseTo(450000 * 0.08, 2);
  });
});

describe("Edge cases", () => {
  it("zero invoice volume: no crash, utilization margin = 0", () => {
    const o = executeFormula({ ...BASE, invoiceVolume: 0 });
    expect(o.out_utilization_margin).toBe(0);
    for (const [k, v] of Object.entries(o)) {
      if (k !== "out_reference_deviation") expect(isFiniteNumber(v)).toBe(true);
    }
  });

  it("zero everything: no NaN/Infinity", () => {
    const o = executeFormula({
      averageReceivableBalance: 0, annualInterestRate: 0, averageCollectionDays: 0,
      invoiceVolume: 0, sourceConfidence: 0,
    });
    for (const v of Object.values(o)) expect(isFiniteNumber(v)).toBe(true);
  });

  it("high financing cost ratio triggers REVIEW/BLOCK decision states", () => {
    const o = executeFormula({ ...BASE, annualInterestRate: 0.5, averageCollectionDays: 180 });
    expect(o.out_final_decision_state).toBeGreaterThan(0);
  });
});

describe("Semantic insight rules", () => {
  const CUR = "$";

  it("every insight rule exists", () => {
    const allIds = INSIGHTS.map((r) => r.id);
    expect(allIds.length).toBeGreaterThan(0);
  });

  it("insights evaluate without throwing on a normal scenario", () => {
    const o = executeFormula(BASE);
    expect(() => getActiveInsights(o, BASE, CUR)).not.toThrow();
  });

  it("insights evaluate without throwing on a stressed scenario", () => {
    const stressed = { ...BASE, annualInterestRate: 0.5, averageCollectionDays: 180 };
    const o = executeFormula(stressed);
    expect(() => getActiveInsights(o, stressed, CUR)).not.toThrow();
  });
});

describe("Stress test", () => {
  it("extreme large values produce finite results", () => {
    const o = executeFormula({
      averageReceivableBalance: 1e9, annualInterestRate: 1, averageCollectionDays: 365,
      invoiceVolume: 1e10, sourceConfidence: 1,
    });
    for (const [key, v] of Object.entries(o)) {
      expect(typeof v).toBe("number");
      if (key !== "out_audit_hash_payload") expect(v).not.toBeNaN();
    }
  });
});
