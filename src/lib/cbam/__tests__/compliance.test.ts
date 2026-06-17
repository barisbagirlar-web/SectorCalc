import { describe, expect, it } from "vitest";
import { calculateCBAM, resolveCarbonEmissionsKg } from "@/lib/cbam/compliance";

describe("cbam compliance", () => {
  it("calculates adjustment from kg emissions", () => {
    const report = calculateCBAM(2000, "DE");
    expect(report.productCarbonFootprint).toBe(2000);
    expect(report.cbamAdjustment).toBe(170);
    expect(report.complianceStatus).toBe("warning");
  });

  it("marks low exposure as compliant", () => {
    const report = calculateCBAM(500, "DE");
    expect(report.complianceStatus).toBe("compliant");
    expect(report.recommendations).toEqual([]);
  });

  it("resolves carbon totals from result keys", () => {
    expect(resolveCarbonEmissionsKg({ totalCO2: 1200 })).toBe(1200);
    expect(
      resolveCarbonEmissionsKg({
        breakdown: { electricityCO2: 400, fuelCO2: 600 },
      }),
    ).toBe(1000);
  });
});
