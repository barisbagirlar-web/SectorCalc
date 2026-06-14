import { describe, expect, test } from "vitest";
import { LABORATUVAR_ANALIZ_MALIYETI_VE_NUMUNE_ALMA_OPTIMIZASYON_CALCULATOR_CRITICAL_FORMULA_CONTRACTS } from "@/lib/formula-governance/contracts/laboratuvar-analiz-maliyeti-ve-numune-alma-optimizasyon-calculator-critical";
import { getFormulaContractBySlug } from "@/lib/formula-governance/contracts";
import {
  calculateLaboratuvarAnalizMaliyetiVeNumuneAlmaOptimizasyonCalculator,
  type LaboratuvarAnalizMaliyetiVeNumuneAlmaOptimizasyonCalculatorInputs,
} from "@/lib/premium-schema/calculators/laboratuvar-analiz-maliyeti-ve-numune-alma-optimizasyon-calculator";
import { validateLaboratuvarAnalizMaliyetiVeNumuneAlmaOptimizasyonCalculatorInputs } from "@/lib/premium-schema/calculators/laboratuvar-analiz-maliyeti-ve-numune-alma-optimizasyon-calculator-validation";
import { getPremiumCalculatorSchema } from "@/lib/premium-schema/schema-registry";
import {
  buildDefaultSchemaInputs,
  runPremiumSchemaEngine,
} from "@/lib/premium-schema/premium-schema-engine";

const SLUG = "laboratuvar-analiz-maliyeti-ve-numune-alma-optimizasyon-calculator";
const SCHEMA_ID = "laboratuvar-analiz-maliyeti-ve-numune-alma-optimizasyon-calculator";

const defaultInputs: LaboratuvarAnalizMaliyetiVeNumuneAlmaOptimizasyonCalculatorInputs = {
    "monthlyTestDemand": 500,
    "fixedCostPerMonth": 10000,
    "variableCostPerTest": 50,
    "currentSamplingRate": 10,
    "setupCostPerBatch": 200,
    "holdingCostPerTest": 5
  };
const lowBandInputs: LaboratuvarAnalizMaliyetiVeNumuneAlmaOptimizasyonCalculatorInputs = {
    "monthlyTestDemand": 1,
    "fixedCostPerMonth": 10000,
    "variableCostPerTest": 50,
    "currentSamplingRate": 10,
    "setupCostPerBatch": 200,
    "holdingCostPerTest": 5
  };
const criticalBandInputs: LaboratuvarAnalizMaliyetiVeNumuneAlmaOptimizasyonCalculatorInputs = {
    "monthlyTestDemand": 6,
    "fixedCostPerMonth": 10000,
    "variableCostPerTest": 50,
    "currentSamplingRate": 10,
    "setupCostPerBatch": 200,
    "holdingCostPerTest": 5
  };

function expectValidationFailure(partial: Partial<LaboratuvarAnalizMaliyetiVeNumuneAlmaOptimizasyonCalculatorInputs>): void {
  const inputs = { ...defaultInputs, ...partial } as LaboratuvarAnalizMaliyetiVeNumuneAlmaOptimizasyonCalculatorInputs;
  const validation = validateLaboratuvarAnalizMaliyetiVeNumuneAlmaOptimizasyonCalculatorInputs(inputs);
  expect(validation.ok).toBe(false);
  if (validation.ok) return;
  expect(validation.errors.length).toBeGreaterThan(0);
  expect(() => calculateLaboratuvarAnalizMaliyetiVeNumuneAlmaOptimizasyonCalculator(inputs)).toThrow();
}

function engineNumeric(schemaSlug: string, outputId: string, inputs: LaboratuvarAnalizMaliyetiVeNumuneAlmaOptimizasyonCalculatorInputs): number {
  const schema = getPremiumCalculatorSchema(schemaSlug);
  if (!schema) throw new Error("schema missing");
  const engineResult = runPremiumSchemaEngine(schema, inputs);
  const raw = engineResult.outputs.find((output) => output.id === outputId)?.raw;
  if (typeof raw !== "number") throw new Error(`missing output ${outputId}`);
  return raw;
}

