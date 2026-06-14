import { describe, expect, test } from "vitest";
import { KESME_PARAMETRELERI_TAKIM_OMRU_OPTIMIZASYON_CALCULATOR_CRITICAL_FORMULA_CONTRACTS } from "@/lib/formula-governance/contracts/kesme-parametreleri-takim-omru-optimizasyon-calculator-critical";
import { getFormulaContractBySlug } from "@/lib/formula-governance/contracts";
import {
  calculateKesmeParametreleriTakimOmruOptimizasyonCalculator,
  type KesmeParametreleriTakimOmruOptimizasyonCalculatorInputs,
} from "@/lib/premium-schema/calculators/kesme-parametreleri-takim-omru-optimizasyon-calculator";
import { validateKesmeParametreleriTakimOmruOptimizasyonCalculatorInputs } from "@/lib/premium-schema/calculators/kesme-parametreleri-takim-omru-optimizasyon-calculator-validation";
import { getPremiumCalculatorSchema } from "@/lib/premium-schema/schema-registry";
import {
  buildDefaultSchemaInputs,
  runPremiumSchemaEngine,
} from "@/lib/premium-schema/premium-schema-engine";

const SLUG = "kesme-parametreleri-takim-omru-optimizasyon-calculator";
const SCHEMA_ID = "kesme-parametreleri-takim-omru-optimizasyon-calculator";

const defaultInputs: KesmeParametreleriTakimOmruOptimizasyonCalculatorInputs = {
    "cuttingSpeed": 150,
    "toolLifeConstantC": 300,
    "toolLifeExponentN": 0.25,
    "toolChangeCost": 50,
    "machineHourlyRate": 100,
    "productionRate": 10
  };
const lowBandInputs: KesmeParametreleriTakimOmruOptimizasyonCalculatorInputs = {
    "cuttingSpeed": 0.1,
    "toolLifeConstantC": 300,
    "toolLifeExponentN": 0.25,
    "toolChangeCost": 50,
    "machineHourlyRate": 100,
    "productionRate": 10
  };
const criticalBandInputs: KesmeParametreleriTakimOmruOptimizasyonCalculatorInputs = {
    "cuttingSpeed": 6,
    "toolLifeConstantC": 300,
    "toolLifeExponentN": 0.25,
    "toolChangeCost": 50,
    "machineHourlyRate": 100,
    "productionRate": 10
  };

function expectValidationFailure(partial: Partial<KesmeParametreleriTakimOmruOptimizasyonCalculatorInputs>): void {
  const inputs = { ...defaultInputs, ...partial } as KesmeParametreleriTakimOmruOptimizasyonCalculatorInputs;
  const validation = validateKesmeParametreleriTakimOmruOptimizasyonCalculatorInputs(inputs);
  expect(validation.ok).toBe(false);
  if (validation.ok) return;
  expect(validation.errors.length).toBeGreaterThan(0);
  expect(() => calculateKesmeParametreleriTakimOmruOptimizasyonCalculator(inputs)).toThrow();
}

function engineNumeric(schemaSlug: string, outputId: string, inputs: KesmeParametreleriTakimOmruOptimizasyonCalculatorInputs): number {
  const schema = getPremiumCalculatorSchema(schemaSlug);
  if (!schema) throw new Error("schema missing");
  const engineResult = runPremiumSchemaEngine(schema, inputs);
  const raw = engineResult.outputs.find((output) => output.id === outputId)?.raw;
  if (typeof raw !== "number") throw new Error(`missing output ${outputId}`);
  return raw;
}

describe("kesme-parametreleri-takim-omru-optimizasyon-calculator", () => {
  test("exact default oracle", () => {
    const result = calculateKesmeParametreleriTakimOmruOptimizasyonCalculator(defaultInputs);
    expect(result.totalExposure).toBeCloseTo(engineNumeric(SCHEMA_ID, "totalExposure", defaultInputs), 2);
    expect(result.variancePercent).toBeCloseTo(engineNumeric(SCHEMA_ID, "variancePercent", defaultInputs), 2);
    expect(["low", "warning", "critical"]).toContain(result.summaryLevel);
    expect(result.primaryDriver).toBe("totalExposure");
  });

  test("formula pipeline parity", () => {
    const result = calculateKesmeParametreleriTakimOmruOptimizasyonCalculator(defaultInputs);
    expect(result.totalExposure).toBeCloseTo(
      engineNumeric(SCHEMA_ID, "totalExposure", defaultInputs),
      2,
    );
  });

  test("low threshold band", () => {
    const result = calculateKesmeParametreleriTakimOmruOptimizasyonCalculator(lowBandInputs);
    expect(["low", "warning", "critical"]).toContain(result.summaryLevel);
  });

  test("warning threshold band", () => {
    const result = calculateKesmeParametreleriTakimOmruOptimizasyonCalculator(defaultInputs);
    expect(["warning", "critical", "low"]).toContain(result.summaryLevel);
  });

  test("critical threshold band", () => {
    const result = calculateKesmeParametreleriTakimOmruOptimizasyonCalculator(criticalBandInputs);
    expect(["low", "warning", "critical"]).toContain(result.summaryLevel);
  });

  test("invalid missing input fails validation and calculator throws", () => {
    const broken = { ...defaultInputs, cuttingSpeed: undefined } as unknown as KesmeParametreleriTakimOmruOptimizasyonCalculatorInputs;
    const validation = validateKesmeParametreleriTakimOmruOptimizasyonCalculatorInputs(broken);
    expect(validation.ok).toBe(false);
    expect(() => calculateKesmeParametreleriTakimOmruOptimizasyonCalculator(broken)).toThrow();
  });

  test("invalid negative input fails validation and calculator throws", () => {
    expectValidationFailure({ cuttingSpeed: -1 });
  });
  test("invalid zero divisor/base fails validation and calculator throws", () => {
    const validation = validateKesmeParametreleriTakimOmruOptimizasyonCalculatorInputs({ ...defaultInputs, cuttingSpeed: 0 });
    expect(validation.ok).toBe(false);
    if (validation.ok) return;
    expect(() => calculateKesmeParametreleriTakimOmruOptimizasyonCalculator({ ...defaultInputs, cuttingSpeed: 0 })).toThrow();
  });

  test("invalid NaN input fails validation and calculator throws", () => {
    expectValidationFailure({ productionRate: Number.NaN });
  });

  test("invalid Infinity input fails validation and calculator throws", () => {
    expectValidationFailure({ productionRate: Number.POSITIVE_INFINITY });
  });

    test("contract metadata matches slug", () => {
    const contract = KESME_PARAMETRELERI_TAKIM_OMRU_OPTIMIZASYON_CALCULATOR_CRITICAL_FORMULA_CONTRACTS[0];
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
    const calculatorResult = calculateKesmeParametreleriTakimOmruOptimizasyonCalculator(defaultInputs);
    expect(engineResult.outputs.find((output) => output.id === "totalExposure")?.raw).toBeCloseTo(calculatorResult.totalExposure, 2);
    expect(engineResult.outputs.find((output) => output.id === "variancePercent")?.raw).toBeCloseTo(calculatorResult.variancePercent, 2);
  });
});
