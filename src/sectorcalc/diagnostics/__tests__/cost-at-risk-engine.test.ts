import { describe, it, expect } from "vitest";
import { computeCostAtRisk } from "../engines/cost-at-risk-engine";
import type { CostAtRiskInput } from "../diagnostic-types";

/* ── Golden Fixtures ── */

const MODERATE_RISK: CostAtRiskInput = {
  affected_quantity: 100,
  material_cost_per_unit: 25.0,
  rework_hours_per_unit: 0.5,
  blended_hourly_rate: 45.0,
  downtime_hours: 8,
  machine_hourly_rate: 120.0,
  expedite_or_delay_cost: 500.0,
  scrap_probability: 0.05,
  rework_probability: 0.15,
  probability_source: "DEFAULT_TABLE",
};

const HIGH_RISK_USER_ADJUSTED: CostAtRiskInput = {
  affected_quantity: 500,
  material_cost_per_unit: 85.0,
  rework_hours_per_unit: 1.5,
  blended_hourly_rate: 55.0,
  downtime_hours: 24,
  machine_hourly_rate: 200.0,
  expedite_or_delay_cost: 2500.0,
  scrap_probability: 0.30,
  rework_probability: 0.50,
  probability_source: "USER_ADJUSTED",
};

const ZERO_RISK: CostAtRiskInput = {
  affected_quantity: 0,
  material_cost_per_unit: 0,
  rework_hours_per_unit: 0,
  blended_hourly_rate: 0,
  downtime_hours: 0,
  machine_hourly_rate: 0,
  expedite_or_delay_cost: 0,
  scrap_probability: 0,
  rework_probability: 0,
  probability_source: "DEFAULT_TABLE",
};

describe("computeCostAtRisk — MODERATE_RISK", () => {
  const result = computeCostAtRisk(MODERATE_RISK);

  it("cost_at_risk matches deterministic formula", () => {
    // scrap: 0.05 * 100 * 25 = 125
    // rework: 0.15 * 100 * 0.5 * 45 = 337.5
    // downtime: 8 * 120 = 960
    // expedite: 500
    // total: 125 + 337.5 + 960 + 500 = 1922.5
    expect(result.cost_at_risk).toBeCloseTo(1922.5, 2);
  });

  it("probability_source is DEFAULT_TABLE", () => {
    expect(result.probability_source).toBe("DEFAULT_TABLE");
  });

  it("includes default assumptions", () => {
    expect(result.assumptions.length).toBeGreaterThanOrEqual(4);
    expect(result.assumptions[0]).toContain("Cost-at-risk is a deterministic estimate");
  });
});

describe("computeCostAtRisk — HIGH_RISK_USER_ADJUSTED", () => {
  const result = computeCostAtRisk(HIGH_RISK_USER_ADJUSTED);

  it("cost_at_risk matches deterministic formula", () => {
    // scrap: 0.30 * 500 * 85 = 12750
    // rework: 0.50 * 500 * 1.5 * 55 = 20625
    // downtime: 24 * 200 = 4800
    // expedite: 2500
    // total: 12750 + 20625 + 4800 + 2500 = 40675
    expect(result.cost_at_risk).toBeCloseTo(40675.0, 2);
  });

  it("probability_source is USER_ADJUSTED", () => {
    expect(result.probability_source).toBe("USER_ADJUSTED");
  });

  it("includes user-adjusted assumption", () => {
    expect(result.assumptions.some((a) => a.includes("User-adjusted probabilities"))).toBe(true);
  });
});

describe("computeCostAtRisk — ZERO_RISK", () => {
  const result = computeCostAtRisk(ZERO_RISK);

  it("cost_at_risk is 0", () => {
    expect(result.cost_at_risk).toBe(0);
  });

  it("returns default assumptions still", () => {
    expect(result.assumptions.length).toBeGreaterThanOrEqual(4);
  });
});

describe("computeCostAtRisk — determinism test", () => {
  it("produces identical result on repeated calls with same input", () => {
    const first = computeCostAtRisk(MODERATE_RISK);
    const second = computeCostAtRisk(MODERATE_RISK);
    expect(second.cost_at_risk).toBe(first.cost_at_risk);
    expect(second.assumptions).toEqual(first.assumptions);
  });
});
