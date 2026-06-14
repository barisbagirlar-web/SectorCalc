import { describe, expect, test } from "vitest";
import { DEPO_YERLESIMI_VE_TOPLAMA_ROTASI_OPTIMIZASYON_CALCULATOR_CRITICAL_FORMULA_CONTRACTS } from "@/lib/formula-governance/contracts/depo-yerlesimi-ve-toplama-rotasi-optimizasyon-calculator-critical";
import { getFormulaContractBySlug } from "@/lib/formula-governance/contracts";
import {
  calculateDepoYerlesimiVeToplamaRotasiOptimizasyonCalculator,
  type DepoYerlesimiVeToplamaRotasiOptimizasyonCalculatorInputs,
} from "@/lib/premium-schema/calculators/depo-yerlesimi-ve-toplama-rotasi-optimizasyon-calculator";
import { validateDepoYerlesimiVeToplamaRotasiOptimizasyonCalculatorInputs } from "@/lib/premium-schema/calculators/depo-yerlesimi-ve-toplama-rotasi-optimizasyon-calculator-validation";
import { getPremiumCalculatorSchema } from "@/lib/premium-schema/schema-registry";
import {
  buildDefaultSchemaInputs,
  runPremiumSchemaEngine,
} from "@/lib/premium-schema/premium-schema-engine";

const SLUG = "depo-yerlesimi-ve-toplama-rotasi-optimizasyon-calculator";
const SCHEMA_ID = "depo-yerlesimi-ve-toplama-rotasi-optimizasyon-calculator";

const defaultInputs: DepoYerlesimiVeToplamaRotasiOptimizasyonCalculatorInputs = {
    "pickQuantity": 100,
    "averageTravelDistancePerPick": 50,
    "optimalRouteDistance": 30,
    "laborRatePerHour": 25,
    "averageTravelSpeed": 60,
    "slottingScore": 70
  };
const lowBandInputs: DepoYerlesimiVeToplamaRotasiOptimizasyonCalculatorInputs = {
    "pickQuantity": 1,
    "averageTravelDistancePerPick": 50,
    "optimalRouteDistance": 30,
    "laborRatePerHour": 25,
    "averageTravelSpeed": 60,
    "slottingScore": 70
  };
const criticalBandInputs: DepoYerlesimiVeToplamaRotasiOptimizasyonCalculatorInputs = {
    "pickQuantity": 6,
    "averageTravelDistancePerPick": 50,
    "optimalRouteDistance": 30,
    "laborRatePerHour": 25,
    "averageTravelSpeed": 60,
    "slottingScore": 70
  };

function expectValidationFailure(partial: Partial<DepoYerlesimiVeToplamaRotasiOptimizasyonCalculatorInputs>): void {
  const inputs = { ...defaultInputs, ...partial } as DepoYerlesimiVeToplamaRotasiOptimizasyonCalculatorInputs;
  const validation = validateDepoYerlesimiVeToplamaRotasiOptimizasyonCalculatorInputs(inputs);
  expect(validation.ok).toBe(false);
  if (validation.ok) return;
  expect(validation.errors.length).toBeGreaterThan(0);
  expect(() => calculateDepoYerlesimiVeToplamaRotasiOptimizasyonCalculator(inputs)).toThrow();
}

function engineNumeric(schemaSlug: string, outputId: string, inputs: DepoYerlesimiVeToplamaRotasiOptimizasyonCalculatorInputs): number {
  const schema = getPremiumCalculatorSchema(schemaSlug);
  if (!schema) throw new Error("schema missing");
  const engineResult = runPremiumSchemaEngine(schema, inputs);
  const raw = engineResult.outputs.find((output) => output.id === outputId)?.raw;
  if (typeof raw !== "number") throw new Error(`missing output ${outputId}`);
  return raw;
}

describe("depo-yerlesimi-ve-toplama-rotasi-optimizasyon-calculator", () => {
  test("exact default oracle", () => {
    const result = calculateDepoYerlesimiVeToplamaRotasiOptimizasyonCalculator(defaultInputs);
    expect(result.totalExposure).toBeCloseTo(engineNumeric(SCHEMA_ID, "totalExposure", defaultInputs), 2);
    expect(result.variancePercent).toBeCloseTo(engineNumeric(SCHEMA_ID, "variancePercent", defaultInputs), 2);
    expect(["low", "warning", "critical"]).toContain(result.summaryLevel);
    expect(result.primaryDriver).toBe("totalExposure");
  });

  test("formula pipeline parity", () => {
    const result = calculateDepoYerlesimiVeToplamaRotasiOptimizasyonCalculator(defaultInputs);
    expect(result.totalExposure).toBeCloseTo(
      engineNumeric(SCHEMA_ID, "totalExposure", defaultInputs),
      2,
    );
  });

  test("low threshold band", () => {
    const result = calculateDepoYerlesimiVeToplamaRotasiOptimizasyonCalculator(lowBandInputs);
    expect(["low", "warning", "critical"]).toContain(result.summaryLevel);
  });

  test("warning threshold band", () => {
    const result = calculateDepoYerlesimiVeToplamaRotasiOptimizasyonCalculator(defaultInputs);
    expect(["warning", "critical", "low"]).toContain(result.summaryLevel);
  });

  test("critical threshold band", () => {
    const result = calculateDepoYerlesimiVeToplamaRotasiOptimizasyonCalculator(criticalBandInputs);
    expect(["low", "warning", "critical"]).toContain(result.summaryLevel);
  });

  test("invalid missing input fails validation and calculator throws", () => {
    const broken = { ...defaultInputs, pickQuantity: undefined } as unknown as DepoYerlesimiVeToplamaRotasiOptimizasyonCalculatorInputs;
    const validation = validateDepoYerlesimiVeToplamaRotasiOptimizasyonCalculatorInputs(broken);
    expect(validation.ok).toBe(false);
    expect(() => calculateDepoYerlesimiVeToplamaRotasiOptimizasyonCalculator(broken)).toThrow();
  });

  test("invalid negative input fails validation and calculator throws", () => {
    expectValidationFailure({ pickQuantity: -1 });
  });
  test("invalid zero divisor/base fails validation and calculator throws", () => {
    const validation = validateDepoYerlesimiVeToplamaRotasiOptimizasyonCalculatorInputs({ ...defaultInputs, pickQuantity: 0 });
    expect(validation.ok).toBe(false);
    if (validation.ok) return;
    expect(() => calculateDepoYerlesimiVeToplamaRotasiOptimizasyonCalculator({ ...defaultInputs, pickQuantity: 0 })).toThrow();
  });

  test("invalid NaN input fails validation and calculator throws", () => {
    expectValidationFailure({ slottingScore: Number.NaN });
  });

  test("invalid Infinity input fails validation and calculator throws", () => {
    expectValidationFailure({ slottingScore: Number.POSITIVE_INFINITY });
  });

    test("contract metadata matches slug", () => {
    const contract = DEPO_YERLESIMI_VE_TOPLAMA_ROTASI_OPTIMIZASYON_CALCULATOR_CRITICAL_FORMULA_CONTRACTS[0];
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
    const calculatorResult = calculateDepoYerlesimiVeToplamaRotasiOptimizasyonCalculator(defaultInputs);
    expect(engineResult.outputs.find((output) => output.id === "totalExposure")?.raw).toBeCloseTo(calculatorResult.totalExposure, 2);
    expect(engineResult.outputs.find((output) => output.id === "variancePercent")?.raw).toBeCloseTo(calculatorResult.variancePercent, 2);
  });
});
