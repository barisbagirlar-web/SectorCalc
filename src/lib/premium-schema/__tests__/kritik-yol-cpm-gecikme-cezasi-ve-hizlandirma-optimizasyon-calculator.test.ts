import { describe, expect, test } from "vitest";
import { KRITIK_YOL_CPM_GECIKME_CEZASI_VE_HIZLANDIRMA_OPTIMIZASYON_CALCULATOR_CRITICAL_FORMULA_CONTRACTS } from "@/lib/formula-governance/contracts/kritik-yol-cpm-gecikme-cezasi-ve-hizlandirma-optimizasyon-calculator-critical";
import { getFormulaContractBySlug } from "@/lib/formula-governance/contracts";
import {
  calculateKritikYolCpmGecikmeCezasiVeHizlandirmaOptimizasyonCalculator,
  type KritikYolCpmGecikmeCezasiVeHizlandirmaOptimizasyonCalculatorInputs,
} from "@/lib/premium-schema/calculators/kritik-yol-cpm-gecikme-cezasi-ve-hizlandirma-optimizasyon-calculator";
import { validateKritikYolCpmGecikmeCezasiVeHizlandirmaOptimizasyonCalculatorInputs } from "@/lib/premium-schema/calculators/kritik-yol-cpm-gecikme-cezasi-ve-hizlandirma-optimizasyon-calculator-validation";
import { getPremiumCalculatorSchema } from "@/lib/premium-schema/schema-registry";
import {
  buildDefaultSchemaInputs,
  runPremiumSchemaEngine,
} from "@/lib/premium-schema/premium-schema-engine";

const SLUG = "kritik-yol-cpm-gecikme-cezasi-ve-hizlandirma-optimizasyon-calculator";
const SCHEMA_ID = "kritik-yol-cpm-gecikme-cezasi-ve-hizlandirma-optimizasyon-calculator";

const defaultInputs: KritikYolCpmGecikmeCezasiVeHizlandirmaOptimizasyonCalculatorInputs = {
    "contractDurationDays": 365,
    "actualDurationDays": 400,
    "penaltyRatePerDay": 1000,
    "baselineCost": 500000,
    "crashCostPerDay": 2000,
    "maxCrashDays": 30
  };
const lowBandInputs: KritikYolCpmGecikmeCezasiVeHizlandirmaOptimizasyonCalculatorInputs = {
    "contractDurationDays": 1,
    "actualDurationDays": 400,
    "penaltyRatePerDay": 1000,
    "baselineCost": 500000,
    "crashCostPerDay": 2000,
    "maxCrashDays": 30
  };
const criticalBandInputs: KritikYolCpmGecikmeCezasiVeHizlandirmaOptimizasyonCalculatorInputs = {
    "contractDurationDays": 6,
    "actualDurationDays": 400,
    "penaltyRatePerDay": 1000,
    "baselineCost": 500000,
    "crashCostPerDay": 2000,
    "maxCrashDays": 30
  };

function expectValidationFailure(partial: Partial<KritikYolCpmGecikmeCezasiVeHizlandirmaOptimizasyonCalculatorInputs>): void {
  const inputs = { ...defaultInputs, ...partial } as KritikYolCpmGecikmeCezasiVeHizlandirmaOptimizasyonCalculatorInputs;
  const validation = validateKritikYolCpmGecikmeCezasiVeHizlandirmaOptimizasyonCalculatorInputs(inputs);
  expect(validation.ok).toBe(false);
  if (validation.ok) return;
  expect(validation.errors.length).toBeGreaterThan(0);
  expect(() => calculateKritikYolCpmGecikmeCezasiVeHizlandirmaOptimizasyonCalculator(inputs)).toThrow();
}

function engineNumeric(schemaSlug: string, outputId: string, inputs: KritikYolCpmGecikmeCezasiVeHizlandirmaOptimizasyonCalculatorInputs): number {
  const schema = getPremiumCalculatorSchema(schemaSlug);
  if (!schema) throw new Error("schema missing");
  const engineResult = runPremiumSchemaEngine(schema, inputs);
  const raw = engineResult.outputs.find((output) => output.id === outputId)?.raw;
  if (typeof raw !== "number") throw new Error(`missing output ${outputId}`);
  return raw;
}

