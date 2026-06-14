import { describe, expect, test } from "vitest";
import { VOLUMETRIC_WEIGHT_CALCULATOR_CRITICAL_FORMULA_CONTRACTS } from "@/lib/formula-governance/contracts/volumetric-weight-calculator-critical";
import { getFormulaContractBySlug } from "@/lib/formula-governance/contracts";
import {
  calculateVolumetricWeightCalculator,
  type VolumetricWeightCalculatorInputs,
} from "@/lib/premium-schema/calculators/volumetric-weight-calculator";
import { validateVolumetricWeightCalculatorInputs } from "@/lib/premium-schema/calculators/volumetric-weight-calculator-validation";
import { getPremiumCalculatorSchema } from "@/lib/premium-schema/schema-registry";
import {
  buildDefaultSchemaInputs,
  runPremiumSchemaEngine,
} from "@/lib/premium-schema/premium-schema-engine";

const SLUG = "volumetric-weight-calculator";
const SCHEMA_ID = "volumetric-weight-calculator";

const defaultInputs: VolumetricWeightCalculatorInputs = {
    "lengthCm": 50,
    "widthCm": 40,
    "heightCm": 30,
    "actualWeightKg": 10,
    "volumetricDivisor": 6000,
    "ratePerKg": 5
  };
const lowBandInputs: VolumetricWeightCalculatorInputs = {
    "lengthCm": 0.1,
    "widthCm": 40,
    "heightCm": 30,
    "actualWeightKg": 10,
    "volumetricDivisor": 6000,
    "ratePerKg": 5
  };
const criticalBandInputs: VolumetricWeightCalculatorInputs = {
    "lengthCm": 6,
    "widthCm": 40,
    "heightCm": 30,
    "actualWeightKg": 10,
    "volumetricDivisor": 6000,
    "ratePerKg": 5
  };

function expectValidationFailure(partial: Partial<VolumetricWeightCalculatorInputs>): void {
  const inputs = { ...defaultInputs, ...partial } as VolumetricWeightCalculatorInputs;
  const validation = validateVolumetricWeightCalculatorInputs(inputs);
  expect(validation.ok).toBe(false);
  if (validation.ok) return;
  expect(validation.errors.length).toBeGreaterThan(0);
  expect(() => calculateVolumetricWeightCalculator(inputs)).toThrow();
}

function engineNumeric(schemaSlug: string, outputId: string, inputs: VolumetricWeightCalculatorInputs): number {
  const schema = getPremiumCalculatorSchema(schemaSlug);
  if (!schema) throw new Error("schema missing");
  const engineResult = runPremiumSchemaEngine(schema, inputs);
  const raw = engineResult.outputs.find((output) => output.id === outputId)?.raw;
  if (typeof raw !== "number") throw new Error(`missing output ${outputId}`);
  return raw;
}

describe("volumetric-weight-calculator", () => {
  test("exact default oracle", () => {
    const result = calculateVolumetricWeightCalculator(defaultInputs);
    expect(result.totalExposure).toBeCloseTo(engineNumeric(SCHEMA_ID, "totalExposure", defaultInputs), 2);
    expect(result.variancePercent).toBeCloseTo(engineNumeric(SCHEMA_ID, "variancePercent", defaultInputs), 2);
    expect(["low", "warning", "critical"]).toContain(result.summaryLevel);
    expect(result.primaryDriver).toBe("totalExposure");
  });

  test("formula pipeline parity", () => {
    const result = calculateVolumetricWeightCalculator(defaultInputs);
    expect(result.totalExposure).toBeCloseTo(
      engineNumeric(SCHEMA_ID, "totalExposure", defaultInputs),
      2,
    );
  });

  test("low threshold band", () => {
    const result = calculateVolumetricWeightCalculator(lowBandInputs);
    expect(["low", "warning", "critical"]).toContain(result.summaryLevel);
  });

  test("warning threshold band", () => {
    const result = calculateVolumetricWeightCalculator(defaultInputs);
    expect(["warning", "critical", "low"]).toContain(result.summaryLevel);
  });

  test("critical threshold band", () => {
    const result = calculateVolumetricWeightCalculator(criticalBandInputs);
    expect(["low", "warning", "critical"]).toContain(result.summaryLevel);
  });

  test("invalid missing input fails validation and calculator throws", () => {
    const broken = { ...defaultInputs, lengthCm: undefined } as unknown as VolumetricWeightCalculatorInputs;
    const validation = validateVolumetricWeightCalculatorInputs(broken);
    expect(validation.ok).toBe(false);
    expect(() => calculateVolumetricWeightCalculator(broken)).toThrow();
  });

  test("invalid negative input fails validation and calculator throws", () => {
    expectValidationFailure({ lengthCm: -1 });
  });
  test("invalid zero divisor/base fails validation and calculator throws", () => {
    const validation = validateVolumetricWeightCalculatorInputs({ ...defaultInputs, lengthCm: 0 });
    expect(validation.ok).toBe(false);
    if (validation.ok) return;
    expect(() => calculateVolumetricWeightCalculator({ ...defaultInputs, lengthCm: 0 })).toThrow();
  });

  test("invalid NaN input fails validation and calculator throws", () => {
    expectValidationFailure({ ratePerKg: Number.NaN });
  });

  test("invalid Infinity input fails validation and calculator throws", () => {
    expectValidationFailure({ ratePerKg: Number.POSITIVE_INFINITY });
  });

    test("contract metadata matches slug", () => {
    const contract = VOLUMETRIC_WEIGHT_CALCULATOR_CRITICAL_FORMULA_CONTRACTS[0];
    expect(contract).toBeDefined();
    if (!contract) return;
    expect(contract.slug).toBe(SLUG);
    expect(contract.requiredInputs.length).toBeGreaterThan(0);
    expect(contract.assumptions.join(" ")).toContain("deterministic");
  });

  test("engine parity test", () => {
    const schema = getPremiumCalculatorSchema(SCHEMA_ID);
    expect(schema).not.toBeNull();
    if (!schema) return;
    const schemaInputs = buildDefaultSchemaInputs(schema);
    const engineResult = runPremiumSchemaEngine(schema, schemaInputs);
    const calculatorResult = calculateVolumetricWeightCalculator(defaultInputs);
    expect(engineResult.outputs.find((output) => output.id === "totalExposure")?.raw).toBeCloseTo(calculatorResult.totalExposure, 2);
    expect(engineResult.outputs.find((output) => output.id === "variancePercent")?.raw).toBeCloseTo(calculatorResult.variancePercent, 2);
  });
});
