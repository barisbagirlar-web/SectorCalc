import { describe, expect, test } from "vitest";
import { CROP_YIELD_LOSS_ANALYZER_CRITICAL_FORMULA_CONTRACTS } from "@/lib/formula-governance/contracts/crop-yield-loss-analyzer-critical";
import { getFormulaContractBySlug } from "@/lib/formula-governance/contracts";
import {
  calculateCropYieldLossAnalyzer,
  type CropYieldLossAnalyzerInputs,
} from "@/lib/premium-schema/calculators/crop-yield-loss-analyzer";
import { validateCropYieldLossAnalyzerInputs } from "@/lib/premium-schema/calculators/crop-yield-loss-analyzer-validation";
import { getPremiumCalculatorSchema } from "@/lib/premium-schema/schema-registry";
import {
  buildDefaultSchemaInputs,
  runPremiumSchemaEngine,
} from "@/lib/premium-schema/premium-schema-engine";

const SLUG = "crop-yield-loss-analyzer";

const defaultInputs: CropYieldLossAnalyzerInputs = {
    "areaHa": 18,
    "expectedYieldTonPerHa": 7,
    "actualYieldTonPerHa": 6.2,
    "pricePerTon": 230,
    "irrigationCost": 3400
  };
const lowBandInputs: CropYieldLossAnalyzerInputs = {
    "areaHa": 0.18,
    "expectedYieldTonPerHa": 7,
    "actualYieldTonPerHa": 6.2,
    "pricePerTon": 230,
    "irrigationCost": 3400
  };
const criticalBandInputs: CropYieldLossAnalyzerInputs = {
    "areaHa": 18000,
    "expectedYieldTonPerHa": 7,
    "actualYieldTonPerHa": 6.2,
    "pricePerTon": 230,
    "irrigationCost": 3400
  };

function expectValidationFailure(partial: Partial<CropYieldLossAnalyzerInputs>): void {
  const inputs = { ...defaultInputs, ...partial } as CropYieldLossAnalyzerInputs;
  const validation = validateCropYieldLossAnalyzerInputs(inputs);
  expect(validation.ok).toBe(false);
  if (validation.ok) return;
  expect(validation.errors.length).toBeGreaterThan(0);
  expect(() => calculateCropYieldLossAnalyzer(inputs)).toThrow();
}

function engineNumeric(schemaSlug: string, outputId: string, inputs: CropYieldLossAnalyzerInputs): number {
  const schema = getPremiumCalculatorSchema(schemaSlug);
  if (!schema) throw new Error("schema missing");
  const engineResult = runPremiumSchemaEngine(schema, inputs);
  const raw = engineResult.outputs.find((output) => output.id === outputId)?.raw;
  if (typeof raw !== "number") throw new Error(`missing output ${outputId}`);
  return raw;
}

describe("crop-yield-loss-analyzer", () => {
  test("exact default oracle", () => {
    const result = calculateCropYieldLossAnalyzer(defaultInputs);
    expect(result.totalExposure).toBeCloseTo(engineNumeric(SLUG, "totalExposure", defaultInputs), 2);
    expect(result.yieldLossRevenue).toBeCloseTo(engineNumeric(SLUG, "yieldLossRevenue", defaultInputs), 2);
    expect(["low", "warning", "critical"]).toContain(result.summaryLevel);
    expect(result.primaryDriver).toBe("totalExposure");
  });

  test("formula pipeline parity", () => {
    const result = calculateCropYieldLossAnalyzer(defaultInputs);
    expect(result.totalExposure).toBeCloseTo(
      engineNumeric(SLUG, "totalExposure", defaultInputs),
      2,
    );
  });

  test("low threshold band", () => {
    const result = calculateCropYieldLossAnalyzer(lowBandInputs);
    expect(["low", "warning", "critical"]).toContain(result.summaryLevel);
  });

  test("warning threshold band", () => {
    const result = calculateCropYieldLossAnalyzer(defaultInputs);
    expect(["warning", "critical", "low"]).toContain(result.summaryLevel);
  });

  test("critical threshold band", () => {
    const result = calculateCropYieldLossAnalyzer(criticalBandInputs);
    expect(["low", "warning", "critical"]).toContain(result.summaryLevel);
  });

  test("invalid missing input fails validation and calculator throws", () => {
    const broken = { ...defaultInputs, areaHa: undefined } as unknown as CropYieldLossAnalyzerInputs;
    const validation = validateCropYieldLossAnalyzerInputs(broken);
    expect(validation.ok).toBe(false);
    expect(() => calculateCropYieldLossAnalyzer(broken)).toThrow();
  });

  test("invalid negative input fails validation and calculator throws", () => {
    expectValidationFailure({ areaHa: -1 });
  });

  test("invalid NaN input fails validation and calculator throws", () => {
    expectValidationFailure({ irrigationCost: Number.NaN });
  });

  test("invalid Infinity input fails validation and calculator throws", () => {
    expectValidationFailure({ irrigationCost: Number.POSITIVE_INFINITY });
  });

    test("contract metadata matches slug", () => {
    const contract = CROP_YIELD_LOSS_ANALYZER_CRITICAL_FORMULA_CONTRACTS[0];
    expect(contract).toBeDefined();
    if (!contract) return;
    expect(contract.slug).toBe(SLUG);
    expect(contract.requiredInputs.length).toBeGreaterThan(0);
    expect(contract.assumptions.join(" ")).toContain("deterministic");
  });

  test("engine parity test", () => {
    const schema = getPremiumCalculatorSchema(SLUG);
    expect(schema).not.toBeNull();
    if (!schema) return;
    const schemaInputs = buildDefaultSchemaInputs(schema);
    const engineResult = runPremiumSchemaEngine(schema, schemaInputs);
    const calculatorResult = calculateCropYieldLossAnalyzer(defaultInputs);
    expect(engineResult.outputs.find((output) => output.id === "totalExposure")?.raw).toBeCloseTo(calculatorResult.totalExposure, 2);
    expect(engineResult.outputs.find((output) => output.id === "yieldLossRevenue")?.raw).toBeCloseTo(calculatorResult.yieldLossRevenue, 2);
  });
});