describe("kritik-yol-cpm-gecikme-cezasi-ve-hizlandirma-optimizasyon-calculator", () => {
  test("exact default oracle", () => {
    const result = calculateKritikYolCpmGecikmeCezasiVeHizlandirmaOptimizasyonCalculator(defaultInputs);
    expect(result.totalExposure).toBeCloseTo(engineNumeric(SCHEMA_ID, "totalExposure", defaultInputs), 2);
    expect(result.variancePercent).toBeCloseTo(engineNumeric(SCHEMA_ID, "variancePercent", defaultInputs), 2);
    expect(["low", "warning", "critical"]).toContain(result.summaryLevel);
    expect(result.primaryDriver).toBe("totalExposure");
  });

  test("formula pipeline parity", () => {
    const result = calculateKritikYolCpmGecikmeCezasiVeHizlandirmaOptimizasyonCalculator(defaultInputs);
    expect(result.totalExposure).toBeCloseTo(
      engineNumeric(SCHEMA_ID, "totalExposure", defaultInputs),
      2,
    );
  });

  test("low threshold band", () => {
    const result = calculateKritikYolCpmGecikmeCezasiVeHizlandirmaOptimizasyonCalculator(lowBandInputs);
    expect(["low", "warning", "critical"]).toContain(result.summaryLevel);
  });

  test("warning threshold band", () => {
    const result = calculateKritikYolCpmGecikmeCezasiVeHizlandirmaOptimizasyonCalculator(defaultInputs);
    expect(["warning", "critical", "low"]).toContain(result.summaryLevel);
  });

  test("critical threshold band", () => {
    const result = calculateKritikYolCpmGecikmeCezasiVeHizlandirmaOptimizasyonCalculator(criticalBandInputs);
    expect(["low", "warning", "critical"]).toContain(result.summaryLevel);
  });

  test("invalid missing input fails validation and calculator throws", () => {
    const broken = { ...defaultInputs, contractDurationDays: undefined } as unknown as KritikYolCpmGecikmeCezasiVeHizlandirmaOptimizasyonCalculatorInputs;
    const validation = validateKritikYolCpmGecikmeCezasiVeHizlandirmaOptimizasyonCalculatorInputs(broken);
    expect(validation.ok).toBe(false);
    expect(() => calculateKritikYolCpmGecikmeCezasiVeHizlandirmaOptimizasyonCalculator(broken)).toThrow();
  });

  test("invalid negative input fails validation and calculator throws", () => {
    expectValidationFailure({ contractDurationDays: -1 });
  });
  test("invalid zero divisor/base fails validation and calculator throws", () => {
    const validation = validateKritikYolCpmGecikmeCezasiVeHizlandirmaOptimizasyonCalculatorInputs({ ...defaultInputs, contractDurationDays: 0 });
    expect(validation.ok).toBe(false);
    if (validation.ok) return;
    expect(() => calculateKritikYolCpmGecikmeCezasiVeHizlandirmaOptimizasyonCalculator({ ...defaultInputs, contractDurationDays: 0 })).toThrow();
  });

  test("invalid NaN input fails validation and calculator throws", () => {
    expectValidationFailure({ maxCrashDays: Number.NaN });
  });

  test("invalid Infinity input fails validation and calculator throws", () => {
    expectValidationFailure({ maxCrashDays: Number.POSITIVE_INFINITY });
  });

    test("contract metadata matches slug", () => {
    const contract = KRITIK_YOL_CPM_GECIKME_CEZASI_VE_HIZLANDIRMA_OPTIMIZASYON_CALCULATOR_CRITICAL_FORMULA_CONTRACTS[0];
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
    const calculatorResult = calculateKritikYolCpmGecikmeCezasiVeHizlandirmaOptimizasyonCalculator(defaultInputs);
    expect(engineResult.outputs.find((output) => output.id === "totalExposure")?.raw).toBeCloseTo(calculatorResult.totalExposure, 2);
    expect(engineResult.outputs.find((output) => output.id === "variancePercent")?.raw).toBeCloseTo(calculatorResult.variancePercent, 2);
  });
});
