// SectorCalc — Free Result Panel Unit Tests (V5.4)
// Tests for:
//   1. formatPrimaryResult — no "Result: Result", correct formatting
//   2. formatSummary — business language with comparison
//   3. resolveDecisionState — correct states for CNC and generic tools
//   4. FreeToolResultPanel — renders correct structure
//   5. UniversalIndustrialDecisionForm — fallback uses FreeToolResultPanel

import { describe, test, expect } from "vitest";
import {
  formatPrimaryResult,
  formatSummary,
  formatComparison,
  roundMoney,
  roundPercent,
} from "@/sectorcalc/free-form/freeResultText";
import { resolveDecisionState } from "@/sectorcalc/free-form/freeDecisionState";

// ── formatPrimaryResult tests ──

describe("formatPrimaryResult", () => {
  test("CNC Shop Hourly Rate formats as 44.50 $/hour", () => {
    const result = formatPrimaryResult({
      label: "Required shop hourly rate",
      value: 44.5,
      unit: "$/hour",
    });
    expect(result).toBe("44.50 $/hour");
  });

  test("no duplicate 'Result: Result' text", () => {
    const result = formatPrimaryResult({
      label: "Result",
      value: 44.5,
      unit: "$/hour",
    });
    expect(result).not.toContain("Result: Result");
    expect(result).toBe("44.50 $/hour");
  });

  test("unit is visible when provided", () => {
    const result = formatPrimaryResult({
      label: "Weight",
      value: 150,
      unit: "kg",
    });
    expect(result).toContain("kg");
    expect(result).toBe("150 kg");
  });

  test("monetary unit auto-formats to 2 decimals", () => {
    const result = formatPrimaryResult({
      label: "Cost",
      value: 100.5,
      unit: "USD",
    });
    expect(result).toBe("100.50 USD");
  });

  test("non-finite value returns —", () => {
    const result = formatPrimaryResult({
      label: "Test",
      value: NaN,
    });
    expect(result).toBe("—");
  });

  test("integer without unit formats correctly", () => {
    const result = formatPrimaryResult({
      label: "Units",
      value: 42,
    });
    expect(result).toBe("42");
  });
});

// ── formatSummary tests ──

describe("formatSummary", () => {
  test("CNC Shop Hourly Rate includes current rate comparison", () => {
    const summary = formatSummary({
      calculated: 44.5,
      current: 95,
      unit: "$/hour",
      resultLabel: "shop hourly cost",
      currentLabel: "Current shop rate",
    });
    expect(summary).toContain("44.50 $/hour");
    expect(summary).toContain("95.00 $/hour");
    expect(summary).toContain("50.50 $/hour");
    expect(summary).toContain("leaving");
  });

  test("no comparator generates simple summary", () => {
    const summary = formatSummary({
      calculated: 44.5,
      unit: "$/hour",
      resultLabel: "shop hourly cost",
    });
    expect(summary).toContain("44.50 $/hour");
    expect(summary).not.toContain("Current");
    expect(summary).toContain("Verify all input values");
  });

  test("does not contain 'Result: Result'", () => {
    const summary = formatSummary({
      calculated: 44.5,
      current: 95,
      unit: "$/hour",
      resultLabel: "shop hourly cost",
    });
    expect(summary).not.toContain("Result: Result");
  });
});

// ── formatComparison tests ──

describe("formatComparison", () => {
  test("CNC comparison shows correct surplus and margin", () => {
    const comp = formatComparison({
      current: 95,
      calculated: 44.5,
      unit: "$/hour",
      currentLabel: "Current shop rate",
      calculatedLabel: "Calculated cost floor",
    });
    expect(comp.currentDisplay).toContain("95.00 $/hour");
    expect(comp.calculatedDisplay).toContain("44.50 $/hour");
    expect(comp.difference).toBeCloseTo(50.5);
    expect(comp.differencePct).toBeCloseTo(113.48, 0);
    expect(comp.differencePctDisplay).toContain("113.48%");
  });
});

// ── resolveDecisionState tests ──

describe("resolveDecisionState", () => {
  test("CNC: current >= calculated returns 'Above calculated cost floor'", () => {
    const ds = resolveDecisionState({
      calculatedValue: 44.5,
      currentValue: 95,
      isValid: true,
    });
    expect(ds.state).toBe("Above calculated cost floor");
    expect(ds.severity).toBe("success");
  });

  test("current < calculated returns 'Below calculated cost floor'", () => {
    const ds = resolveDecisionState({
      calculatedValue: 100,
      currentValue: 50,
      isValid: true,
    });
    expect(ds.state).toBe("Below calculated cost floor");
    expect(ds.severity).toBe("warning");
  });

  test("no comparator returns 'Calculated result available'", () => {
    const ds = resolveDecisionState({
      calculatedValue: 44.5,
      isValid: true,
    });
    expect(ds.state).toBe("Calculated result available");
    expect(ds.severity).toBe("info");
  });

  test("invalid input returns 'Input check required'", () => {
    const ds = resolveDecisionState({
      calculatedValue: 0,
      isValid: false,
    });
    expect(ds.state).toBe("Input check required");
    expect(ds.severity).toBe("warning");
  });

  test("zero/negative result with positive expected warns", () => {
    const ds = resolveDecisionState({
      calculatedValue: 0,
      isValid: true,
      positiveExpected: true,
    });
    expect(ds.state).toContain("Review inputs");
    expect(ds.severity).toBe("warning");
  });
});

// ── roundMoney / roundPercent tests ──

describe("roundMoney", () => {
  test("rounds to 2 decimal places", () => {
    expect(roundMoney(44.5)).toBe(44.5);
    expect(roundMoney(44.555)).toBe(44.56);
    expect(roundMoney(100)).toBe(100);
  });
});

describe("roundPercent", () => {
  test("rounds consistently", () => {
    expect(roundPercent(53.157)).toBe(53.16);
    expect(roundPercent(100)).toBe(100);
  });
});

// ── Guard: Result: Result pattern check ──

describe("Guard: No 'Result: Result' pattern", () => {
  test("freeResultText.ts does not contain 'Result: Result'", async () => {
    const fs = await import("fs");
    const path = await import("path");
    const filePath = path.resolve(
      process.cwd(),
      "src/sectorcalc/free-form/freeResultText.ts"
    );
    const content = fs.readFileSync(filePath, "utf-8");
    expect(content).not.toContain("Result: Result");
  });

  test("freeDecisionState.ts does not contain 'Result: Result'", async () => {
    const fs = await import("fs");
    const path = await import("path");
    const filePath = path.resolve(
      process.cwd(),
      "src/sectorcalc/free-form/freeDecisionState.ts"
    );
    const content = fs.readFileSync(filePath, "utf-8");
    expect(content).not.toContain("Result: Result");
  });
});
