import { describe, expect, test } from "vitest";
import { WATER_USAGE_CALCULATOR_CRITICAL_FORMULA_CONTRACTS } from "@/lib/formula-governance/contracts/water-usage-calculator-critical";
import { getFormulaContractBySlug } from "@/lib/formula-governance/contracts";
import {
  calculateWaterUsageCalculator,
  type WaterUsageCalculatorInputs,
} from "@/lib/premium-schema/calculators/water-usage-calculator";
import { validateWaterUsageCalculatorInputs } from "@/lib/premium-schema/calculators/water-usage-calculator-validation";
import { getPremiumCalculatorSchema } from "@/lib/premium-schema/schema-registry";
import {
  buildDefaultSchemaInputs,
  runPremiumSchemaEngine,
} from "@/lib/premium-schema/premium-schema-engine";

const SLUG = "water-usage-calculator";
const SCHEMA_ID = "water-usage-calculator";

const defaultInputs: WaterUsageCalculatorInputs = {
    "dailyUsage": 100,
    "operatingDays": 250,
    "unitWaterCost": 1.5,
    "wasteVolume": 10,
    "productionOutput": 1000
  };
const lowBandInputs: WaterUsageCalculatorInputs = {
    "dailyUsage": 0.1,
    "operatingDays": 250,
    "unitWaterCost": 1.5,
    "wasteVolume": 10,
    "productionOutput": 1000
  };
const criticalBandInputs: WaterUsageCalculatorInputs = {
    "dailyUsage": 6,
    "operatingDays": 250,
    "unitWaterCost": 1.5,
    "wasteVolume": 10,
    "productionOutput": 1000
  };

function expectValidationFailure(partial: Partial<WaterUsageCalculatorInputs>): void {
  const inputs = { ...defaultInputs, ...partial } as WaterUsageCalculatorInputs;
  const validation = validateWaterUsageCalculatorInputs(inputs);
  expect(validation.ok).toBe(false);
  if (validation.ok) return;
  expect(validation.errors.length).toBeGreaterThan(0);
  expect(() => calculateWaterUsageCalculator(inputs)).toThrow();
}

function engineNumeric(schemaSlug: string, outputId: string, inputs: WaterUsageCalculatorInputs): number {
  const schema = getPremiumCalculatorSchema(schemaSlug);
  if (!schema) throw new Error("schema missing");
  const engineResult = runPremiumSchemaEngine(schema, inputs);
  const raw = engineResult.outputs.find((output) => output.id === outputId)?.raw;
  if (typeof raw !== "number") throw new Error(`missing output ${outputId}`);
  return raw;
}

describe("water-usage-calculator", () => {
  test("exact default oracle", () => {
    const result = calculateWaterUsageCalculator(defaultInputs);
    expect(result.totalExposure).toBeCloseTo(engineNumeric(SCHEMA_ID, "totalExposure", defaultInputs), 2);
    expect(result.variancePercent).toBeCloseTo(engineNumeric(SCHEMA_ID, "variancePercent", defaultInputs), 2);
    expect(["low", "warning", "critical"]).toContain(result.summaryLevel);
    expect(result.primaryDriver).toBe("totalExposure");
  });

  test("formula pipeline parity", () => {
    const result = calculateWaterUsageCalculator(defaultInputs);
    expect(result.totalExposure).toBeCloseTo(
      engineNumeric(SCHEMA_ID, "totalExposure", defaultInputs),
      2,
    );
  });

  test("low threshold band", () => {
    const result = calculateWaterUsageCalculator(lowBandInputs);
    expect(["low", "warning", "critical"]).toContain(result.summaryLevel);
  });

  test("warning threshold band", () => {
    const result = calculateWaterUsageCalculator(defaultInputs);
    expect(["warning", "critical", "low"]).toContain(result.summaryLevel);
  });

  test("critical threshold band", () => {
    const result = calculateWaterUsageCalculator(criticalBandInputs);
    expect(["low", "warning", "critical"]).toContain(result.summaryLevel);
  });

  test("invalid missing input fails validation and calculator throws", () => {
    const broken = { ...defaultInputs, dailyUsage: undefined } as unknown as WaterUsageCalculatorInputs;
    const validation = validateWaterUsageCalculatorInputs(broken);
    expect(validation.ok).toBe(false);
    expect(() => calculateWaterUsageCalculator(broken)).toThrow();
  });

  test("invalid negative input fails validation and calculator throws", () => {
    expectValidationFailure({ dailyUsage: -1 });
  });
  test("invalid zero divisor/base fails validation and calculator throws", () => {
    const validation = validateWaterUsageCalculatorInputs({ ...defaultInputs, dailyUsage: 0 });
    expect(validation.ok).toBe(false);
    if (validation.ok) return;
    expect(() => calculateWaterUsageCalculator({ ...defaultInputs, dailyUsage: 0 })).toThrow();
  });

  test("invalid NaN input fails validation and calculator throws", () => {
    expectValidationFailure({ productionOutput: Number.NaN });
  });

  test("invalid Infinity input fails validation and calculator throws", () => {
    expectValidationFailure({ productionOutput: Number.POSITIVE_INFINITY });
  });

    test("contract metadata matches slug", () => {
    const contract = WATER_USAGE_CALCULATOR_CRITICAL_FORMULA_CONTRACTS[0];
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
    const calculatorResult = calculateWaterUsageCalculator(defaultInputs);
    expect(engineResult.outputs.find((output) => output.id === "totalExposure")?.raw).toBeCloseTo(calculatorResult.totalExposure, 2);
    expect(engineResult.outputs.find((output) => output.id === "variancePercent")?.raw).toBeCloseTo(calculatorResult.variancePercent, 2);
  });
});
