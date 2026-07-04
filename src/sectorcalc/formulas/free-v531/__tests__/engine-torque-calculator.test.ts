import { describe, it, expect } from "vitest";
import { calculate, toolKey, formulaVersion } from "../engine-torque-calculator.formula";

describe("Engine Torque Calculator Formula", () => {
  it("exports toolKey and formulaVersion", () => {
    expect(toolKey).toBe("engine-torque-calculator");
    expect(formulaVersion).toBe("1.0.0");
  });

  it("calculates torque correctly: P=100kW, N=3000rpm", () => {
    const result = calculate({ enginePowerKw: 100, engineSpeedRpm: 3000 });
    expect(result.status).toBe("OK");
    expect(result.outputs.engine_torque).toBeCloseTo(318.33, 1);
    expect(result.outputKeys).toContain("engine_torque");
  });

  it("calculates torque correctly: P=200kW, N=4000rpm", () => {
    const result = calculate({ enginePowerKw: 200, engineSpeedRpm: 4000 });
    expect(result.status).toBe("OK");
    expect(result.outputs.engine_torque).toBeCloseTo(477.5, 1);
  });

  it("calculates torque correctly: P=50kW, N=1500rpm", () => {
    const result = calculate({ enginePowerKw: 50, engineSpeedRpm: 1500 });
    expect(result.status).toBe("OK");
    expect(result.outputs.engine_torque).toBeCloseTo(318.33, 1);
  });

  it("returns REVIEW status for missing/invalid inputs", () => {
    const result = calculate({} as Record<string, number>);
    expect(result.status).toBe("REVIEW");
    expect(result.warnings.length).toBeGreaterThan(0);
  });

  it("returns REVIEW for zero power", () => {
    const result = calculate({ enginePowerKw: 0, engineSpeedRpm: 3000 });
    expect(result.status).toBe("REVIEW");
    expect(result.warnings.some((w) => w.includes("positive"))).toBe(true);
  });

  it("returns REVIEW for negative power", () => {
    const result = calculate({ enginePowerKw: -50, engineSpeedRpm: 3000 });
    expect(result.status).toBe("REVIEW");
  });

  it("returns REVIEW for zero speed", () => {
    const result = calculate({ enginePowerKw: 100, engineSpeedRpm: 0 });
    expect(result.status).toBe("REVIEW");
    expect(result.warnings.some((w) => w.includes("positive"))).toBe(true);
  });

  it("handles non-finite inputs gracefully", () => {
    const result = calculate({ enginePowerKw: NaN, engineSpeedRpm: 3000 });
    expect(result.status).toBe("REVIEW");
  });

  it("produces non-negative torque for valid inputs", () => {
    const result = calculate({ enginePowerKw: 75, engineSpeedRpm: 2500 });
    expect(result.outputs.engine_torque).toBeGreaterThan(0);
  });

  it("sets redaction_status to PUBLIC_SAFE_REDACTED", () => {
    const result = calculate({ enginePowerKw: 100, engineSpeedRpm: 3000 });
    expect(result.redaction_status).toBe("PUBLIC_SAFE_REDACTED");
  });

  it("does not produce NaN for edge case with tiny speed", () => {
    const result = calculate({ enginePowerKw: 1, engineSpeedRpm: 0.001 });
    expect(Number.isFinite(result.outputs.engine_torque)).toBe(true);
  });
});
