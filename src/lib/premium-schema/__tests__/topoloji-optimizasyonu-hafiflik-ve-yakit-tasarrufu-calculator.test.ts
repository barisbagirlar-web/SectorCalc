import { describe, expect, test } from "vitest";
import { TOPOLOJI_OPTIMIZASYONU_HAFIFLIK_VE_YAKIT_TASARRUFU_CALCULATOR_CRITICAL_FORMULA_CONTRACTS } from "@/lib/formula-governance/contracts/topoloji-optimizasyonu-hafiflik-ve-yakit-tasarrufu-calculator-critical";
import { getFormulaContractBySlug } from "@/lib/formula-governance/contracts";
import {
  calculateTopolojiOptimizasyonuHafiflikVeYakitTasarrufuCalculator,
  type TopolojiOptimizasyonuHafiflikVeYakitTasarrufuCalculatorInputs,
} from "@/lib/premium-schema/calculators/topoloji-optimizasyonu-hafiflik-ve-yakit-tasarrufu-calculator";
import { validateTopolojiOptimizasyonuHafiflikVeYakitTasarrufuCalculatorInputs } from "@/lib/premium-schema/calculators/topoloji-optimizasyonu-hafiflik-ve-yakit-tasarrufu-calculator-validation";
import { getPremiumCalculatorSchema } from "@/lib/premium-schema/schema-registry";
import {
  buildDefaultSchemaInputs,
  runPremiumSchemaEngine,
} from "@/lib/premium-schema/premium-schema-engine";

const SLUG = "topoloji-optimizasyonu-hafiflik-ve-yakit-tasarrufu-calculator";
const SCHEMA_ID = "topoloji-optimizasyonu-hafiflik-ve-yakit-tasarrufu-calculator";

const defaultInputs: TopolojiOptimizasyonuHafiflikVeYakitTasarrufuCalculatorInputs = {
    "originalWeight": 100,
    "optimizedWeight": 80,
    "annualDistanceKm": 20000,
    "fuelPricePerLiter": 1.5,
    "additionalCost": 500,
    "lifetimeYears": 10
  };
const lowBandInputs: TopolojiOptimizasyonuHafiflikVeYakitTasarrufuCalculatorInputs = {
    "originalWeight": 0.1,
    "optimizedWeight": 80,
    "annualDistanceKm": 20000,
    "fuelPricePerLiter": 1.5,
    "additionalCost": 500,
    "lifetimeYears": 10
  };
const criticalBandInputs: TopolojiOptimizasyonuHafiflikVeYakitTasarrufuCalculatorInputs = {
    "originalWeight": 6,
    "optimizedWeight": 80,
    "annualDistanceKm": 20000,
    "fuelPricePerLiter": 1.5,
    "additionalCost": 500,
    "lifetimeYears": 10
  };

function expectValidationFailure(partial: Partial<TopolojiOptimizasyonuHafiflikVeYakitTasarrufuCalculatorInputs>): void {
  const inputs = { ...defaultInputs, ...partial } as TopolojiOptimizasyonuHafiflikVeYakitTasarrufuCalculatorInputs;
  const validation = validateTopolojiOptimizasyonuHafiflikVeYakitTasarrufuCalculatorInputs(inputs);
  expect(validation.ok).toBe(false);
  if (validation.ok) return;
  expect(validation.errors.length).toBeGreaterThan(0);
  expect(() => calculateTopolojiOptimizasyonuHafiflikVeYakitTasarrufuCalculator(inputs)).toThrow();
}

function engineNumeric(schemaSlug: string, outputId: string, inputs: TopolojiOptimizasyonuHafiflikVeYakitTasarrufuCalculatorInputs): number {
  const schema = getPremiumCalculatorSchema(schemaSlug);
  if (!schema) throw new Error("schema missing");
  const engineResult = runPremiumSchemaEngine(schema, inputs);
  const raw = engineResult.outputs.find((output) => output.id === outputId)?.raw;
  if (typeof raw !== "number") throw new Error(`missing output ${outputId}`);
  return raw;
}

