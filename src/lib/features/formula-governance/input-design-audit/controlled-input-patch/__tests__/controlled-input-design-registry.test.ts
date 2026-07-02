/**
 * Phase 5H-F - controlled input design registry tests.
 */

import { describe, expect, test } from "vitest";
import {
  ALL_CONTROLLED_INPUT_DESIGN_PATCH_SLUGS,
  CONTROLLED_INPUT_DESIGN_PATCH_REGISTRY,
  FIRST_CONTROLLED_INPUT_DESIGN_PATCH_SLUGS,
  SECOND_CONTROLLED_INPUT_DESIGN_PATCH_SLUGS,
  THIRD_CONTROLLED_INPUT_DESIGN_PATCH_SLUGS,
  FOURTH_CONTROLLED_INPUT_DESIGN_PATCH_SLUGS,
  FIFTH_CONTROLLED_INPUT_DESIGN_PATCH_SLUGS,
  getControlledInputDesignPatch,
} from "@/lib/features/formula-governance/input-design-audit/controlled-input-patch/controlled-input-design-registry";

describe("controlled input design registry", () => {
  test("target slugs are registered", () => {
    for (const slug of ALL_CONTROLLED_INPUT_DESIGN_PATCH_SLUGS) {
      expect(getControlledInputDesignPatch(slug)).toBeDefined();
    }
    expect(Object.keys(CONTROLLED_INPUT_DESIGN_PATCH_REGISTRY)).toHaveLength(15);
  });

  test("every patch declares productionImpact none", () => {
    for (const slug of ALL_CONTROLLED_INPUT_DESIGN_PATCH_SLUGS) {
      const patch = getControlledInputDesignPatch(slug)!;
      expect(patch.productionImpact).toBe("none");
      expect(patch.oracleImpact).toBe("none");
      expect(patch.patchType).toBe("input_design_only");
    }
  });

  test("required optional advanced derived classifications are populated", () => {
    for (const slug of ALL_CONTROLLED_INPUT_DESIGN_PATCH_SLUGS) {
      const patch = getControlledInputDesignPatch(slug)!;
      expect(patch.requiredInputs.length).toBeGreaterThan(0);
      expect(patch.optionalInputs.length).toBeGreaterThan(0);
      expect(patch.advancedInputs.length).toBeGreaterThan(0);
      expect(patch.derivedInputs.length).toBeGreaterThan(0);
    }
  });

  test("3d-print default assumptions are explicit", () => {
    const patch = getControlledInputDesignPatch("3d-print-cost-check")!;
    expect(patch.defaultAssumptions.some((line) => line.includes("Failed print rate"))).toBe(
      true,
    );
    expect(patch.defaultAssumptions.some((line) => line.includes("postProcessHours"))).toBe(true);
    expect(patch.requiredInputs).toContain("materialCost");
    expect(patch.requiredInputs).toContain("printHours");
    expect(patch.requiredInputs).toContain("machineRate");
  });

  test("auto-shop advanced risk inputs are classified", () => {
    const patch = getControlledInputDesignPatch("auto-shop-margin-leak-detector")!;
    expect(patch.advancedInputs).toContain("comebackProbability");
    expect(patch.advancedInputs).toContain("technicianEfficiency");
    expect(patch.advancedInputs).toContain("partsAvailabilityRisk");
    expect(patch.defaultAssumptions.some((line) => line.includes("Shop supplies"))).toBe(true);
    expect(patch.derivedInputs).toContain("trueJobProfit");
    expect(patch.derivedInputs).toContain("marginLeak");
  });

  test("cabinet finish hardware and waste inputs are classified", () => {
    const patch = getControlledInputDesignPatch("cabinet-cost-estimator")!;
    expect(patch.optionalInputs).toContain("hardwareCost");
    expect(patch.optionalInputs).toContain("finishCost");
    expect(patch.optionalInputs).toContain("wastePercent");
    expect(patch.advancedInputs).toContain("finishGrade");
    expect(patch.advancedInputs).toContain("fieldMeasurementRisk");
    expect(patch.defaultAssumptions.some((line) => line.includes("12% waste"))).toBe(true);
    expect(patch.derivedInputs).toContain("wasteAdjustedHours");
  });

  test("second batch slugs are registered", () => {
    for (const slug of SECOND_CONTROLLED_INPUT_DESIGN_PATCH_SLUGS) {
      expect(getControlledInputDesignPatch(slug)).toBeDefined();
    }
  });

  test("electrical labor estimator NEC and permit defaults are explicit", () => {
    const patch = getControlledInputDesignPatch("electrical-labor-estimator")!;
    expect(patch.requiredInputs).toEqual(["materialCost", "laborHours", "laborRate"]);
    expect(patch.optionalInputs).toContain("permitCost");
    expect(patch.advancedInputs).toContain("codeJurisdictionRisk");
    expect(patch.defaultAssumptions.some((line) => line.includes("NEC"))).toBe(true);
    expect(patch.derivedInputs).toContain("laborMaterialRatio");
  });

  test("hvac project margin guard callback and seasonal defaults are explicit", () => {
    const patch = getControlledInputDesignPatch("hvac-project-margin-guard")!;
    expect(patch.requiredInputs).toContain("equipmentCost");
    expect(patch.requiredInputs).toContain("callbackRiskPercent");
    expect(patch.advancedInputs).toContain("manualJLoadVariance");
    expect(patch.defaultAssumptions.some((line) => line.includes("seasonal labor"))).toBe(true);
    expect(patch.derivedInputs).toContain("minimumSafePrice");
  });

  test("millwork bid risk analyzer waste and finish inputs are classified", () => {
    const patch = getControlledInputDesignPatch("millwork-bid-risk-analyzer")!;
    expect(patch.requiredInputs).toContain("wasteRatePercent");
    expect(patch.requiredInputs).toContain("finishingCost");
    expect(patch.optionalInputs).toContain("hardwareCost");
    expect(patch.advancedInputs).toContain("finishGrade");
    expect(patch.defaultAssumptions.some((line) => line.includes("Waste rate"))).toBe(true);
    expect(patch.derivedInputs).toContain("minimumSafePrice");
  });

  test("third batch slugs are registered", () => {
    for (const slug of THIRD_CONTROLLED_INPUT_DESIGN_PATCH_SLUGS) {
      expect(getControlledInputDesignPatch(slug)).toBeDefined();
    }
  });

  test("panel shop margin verdict inspection and permit defaults are explicit", () => {
    const patch = getControlledInputDesignPatch("panel-shop-margin-verdict")!;
    expect(patch.requiredInputs).toContain("testingHours");
    expect(patch.requiredInputs).toContain("inspectionRiskPercent");
    expect(patch.advancedInputs).toContain("panelComplexity");
    expect(patch.defaultAssumptions.some((line) => line.includes("4%"))).toBe(true);
    expect(patch.derivedInputs).toContain("minimumSafePrice");
  });

  test("plumbing job margin verdict fixture and callback defaults are explicit", () => {
    const patch = getControlledInputDesignPatch("plumbing-job-margin-verdict")!;
    expect(patch.requiredInputs).toContain("fixtureCount");
    expect(patch.requiredInputs).toContain("callbackRiskPercent");
    expect(patch.advancedInputs).toContain("concealedDamageRisk");
    expect(patch.defaultAssumptions.some((line) => line.includes("$25 per fixture"))).toBe(true);
    expect(patch.derivedInputs).toContain("minimumSafePrice");
  });

  test("print job cost check design and spoilage inputs are classified", () => {
    const patch = getControlledInputDesignPatch("print-job-cost-check")!;
    expect(patch.requiredInputs).toEqual(["materialCost", "designHours", "laborRate"]);
    expect(patch.optionalInputs).toContain("spoilageRate");
    expect(patch.advancedInputs).toContain("colorCalibrationRisk");
    expect(patch.defaultAssumptions.some((line) => line.includes("SGIA"))).toBe(true);
    expect(patch.derivedInputs).toContain("designMaterialRatio");
  });

  test("fourth batch slugs are registered", () => {
    for (const slug of FOURTH_CONTROLLED_INPUT_DESIGN_PATCH_SLUGS) {
      expect(getControlledInputDesignPatch(slug)).toBeDefined();
    }
  });

  test("repair time vs price check shop rate and diagnostic defaults are explicit", () => {
    const patch = getControlledInputDesignPatch("repair-time-vs-price-check")!;
    expect(patch.requiredInputs).toEqual(["quotedPrice", "repairHours", "partsCost"]);
    expect(patch.optionalInputs).toContain("shopRate");
    expect(patch.advancedInputs).toContain("technicianEfficiency");
    expect(patch.defaultAssumptions.some((line) => line.includes("$80/hr"))).toBe(true);
    expect(patch.derivedInputs).toContain("burdenedCost");
  });

  test("sheet metal quote risk tool scrap and bend defaults are explicit", () => {
    const patch = getControlledInputDesignPatch("sheet-metal-quote-risk-tool")!;
    expect(patch.requiredInputs).toContain("scrapRatePercent");
    expect(patch.requiredInputs).toContain("bendCount");
    expect(patch.advancedInputs).toContain("nestScrapVolatility");
    expect(patch.defaultAssumptions.some((line) => line.includes("2 minutes per bend"))).toBe(true);
    expect(patch.derivedInputs).toContain("minimumSafePrice");
  });

  test("signage bid safe price tool reprint and RIP defaults are explicit", () => {
    const patch = getControlledInputDesignPatch("signage-bid-safe-price-tool")!;
    expect(patch.requiredInputs).toContain("reprintRiskPercent");
    expect(patch.requiredInputs).toContain("inkCost");
    expect(patch.advancedInputs).toContain("wideFormatSpoilage");
    expect(patch.defaultAssumptions.some((line) => line.includes("4%"))).toBe(true);
    expect(patch.derivedInputs).toContain("minimumSafePrice");
  });

  test("fifth batch slugs are registered", () => {
    for (const slug of FIFTH_CONTROLLED_INPUT_DESIGN_PATCH_SLUGS) {
      expect(getControlledInputDesignPatch(slug)).toBeDefined();
    }
  });

  test("welding bid risk analyzer fit-up and rework defaults are explicit", () => {
    const patch = getControlledInputDesignPatch("welding-bid-risk-analyzer")!;
    expect(patch.requiredInputs).toContain("fitUpHours");
    expect(patch.requiredInputs).toContain("reworkRiskPercent");
    expect(patch.advancedInputs).toContain("weldProcedureComplexity");
    expect(patch.defaultAssumptions.some((line) => line.includes("fit-up"))).toBe(true);
    expect(patch.derivedInputs).toContain("minimumSafePrice");
  });

  test("landscaping contract profit tool fuel and wear inputs are classified", () => {
    const patch = getControlledInputDesignPatch("landscaping-contract-profit-tool")!;
    expect(patch.requiredInputs).toContain("fuelCostPerVisit");
    expect(patch.requiredInputs).toContain("equipmentWearCost");
    expect(patch.advancedInputs).toContain("routeDensityRisk");
    expect(patch.defaultAssumptions.some((line) => line.includes("8%"))).toBe(true);
    expect(patch.derivedInputs).toContain("minimumSafePrice");
  });

  test("lawn care cost check route and monthly hours defaults are explicit", () => {
    const patch = getControlledInputDesignPatch("lawn-care-cost-check")!;
    expect(patch.requiredInputs).toEqual(["crewHoursPerVisit", "visitsPerMonth", "laborRate"]);
    expect(patch.optionalInputs).toContain("fuelCostPerVisit");
    expect(patch.advancedInputs).toContain("routeDensityRisk");
    expect(patch.defaultAssumptions.some((line) => line.includes("monthlyCrewHours"))).toBe(true);
    expect(patch.derivedInputs).toContain("monthlyCrewHours");
  });
});
