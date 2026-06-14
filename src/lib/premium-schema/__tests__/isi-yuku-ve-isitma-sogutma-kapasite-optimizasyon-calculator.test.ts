import { describe, expect, test } from "vitest";
import { ISI_YUKU_VE_ISITMA_SOGUTMA_KAPASITE_OPTIMIZASYON_CALCULATOR_CRITICAL_FORMULA_CONTRACTS } from "@/lib/formula-governance/contracts/isi-yuku-ve-isitma-sogutma-kapasite-optimizasyon-calculator-critical";
import { getFormulaContractBySlug } from "@/lib/formula-governance/contracts";
import {
  calculateIsiYukuVeIsitmaSogutmaKapasiteOptimizasyonCalculator,
  type IsiYukuVeIsitmaSogutmaKapasiteOptimizasyonCalculatorInputs,
} from "@/lib/premium-schema/calculators/isi-yuku-ve-isitma-sogutma-kapasite-optimizasyon-calculator";
import { validateIsiYukuVeIsitmaSogutmaKapasiteOptimizasyonCalculatorInputs } from "@/lib/premium-schema/calculators/isi-yuku-ve-isitma-sogutma-kapasite-optimizasyon-calculator-validation";
import { getPremiumCalculatorSchema } from "@/lib/premium-schema/schema-registry";
import {
  buildDefaultSchemaInputs,
  runPremiumSchemaEngine,
} from "@/lib/premium-schema/premium-schema-engine";

const SLUG = "isi-yuku-ve-isitma-sogutma-kapasite-optimizasyon-calculator";
const SCHEMA_ID = "isi-yuku-ve-isitma-sogutma-kapasite-optimizasyon-calculator";

const defaultInputs: IsiYukuVeIsitmaSogutmaKapasiteOptimizasyonCalculatorInputs = {
    "powerKw": 100,
    "runtimeHours": 8,
    "energyConsumptionKwh": 800,
    "tariffPerKwh": 0.12,
    "peakDemandKw": 150,
    "efficiencyPercent": 85
  };
const lowBandInputs: IsiYukuVeIsitmaSogutmaKapasiteOptimizasyonCalculatorInputs = {
    "powerKw": 0.1,
    "runtimeHours": 8,
    "energyConsumptionKwh": 800,
    "tariffPerKwh": 0.12,
    "peakDemandKw": 150,
    "efficiencyPercent": 85
  };
const criticalBandInputs: IsiYukuVeIsitmaSogutmaKapasiteOptimizasyonCalculatorInputs = {
    "powerKw": 6,
    "runtimeHours": 8,
    "energyConsumptionKwh": 800,
    "tariffPerKwh": 0.12,
    "peakDemandKw": 150,
    "efficiencyPercent": 85
  };

function expectValidationFailure(partial: Partial<IsiYukuVeIsitmaSogutmaKapasiteOptimizasyonCalculatorInputs>): void {
  const inputs = { ...defaultInputs, ...partial } as IsiYukuVeIsitmaSogutmaKapasiteOptimizasyonCalculatorInputs;
  const validation = validateIsiYukuVeIsitmaSogutmaKapasiteOptimizasyonCalculatorInputs(inputs);
  expect(validation.ok).toBe(false);
  if (validation.ok) return;
  expect(validation.errors.length).toBeGreaterThan(0);
  expect(() => calculateIsiYukuVeIsitmaSogutmaKapasiteOptimizasyonCalculator(inputs)).toThrow();
}

function engineNumeric(schemaSlug: string, outputId: string, inputs: IsiYukuVeIsitmaSogutmaKapasiteOptimizasyonCalculatorInputs): number {
  const schema = getPremiumCalculatorSchema(schemaSlug);
  if (!schema) throw new Error("schema missing");
  const engineResult = runPremiumSchemaEngine(schema, inputs);
  const raw = engineResult.outputs.find((output) => output.id === outputId)?.raw;
  if (typeof raw !== "number") throw new Error(`missing output ${outputId}`);
  return raw;
}