describe("topoloji-optimizasyonu-hafiflik-ve-yakit-tasarrufu-calculator", () => {
  test("exact default oracle", () => {
    const result = calculateTopolojiOptimizasyonuHafiflikVeYakitTasarrufuCalculator(defaultInputs);
    expect(result.totalExposure).toBeCloseTo(engineNumeric(SCHEMA_ID, "totalExposure", defaultInputs), 2);
    expect(result.variancePercent).toBeCloseTo(engineNumeric(SCHEMA_ID, "variancePercent", defaultInputs), 2);
    expect(["low", "warning", "critical"]).toContain(result.summaryLevel);
    expect(result.primaryDriver).toBe("totalExposure");
  });

  test("formula pipeline parity", () => {
    const result = calculateTopolojiOptimizasyonuHafiflikVeYakitTasarrufuCalculator(defaultInputs);
    expect(result.totalExposure).toBeCloseTo(
      engineNumeric(SCHEMA_ID, "totalExposure", defaultInputs),
      2,
    );
  });

  test("low threshold band", () => {
    const result = calculateTopolojiOptimizasyonuHafiflikVeYakitTasarrufuCalculator(lowBandInputs);
    expect(["low", "warning", "critical"]).toContain(result.summaryLevel);
  });

  test("warning threshold band", () => {
    const result = calculateTopolojiOptimizasyonuHafiflikVeYakitTasarrufuCalculator(defaultInputs);
    expect(["warning", "critical", "low"]).toContain(result.summaryLevel);
  });

  test("critical threshold band", () => {
    const result = calculateTopolojiOptimizasyonuHafiflikVeYakitTasarrufuCalculator(criticalBandInputs);
    expect(["low", "warning", "critical"]).toContain(result.summaryLevel);
  });

  test("invalid missing input fails validation and calculator throws", () => {
    const broken = { ...defaultInputs, originalWeight: undefined } as unknown as TopolojiOptimizasyonuHafiflikVeYakitTasarrufuCalculatorInputs;
    const validation = validateTopolojiOptimizasyonuHafiflikVeYakitTasarrufuCalculatorInputs(broken);
    expect(validation.ok).toBe(false);
    expect(() => calculateTopolojiOptimizasyonuHafiflikVeYakitTasarrufuCalculator(broken)).toThrow();
  });

  test("invalid negative input fails validation and calculator throws", () => {
    expectValidationFailure({ originalWeight: -1 });
  });
  test("invalid zero divisor/base fails validation and calculator throws", () => {
    const validation = validateTopolojiOptimizasyonuHafiflikVeYakitTasarrufuCalculatorInputs({ ...defaultInputs, originalWeight: 0 });
    expect(validation.ok).toBe(false);
    if (validation.ok) return;
    expect(() => calculateTopolojiOptimizasyonuHafiflikVeYakitTasarrufuCalculator({ ...defaultInputs, originalWeight: 0 })).toThrow();
  });

  test("invalid NaN input fails validation and calculator throws", () => {
    expectValidationFailure({ lifetimeYears: Number.NaN });
  });

  test("invalid Infinity input fails validation and calculator throws", () => {
    expectValidationFailure({ lifetimeYears: Number.POSITIVE_INFINITY });
  });

    test("contract metadata matches slug", () => {
    const contract = TOPOLOJI_OPTIMIZASYONU_HAFIFLIK_VE_YAKIT_TASARRUFU_CALCULATOR_CRITICAL_FORMULA_CONTRACTS[0];
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
    const calculatorResult = calculateTopolojiOptimizasyonuHafiflikVeYakitTasarrufuCalculator(defaultInputs);
    expect(engineResult.outputs.find((output) => output.id === "totalExposure")?.raw).toBeCloseTo(calculatorResult.totalExposure, 2);
    expect(engineResult.outputs.find((output) => output.id === "variancePercent")?.raw).toBeCloseTo(calculatorResult.variancePercent, 2);
  });
});
