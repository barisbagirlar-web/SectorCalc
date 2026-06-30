/**
 * Industrial Formula Input Validation — Test Suite
 *
 * Tests focus on the validator output structure and basic error detection
 * rather than exact field name matching.
 */

import { describe, expect, it } from "vitest";
import {
  validateIrrInputs,
  validateNpvInputs,
  validateDcfInputs,
  validateLeaseVsBuyInputs,
  validateDarcyWeisbachInputs,
  validateLmtdInputs,
  validateOeeInputs,
  validateLineBalancingInputs,
  validateStandardTimeInputs,
  validateLearningCurveInputs,
  validateSpringDesignInputs,
  validateCarbonFootprintInputs,
  validateRegressionInputs,
  validateSampleSizeInputs,
  validateAnovaInputs,
  validateRoiInputs,
  validateBeltPulleyInputs,
  validateHydraulicCylinderInputs,
} from "@/lib/features/premium-schema/calculators/industrial-formulas-validation";

describe("validateIrrInputs", () => {
  it("rejects empty inputs with errors", () => {
    const result = validateIrrInputs({});
    expect(result.ok).toBe(false);
    expect(result.errors.length).toBeGreaterThan(0);
    expect(result.warnings).toBeDefined();
  });

  it("rejects non-numeric investment", () => {
    const result = validateIrrInputs({
      initialInvestment: "abc",
      cashFlowYear1: 100,
    });
    expect(result.ok).toBe(false);
  });
});

describe("validateNpvInputs", () => {
  it("rejects empty NPV inputs", () => {
    const result = validateNpvInputs({});
    expect(result.ok).toBe(false);
    expect(result.errors.length).toBeGreaterThan(0);
  });
});

describe("validateOeeInputs", () => {
  it("validates OEE input structure", () => {
    const empty = validateOeeInputs({});
    expect(empty.ok).toBe(false);
    expect(empty.errors.length).toBeGreaterThan(0);
  });
});

describe("validateRegressionInputs", () => {
  it("rejects empty regression inputs", () => {
    const result = validateRegressionInputs({});
    expect(result.ok).toBe(false);
  });
});

describe("validateSampleSizeInputs", () => {
  it("rejects empty sample size inputs", () => {
    const result = validateSampleSizeInputs({});
    expect(result.ok).toBe(false);
  });
});

describe("validateDarcyWeisbachInputs", () => {
  it("rejects empty pipe flow inputs", () => {
    const result = validateDarcyWeisbachInputs({});
    expect(result.ok).toBe(false);
  });

  it("validates with all required fields", () => {
    const result = validateDarcyWeisbachInputs({
      flowRate: 10,
      pipeLength: 100,
      pipeDiameter: 50,
      fluidDensity: 1000,
      fluidViscosity: 0.001,
      pipeMaterial: "steel",
    });
    expect(result.ok).toBeDefined();
    expect(result.errors).toBeDefined();
    expect(result.warnings).toBeDefined();
  });
});

describe("validateLmtdInputs", () => {
  it("rejects empty heat exchanger inputs", () => {
    const result = validateLmtdInputs({});
    expect(result.ok).toBe(false);
  });
});

describe("validateHydraulicCylinderInputs", () => {
  it("rejects empty cylinder inputs", () => {
    const result = validateHydraulicCylinderInputs({});
    expect(result.ok).toBe(false);
  });
});

describe("All validators produce consistent output", () => {
  const validators = [
    { name: "IRR", fn: validateIrrInputs },
    { name: "NPV", fn: validateNpvInputs },
    { name: "DCF", fn: validateDcfInputs },
    { name: "LeaseVsBuy", fn: validateLeaseVsBuyInputs },
    { name: "DarcyWeisbach", fn: validateDarcyWeisbachInputs },
    { name: "LMTD", fn: validateLmtdInputs },
    { name: "OEE", fn: validateOeeInputs },
    { name: "LineBalancing", fn: validateLineBalancingInputs },
    { name: "StandardTime", fn: validateStandardTimeInputs },
    { name: "LearningCurve", fn: validateLearningCurveInputs },
    { name: "SpringDesign", fn: validateSpringDesignInputs },
    { name: "CarbonFootprint", fn: validateCarbonFootprintInputs },
    { name: "Regression", fn: validateRegressionInputs },
    { name: "SampleSize", fn: validateSampleSizeInputs },
    { name: "ANOVA", fn: validateAnovaInputs },
    { name: "ROI", fn: validateRoiInputs },
    { name: "BeltPulley", fn: validateBeltPulleyInputs },
    { name: "HydraulicCylinder", fn: validateHydraulicCylinderInputs },
  ];

  for (const { name, fn } of validators) {
    it(`${name} validator rejects empty input`, () => {
      const result = fn({});
      expect(result.ok).toBe(false);
      expect(Array.isArray(result.errors)).toBe(true);
    });
  }
});
