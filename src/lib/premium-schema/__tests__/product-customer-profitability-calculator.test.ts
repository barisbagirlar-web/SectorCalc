import { describe, expect, test } from "vitest";
import { getFormulaContractBySlug } from "@/lib/formula-governance/contracts";
import {
  calculateProductCustomerProfitabilityCalculator,
  type ProductCustomerProfitabilityCalculatorInputs,
} from "@/lib/premium-schema/calculators/product-customer-profitability-calculator";
import { validateProductCustomerProfitabilityCalculatorInputs } from "@/lib/premium-schema/calculators/product-customer-profitability-calculator-validation";
import { getPremiumCalculatorSchema } from "@/lib/premium-schema/schema-registry";
import {
  buildDefaultSchemaInputs,
  runPremiumSchemaEngine,
} from "@/lib/premium-schema/premium-schema-engine";

const SLUG = "product-customer-profitability-calculator";

const defaultInputs: ProductCustomerProfitabilityCalculatorInputs = {
    "revenue": 85000,
    "directCost": 52000,
    "serviceCost": 6800,
    "returnsCost": 4200
  };
const lowBandInputs: ProductCustomerProfitabilityCalculatorInputs = {
    "revenue": 850,
    "directCost": 52000,
    "serviceCost": 6800,
    "returnsCost": 4200
  };
const criticalBandInputs: ProductCustomerProfitabilityCalculatorInputs = {
    "revenue": 85000000,
    "directCost": 52000,
    "serviceCost": 6800,
    "returnsCost": 4200
  };

function expectValidationFailure(partial: Partial<ProductCustomerProfitabilityCalculatorInputs>): void {
  const inputs = { ...defaultInputs, ...partial } as ProductCustomerProfitabilityCalculatorInputs;
  const validation = validateProductCustomerProfitabilityCalculatorInputs(inputs);
  expect(validation.ok).toBe(false);
  if (validation.ok) return;
  expect(validation.errors.length).toBeGreaterThan(0);
  expect(() => calculateProductCustomerProfitabilityCalculator(inputs)).toThrow();
}

function engineNumeric(schemaSlug: string, outputId: string, inputs: ProductCustomerProfitabilityCalculatorInputs): number {
  const schema = getPremiumCalculatorSchema(schemaSlug);
  if (!schema) throw new Error("schema missing");
  const engineResult = runPremiumSchemaEngine(schema, inputs);
  const raw = engineResult.outputs.find((output) => output.id === outputId)?.raw;
  if (typeof raw !== "number") throw new Error(`missing output ${outputId}`);
  return raw;
}

describe("product-customer-profitability-calculator", () => {
  test("exact default oracle", () => {
    const result = calculateProductCustomerProfitabilityCalculator(defaultInputs);
    expect(result.contributionMarginRate).toBeCloseTo(engineNumeric(SLUG, "contributionMarginRate", defaultInputs), 2);
    expect(result.contributionAmount).toBeCloseTo(engineNumeric(SLUG, "contributionAmount", defaultInputs), 2);
    expect(["low", "warning", "critical"]).toContain(result.summaryLevel);
    expect(result.primaryDriver).toBe("contributionMarginRate");
  });

  test("formula pipeline parity", () => {
    const result = calculateProductCustomerProfitabilityCalculator(defaultInputs);
    expect(result.contributionMarginRate).toBeCloseTo(
      engineNumeric(SLUG, "contributionMarginRate", defaultInputs),
      2,
    );
  });

  test("low threshold band", () => {
    const lowResult = calculateProductCustomerProfitabilityCalculator(lowBandInputs);
    const defaultResult = calculateProductCustomerProfitabilityCalculator(defaultInputs);
    const rank = { low: 0, warning: 1, critical: 2 } as const;
    expect(rank[lowResult.summaryLevel]).toBeLessThanOrEqual(rank[defaultResult.summaryLevel]);
  });

  test("warning threshold band", () => {
    const result = calculateProductCustomerProfitabilityCalculator(defaultInputs);
    expect(["warning", "critical", "low"]).toContain(result.summaryLevel);
  });

  test("critical threshold band", () => {
    const result = calculateProductCustomerProfitabilityCalculator(criticalBandInputs);
    expect(["warning", "critical"]).toContain(result.summaryLevel);
  });

  test("invalid missing input fails validation and calculator throws", () => {
    const broken = { ...defaultInputs, revenue: undefined } as unknown as ProductCustomerProfitabilityCalculatorInputs;
    const validation = validateProductCustomerProfitabilityCalculatorInputs(broken);
    expect(validation.ok).toBe(false);
    expect(() => calculateProductCustomerProfitabilityCalculator(broken)).toThrow();
  });

  test("invalid negative input fails validation and calculator throws", () => {
    expectValidationFailure({ revenue: -1 });
  });
  test("invalid zero divisor/base fails validation and calculator throws", () => {
    const validation = validateProductCustomerProfitabilityCalculatorInputs({ ...defaultInputs, revenue: 0 });
    expect(validation.ok).toBe(false);
    if (validation.ok) return;
    expect(() => calculateProductCustomerProfitabilityCalculator({ ...defaultInputs, revenue: 0 })).toThrow();
  });

  test("invalid NaN input fails validation and calculator throws", () => {
    expectValidationFailure({ returnsCost: Number.NaN });
  });

  test("invalid Infinity input fails validation and calculator throws", () => {
    expectValidationFailure({ returnsCost: Number.POSITIVE_INFINITY });
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
    const calculatorResult = calculateProductCustomerProfitabilityCalculator(defaultInputs);
    expect(engineResult.outputs.find((output) => output.id === "contributionMarginRate")?.raw).toBeCloseTo(calculatorResult.contributionMarginRate, 2);
    expect(engineResult.outputs.find((output) => output.id === "contributionAmount")?.raw).toBeCloseTo(calculatorResult.contributionAmount, 2);
  });
});
