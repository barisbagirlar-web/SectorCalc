// Test: Reference range evaluation

import { describe, it, expect } from "vitest";
import { evaluateReferenceRange, evaluateAllReferenceRanges } from "../reference-range-evaluator";
import type { EngineeringReferenceRange } from "../contract-types";

describe("Reference range evaluation", () => {
  const insideRange: EngineeringReferenceRange = {
    min: 0, max: 100, unit: "m",
    source: "ISO 2768",
    status: "VERIFIED",
    warning_behavior: "OUTSIDE",
  };

  it("returns INSIDE when value is within range", () => {
    const result = evaluateReferenceRange("test", 50, insideRange);
    expect(result).not.toBeNull();
    expect(result!.status).toBe("INSIDE");
  });

  it("returns ABOVE when value exceeds max", () => {
    const result = evaluateReferenceRange("test", 150, insideRange);
    expect(result).not.toBeNull();
    expect(result!.status).toBe("ABOVE");
  });

  it("returns BELOW when value is below min", () => {
    const range: EngineeringReferenceRange = {
      min: 10, max: 100, unit: "m",
      source: "ISO 2768", status: "VERIFIED", warning_behavior: "OUTSIDE",
    };
    const result = evaluateReferenceRange("test", -5, range);
    expect(result).not.toBeNull();
    expect(result!.status).toBe("BELOW");
  });

  it("returns null for undefined range", () => {
    const result = evaluateReferenceRange("test", 50, undefined);
    expect(result).toBeNull();
  });

  it("evaluateAllReferenceRanges processes multiple inputs", () => {
    const inputs = [
      {
        id: "a",
        engineering_reference_range: {
          min: 0, max: 100, unit: "m",
          source: "ISO", status: "VERIFIED" as const,
          warning_behavior: "OUTSIDE" as const,
        } as EngineeringReferenceRange,
      },
      {
        id: "b",
        engineering_reference_range: {
          min: 0, max: 100, unit: "m",
          source: "ISO", status: "VERIFIED" as const,
          warning_behavior: "OUTSIDE" as const,
        } as EngineeringReferenceRange,
      },
      { id: "c" },
    ];
    const values = { a: 50, b: 200, c: 10 };
    const result = evaluateAllReferenceRanges(inputs as any, values);
    expect(result.audit.length).toBe(2);
    expect(result.audit[0].status).toBe("INSIDE");
    expect(result.audit[1].status).toBe("ABOVE");
  });
});
