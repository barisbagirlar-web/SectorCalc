import { describe, it, expect } from "vitest";
import { calculateIRR, calculateNPV } from "../irr";

describe("calculateIRR", () => {
  // Golden test: standard 5-year investment
  it("computes IRR for standard cash flows", () => {
    // initialInvestment=-1000, year1=300, year2=400, year3=500, year4=500, year5=400
    const irr = calculateIRR([-1000, 300, 400, 500, 500, 400]);
    expect(irr).not.toBeNull();
    expect(irr!).toBeGreaterThan(0.28);
    expect(irr!).toBeLessThan(0.30);
    // NPV at computed IRR should be near zero
    const npv = calculateNPV([-1000, 300, 400, 500, 500, 400], irr!);
    expect(npv).not.toBeNull();
    expect(Math.abs(npv!)).toBeLessThan(0.01);
  });

  it("returns 0.2 for 2-period investment [-100, 120]", () => {
    const irr = calculateIRR([-100, 120]);
    expect(irr).not.toBeNull();
    expect(irr!).toBeCloseTo(0.2, 2);
  });

  // Edge cases — must return null (never 0)
  it("returns null for less than 2 cash flows", () => {
    expect(calculateIRR([])).toBeNull();
    expect(calculateIRR([100])).toBeNull();
  });

  it("returns null when all cash flows are positive", () => {
    expect(calculateIRR([100, 200, 300])).toBeNull();
  });

  it("returns null when all cash flows are negative", () => {
    expect(calculateIRR([-100, -200, -300])).toBeNull();
  });

  it("returns null for NaN input", () => {
    expect(calculateIRR([NaN, 100])).toBeNull();
  });

  it("returns null for Infinity input", () => {
    expect(calculateIRR([Infinity, 100])).toBeNull();
  });

  it("returns null for -Infinity input", () => {
    expect(calculateIRR([-Infinity, 100])).toBeNull();
  });

  it("returns null for null/undefined input", () => {
    expect(calculateIRR(null as unknown as number[])).toBeNull();
    expect(calculateIRR(undefined as unknown as number[])).toBeNull();
  });
});

describe("calculateNPV", () => {
  it("computes NPV for standard cash flows at 10%", () => {
    const npv = calculateNPV([-1000, 300, 400, 500, 500, 400], 0.1);
    expect(npv).not.toBeNull();
    expect(npv!).toBeCloseTo(568.84, 0);
  });

  it("returns 0 NPV at IRR", () => {
    const irr = calculateIRR([-1000, 300, 400, 500, 500, 400]);
    expect(irr).not.toBeNull();
    const npv = calculateNPV([-1000, 300, 400, 500, 500, 400], irr!);
    expect(npv).not.toBeNull();
    expect(Math.abs(npv!)).toBeLessThan(0.01);
  });

  it("returns null for empty cash flows", () => {
    expect(calculateNPV([], 0.1)).toBeNull();
  });

  it("returns null for NaN discount rate", () => {
    expect(calculateNPV([100], NaN)).toBeNull();
  });
});
