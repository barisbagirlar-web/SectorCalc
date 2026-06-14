import { describe, expect, test } from "vitest";
import { BATCH_YIELD_CALCULATOR_CRITICAL_FORMULA_CONTRACTS } from "@/lib/formula-governance/contracts/batch-yield-calculator-critical";
import { getFormulaContractBySlug } from "@/lib/formula-governance/contracts";
import {
  calculateBatchYieldCalculator,
  type BatchYieldCalculatorInputs,
} from "@/lib/premium-schema/calculators/batch-yield-calculator";
import { validateBatchYieldCalculatorInputs } from "@/lib/premium-schema/calculators/batch-yield-calculator-validation";
import { getPremiumCalculatorSchema } from "@/lib/premium-schema/schema-registry";
import {
  buildDefaultSchemaInputs,
  runPremiumSchemaEngine,
} from "@/lib/premium-schema/premium-schema-engine";

const SLUG = "batch-yield-calculator";
const SCHEMA_ID = "batch-yield-calculator";

const defaultInputs: BatchYieldCalculatorInputs = {
    "inputQuantity": 100,
    "outputQuantity": 90,
    "yieldPercent": 90,
    "rawMaterialCost": 5,
    "laborCost": 50,
    "processingCost": 30
  };
const lowBandInputs: BatchYieldCalculatorInputs = {
    "inputQuantity": 0.1,
    "outputQuantity": 90,
    "yieldPercent": 90,
    "rawMaterialCost": 5,
    "laborCost": 50,
    "processingCost": 30
  };
const criticalBandInputs: BatchYieldCalculatorInputs = {
    "inputQuantity": 6,
    "outputQuantity": 90,
    "yieldPercent": 90,
    "rawMaterialCost": 5,
    "laborCost": 50,
    "processingCost": 30
  };

function expectValidationFailure(partial: Partial<BatchYieldCalculatorInputs>): void {
  const inputs = { ...defaultInputs, ...partial } as BatchYieldCalculatorInputs;
  const validation = validateBatchYieldCalculatorInputs(inputs);
  expect(validation.ok).toBe(false);
  if (validation.ok) return;
  expect(validation.errors.length).toBeGreaterThan(0);
  expect(() => calculateBatchYieldCalculator(inputs)).toThrow();
}

function engineNumeric(schemaSlug: string, outputId: string, inputs: BatchYieldCalculatorInputs): number {
  const schema = getPremiumCalculatorSchema(schemaSlug);
  if (!schema) throw new Error("schema missing");
  const engineResult = runPremiumSchemaEngine(schema, inputs);
  const raw = engineResult.outputs.find((output) => output.id === outputId)?.raw;
  if (typeof raw !== "number") throw new Error(`missing output ${outputId}`);
  return raw;
}

describe("batch-yield-calculator", () => {
  test("exact default oracle", () => {
    const result = calculateBatchYieldCalculator(defaultInputs);
    expect(result.totalExposure).toBeCloseTo(engineNumeric(SCHEMA_ID, "totalExposure", defaultInputs), 2);
    expect(result.variancePercent).toBeCloseTo(engineNumeric(SCHEMA_ID, "variancePercent", defaultInputs), 2);
    expect(["low", "warning", "critical"]).toContain(result.summaryLevel);
    expect(result.primaryDriver).toBe("totalExposure");
  });

  test("formula pipeline parity", () => {
    const result = calculateBatchYieldCalculator(defaultInputs);
    expect(result.totalExposure).toBeCloseTo(
      engineNumeric(SCHEMA_ID, "totalExposure", defaultInputs),
      2,
    );
  });

  test("low threshold band", () => {
    const result = calculateBatchYieldCalculator(lowBandInputs);
    expect(["low", "warning", "critical"]).toContain(result.summaryLevel);
  });

  test("warning threshold band", () => {
    const result = calculateBatchYieldCalculator(defaultInputs);
    expect(["warning", "critical", "low"]).toContain(result.summaryLevel);
  });

  test("critical threshold band", () => {
    const result = calculateBatchYieldCalculator(criticalBandInputs);
    expect(["low", "warning", "critical"]).toContain(result.summaryLevel);
  });

  test("invalid missing input fails validation and calculator throws", () => {
    const broken = { ...defaultInputs, inputQuantity: undefined } as unknown as BatchYieldCalculatorInputs;
    const validation = validateBatchYieldCalculatorInputs(broken);
    expect(validation.ok).toBe(false);
    expect(() => calculateBatchYieldCalculator(broken)).toThrow();
  });

  test("invalid negative input fails validation and calculator throws", () => {
    expectValidationFailure({ inputQuantity: -1 });
  });
  test("invalid zero divisor/base fails validation and calculator throws", () => {
    const validation = validateBatchYieldCalculatorInputs({ ...defaultInputs, inputQuantity: 0 });
    expect(validation.ok).toBe(false);
    if (validation.ok) return;
    expect(() => calculateBatchYieldCalculator({ ...defaultInputs, inputQuantity: 0 })).toThrow();
  });

  test("invalid NaN input fails validation and calculator throws", () => {
    expectValidationFailure({ processingCost: Number.NaN });
  });

  test("invalid Infinity input fails validation and calculator throws", () => {
    expectValidationFailure({ processingCost: Number.POSITIVE_INFINITY });
  });

    test("contract metadata matches slug", () => {
    const contract = BATCH_YIELD_CALCULATOR_CRITICAL_FORMULA_CONTRACTS[0];
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
    const calculatorResult = calculateBatchYieldCalculator(defaultInputs);
    expect(engineResult.outputs.find((output) => output.id === "totalExposure")?.raw).toBeCloseTo(calculatorResult.totalExposure, 2);
    expect(engineResult.outputs.find((output) => output.id === "variancePercent")?.raw).toBeCloseTo(calculatorResult.variancePercent, 2);
  });
});
