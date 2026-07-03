// Test: Uncertainty engine

import { describe, it, expect } from "vitest";
import { computeUncertainty, analyzeSensitivity } from "../uncertainty-engine";

describe("Uncertainty engine", () => {
  it("computeUncertainty returns empty for empty inputs", () => {
    const result = computeUncertainty([], {});
    expect(result.outputs).toEqual([]);
  });

  it("computeUncertainty returns stubbed result", () => {
    const result = computeUncertainty(
      [{ id: "out", value: 100 }],
      { inp: 5 },
    );
    expect(result.outputs).toEqual([]);
    expect(result.warnings.length).toBeGreaterThan(0);
  });
});

describe("Sensitivity analysis (from uncertainty engine)", () => {
  it("analyzeSensitivity returns empty for empty inputs", () => {
    const result = analyzeSensitivity([], []);
    expect(result.items).toEqual([]);
  });

  it("analyzeSensitivity returns empty for any input (stub)", () => {
    const result = analyzeSensitivity(
      [{ id: "a", name: "A", value: 100 }],
      [{ id: "out", value: 50 }],
    );
    expect(result.items).toEqual([]);
  });
});
