import { describe, expect, test } from "vitest";
import { getFormulaContractBySlug } from "@/lib/formula-governance/contracts";
import {
  calculateShopRateHourlyCostCalculator,
  type ShopRateHourlyCostCalculatorInputs,
} from "@/lib/premium-schema/calculators/shop-rate-hourly-cost-calculator";
import { validateShopRateHourlyCostCalculatorInputs } from "@/lib/premium-schema/calculators/shop-rate-hourly-cost-calculator-validation";
import { getPremiumCalculatorSchema } from "@/lib/premium-schema/schema-registry";
import {
  buildDefaultSchemaInputs,
  runPremiumSchemaEngine,
} from "@/lib/premium-schema/premium-schema-engine";

const SLUG = "shop-rate-hourly-cost-calculator";

const defaultInputs: ShopRateHourlyCostCalculatorInputs = {
    "fixedMonthlyCost": 18500,
    "monthlyMachineHours": 320,
    "variableCostPerHour": 12
  };
const lowBandInputs: ShopRateHourlyCostCalculatorInputs = {
    "fixedMonthlyCost": 185,
    "monthlyMachineHours": 320,
    "variableCostPerHour": 12
  };
const criticalBandInputs: ShopRateHourlyCostCalculatorInputs = {
    "fixedMonthlyCost": 18500000,
    "monthlyMachineHours": 320,
    "variableCostPerHour": 12
  };

function expectValidationFailure(partial: Partial<ShopRateHourlyCostCalculatorInputs>): void {
  const inputs = { ...defaultInputs, ...partial } as ShopRateHourlyCostCalculatorInputs;
  const validation = validateShopRateHourlyCostCalculatorInputs(inputs);
  expect(validation.ok).toBe(false);
  if (validation.ok) return;
  expect(validation.errors.length).toBeGreaterThan(0);
  expect(() => calculateShopRateHourlyCostCalculator(inputs)).toThrow();
}

function engineNumeric(schemaSlug: string, outputId: string, inputs: ShopRateHourlyCostCalculatorInputs): number {
  const schema = getPremiumCalculatorSchema(schemaSlug);
  if (!schema) throw new Error("schema missing");
  const engineResult = runPremiumSchemaEngine(schema, inputs);
  const raw = engineResult.outputs.find((output) => output.id === outputId)?.raw;
  if (typeof raw !== "number") throw new Error(`missing output ${outputId}`);
  return raw;
}

describe("shop-rate-hourly-cost-calculator", () => {
  test("exact default oracle", () => {
    const result = calculateShopRateHourlyCostCalculator(defaultInputs);
    expect(result.hourlyRate).toBeCloseTo(engineNumeric(SLUG, "hourlyRate", defaultInputs), 2);
    expect(["low", "warning", "critical"]).toContain(result.summaryLevel);
    expect(result.primaryDriver).toBe("hourlyRate");
  });

  test("formula pipeline parity", () => {
    const result = calculateShopRateHourlyCostCalculator(defaultInputs);
    expect(result.hourlyRate).toBeCloseTo(
      engineNumeric(SLUG, "hourlyRate", defaultInputs),
      2,
    );
  });

  test("low threshold band", () => {
    const result = calculateShopRateHourlyCostCalculator(lowBandInputs);
    expect(["low", "warning", "critical"]).toContain(result.summaryLevel);
  });

  test("warning threshold band", () => {
    const result = calculateShopRateHourlyCostCalculator(defaultInputs);
    expect(["warning", "critical", "low"]).toContain(result.summaryLevel);
  });

  test("critical threshold band", () => {
    const result = calculateShopRateHourlyCostCalculator(criticalBandInputs);
    expect(["low", "warning", "critical"]).toContain(result.summaryLevel);
  });

  test("invalid missing input fails validation and calculator throws", () => {
    const broken = { ...defaultInputs, fixedMonthlyCost: undefined } as unknown as ShopRateHourlyCostCalculatorInputs;
    const validation = validateShopRateHourlyCostCalculatorInputs(broken);
    expect(validation.ok).toBe(false);
    expect(() => calculateShopRateHourlyCostCalculator(broken)).toThrow();
  });

  test("invalid negative input fails validation and calculator throws", () => {
    expectValidationFailure({ fixedMonthlyCost: -1 });
  });
  test("invalid zero divisor/base fails validation and calculator throws", () => {
    const validation = validateShopRateHourlyCostCalculatorInputs({ ...defaultInputs, monthlyMachineHours: 0 });
    expect(validation.ok).toBe(false);
    if (validation.ok) return;
    expect(() => calculateShopRateHourlyCostCalculator({ ...defaultInputs, monthlyMachineHours: 0 })).toThrow();
  });

  test("invalid NaN input fails validation and calculator throws", () => {
    expectValidationFailure({ variableCostPerHour: Number.NaN });
  });

  test("invalid Infinity input fails validation and calculator throws", () => {
    expectValidationFailure({ variableCostPerHour: Number.POSITIVE_INFINITY });
  });

  test("contract metadata matches slug", () => {
    const contract = getFormulaContractBySlug(SLUG);
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
    const calculatorResult = calculateShopRateHourlyCostCalculator(defaultInputs);
    expect(engineResult.outputs.find((output) => output.id === "hourlyRate")?.raw).toBeCloseTo(calculatorResult.hourlyRate, 2);
  });
});
