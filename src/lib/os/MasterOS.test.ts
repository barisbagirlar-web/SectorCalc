import { describe, expect, test } from "vitest";
import { MasterOS, runIndustrialAudit } from "@/lib/os/core/master-os";
import { Formulas } from "@/lib/os/core/formulas";

describe("MasterOS runIndustrialAudit", () => {
  test("throws on unknown sector", () => {
    expect(() =>
      runIndustrialAudit("invalid_sector" as "cnc", {
        target: 100,
        actual: 100,
        cost: 50,
      }),
    ).toThrow("SECTOR_NOT_FOUND");
  });

  test("throws on invalid inputs", () => {
    expect(() =>
      runIndustrialAudit("cnc", {
        target: Number.NaN,
        actual: 100,
        cost: 50,
      }),
    ).toThrow("INVALID_INPUTS");
  });

  test("returns CRITICAL when efficiency score is below threshold", () => {
    const result = runIndustrialAudit("cnc", {
      target: 100,
      actual: 125,
      cost: 50,
    });

    expect(result.status).toBe("CRITICAL");
    expect(result.metric).toBeLessThan(80);
    expect(result.prescription.code).toBe("IMMEDIATE_CALIBRATION");
    expect(result.benchmark.sector).toBe("cnc");
    expect(result.intelligence.hiddenLoss).toBeGreaterThan(0);
    expect(result.features.length).toBeGreaterThan(0);
  });

  test("returns OPTIMAL within tolerance band", () => {
    const result = runIndustrialAudit("cnc", {
      target: 100,
      actual: 102,
      cost: 50,
    });

    expect(result.status).toBe("OPTIMAL");
    expect(result.metric).toBeGreaterThan(80);
    expect(result.prescription.code).toBe("MONITOR_OPTIMAL");
  });

  test("Formulas map covers all registry sectors", () => {
    expect(Object.keys(Formulas)).toHaveLength(27);
    expect(Formulas.logistics({ target: 100, actual: 100, cost: 10 })).toBe(100);
  });

  test("MasterOS object exposes dispatcher", () => {
    expect(MasterOS.OPTIMAL_SCORE_THRESHOLD).toBe(80);
    expect(MasterOS.runIndustrialAudit).toBe(runIndustrialAudit);
  });
});
