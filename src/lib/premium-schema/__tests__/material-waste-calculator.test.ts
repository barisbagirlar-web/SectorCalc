import { describe, expect, test } from "vitest";
import { MATERIAL_WASTE_CALCULATOR_CRITICAL_FORMULA_CONTRACTS } from "@/lib/formula-governance/contracts/material-waste-calculator-critical";
import { getFormulaContractBySlug } from "@/lib/formula-governance/contracts";
import {
  calculateMaterialWasteCalculator,
  type MaterialWasteCalculatorInputs,
} from "@/lib/premium-schema/calculators/material-waste-calculator";
import { validateMaterialWasteCalculatorInputs } from "@/lib/premium-schema/calculators/material-waste-calculator-validation";
import { getPremiumCalculatorSchema } from "@/lib/premium-schema/schema-registry";
import {
  buildDefaultSchemaInputs,
  runPremiumSchemaEngine,
} from "@/lib/premium-schema/premium-schema-engine";

const SLUG = "material-waste-calculator";

const defaultInputs: MaterialWasteCalculatorInputs = {
    "monthlyIngredientCost": 18000,
    "wasteRate": 7,
    "targetWasteRate": 3,
    "monthlyRevenue": 42000,
    "grossMargin": 62
  };
const lowBandInputs: MaterialWasteCalculatorInputs = {
    "monthlyIngredientCost": 180,
    "wasteRate": 7,
    "targetWasteRate": 3,
    "monthlyRevenue": 42000,
    "grossMargin": 62
  };
const criticalBandInputs: MaterialWasteCalculatorInputs = {
    "monthlyIngredientCost": 18000000,
    "wasteRate": 7,
    "targetWasteRate": 3,
    "monthlyRevenue": 42000,
    "grossMargin": 62
  };

function expectValidationFailure(partial: Partial<MaterialWasteCalculatorInputs>): void {
  const inputs = { ...defaultInputs, ...partial } as MaterialWasteCalculatorInputs;
  const validation = validateMaterialWasteCalculatorInputs(inputs);
  expect(validation.ok).toBe(false);
  if (validation.ok) return;
  expect(validation.errors.length).toBeGreaterThan(0);
  expect(() => calculateMaterialWasteCalculator(inputs)).toThrow();
}

function engineNumeric(schemaSlug: string, outputId: string, inputs: MaterialWasteCalculatorInputs): number {
  const schema = getPremiumCalculatorSchema(schemaSlug);
  if (!schema) throw new Error("schema missing");
  const engineResult = runPremiumSchemaEngine(schema, inputs);
  const raw = engineResult.outputs.find((output) => output.id === outputId)?.raw;
  if (typeof raw !== "number") throw new Error(`missing output ${outputId}`);
  return raw;
}

describe("material-waste-calculator", () => {
  test("exact default oracle", () => {
    const result = calculateMaterialWasteCalculator(defaultInputs);
    expect(result.wasteExposure).toBeCloseTo(engineNumeric(SLUG, "wasteExposure", defaultInputs), 2);
    expect(result.excessWasteCost).toBeCloseTo(engineNumeric(SLUG, "excessWasteCost", defaultInputs), 2);
    expect(result.marginPressure).toBeCloseTo(engineNumeric(SLUG, "marginPressure", defaultInputs), 2);
    expect(["low", "warning", "critical"]).toContain(result.summaryLevel);
    expect(result.primaryDriver).toBe("marginPressure");
  });

  test("formula pipeline parity", () => {
    const result = calculateMaterialWasteCalculator(defaultInputs);
    expect(result.marginPressure).toBeCloseTo(
      engineNumeric(SLUG, "marginPressure", defaultInputs),
      2,
    );
  });

  test("low threshold band", () => {
    const result = calculateMaterialWasteCalculator(lowBandInputs);
    expect(["low", "warning", "critical"]).toContain(result.summaryLevel);
  });

  test("warning threshold band", () => {
    const result = calculateMaterialWasteCalculator(defaultInputs);
    expect(["warning", "critical", "low"]).toContain(result.summaryLevel);
  });

  test("critical threshold band", () => {
    const result = calculateMaterialWasteCalculator(criticalBandInputs);
    expect(["low", "warning", "critical"]).toContain(result.summaryLevel);
  });

  test("invalid missing input fails validation and calculator throws", () => {
    const broken = { ...defaultInputs, monthlyIngredientCost: undefined } as unknown as MaterialWasteCalculatorInputs;
    const validation = validateMaterialWasteCalculatorInputs(broken);
    expect(validation.ok).toBe(false);
    expect(() => calculateMaterialWasteCalculator(broken)).toThrow();
  });

  test("invalid negative input fails validation and calculator throws", () => {
    expectValidationFailure({ monthlyIngredientCost: -1 });
  });
  test("invalid zero divisor/base fails validation and calculator throws", () => {
    const validation = validateMaterialWasteCalculatorInputs({ ...defaultInputs, monthlyRevenue: 0 });
    expect(validation.ok).toBe(false);
    if (validation.ok) return;
    expect(() => calculateMaterialWasteCalculator({ ...defaultInputs, monthlyRevenue: 0 })).toThrow();
  });

  test("invalid NaN input fails validation and calculator throws", () => {
    expectValidationFailure({ grossMargin: Number.NaN });
  });

  test("invalid Infinity input fails validation and calculator throws", () => {
    expectValidationFailure({ grossMargin: Number.POSITIVE_INFINITY });
  });

    test("contract metadata matches slug", () => {
    const contract = MATERIAL_WASTE_CALCULATOR_CRITICAL_FORMULA_CONTRACTS[0];
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
    const calculatorResult = calculateMaterialWasteCalculator(defaultInputs);
    expect(engineResult.outputs.find((output) => output.id === "wasteExposure")?.raw).toBeCloseTo(calculatorResult.wasteExposure, 2);
    expect(engineResult.outputs.find((output) => output.id === "excessWasteCost")?.raw).toBeCloseTo(calculatorResult.excessWasteCost, 2);
    expect(engineResult.outputs.find((output) => output.id === "marginPressure")?.raw).toBeCloseTo(calculatorResult.marginPressure, 2);
  });
});
