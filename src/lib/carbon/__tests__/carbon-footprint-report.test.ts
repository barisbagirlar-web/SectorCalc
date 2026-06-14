import { describe, expect, it } from "vitest";
import {
  calculateCarbonFootprintReport,
  DEFAULT_CARBON_EMISSION_FACTOR_MAP,
  isCarbonFootprintReportTool,
  mapCarbonToolInputsToReport,
  mergeCarbonEmissionInputs,
} from "@/lib/carbon/carbon-footprint-report";

describe("carbon footprint report", () => {
  it("calculates scope totals and CBAM exposure", () => {
    const results = calculateCarbonFootprintReport(
      mergeCarbonEmissionInputs({
        electricityKWh: 1000,
        dieselLitres: 100,
        freightRoadTkm: 50,
      }),
      { cbamCertificatePriceEurPerTon: 80, cbamExposureRatio: 0.7 },
    );

    expect(results.scope1).toBeGreaterThan(0);
    expect(results.scope2).toBeGreaterThan(0);
    expect(results.scope3).toBeGreaterThan(0);
    expect(results.total).toBe(results.scope1 + results.scope2 + results.scope3);
    expect(results.cbamExposure).toBeCloseTo(results.total * 0.7, 5);
    expect(results.cbamCostEur).toBeCloseTo((results.cbamExposure / 1000) * 80, 5);
  });

  it("accepts custom emission factor map", () => {
    const inputs = mergeCarbonEmissionInputs({ electricityKWh: 1000 });
    const defaultResults = calculateCarbonFootprintReport(inputs);
    const customResults = calculateCarbonFootprintReport(inputs, {
      emissionFactors: {
        ...DEFAULT_CARBON_EMISSION_FACTOR_MAP,
        electricity: 1,
      },
    });

    expect(customResults.scope2).toBeGreaterThan(defaultResults.scope2);
    expect(customResults.scope2).toBe(1000);
  });

  it("detects carbon and cbam tool slugs", () => {
    expect(isCarbonFootprintReportTool("carbon-footprint-quick")).toBe(true);
    expect(isCarbonFootprintReportTool("cbam-exposure-quick-check")).toBe(true);
    expect(isCarbonFootprintReportTool("forklift-transpalet-kullanim-maliyeti")).toBe(false);
  });

  it("maps carbon-footprint-quick activity inputs", () => {
    const mapped = mapCarbonToolInputsToReport("carbon-footprint-quick", {
      activityType: "electricity",
      quantity: 5000,
    });

    expect(mapped.seed.electricityKWh).toBe(5000);
  });
});
