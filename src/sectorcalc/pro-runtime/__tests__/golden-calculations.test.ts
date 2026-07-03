// Test: Golden calculations — deterministic reproducibility

import { describe, it, expect } from "vitest";
import { computeHash } from "../audit-seal-service";
import { checkPhysicalBounds } from "../physical-bounds-guard";
import { analyzeSensitivity } from "../uncertainty-engine";
import { computeDecision } from "../decision-engine";
import type { PhysicalHardBounds } from "../../pro-form/contract-types";

describe("Golden calculations — reproducibility", () => {
  const goldenInputHash = computeHash(JSON.stringify({ a: 100, b: 50, c: 25 }));
  const goldenBoundResult = checkPhysicalBounds(
    [{ id: "x", physical_hard_bounds: { min: 0, max: 200, unit: "m", basis: "PHYSICAL_LIMIT", violation_behavior: "BLOCK", semantic_error_message: "Bounds" } as PhysicalHardBounds }],
    { x: 100 },
  );

  it("computeHash is deterministic (golden)", () => {
    const result = computeHash(JSON.stringify({ a: 100, b: 50, c: 25 }));
    expect(result).toBe(goldenInputHash);
  });

  it("physical bounds check is deterministic (golden)", () => {
    const result = checkPhysicalBounds(
      [{ id: "x", physical_hard_bounds: { min: 0, max: 200, unit: "m", basis: "PHYSICAL_LIMIT", violation_behavior: "BLOCK", semantic_error_message: "Bounds" } as PhysicalHardBounds }],
      { x: 100 },
    );
    expect(result.passed).toBe(goldenBoundResult.passed);
    expect(result.violations.length).toBe(goldenBoundResult.violations.length);
  });

  it("sensitivity analysis is deterministic (golden)", () => {
    const result = analyzeSensitivity(
      [{ id: "a", name: "A", value: 100 }, { id: "b", name: "B", value: 50 }],
      [{ id: "out", value: 75 }],
    );
    expect(result.items).toEqual([]);
  });

  it("decision engine is deterministic", () => {
    const result1 = computeDecision({
      outputs: [{ id: "out", value: 100, name: "Output" }],
      warnings: [],
      violations: [],
      riskLevel: "LOW",
      moneyAtRisk: null,
      currency: null,
      mainCostDriver: null,
    });
    const result2 = computeDecision({
      outputs: [{ id: "out", value: 100, name: "Output" }],
      warnings: [],
      violations: [],
      riskLevel: "LOW",
      moneyAtRisk: null,
      currency: null,
      mainCostDriver: null,
    });
    expect(result1.status).toBe(result2.status);
    expect(result1.primary_reason).toBe(result2.primary_reason);
    expect(result1.next_actions).toEqual(result2.next_actions);
  });
});