describe("laboratuvar-analiz-maliyeti-ve-numune-alma-optimizasyon-calculator", () => {
  test("exact default oracle", () => {
    const result = calculateLaboratuvarAnalizMaliyetiVeNumuneAlmaOptimizasyonCalculator(defaultInputs);
    expect(result.totalExposure).toBeCloseTo(engineNumeric(SCHEMA_ID, "totalExposure", defaultInputs), 2);
    expect(result.variancePercent).toBeCloseTo(engineNumeric(SCHEMA_ID, "variancePercent", defaultInputs), 2);
    expect(["low", "warning", "critical"]).toContain(result.summaryLevel);
    expect(result.primaryDriver).toBe("totalExposure");
  });

  test("formula pipeline parity", () => {
    const result = calculateLaboratuvarAnalizMaliyetiVeNumuneAlmaOptimizasyonCalculator(defaultInputs);
    expect(result.totalExposure).toBeCloseTo(
      engineNumeric(SCHEMA_ID, "totalExposure", defaultInputs),
      2,
    );
  });

  test("low threshold band", () => {
    const result = calculateLaboratuvarAnalizMaliyetiVeNumuneAlmaOptimizasyonCalculator(lowBandInputs);
    expect(["low", "warning", "critical"]).toContain(result.summaryLevel);
  });

  test("warning threshold band", () => {
    const result = calculateLaboratuvarAnalizMaliyetiVeNumuneAlmaOptimizasyonCalculator(defaultInputs);
    expect(["warning", "critical", "low"]).toContain(result.summaryLevel);
  });

  test("critical threshold band", () => {
    const result = calculateLaboratuvarAnalizMaliyetiVeNumuneAlmaOptimizasyonCalculator(criticalBandInputs);
    expect(["low", "warning", "critical"]).toContain(result.summaryLevel);
  });

  test("invalid missing input fails validation and calculator throws", () => {
    const broken = { ...defaultInputs, monthlyTestDemand: undefined } as unknown as LaboratuvarAnalizMaliyetiVeNumuneAlmaOptimizasyonCalculatorInputs;
    const validation = validateLaboratuvarAnalizMaliyetiVeNumuneAlmaOptimizasyonCalculatorInputs(broken);
    expect(validation.ok).toBe(false);
    expect(() => calculateLaboratuvarAnalizMaliyetiVeNumuneAlmaOptimizasyonCalculator(broken)).toThrow();
  });

  test("invalid negative input fails validation and calculator throws", () => {
    expectValidationFailure({ monthlyTestDemand: -1 });
  });
  test("invalid zero divisor/base fails validation and calculator throws", () => {
    const validation = validateLaboratuvarAnalizMaliyetiVeNumuneAlmaOptimizasyonCalculatorInputs({ ...defaultInputs, monthlyTestDemand: 0 });
    expect(validation.ok).toBe(false);
    if (validation.ok) return;
    expect(() => calculateLaboratuvarAnalizMaliyetiVeNumuneAlmaOptimizasyonCalculator({ ...defaultInputs, monthlyTestDemand: 0 })).toThrow();
  });

  test("invalid NaN input fails validation and calculator throws", () => {
    expectValidationFailure({ holdingCostPerTest: Number.NaN });
  });

  test("invalid Infinity input fails validation and calculator throws", () => {
    expectValidationFailure({ holdingCostPerTest: Number.POSITIVE_INFINITY });
  });

    test("contract metadata matches slug", () => {
    const contract = LABORATUVAR_ANALIZ_MALIYETI_VE_NUMUNE_ALMA_OPTIMIZASYON_CALCULATOR_CRITICAL_FORMULA_CONTRACTS[0];
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
    const calculatorResult = calculateLaboratuvarAnalizMaliyetiVeNumuneAlmaOptimizasyonCalculator(defaultInputs);
    expect(engineResult.outputs.find((output) => output.id === "totalExposure")?.raw).toBeCloseTo(calculatorResult.totalExposure, 2);
    expect(engineResult.outputs.find((output) => output.id === "variancePercent")?.raw).toBeCloseTo(calculatorResult.variancePercent, 2);
  });
});
