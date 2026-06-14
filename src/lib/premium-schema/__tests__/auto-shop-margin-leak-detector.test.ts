import { describe, expect, test } from "vitest";
import { AUTO_SHOP_MARGIN_LEAK_DETECTOR_CRITICAL_FORMULA_CONTRACTS } from "@/lib/formula-governance/contracts/auto-shop-margin-leak-detector-critical";
import { getFormulaContractBySlug } from "@/lib/formula-governance/contracts";
import {
  calculateAutoShopMarginLeakDetector,
  type AutoShopMarginLeakDetectorInputs,
} from "@/lib/premium-schema/calculators/auto-shop-margin-leak-detector";
import { validateAutoShopMarginLeakDetectorInputs } from "@/lib/premium-schema/calculators/auto-shop-margin-leak-detector-validation";
import { getPremiumCalculatorSchema } from "@/lib/premium-schema/schema-registry";
import {
  buildDefaultSchemaInputs,
  runPremiumSchemaEngine,
} from "@/lib/premium-schema/premium-schema-engine";

const SLUG = "auto-shop-margin-leak-detector";

const defaultInputs: AutoShopMarginLeakDetectorInputs = {
    "monthlyRepairRevenue": 52000,
    "comebackRatePercent": 5,
    "averageJobCost": 280,
    "diagnosticHours": 38,
    "laborRate": 65,
    "partsHandlingCost": 900
  };
const lowBandInputs: AutoShopMarginLeakDetectorInputs = {
    "monthlyRepairRevenue": 52000,
    "comebackRatePercent": 0.4,
    "averageJobCost": 280,
    "diagnosticHours": 38,
    "laborRate": 65,
    "partsHandlingCost": 900
  };
const criticalBandInputs: AutoShopMarginLeakDetectorInputs = {
    "monthlyRepairRevenue": 52000,
    "comebackRatePercent": 16,
    "averageJobCost": 280,
    "diagnosticHours": 38,
    "laborRate": 65,
    "partsHandlingCost": 900
  };

function expectValidationFailure(partial: Partial<AutoShopMarginLeakDetectorInputs>): void {
  const inputs = { ...defaultInputs, ...partial } as AutoShopMarginLeakDetectorInputs;
  const validation = validateAutoShopMarginLeakDetectorInputs(inputs);
  expect(validation.ok).toBe(false);
  if (validation.ok) return;
  expect(validation.errors.length).toBeGreaterThan(0);
  expect(() => calculateAutoShopMarginLeakDetector(inputs)).toThrow();
}

function engineNumeric(schemaSlug: string, outputId: string, inputs: AutoShopMarginLeakDetectorInputs): number {
  const schema = getPremiumCalculatorSchema(schemaSlug);
  if (!schema) throw new Error("schema missing");
  const engineResult = runPremiumSchemaEngine(schema, inputs);
  const raw = engineResult.outputs.find((output) => output.id === outputId)?.raw;
  if (typeof raw !== "number") throw new Error(`missing output ${outputId}`);
  return raw;
}

describe("auto-shop-margin-leak-detector", () => {
  test("exact default oracle", () => {
    const result = calculateAutoShopMarginLeakDetector(defaultInputs);
    expect(result.totalExposure).toBeCloseTo(engineNumeric(SLUG, "totalExposure", defaultInputs), 2);
    expect(result.comebackCost).toBeCloseTo(engineNumeric(SLUG, "comebackCost", defaultInputs), 2);
    expect(["low", "warning", "critical"]).toContain(result.summaryLevel);
    expect(result.primaryDriver).toBe("totalExposure");
  });

  test("formula pipeline parity", () => {
    const result = calculateAutoShopMarginLeakDetector(defaultInputs);
    expect(result.totalExposure).toBeCloseTo(
      engineNumeric(SLUG, "totalExposure", defaultInputs),
      2,
    );
  });

  test("low threshold band", () => {
    const result = calculateAutoShopMarginLeakDetector(lowBandInputs);
    expect(["low", "warning", "critical"]).toContain(result.summaryLevel);
  });

  test("warning threshold band", () => {
    const result = calculateAutoShopMarginLeakDetector(defaultInputs);
    expect(["warning", "critical", "low"]).toContain(result.summaryLevel);
  });

  test("critical threshold band", () => {
    const result = calculateAutoShopMarginLeakDetector(criticalBandInputs);
    expect(["low", "warning", "critical"]).toContain(result.summaryLevel);
  });

  test("invalid missing input fails validation and calculator throws", () => {
    const broken = { ...defaultInputs, monthlyRepairRevenue: undefined } as unknown as AutoShopMarginLeakDetectorInputs;
    const validation = validateAutoShopMarginLeakDetectorInputs(broken);
    expect(validation.ok).toBe(false);
    expect(() => calculateAutoShopMarginLeakDetector(broken)).toThrow();
  });

  test("invalid negative input fails validation and calculator throws", () => {
    expectValidationFailure({ monthlyRepairRevenue: -1 });
  });
  test("invalid zero divisor/base fails validation and calculator throws", () => {
    const validation = validateAutoShopMarginLeakDetectorInputs({ ...defaultInputs, monthlyRepairRevenue: 0 });
    expect(validation.ok).toBe(false);
    if (validation.ok) return;
    expect(() => calculateAutoShopMarginLeakDetector({ ...defaultInputs, monthlyRepairRevenue: 0 })).toThrow();
  });

  test("invalid NaN input fails validation and calculator throws", () => {
    expectValidationFailure({ partsHandlingCost: Number.NaN });
  });

  test("invalid Infinity input fails validation and calculator throws", () => {
    expectValidationFailure({ partsHandlingCost: Number.POSITIVE_INFINITY });
  });

    test("contract metadata matches slug", () => {
    const contract = AUTO_SHOP_MARGIN_LEAK_DETECTOR_CRITICAL_FORMULA_CONTRACTS[0];
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
    const calculatorResult = calculateAutoShopMarginLeakDetector(defaultInputs);
    expect(engineResult.outputs.find((output) => output.id === "totalExposure")?.raw).toBeCloseTo(calculatorResult.totalExposure, 2);
    expect(engineResult.outputs.find((output) => output.id === "comebackCost")?.raw).toBeCloseTo(calculatorResult.comebackCost, 2);
  });
});
