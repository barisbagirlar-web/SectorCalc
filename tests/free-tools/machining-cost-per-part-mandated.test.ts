/**
 * Value-verified correctness test for machining-cost-per-part formula.
 *
 * Reads a mandated golden fixture with expected output values and
 * verifies the formula engine produces those exact values.
 * This is a numeric-accuracy test with ultra-precise tolerance.
 */
import { describe, it, expect } from "vitest";
import fs from "fs";
import path from "path";
import { freeV531FormulaRegistry } from "@/sectorcalc/formulas/free-v531";

const FIXTURE_PATH = path.resolve(
  __dirname,
  "machining-cost-per-part-mandated.fixture.json",
);

interface MandatedFixture {
  tool_key: string;
  tool_id: string;
  raw_inputs: Record<string, unknown>;
  expected_outputs: Record<string, number>;
  expected_decision_state?: string;
  expected_redaction_status: string;
}

describe("Machining Cost Per Part — Mandated Value Verification", () => {
  const fixture: MandatedFixture = JSON.parse(
    fs.readFileSync(FIXTURE_PATH, "utf-8"),
  );

  it("fixture loads correctly", () => {
    expect(fixture.tool_key).toBe("machining-cost-per-part-mandated");
    expect(fixture.expected_outputs).toBeDefined();
  });

  it("formula is registered in free-v531 registry", () => {
    const formula = freeV531FormulaRegistry["machining-cost-per-part"];
    expect(formula).toBeDefined();
    expect(typeof formula.execute).toBe("function");
  });

  it("executes with expected decision state", () => {
    const formula = freeV531FormulaRegistry["machining-cost-per-part"];
    const result = formula.execute(fixture.raw_inputs);
    const expectedState = fixture.expected_decision_state || "OK";
    expect(result.status).toBe(expectedState);
    expect(result.outputs.length).toBeGreaterThan(0);
  });

  it("produces expected output values within 1e-12 relative tolerance", () => {
    const formula = freeV531FormulaRegistry["machining-cost-per-part"];
    const result = formula.execute(fixture.raw_inputs);

    for (const [key, expected] of Object.entries(fixture.expected_outputs)) {
      const output = result.outputs.find((o) => o.id === key);
      expect(output, `Output "${key}" not found in formula response`).toBeDefined();
      const actual = output!.value as number;
      const tolerance = Math.max(1e-12, Math.abs(expected) * 1e-12);
      expect(
        Math.abs(actual - expected),
        `"${key}" expected ${expected} got ${actual}`,
      ).toBeLessThanOrEqual(tolerance);
    }
  });

  it("has correct redaction status", () => {
    const formula = freeV531FormulaRegistry["machining-cost-per-part"];
    const result = formula.execute(fixture.raw_inputs);
    expect(result.redactionStatus).toBe(fixture.expected_redaction_status);
  });

  it("all output values are finite", () => {
    const formula = freeV531FormulaRegistry["machining-cost-per-part"];
    const result = formula.execute(fixture.raw_inputs);
    for (const output of result.outputs) {
      expect(Number.isFinite(output.value)).toBe(true);
    }
  });

  it("no public formula exposure in response", () => {
    const formula = freeV531FormulaRegistry["machining-cost-per-part"];
    const result = formula.execute(fixture.raw_inputs);
    const serialized = JSON.stringify(result).toLowerCase();
    const forbidden = ["expression", "eval(", "new function"];
    for (const pattern of forbidden) {
      expect(serialized, `Should not contain "${pattern}"`).not.toContain(pattern);
    }
  });
});
