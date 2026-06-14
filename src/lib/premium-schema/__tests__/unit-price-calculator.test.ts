import { describe, expect, test } from "vitest";
import { UNIT_PRICE_CALCULATOR_CRITICAL_FORMULA_CONTRACTS } from "@/lib/formula-governance/contracts/unit-price-calculator-critical";
import { getFormulaContractBySlug } from "@/lib/formula-governance/contracts";
import {
  calculateUnitPriceCalculator,
  type UnitPriceCalculatorInputs,
} from "@/lib/premium-schema/calculators/unit-price-calculator";
import { validateUnitPriceCalculatorInputs } from "@/lib/premium-schema/calculators/unit-price-calculator-validation";
import { getPremiumCalculatorSchema } from "@/lib/premium-schema/schema-registry";
import {
  buildDefaultSchemaInputs,
  runPremiumSchemaEngine,
} from "@/lib/premium-schema/premium-schema-engine";

const SLUG = "unit-price-calculator";
const SCHEMA_ID = "unit-price-calculator";

const defaultInputs: UnitPriceCalculatorInputs = {
    "productionQuantity": 100,
    "unitMaterialCost": 10,
    "scrapRatePercent": 5,
    "laborCostPerUnit": 5,
    "overheadRatePercent": 20
  };
const lowBandInputs: UnitPriceCalculatorInputs = {
    "productionQuantity": 1,
    "unitMaterialCost": 10,
    "scrapRatePercent": 5,
    "laborCostPerUnit": 5,
    "overheadRatePercent": 20
  };
const criticalBandInputs: UnitPriceCalculatorInputs = {
    "productionQuantity": 6,
    "unitMaterialCost": 10,
    "scrapRatePercent": 5,
    "laborCostPerUnit": 5,
    "overheadRatePercent": 20
  };

function expectValidationFailure(partial: Partial<UnitPriceCalculatorInputs>): void {
  const inputs = { ...defaultInputs, ...partial } as UnitPriceCalculatorInputs;
  const validation = validateUnitPriceCalculatorInputs(inputs);
  expect(validation.ok).toBe(false);
  if (validation.ok) return;
  expect(validation.errors.length).toBeGreaterThan(0);
  expect(() => calculateUnitPriceCalculator(inputs)).toThrow();
}

function engineNumeric(schemaSlug: string, outputId: string, inputs: UnitPriceCalculatorInputs): number {
  const schema = getPremiumCalculatorSchema(schemaSlug);
  if (!schema) throw new Error("schema missing");
  const engineResult = runPremiumSchemaEngine(schema, inputs);
  const raw = engineResult.outputs.find((output) => output.id === outputId)?.raw;
  if (typeof raw !== "number") throw new Error(`missing output ${outputId}`);
  return raw;
}

describe("unit-price-calculator", () => {
  test("exact default oracle", () => {
    const result = calculateUnitPriceCalculator(defaultInputs);
    expect(result.totalExposure).toBeCloseTo(engineNumeric(SCHEMA_ID, "totalExposure", defaultInputs), 2);
    expect(result.variancePercent).toBeCloseTo(engineNumeric(SCHEMA_ID, "variancePercent", defaultInputs), 2);
    expect(["low", "warning", "critical"]).toContain(result.summaryLevel);
    expect(result.primaryDriver).toBe("totalExposure");
  });

  test("formula pipeline parity", () => {
    const result = calculateUnitPriceCalculator(defaultInputs);
    expect(result.totalExposure).toBeCloseTo(
      engineNumeric(SCHEMA_ID, "totalExposure", defaultInputs),
      2,
    );
  });

  test("low threshold band", () => {
    const result = calculateUnitPriceCalculator(lowBandInputs);
    expect(["low", "warning", "critical"]).toContain(result.summaryLevel);
  });

  test("warning threshold band", () => {
    const result = calculateUnitPriceCalculator(defaultInputs);
    expect(["warning", "critical", "low"]).toContain(result.summaryLevel);
  });

  test("critical threshold band", () => {
    const result = calculateUnitPriceCalculator(criticalBandInputs);
    expect(["low", "warning", "critical"]).toContain(result.summaryLevel);
  });

  test("invalid missing input fails validation and calculator throws", () => {
    const broken = { ...defaultInputs, productionQuantity: undefined } as unknown as UnitPriceCalculatorInputs;
    const validation = validateUnitPriceCalculatorInputs(broken);
    expect(validation.ok).toBe(false);
    expect(() => calculateUnitPriceCalculator(broken)).toThrow();
  });

  test("invalid negative input fails validation and calculator throws", () => {
    expectValidationFailure({ productionQuantity: -1 });
  });
  test("invalid zero divisor/base fails validation and calculator throws", () => {
    const validation = validateUnitPriceCalculatorInputs({ ...defaultInputs, productionQuantity: 0 });
    expect(validation.ok).toBe(false);
    if (validation.ok) return;
    expect(() => calculateUnitPriceCalculator({ ...defaultInputs, productionQuantity: 0 })).toThrow();
  });

  test("invalid NaN input fails validation and calculator throws", () => {
    expectValidationFailure({ overheadRatePercent: Number.NaN });
  });

  test("invalid Infinity input fails validation and calculator throws", () => {
    expectValidationFailure({ overheadRatePercent: Number.POSITIVE_INFINITY });
  });

    test("contract metadata matches slug", () => {
    const contract = UNIT_PRICE_CALCULATOR_CRITICAL_FORMULA_CONTRACTS[0];
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
    const calculatorResult = calculateUnitPriceCalculator(defaultInputs);
    expect(engineResult.outputs.find((output) => output.id === "totalExposure")?.raw).toBeCloseTo(calculatorResult.totalExposure, 2);
    expect(engineResult.outputs.find((output) => output.id === "variancePercent")?.raw).toBeCloseTo(calculatorResult.variancePercent, 2);
  });
});
