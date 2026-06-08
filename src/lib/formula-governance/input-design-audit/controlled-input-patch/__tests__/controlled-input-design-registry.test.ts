/**
 * Phase 5H-F — controlled input design registry tests.
 */

import { describe, expect, test } from "vitest";
import {
  CONTROLLED_INPUT_DESIGN_PATCH_REGISTRY,
  FIRST_CONTROLLED_INPUT_DESIGN_PATCH_SLUGS,
  getControlledInputDesignPatch,
} from "@/lib/formula-governance/input-design-audit/controlled-input-patch/controlled-input-design-registry";

describe("controlled input design registry", () => {
  test("target slugs are registered", () => {
    for (const slug of FIRST_CONTROLLED_INPUT_DESIGN_PATCH_SLUGS) {
      expect(getControlledInputDesignPatch(slug)).toBeDefined();
    }
    expect(Object.keys(CONTROLLED_INPUT_DESIGN_PATCH_REGISTRY)).toHaveLength(3);
  });

  test("every patch declares productionImpact none", () => {
    for (const slug of FIRST_CONTROLLED_INPUT_DESIGN_PATCH_SLUGS) {
      const patch = getControlledInputDesignPatch(slug)!;
      expect(patch.productionImpact).toBe("none");
      expect(patch.oracleImpact).toBe("none");
      expect(patch.patchType).toBe("input_design_only");
    }
  });

  test("required optional advanced derived classifications are populated", () => {
    for (const slug of FIRST_CONTROLLED_INPUT_DESIGN_PATCH_SLUGS) {
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
});
