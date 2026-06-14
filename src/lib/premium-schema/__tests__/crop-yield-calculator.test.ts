import { describe, expect, test } from "vitest";
import { CROP_YIELD_CALCULATOR_CRITICAL_FORMULA_CONTRACTS } from "@/lib/formula-governance/contracts/crop-yield-calculator-critical";
import { getFormulaContractBySlug } from "@/lib/formula-governance/contracts";
import {
  calculateCropYieldCalculator,
  type CropYieldCalculatorInputs,
} from "@/lib/premium-schema/calculators/crop-yield-calculator";
import { validateCropYieldCalculatorInputs } from "@/lib/premium-schema/calculators/crop-yield-calculator-validation";
import { getPremiumCalculatorSchema } from "@/lib/premium-schema/schema-registry";
import {
  buildDefaultSchemaInputs,
  runPremiumSchemaEngine,
} from "@/lib/premium-schema/premium-schema-engine";

const SLUG = "crop-yield-calculator";
const SCHEMA_ID = "crop-yield-calculator";

const defaultInputs: CropYieldCalculatorInputs = {
    "inputQuantity": 1000,
    "outputQuantity": 800,
    "yieldPercent": 80,
    "rawMaterialCost": 0.5,
    "laborCost": 100,
    "processingCost": 50
  };
const lowBandInputs: CropYieldCalculatorInputs = {
    "inputQuantity": 0.1,
    "outputQuantity": 800,
    "yieldPercent": 80,
    "rawMaterialCost": 0.5,
    "laborCost": 100,
    "processingCost": 50
  };
const criticalBandInputs: CropYieldCalculatorInputs = {
    "inputQuantity": 6,
    "outputQuantity": 800,
    "yieldPercent": 80,
    "rawMaterialCost": 0.5,
    "laborCost": 100,
    "processingCost": 50
  };

function expectValidationFailure(partial: Partial<CropYieldCalculatorInputs>): void {
  const inputs = { ...defaultInputs, ...partial } as CropYieldCalculatorInputs;
  const validation = validateCropYieldCalculatorInputs(inputs);
  expect(validation.ok).toBe(false);
  if (validation.ok) return;
  expect(validation.errors.length).toBeGreaterThan(0);
  expect(() => calculateCropYieldCalculator(inputs)).toThrow();
}

function engineNumeric(schemaSlug: string, outputId: string, inputs: CropYieldCalculatorInputs): number {
  const schema = getPremiumCalculatorSchema(schemaSlug);
  if (!schema) throw new Error("schema missing");
  const engineResult = runPremiumSchemaEngine(schema, inputs);
  const raw = engineResult.outputs.find((output) => output.id === outputId)?.raw;
  if (typeof raw !== "number") throw new Error(`missing output ${outputId}`);
  return raw;
}

describe("crop-yield-calculator", () => {
  test("exact default oracle", () => {
    const result = calculateCropYieldCalculator(defaultInputs);
    expect(result.totalExposure).toBeCloseTo(engineNumeric(SCHEMA_ID, "totalExposure", defaultInputs), 2);
    expect(result.variancePercent).toBeCloseTo(engineNumeric(SCHEMA_ID, "variancePercent", defaultInputs), 2);
    expect(["low", "warning", "critical"]).toContain(result.summaryLevel);
    expect(result.primaryDriver).toBe("totalExposure");
  });

  test("formula pipeline parity", () => {
    const result = calculateCropYieldCalculator(defaultInputs);
    expect(result.totalExposure).toBeCloseTo(
      engineNumeric(SCHEMA_ID, "totalExposure", defaultInputs),
      2,
    );
  });

  test("low threshold band", () => {
    const result = calculateCropYieldCalculator(lowBandInputs);
    expect(["low", "warning", "critical"]).toContain(result.summaryLevel);
  });

  test("warning threshold band", () => {
    const result = calculateCropYieldCalculator(defaultInputs);
    expect(["warning", "critical", "low"]).toContain(result.summaryLevel);
  });

  test("critical threshold band", () => {
    const result = calculateCropYieldCalculator(criticalBandInputs);
    expect(["low", "warning", "critical"]).toContain(result.summaryLevel);
  });

  test("invalid missing input fails validation and calculator throws", () => {
    const broken = { ...defaultInputs, inputQuantity: undefined } as unknown as CropYieldCalculatorInputs;
    const validation = validateCropYieldCalculatorInputs(broken);
    expect(validation.ok).toBe(false);
    expect(() => calculateCropYieldCalculator(broken)).toThrow();
  });

  test("invalid negative input fails validation and calculator throws", () => {
    expectValidationFailure({ inputQuantity: -1 });
  });
  test("invalid zero divisor/base fails validation and calculator throws", () => {
    const validation = validateCropYieldCalculatorInputs({ ...defaultInputs, inputQuantity: 0 });
    expect(validation.ok).toBe(false);
    if (validation.ok) return;
    expect(() => calculateCropYieldCalculator({ ...defaultInputs, inputQuantity: 0 })).toThrow();
  });

  test("invalid NaN input fails validation and calculator throws", () => {
    expectValidationFailure({ processingCost: Number.NaN });
  });

  test("invalid Infinity input fails validation and calculator throws", () => {
    expectValidationFailure({ processingCost: Number.POSITIVE_INFINITY });
  });

    test("contract metadata matches slug", () => {
    const contract = CROP_YIELD_CALCULATOR_CRITICAL_FORMULA_CONTRACTS[0];
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
    const calculatorResult = calculateCropYieldCalculator(defaultInputs);
    expect(engineResult.outputs.find((output) => output.id === "totalExposure")?.raw).toBeCloseTo(calculatorResult.totalExposure, 2);
    expect(engineResult.outputs.find((output) => output.id === "variancePercent")?.raw).toBeCloseTo(calculatorResult.variancePercent, 2);
  });
});
