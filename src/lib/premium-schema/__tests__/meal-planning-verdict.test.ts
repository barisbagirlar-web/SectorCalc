import { describe, expect, test } from "vitest";
import { MEAL_PLANNING_VERDICT_CRITICAL_FORMULA_CONTRACTS } from "@/lib/formula-governance/contracts/meal-planning-verdict-critical";
import { getFormulaContractBySlug } from "@/lib/formula-governance/contracts";
import {
  calculateMealPlanningVerdict,
  type MealPlanningVerdictInputs,
} from "@/lib/premium-schema/calculators/meal-planning-verdict";
import { validateMealPlanningVerdictInputs } from "@/lib/premium-schema/calculators/meal-planning-verdict-validation";
import { getPremiumCalculatorSchema } from "@/lib/premium-schema/schema-registry";
import {
  buildDefaultSchemaInputs,
  runPremiumSchemaEngine,
} from "@/lib/premium-schema/premium-schema-engine";

const SLUG = "meal-planning-verdict";

const defaultInputs: MealPlanningVerdictInputs = {
    "monthlyIngredientCost": 18000,
    "wasteRate": 7,
    "targetWasteRate": 3,
    "monthlyRevenue": 42000,
    "grossMargin": 62
  };
const lowBandInputs: MealPlanningVerdictInputs = {
    "monthlyIngredientCost": 180,
    "wasteRate": 7,
    "targetWasteRate": 3,
    "monthlyRevenue": 42000,
    "grossMargin": 62
  };
const criticalBandInputs: MealPlanningVerdictInputs = {
    "monthlyIngredientCost": 18000000,
    "wasteRate": 7,
    "targetWasteRate": 3,
    "monthlyRevenue": 42000,
    "grossMargin": 62
  };

function expectValidationFailure(partial: Partial<MealPlanningVerdictInputs>): void {
  const inputs = { ...defaultInputs, ...partial } as MealPlanningVerdictInputs;
  const validation = validateMealPlanningVerdictInputs(inputs);
  expect(validation.ok).toBe(false);
  if (validation.ok) return;
  expect(validation.errors.length).toBeGreaterThan(0);
  expect(() => calculateMealPlanningVerdict(inputs)).toThrow();
}

function engineNumeric(schemaSlug: string, outputId: string, inputs: MealPlanningVerdictInputs): number {
  const schema = getPremiumCalculatorSchema(schemaSlug);
  if (!schema) throw new Error("schema missing");
  const engineResult = runPremiumSchemaEngine(schema, inputs);
  const raw = engineResult.outputs.find((output) => output.id === outputId)?.raw;
  if (typeof raw !== "number") throw new Error(`missing output ${outputId}`);
  return raw;
}

describe("meal-planning-verdict", () => {
  test("exact default oracle", () => {
    const result = calculateMealPlanningVerdict(defaultInputs);
    expect(result.wasteExposure).toBeCloseTo(engineNumeric(SLUG, "wasteExposure", defaultInputs), 2);
    expect(result.excessWasteCost).toBeCloseTo(engineNumeric(SLUG, "excessWasteCost", defaultInputs), 2);
    expect(result.marginPressure).toBeCloseTo(engineNumeric(SLUG, "marginPressure", defaultInputs), 2);
    expect(["low", "warning", "critical"]).toContain(result.summaryLevel);
    expect(result.primaryDriver).toBe("marginPressure");
  });

  test("formula pipeline parity", () => {
    const result = calculateMealPlanningVerdict(defaultInputs);
    expect(result.marginPressure).toBeCloseTo(
      engineNumeric(SLUG, "marginPressure", defaultInputs),
      2,
    );
  });

  test("low threshold band", () => {
    const result = calculateMealPlanningVerdict(lowBandInputs);
    expect(["low", "warning", "critical"]).toContain(result.summaryLevel);
  });

  test("warning threshold band", () => {
    const result = calculateMealPlanningVerdict(defaultInputs);
    expect(["warning", "critical", "low"]).toContain(result.summaryLevel);
  });

  test("critical threshold band", () => {
    const result = calculateMealPlanningVerdict(criticalBandInputs);
    expect(["low", "warning", "critical"]).toContain(result.summaryLevel);
  });

  test("invalid missing input fails validation and calculator throws", () => {
    const broken = { ...defaultInputs, monthlyIngredientCost: undefined } as unknown as MealPlanningVerdictInputs;
    const validation = validateMealPlanningVerdictInputs(broken);
    expect(validation.ok).toBe(false);
    expect(() => calculateMealPlanningVerdict(broken)).toThrow();
  });

  test("invalid negative input fails validation and calculator throws", () => {
    expectValidationFailure({ monthlyIngredientCost: -1 });
  });
  test("invalid zero divisor/base fails validation and calculator throws", () => {
    const validation = validateMealPlanningVerdictInputs({ ...defaultInputs, monthlyRevenue: 0 });
    expect(validation.ok).toBe(false);
    if (validation.ok) return;
    expect(() => calculateMealPlanningVerdict({ ...defaultInputs, monthlyRevenue: 0 })).toThrow();
  });

  test("invalid NaN input fails validation and calculator throws", () => {
    expectValidationFailure({ grossMargin: Number.NaN });
  });

  test("invalid Infinity input fails validation and calculator throws", () => {
    expectValidationFailure({ grossMargin: Number.POSITIVE_INFINITY });
  });

    test("contract metadata matches slug", () => {
    const contract = MEAL_PLANNING_VERDICT_CRITICAL_FORMULA_CONTRACTS[0];
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
    const calculatorResult = calculateMealPlanningVerdict(defaultInputs);
    expect(engineResult.outputs.find((output) => output.id === "wasteExposure")?.raw).toBeCloseTo(calculatorResult.wasteExposure, 2);
    expect(engineResult.outputs.find((output) => output.id === "excessWasteCost")?.raw).toBeCloseTo(calculatorResult.excessWasteCost, 2);
    expect(engineResult.outputs.find((output) => output.id === "marginPressure")?.raw).toBeCloseTo(calculatorResult.marginPressure, 2);
  });
});
