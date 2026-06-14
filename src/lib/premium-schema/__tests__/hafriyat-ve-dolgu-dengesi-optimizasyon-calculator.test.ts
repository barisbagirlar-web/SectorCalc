import { describe, expect, test } from "vitest";
import { HAFRIYAT_VE_DOLGU_DENGESI_OPTIMIZASYON_CALCULATOR_CRITICAL_FORMULA_CONTRACTS } from "@/lib/formula-governance/contracts/hafriyat-ve-dolgu-dengesi-optimizasyon-calculator-critical";
import { getFormulaContractBySlug } from "@/lib/formula-governance/contracts";
import {
  calculateHafriyatVeDolguDengesiOptimizasyonCalculator,
  type HafriyatVeDolguDengesiOptimizasyonCalculatorInputs,
} from "@/lib/premium-schema/calculators/hafriyat-ve-dolgu-dengesi-optimizasyon-calculator";
import { validateHafriyatVeDolguDengesiOptimizasyonCalculatorInputs } from "@/lib/premium-schema/calculators/hafriyat-ve-dolgu-dengesi-optimizasyon-calculator-validation";
import { getPremiumCalculatorSchema } from "@/lib/premium-schema/schema-registry";
import {
  buildDefaultSchemaInputs,
  runPremiumSchemaEngine,
} from "@/lib/premium-schema/premium-schema-engine";

const SLUG = "hafriyat-ve-dolgu-dengesi-optimizasyon-calculator";
const SCHEMA_ID = "hafriyat-ve-dolgu-dengesi-optimizasyon-calculator";

const defaultInputs: HafriyatVeDolguDengesiOptimizasyonCalculatorInputs = {
    "cutVolume": 10000,
    "fillVolume": 8000,
    "swellPercent": 25,
    "shrinkPercent": 10,
    "cutUnitCost": 5,
    "fillUnitCost": 8
  };
const lowBandInputs: HafriyatVeDolguDengesiOptimizasyonCalculatorInputs = {
    "cutVolume": 0.1,
    "fillVolume": 8000,
    "swellPercent": 25,
    "shrinkPercent": 10,
    "cutUnitCost": 5,
    "fillUnitCost": 8
  };
const criticalBandInputs: HafriyatVeDolguDengesiOptimizasyonCalculatorInputs = {
    "cutVolume": 6,
    "fillVolume": 8000,
    "swellPercent": 25,
    "shrinkPercent": 10,
    "cutUnitCost": 5,
    "fillUnitCost": 8
  };

function expectValidationFailure(partial: Partial<HafriyatVeDolguDengesiOptimizasyonCalculatorInputs>): void {
  const inputs = { ...defaultInputs, ...partial } as HafriyatVeDolguDengesiOptimizasyonCalculatorInputs;
  const validation = validateHafriyatVeDolguDengesiOptimizasyonCalculatorInputs(inputs);
  expect(validation.ok).toBe(false);
  if (validation.ok) return;
  expect(validation.errors.length).toBeGreaterThan(0);
  expect(() => calculateHafriyatVeDolguDengesiOptimizasyonCalculator(inputs)).toThrow();
}

function engineNumeric(schemaSlug: string, outputId: string, inputs: HafriyatVeDolguDengesiOptimizasyonCalculatorInputs): number {
  const schema = getPremiumCalculatorSchema(schemaSlug);
  if (!schema) throw new Error("schema missing");
  const engineResult = runPremiumSchemaEngine(schema, inputs);
  const raw = engineResult.outputs.find((output) => output.id === outputId)?.raw;
  if (typeof raw !== "number") throw new Error(`missing output ${outputId}`);
  return raw;
}

describe("hafriyat-ve-dolgu-dengesi-optimizasyon-calculator", () => {
  test("exact default oracle", () => {
    const result = calculateHafriyatVeDolguDengesiOptimizasyonCalculator(defaultInputs);
    expect(result.totalExposure).toBeCloseTo(engineNumeric(SCHEMA_ID, "totalExposure", defaultInputs), 2);
    expect(result.variancePercent).toBeCloseTo(engineNumeric(SCHEMA_ID, "variancePercent", defaultInputs), 2);
    expect(["low", "warning", "critical"]).toContain(result.summaryLevel);
    expect(result.primaryDriver).toBe("totalExposure");
  });

  test("formula pipeline parity", () => {
    const result = calculateHafriyatVeDolguDengesiOptimizasyonCalculator(defaultInputs);
    expect(result.totalExposure).toBeCloseTo(
      engineNumeric(SCHEMA_ID, "totalExposure", defaultInputs),
      2,
    );
  });

  test("low threshold band", () => {
    const result = calculateHafriyatVeDolguDengesiOptimizasyonCalculator(lowBandInputs);
    expect(["low", "warning", "critical"]).toContain(result.summaryLevel);
  });

  test("warning threshold band", () => {
    const result = calculateHafriyatVeDolguDengesiOptimizasyonCalculator(defaultInputs);
    expect(["warning", "critical", "low"]).toContain(result.summaryLevel);
  });

  test("critical threshold band", () => {
    const result = calculateHafriyatVeDolguDengesiOptimizasyonCalculator(criticalBandInputs);
    expect(["low", "warning", "critical"]).toContain(result.summaryLevel);
  });

  test("invalid missing input fails validation and calculator throws", () => {
    const broken = { ...defaultInputs, cutVolume: undefined } as unknown as HafriyatVeDolguDengesiOptimizasyonCalculatorInputs;
    const validation = validateHafriyatVeDolguDengesiOptimizasyonCalculatorInputs(broken);
    expect(validation.ok).toBe(false);
    expect(() => calculateHafriyatVeDolguDengesiOptimizasyonCalculator(broken)).toThrow();
  });

  test("invalid negative input fails validation and calculator throws", () => {
    expectValidationFailure({ cutVolume: -1 });
  });
  test("invalid zero divisor/base fails validation and calculator throws", () => {
    const validation = validateHafriyatVeDolguDengesiOptimizasyonCalculatorInputs({ ...defaultInputs, cutVolume: 0 });
    expect(validation.ok).toBe(false);
    if (validation.ok) return;
    expect(() => calculateHafriyatVeDolguDengesiOptimizasyonCalculator({ ...defaultInputs, cutVolume: 0 })).toThrow();
  });

  test("invalid NaN input fails validation and calculator throws", () => {
    expectValidationFailure({ fillUnitCost: Number.NaN });
  });

  test("invalid Infinity input fails validation and calculator throws", () => {
    expectValidationFailure({ fillUnitCost: Number.POSITIVE_INFINITY });
  });

    test("contract metadata matches slug", () => {
    const contract = HAFRIYAT_VE_DOLGU_DENGESI_OPTIMIZASYON_CALCULATOR_CRITICAL_FORMULA_CONTRACTS[0];
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
    const calculatorResult = calculateHafriyatVeDolguDengesiOptimizasyonCalculator(defaultInputs);
    expect(engineResult.outputs.find((output) => output.id === "totalExposure")?.raw).toBeCloseTo(calculatorResult.totalExposure, 2);
    expect(engineResult.outputs.find((output) => output.id === "variancePercent")?.raw).toBeCloseTo(calculatorResult.variancePercent, 2);
  });
});