describe("isi-yuku-ve-isitma-sogutma-kapasite-optimizasyon-calculator", () => {
  test("exact default oracle", () => {
    const result = calculateIsiYukuVeIsitmaSogutmaKapasiteOptimizasyonCalculator(defaultInputs);
    expect(result.totalExposure).toBeCloseTo(engineNumeric(SCHEMA_ID, "totalExposure", defaultInputs), 2);
    expect(result.variancePercent).toBeCloseTo(engineNumeric(SCHEMA_ID, "variancePercent", defaultInputs), 2);
    expect(["low", "warning", "critical"]).toContain(result.summaryLevel);
    expect(result.primaryDriver).toBe("totalExposure");
  });

  test("formula pipeline parity", () => {
    const result = calculateIsiYukuVeIsitmaSogutmaKapasiteOptimizasyonCalculator(defaultInputs);
    expect(result.totalExposure).toBeCloseTo(
      engineNumeric(SCHEMA_ID, "totalExposure", defaultInputs),
      2,
    );
  });

  test("low threshold band", () => {
    const result = calculateIsiYukuVeIsitmaSogutmaKapasiteOptimizasyonCalculator(lowBandInputs);
    expect(["low", "warning", "critical"]).toContain(result.summaryLevel);
  });

  test("warning threshold band", () => {
    const result = calculateIsiYukuVeIsitmaSogutmaKapasiteOptimizasyonCalculator(defaultInputs);
    expect(["warning", "critical", "low"]).toContain(result.summaryLevel);
  });

  test("critical threshold band", () => {
    const result = calculateIsiYukuVeIsitmaSogutmaKapasiteOptimizasyonCalculator(criticalBandInputs);
    expect(["low", "warning", "critical"]).toContain(result.summaryLevel);
  });

  test("invalid missing input fails validation and calculator throws", () => {
    const broken = { ...defaultInputs, powerKw: undefined } as unknown as IsiYukuVeIsitmaSogutmaKapasiteOptimizasyonCalculatorInputs;
    const validation = validateIsiYukuVeIsitmaSogutmaKapasiteOptimizasyonCalculatorInputs(broken);
    expect(validation.ok).toBe(false);
    expect(() => calculateIsiYukuVeIsitmaSogutmaKapasiteOptimizasyonCalculator(broken)).toThrow();
  });

  test("invalid negative input fails validation and calculator throws", () => {
    expectValidationFailure({ powerKw: -1 });
  });
  test("invalid zero divisor/base fails validation and calculator throws", () => {
    const validation = validateIsiYukuVeIsitmaSogutmaKapasiteOptimizasyonCalculatorInputs({ ...defaultInputs, efficiencyPercent: 0 });
    expect(validation.ok).toBe(false);
    if (validation.ok) return;
    expect(() => calculateIsiYukuVeIsitmaSogutmaKapasiteOptimizasyonCalculator({ ...defaultInputs, efficiencyPercent: 0 })).toThrow();
  });

  test("invalid NaN input fails validation and calculator throws", () => {
    expectValidationFailure({ efficiencyPercent: Number.NaN });
  });

  test("invalid Infinity input fails validation and calculator throws", () => {
    expectValidationFailure({ efficiencyPercent: Number.POSITIVE_INFINITY });
  });

    test("contract metadata matches slug", () => {
    const contract = ISI_YUKU_VE_ISITMA_SOGUTMA_KAPASITE_OPTIMIZASYON_CALCULATOR_CRITICAL_FORMULA_CONTRACTS[0];
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
    const calculatorResult = calculateIsiYukuVeIsitmaSogutmaKapasiteOptimizasyonCalculator(defaultInputs);
    expect(engineResult.outputs.find((output) => output.id === "totalExposure")?.raw).toBeCloseTo(calculatorResult.totalExposure, 2);
    expect(engineResult.outputs.find((output) => output.id === "variancePercent")?.raw).toBeCloseTo(calculatorResult.variancePercent, 2);
  });
});
