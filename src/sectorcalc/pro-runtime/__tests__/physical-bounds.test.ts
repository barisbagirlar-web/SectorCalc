// Test: Physical bounds guard

import { describe, it, expect } from "vitest";
import { checkPhysicalBounds, hasBlockingViolation } from "../physical-bounds-guard";
import type { PhysicalHardBounds } from "../../pro-form/contract-types";

const blockingBounds: PhysicalHardBounds = {
  min: 0, max: 100, unit: "m",
  basis: "PHYSICAL_LIMIT",
  violation_behavior: "BLOCK",
  semantic_error_message: "Input must be between 0 and 100",
};

const reviewBounds: PhysicalHardBounds = {
  min: 0, max: 100, unit: "m",
  basis: "RECOMMENDED",
  violation_behavior: "REVIEW",
  semantic_error_message: "Input is outside recommended range",
};

describe("Physical bounds guard", () => {
  it("passes when all values are within bounds", () => {
    const result = checkPhysicalBounds(
      [{ id: "x", physical_hard_bounds: blockingBounds }],
      { x: 50 },
    );
    expect(result.passed).toBe(true);
    expect(result.violations.length).toBe(0);
  });

  it("blocks when value exceeds max with BLOCK behavior", () => {
    const result = checkPhysicalBounds(
      [{ id: "x", physical_hard_bounds: blockingBounds }],
      { x: 150 },
    );
    expect(result.passed).toBe(false);
    expect(result.violations[0].severity).toBe("BLOCKED");
  });

  it("blocks when value is below min with BLOCK behavior", () => {
    const result = checkPhysicalBounds(
      [{ id: "x", physical_hard_bounds: blockingBounds }],
      { x: -10 },
    );
    expect(result.passed).toBe(false);
  });

  it("flags REVIEW severity for violation_behavior REVIEW", () => {
    const result = checkPhysicalBounds(
      [{ id: "x", physical_hard_bounds: reviewBounds }],
      { x: 150 },
    );
    expect(result.violations[0].severity).toBe("REVIEW");
  });

  it("skips inputs without physical_hard_bounds", () => {
    const result = checkPhysicalBounds(
      [{ id: "x" }],
      { x: 999 },
    );
    expect(result.passed).toBe(true);
  });

  it("hasBlockingViolation returns true when BLOCKED violation exists", () => {
    const result = checkPhysicalBounds(
      [{ id: "x", physical_hard_bounds: blockingBounds }],
      { x: 150 },
    );
    expect(hasBlockingViolation(result)).toBe(true);
  });

  it("hasBlockingViolation returns false when only REVIEW violations exist", () => {
    const result = checkPhysicalBounds(
      [{ id: "x", physical_hard_bounds: reviewBounds }],
      { x: 150 },
    );
    expect(hasBlockingViolation(result)).toBe(false);
  });

  it("rejects non-finite values with BLOCKED severity", () => {
    const result = checkPhysicalBounds(
      [{ id: "x", physical_hard_bounds: blockingBounds }],
      { x: NaN },
    );
    expect(result.passed).toBe(false);
    expect(result.violations[0].severity).toBe("BLOCKED");
  });
});
