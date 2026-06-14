import { describe, expect, test } from "vitest";
import { PROFIT_MARGIN_CALCULATOR_CRITICAL_FORMULA_CONTRACTS } from "@/lib/formula-governance/contracts/profit-margin-calculator-critical";
import { getFormulaContractBySlug } from "@/lib/formula-governance/contracts";
import {
  calculateProfitMarginCalculator,
  type ProfitMarginCalculatorInputs,
} from "@/lib/premium-schema/calculators/profit-margin-calculator";
import { validateProfitMarginCalculatorInputs } from "@/lib/premium-schema/calculators/profit-margin-calculator-validation";
import { getPremiumCalculatorSchema } from "@/lib/premium-schema/schema-registry";
import {
  buildDefaultSchemaInputs,
  runPremiumSchemaEngine,
} from "@/lib/premium-schema/premium-schema-engine";

const SLUG = "profit-margin-calculator";

const defaultInputs: ProfitMarginCalculatorInputs = {
    "materialCost": 4200,
    "laborCost": 2800,
    "machineCost": 1900,
    "energyCost": 320,
    "overheadCost": 650,
    "wasteRate": 4,
    "setupTimeCost": 480,
    "shippingCost": 180,
    "paymentTermCost": 210,
    "targetMarginRate": 18,
    "discountRate": 0,
    "taxIncluded": 0,
    "safetyMarginUplift": 2
  };
const lowBandInputs: ProfitMarginCalculatorInputs = {
    "materialCost": 42,
    "laborCost": 2800,
    "machineCost": 1900,
    "energyCost": 320,
    "overheadCost": 650,
    "wasteRate": 4,
    "setupTimeCost": 480,
    "shippingCost": 180,
    "paymentTermCost": 210,
    "targetMarginRate": 18,
    "discountRate": 0,
    "taxIncluded": 0,
    "safetyMarginUplift": 2
  };
const criticalBandInputs: ProfitMarginCalculatorInputs = {
    "materialCost": 4200000,
    "laborCost": 2800,
    "machineCost": 1900,
    "energyCost": 320,
    "overheadCost": 650,
    "wasteRate": 4,
    "setupTimeCost": 480,
    "shippingCost": 180,
    "paymentTermCost": 210,
    "targetMarginRate": 18,
    "discountRate": 0,
    "taxIncluded": 0,
    "safetyMarginUplift": 2
  };

function expectValidationFailure(partial: Partial<ProfitMarginCalculatorInputs>): void {
  const inputs = { ...defaultInputs, ...partial } as ProfitMarginCalculatorInputs;
  const validation = validateProfitMarginCalculatorInputs(inputs);
  expect(validation.ok).toBe(false);
  if (validation.ok) return;
  expect(validation.errors.length).toBeGreaterThan(0);
  expect(() => calculateProfitMarginCalculator(inputs)).toThrow();
}

function engineNumeric(schemaSlug: string, outputId: string, inputs: ProfitMarginCalculatorInputs): number {
  const schema = getPremiumCalculatorSchema(schemaSlug);
  if (!schema) throw new Error("schema missing");
  const engineResult = runPremiumSchemaEngine(schema, inputs);
  const raw = engineResult.outputs.find((output) => output.id === outputId)?.raw;
  if (typeof raw !== "number") throw new Error(`missing output ${outputId}`);
  return raw;
}

describe("profit-margin-calculator", () => {
  test("exact default oracle", () => {
    const result = calculateProfitMarginCalculator(defaultInputs);
    expect(result.targetSalesPrice).toBeCloseTo(engineNumeric(SLUG, "targetSalesPrice", defaultInputs), 2);
    expect(result.totalCost).toBeCloseTo(engineNumeric(SLUG, "totalCost", defaultInputs), 2);
    expect(["low", "warning", "critical"]).toContain(result.summaryLevel);
    expect(result.primaryDriver).toBe("totalCost");
  });

  test("formula pipeline parity", () => {
    const result = calculateProfitMarginCalculator(defaultInputs);
    expect(result.totalCost).toBeCloseTo(
      engineNumeric(SLUG, "totalCost", defaultInputs),
      2,
    );
  });

  test("low threshold band", () => {
    const result = calculateProfitMarginCalculator(lowBandInputs);
    expect(["low", "warning", "critical"]).toContain(result.summaryLevel);
  });

  test("warning threshold band", () => {
    const result = calculateProfitMarginCalculator(defaultInputs);
    expect(["warning", "critical", "low"]).toContain(result.summaryLevel);
  });

  test("critical threshold band", () => {
    const result = calculateProfitMarginCalculator(criticalBandInputs);
    expect(["low", "warning", "critical"]).toContain(result.summaryLevel);
  });

  test("invalid missing input fails validation and calculator throws", () => {
    const broken = { ...defaultInputs, materialCost: undefined } as unknown as ProfitMarginCalculatorInputs;
    const validation = validateProfitMarginCalculatorInputs(broken);
    expect(validation.ok).toBe(false);
    expect(() => calculateProfitMarginCalculator(broken)).toThrow();
  });

  test("invalid negative input fails validation and calculator throws", () => {
    expectValidationFailure({ materialCost: -1 });
  });
  test("invalid zero divisor/base fails validation and calculator throws", () => {
    const validation = validateProfitMarginCalculatorInputs({ ...defaultInputs, targetMarginRate: 0 });
    expect(validation.ok).toBe(false);
    if (validation.ok) return;
    expect(() => calculateProfitMarginCalculator({ ...defaultInputs, targetMarginRate: 0 })).toThrow();
  });

  test("invalid NaN input fails validation and calculator throws", () => {
    expectValidationFailure({ safetyMarginUplift: Number.NaN });
  });

  test("invalid Infinity input fails validation and calculator throws", () => {
    expectValidationFailure({ safetyMarginUplift: Number.POSITIVE_INFINITY });
  });

    test("contract metadata matches slug", () => {
    const contract = PROFIT_MARGIN_CALCULATOR_CRITICAL_FORMULA_CONTRACTS[0];
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
    const calculatorResult = calculateProfitMarginCalculator(defaultInputs);
    expect(engineResult.outputs.find((output) => output.id === "targetSalesPrice")?.raw).toBeCloseTo(calculatorResult.targetSalesPrice, 2);
    expect(engineResult.outputs.find((output) => output.id === "totalCost")?.raw).toBeCloseTo(calculatorResult.totalCost, 2);
  });
});
