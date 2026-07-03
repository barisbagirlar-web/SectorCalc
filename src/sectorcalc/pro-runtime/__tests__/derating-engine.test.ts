// Test: Derating engine

import { describe, it, expect } from "vitest";
import { applyDerating, validateDeratingContract } from "../derating-engine";
import type { DeratingRule } from "../derating-engine";

describe("Derating engine", () => {
  it("returns empty result for empty rules", () => {
    const result = applyDerating([], { x: 10 });
    expect(result.applied_rules).toEqual([]);
    expect(result.warnings).toEqual([]);
  });

  it("returns empty result for undefined rules", () => {
    const result = applyDerating(undefined, { x: 10 });
    expect(result.applied_rules).toEqual([]);
  });

  it("processes derating rules without error", () => {
    const rules: DeratingRule[] = [{
      id: "temp_derate",
      description: "Temperature derating above 40C",
      trigger_inputs: ["ambient_temp"],
      condition: "ambient_temp > 40",
      derating_factor: 0.8,
      affected_output: "max_power",
    }];
    const result = applyDerating(rules, { ambient_temp: 50 });
    expect(result.applied_rules.length).toBe(1);
    expect(result.applied_rules[0].rule_id).toBe("temp_derate");
    expect(result.applied_rules[0].applied).toBe(false); // stub
  });

  it("validateDeratingContract passes valid contract", () => {
    const errors = validateDeratingContract({
      rules: [{
        id: "test", description: "Test", trigger_inputs: ["x"],
        condition: "x > 5", derating_factor: 0.9, affected_output: "y",
      }],
    });
    expect(errors).toEqual([]);
  });

  it("validateDeratingContract reports missing id", () => {
    const errors = validateDeratingContract({
      rules: [{
        id: "", description: "Test", trigger_inputs: ["x"],
        condition: "x > 5", derating_factor: 0.9, affected_output: "y",
      }],
    });
    expect(errors.length).toBeGreaterThan(0);
  });

  it("validateDeratingContract reports missing trigger_inputs", () => {
    const errors = validateDeratingContract({
      rules: [{
        id: "test", description: "Test", trigger_inputs: [],
        condition: "x > 5", derating_factor: 0.9, affected_output: "y",
      }],
    });
    expect(errors.length).toBeGreaterThan(0);
  });

  it("validateDeratingContract reports invalid derating_factor", () => {
    const errors = validateDeratingContract({
      rules: [{
        id: "test", description: "Test", trigger_inputs: ["x"],
        condition: "x > 5", derating_factor: -1, affected_output: "y",
      }],
    });
    expect(errors.length).toBeGreaterThan(0);
  });
});
