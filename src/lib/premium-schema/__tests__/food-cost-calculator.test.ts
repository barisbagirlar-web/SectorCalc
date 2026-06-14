import { describe, expect, test } from "vitest";
import { FOOD_COST_CALCULATOR_CRITICAL_FORMULA_CONTRACTS } from "@/lib/formula-governance/contracts/food-cost-calculator-critical";
import { getFormulaContractBySlug } from "@/lib/formula-governance/contracts";
import {
  calculateFoodCostCalculator,
  type FoodCostCalculatorInputs,
} from "@/lib/premium-schema/calculators/food-cost-calculator";
import { validateFoodCostCalculatorInputs } from "@/lib/premium-schema/calculators/food-cost-calculator-validation";
import { getPremiumCalculatorSchema } from "@/lib/premium-schema/schema-registry";
import {
  buildDefaultSchemaInputs,
  runPremiumSchemaEngine,
} from "@/lib/premium-schema/premium-schema-engine";

const SLUG = "food-cost-calculator";
const SCHEMA_ID = "food-cost-calculator";

const defaultInputs: FoodCostCalculatorInputs = {
    "inputQuantity": 100,
    "outputQuantity": 90,
    "yieldPercent": 90,
    "rawMaterialCost": 10,
    "laborCost": 5,
    "processingCost": 3
  };
const lowBandInputs: FoodCostCalculatorInputs = {
    "inputQuantity": 0.1,
    "outputQuantity": 90,
    "yieldPercent": 90,
    "rawMaterialCost": 10,
    "laborCost": 5,
    "processingCost": 3
  };
const criticalBandInputs: FoodCostCalculatorInputs = {
    "inputQuantity": 6,
    "outputQuantity": 90,
    "yieldPercent": 90,
    "rawMaterialCost": 10,
    "laborCost": 5,
    "processingCost": 3
  };

function expectValidationFailure(partial: Partial<FoodCostCalculatorInputs>): void {
  const inputs = { ...defaultInputs, ...partial } as FoodCostCalculatorInputs;
  const validation = validateFoodCostCalculatorInputs(inputs);
  expect(validation.ok).toBe(false);
  if (validation.ok) return;
  expect(validation.errors.length).toBeGreaterThan(0);
  expect(() => calculateFoodCostCalculator(inputs)).toThrow();
}

function engineNumeric(schemaSlug: string, outputId: string, inputs: FoodCostCalculatorInputs): number {
  const schema = getPremiumCalculatorSchema(schemaSlug);
  if (!schema) throw new Error("schema missing");
  const engineResult = runPremiumSchemaEngine(schema, inputs);
  const raw = engineResult.outputs.find((output) => output.id === outputId)?.raw;
  if (typeof raw !== "number") throw new Error(`missing output ${outputId}`);
  return raw;
}

describe("food-cost-calculator", () => {
  test("exact default oracle", () => {
    const result = calculateFoodCostCalculator(defaultInputs);
    expect(result.totalExposure).toBeCloseTo(engineNumeric(SCHEMA_ID, "totalExposure", defaultInputs), 2);
    expect(result.variancePercent).toBeCloseTo(engineNumeric(SCHEMA_ID, "variancePercent", defaultInputs), 2);
    expect(["low", "warning", "critical"]).toContain(result.summaryLevel);
    expect(result.primaryDriver).toBe("totalExposure");
  });

  test("formula pipeline parity", () => {
    const result = calculateFoodCostCalculator(defaultInputs);
    expect(result.totalExposure).toBeCloseTo(
      engineNumeric(SCHEMA_ID, "totalExposure", defaultInputs),
      2,
    );
  });

  test("low threshold band", () => {
    const result = calculateFoodCostCalculator(lowBandInputs);
    expect(["low", "warning", "critical"]).toContain(result.summaryLevel);
  });

  test("warning threshold band", () => {
    const result = calculateFoodCostCalculator(defaultInputs);
    expect(["warning", "critical", "low"]).toContain(result.summaryLevel);
  });

  test("critical threshold band", () => {
    const result = calculateFoodCostCalculator(criticalBandInputs);
    expect(["low", "warning", "critical"]).toContain(result.summaryLevel);
  });

  test("invalid missing input fails validation and calculator throws", () => {
    const broken = { ...defaultInputs, inputQuantity: undefined } as unknown as FoodCostCalculatorInputs;
    const validation = validateFoodCostCalculatorInputs(broken);
    expect(validation.ok).toBe(false);
    expect(() => calculateFoodCostCalculator(broken)).toThrow();
  });

  test("invalid negative input fails validation and calculator throws", () => {
    expectValidationFailure({ inputQuantity: -1 });
  });
  test("invalid zero divisor/base fails validation and calculator throws", () => {
    const validation = validateFoodCostCalculatorInputs({ ...defaultInputs, inputQuantity: 0 });
    expect(validation.ok).toBe(false);
    if (validation.ok) return;
    expect(() => calculateFoodCostCalculator({ ...defaultInputs, inputQuantity: 0 })).toThrow();
  });

  test("invalid NaN input fails validation and calculator throws", () => {
    expectValidationFailure({ processingCost: Number.NaN });
  });

  test("invalid Infinity input fails validation and calculator throws", () => {
    expectValidationFailure({ processingCost: Number.POSITIVE_INFINITY });
  });

    test("contract metadata matches slug", () => {
    const contract = FOOD_COST_CALCULATOR_CRITICAL_FORMULA_CONTRACTS[0];
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
    const calculatorResult = calculateFoodCostCalculator(defaultInputs);
    expect(engineResult.outputs.find((output) => output.id === "totalExposure")?.raw).toBeCloseTo(calculatorResult.totalExposure, 2);
    expect(engineResult.outputs.find((output) => output.id === "variancePercent")?.raw).toBeCloseTo(calculatorResult.variancePercent, 2);
  });
});
