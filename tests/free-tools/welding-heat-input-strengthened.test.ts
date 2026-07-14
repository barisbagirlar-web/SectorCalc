/**
 * Welding Heat Input — Strengthened Value Verification
 *
 * Replaces the weak all-10s fixture with realistic industrial GMAW data
 * based on ISO/TR 17671-1:2022. This verifies the formula produces
 * correct real-world values, not just hash stability.
 */
import { describe, it, expect } from "vitest";
import fs from "fs";
import path from "path";
import { weldingHeatInputFormula } from "@/sectorcalc/formulas/free-v531/welding-heat-input.formula";

const FIXTURE_PATH = path.resolve(__dirname, "welding-heat-input-strengthened.fixture.json");

interface StrengthenedFixture {
  tool_key: string;
  tool_id: string;
  source_standard: string;
  raw_inputs: Record<string, number>;
  expected_outputs: Record<string, number>;
  expected_decision_state: string;
  expected_redaction_status: string;
  expected_no_public_formula_exposure: boolean;
}

describe("Welding Heat Input — Strengthened Value Verification", () => {
  const fixture: StrengthenedFixture = JSON.parse(
    fs.readFileSync(FIXTURE_PATH, "utf-8"),
  );

  it("fixture loads correctly", () => {
    expect(fixture.tool_key).toBe("welding-heat-input-strengthened");
    expect(fixture.tool_id).toBe("FREE_V531_016");
  });

  it("formula module is registered and executable", () => {
    expect(weldingHeatInputFormula).toBeDefined();
    expect(weldingHeatInputFormula.execute).toBeInstanceOf(Function);
    expect(weldingHeatInputFormula.toolKey).toBe("welding-heat-input");
  });

  it("executes with realistic GMAW parameters without error", () => {
    const result = weldingHeatInputFormula.execute(fixture.raw_inputs);
    expect(result.status).not.toContain("BLOCKED");
    expect(result.errors).toBeUndefined();
  });

  it("produces expected heat_input_kj_mm within 1e-12 relative tolerance", () => {
    const result = weldingHeatInputFormula.execute(fixture.raw_inputs);
    const metric = result.outputs.find((o) => o.id === "heat_input_kj_mm");
    expect(metric).toBeDefined();
    const expected = fixture.expected_outputs.heat_input_kj_mm;
    const got = metric!.value as number;
    const relDiff = Math.abs((got - expected) / expected);
    expect(
      relDiff,
      `heat_input_kj_mm: expected ${expected}, got ${got}, rel diff ${relDiff}`,
    ).toBeLessThan(1e-12);
  });

  it("produces expected heat_input_limit_utilization within 1e-12 relative tolerance", () => {
    const result = weldingHeatInputFormula.execute(fixture.raw_inputs);
    const metric = result.outputs.find((o) => o.id === "heat_input_limit_utilization");
    expect(metric).toBeDefined();
    const expected = fixture.expected_outputs.heat_input_limit_utilization;
    const got = metric!.value as number;
    const relDiff = Math.abs((got - expected) / expected);
    expect(
      relDiff,
      `heat_input_limit_utilization: expected ${expected}, got ${got}, rel diff ${relDiff}`,
    ).toBeLessThan(1e-12);
  });

  it("all output values are finite (no NaN/Infinity)", () => {
    const result = weldingHeatInputFormula.execute(fixture.raw_inputs);
    for (const metric of result.outputs) {
      if (typeof metric.value === "number") {
        expect(Number.isFinite(metric.value)).toBe(true);
      }
    }
  });

  it("has correct redaction status", () => {
    const result = weldingHeatInputFormula.execute(fixture.raw_inputs);
    expect(result.redactionStatus).toBe(fixture.expected_redaction_status);
  });

  it("no public formula exposure in response", () => {
    const result = weldingHeatInputFormula.execute(fixture.raw_inputs);
    const serialized = JSON.stringify(result).toLowerCase();
    const forbidden = ["expression", "eval(", "new function"];
    for (const pattern of forbidden) {
      expect(serialized).not.toContain(pattern);
    }
  });

  it("source standard is documented in fixture", () => {
    expect(fixture.source_standard).toContain("ISO/TR 17671-1");
  });
});
