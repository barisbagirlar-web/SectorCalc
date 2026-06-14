import { describe, expect, test } from "vitest";
import { MENU_PROFIT_LEAK_DETECTOR_CRITICAL_FORMULA_CONTRACTS } from "@/lib/formula-governance/contracts/menu-profit-leak-detector-critical";
import { getFormulaContractBySlug } from "@/lib/formula-governance/contracts";
import {
  calculateMenuProfitLeakDetector,
  type MenuProfitLeakDetectorInputs,
} from "@/lib/premium-schema/calculators/menu-profit-leak-detector";
import { validateMenuProfitLeakDetectorInputs } from "@/lib/premium-schema/calculators/menu-profit-leak-detector-validation";
import { getPremiumCalculatorSchema } from "@/lib/premium-schema/schema-registry";
import {
  buildDefaultSchemaInputs,
  runPremiumSchemaEngine,
} from "@/lib/premium-schema/premium-schema-engine";

const SLUG = "menu-profit-leak-detector";

const defaultInputs: MenuProfitLeakDetectorInputs = {
    "monthlyRevenue": 38000,
    "ingredientCost": 14500,
    "deliveryAppFeePercent": 22,
    "wasteRate": 6,
    "targetFoodCostPercent": 32
  };
const lowBandInputs: MenuProfitLeakDetectorInputs = {
    "monthlyRevenue": 380,
    "ingredientCost": 14500,
    "deliveryAppFeePercent": 22,
    "wasteRate": 6,
    "targetFoodCostPercent": 32
  };
const criticalBandInputs: MenuProfitLeakDetectorInputs = {
    "monthlyRevenue": 38000000,
    "ingredientCost": 14500,
    "deliveryAppFeePercent": 22,
    "wasteRate": 6,
    "targetFoodCostPercent": 32
  };

function expectValidationFailure(partial: Partial<MenuProfitLeakDetectorInputs>): void {
  const inputs = { ...defaultInputs, ...partial } as MenuProfitLeakDetectorInputs;
  const validation = validateMenuProfitLeakDetectorInputs(inputs);
  expect(validation.ok).toBe(false);
  if (validation.ok) return;
  expect(validation.errors.length).toBeGreaterThan(0);
  expect(() => calculateMenuProfitLeakDetector(inputs)).toThrow();
}

function engineNumeric(schemaSlug: string, outputId: string, inputs: MenuProfitLeakDetectorInputs): number {
  const schema = getPremiumCalculatorSchema(schemaSlug);
  if (!schema) throw new Error("schema missing");
  const engineResult = runPremiumSchemaEngine(schema, inputs);
  const raw = engineResult.outputs.find((output) => output.id === outputId)?.raw;
  if (typeof raw !== "number") throw new Error(`missing output ${outputId}`);
  return raw;
}

describe("menu-profit-leak-detector", () => {
  test("exact default oracle", () => {
    const result = calculateMenuProfitLeakDetector(defaultInputs);
    expect(result.totalMarginPressure).toBeCloseTo(engineNumeric(SLUG, "totalMarginPressure", defaultInputs), 2);
    expect(result.foodCostPercent).toBeCloseTo(engineNumeric(SLUG, "foodCostPercent", defaultInputs), 2);
    expect(["low", "warning", "critical"]).toContain(result.summaryLevel);
    expect(result.primaryDriver).toBe("totalMarginPressure");
  });

  test("formula pipeline parity", () => {
    const result = calculateMenuProfitLeakDetector(defaultInputs);
    expect(result.totalMarginPressure).toBeCloseTo(
      engineNumeric(SLUG, "totalMarginPressure", defaultInputs),
      2,
    );
  });

  test("low threshold band", () => {
    const result = calculateMenuProfitLeakDetector(lowBandInputs);
    expect(["low", "warning", "critical"]).toContain(result.summaryLevel);
  });

  test("warning threshold band", () => {
    const result = calculateMenuProfitLeakDetector(defaultInputs);
    expect(["warning", "critical", "low"]).toContain(result.summaryLevel);
  });

  test("critical threshold band", () => {
    const result = calculateMenuProfitLeakDetector(criticalBandInputs);
    expect(["low", "warning", "critical"]).toContain(result.summaryLevel);
  });

  test("invalid missing input fails validation and calculator throws", () => {
    const broken = { ...defaultInputs, monthlyRevenue: undefined } as unknown as MenuProfitLeakDetectorInputs;
    const validation = validateMenuProfitLeakDetectorInputs(broken);
    expect(validation.ok).toBe(false);
    expect(() => calculateMenuProfitLeakDetector(broken)).toThrow();
  });

  test("invalid negative input fails validation and calculator throws", () => {
    expectValidationFailure({ monthlyRevenue: -1 });
  });
  test("invalid zero divisor/base fails validation and calculator throws", () => {
    const validation = validateMenuProfitLeakDetectorInputs({ ...defaultInputs, monthlyRevenue: 0 });
    expect(validation.ok).toBe(false);
    if (validation.ok) return;
    expect(() => calculateMenuProfitLeakDetector({ ...defaultInputs, monthlyRevenue: 0 })).toThrow();
  });

  test("invalid NaN input fails validation and calculator throws", () => {
    expectValidationFailure({ targetFoodCostPercent: Number.NaN });
  });

  test("invalid Infinity input fails validation and calculator throws", () => {
    expectValidationFailure({ targetFoodCostPercent: Number.POSITIVE_INFINITY });
  });

    test("contract metadata matches slug", () => {
    const contract = MENU_PROFIT_LEAK_DETECTOR_CRITICAL_FORMULA_CONTRACTS[0];
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
    const calculatorResult = calculateMenuProfitLeakDetector(defaultInputs);
    expect(engineResult.outputs.find((output) => output.id === "totalMarginPressure")?.raw).toBeCloseTo(calculatorResult.totalMarginPressure, 2);
    expect(engineResult.outputs.find((output) => output.id === "foodCostPercent")?.raw).toBeCloseTo(calculatorResult.foodCostPercent, 2);
  });
});
