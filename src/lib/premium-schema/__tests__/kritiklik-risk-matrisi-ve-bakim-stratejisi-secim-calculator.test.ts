import { describe, expect, test } from "vitest";
import { KRITIKLIK_RISK_MATRISI_VE_BAKIM_STRATEJISI_SECIM_CALCULATOR_CRITICAL_FORMULA_CONTRACTS } from "@/lib/formula-governance/contracts/kritiklik-risk-matrisi-ve-bakim-stratejisi-secim-calculator-critical";
import { getFormulaContractBySlug } from "@/lib/formula-governance/contracts";
import {
  calculateKritiklikRiskMatrisiVeBakimStratejisiSecimCalculator,
  type KritiklikRiskMatrisiVeBakimStratejisiSecimCalculatorInputs,
} from "@/lib/premium-schema/calculators/kritiklik-risk-matrisi-ve-bakim-stratejisi-secim-calculator";
import { validateKritiklikRiskMatrisiVeBakimStratejisiSecimCalculatorInputs } from "@/lib/premium-schema/calculators/kritiklik-risk-matrisi-ve-bakim-stratejisi-secim-calculator-validation";
import { getPremiumCalculatorSchema } from "@/lib/premium-schema/schema-registry";
import {
  buildDefaultSchemaInputs,
  runPremiumSchemaEngine,
} from "@/lib/premium-schema/premium-schema-engine";

const SLUG = "kritiklik-risk-matrisi-ve-bakim-stratejisi-secim-calculator";
const SCHEMA_ID = "kritiklik-risk-matrisi-ve-bakim-stratejisi-secim-calculator";

const defaultInputs: KritiklikRiskMatrisiVeBakimStratejisiSecimCalculatorInputs = {
    "downtimeMinutes": 60,
    "machineHourlyRate": 100,
    "laborHourlyRate": 50,
    "lostProductionUnits": 10,
    "contributionMarginPerUnit": 20,
    "repairCost": 500
  };
const lowBandInputs: KritiklikRiskMatrisiVeBakimStratejisiSecimCalculatorInputs = {
    "downtimeMinutes": 0.1,
    "machineHourlyRate": 100,
    "laborHourlyRate": 50,
    "lostProductionUnits": 10,
    "contributionMarginPerUnit": 20,
    "repairCost": 500
  };
const criticalBandInputs: KritiklikRiskMatrisiVeBakimStratejisiSecimCalculatorInputs = {
    "downtimeMinutes": 6,
    "machineHourlyRate": 100,
    "laborHourlyRate": 50,
    "lostProductionUnits": 10,
    "contributionMarginPerUnit": 20,
    "repairCost": 500
  };

function expectValidationFailure(partial: Partial<KritiklikRiskMatrisiVeBakimStratejisiSecimCalculatorInputs>): void {
  const inputs = { ...defaultInputs, ...partial } as KritiklikRiskMatrisiVeBakimStratejisiSecimCalculatorInputs;
  const validation = validateKritiklikRiskMatrisiVeBakimStratejisiSecimCalculatorInputs(inputs);
  expect(validation.ok).toBe(false);
  if (validation.ok) return;
  expect(validation.errors.length).toBeGreaterThan(0);
  expect(() => calculateKritiklikRiskMatrisiVeBakimStratejisiSecimCalculator(inputs)).toThrow();
}

function engineNumeric(schemaSlug: string, outputId: string, inputs: KritiklikRiskMatrisiVeBakimStratejisiSecimCalculatorInputs): number {
  const schema = getPremiumCalculatorSchema(schemaSlug);
  if (!schema) throw new Error("schema missing");
  const engineResult = runPremiumSchemaEngine(schema, inputs);
  const raw = engineResult.outputs.find((output) => output.id === outputId)?.raw;
  if (typeof raw !== "number") throw new Error(`missing output ${outputId}`);
  return raw;
}

describe("kritiklik-risk-matrisi-ve-bakim-stratejisi-secim-calculator", () => {
  test("exact default oracle", () => {
    const result = calculateKritiklikRiskMatrisiVeBakimStratejisiSecimCalculator(defaultInputs);
    expect(result.totalExposure).toBeCloseTo(engineNumeric(SCHEMA_ID, "totalExposure", defaultInputs), 2);
    expect(result.variancePercent).toBeCloseTo(engineNumeric(SCHEMA_ID, "variancePercent", defaultInputs), 2);
    expect(["low", "warning", "critical"]).toContain(result.summaryLevel);
    expect(result.primaryDriver).toBe("totalExposure");
  });

  test("formula pipeline parity", () => {
    const result = calculateKritiklikRiskMatrisiVeBakimStratejisiSecimCalculator(defaultInputs);
    expect(result.totalExposure).toBeCloseTo(
      engineNumeric(SCHEMA_ID, "totalExposure", defaultInputs),
      2,
    );
  });

  test("low threshold band", () => {
    const result = calculateKritiklikRiskMatrisiVeBakimStratejisiSecimCalculator(lowBandInputs);
    expect(["low", "warning", "critical"]).toContain(result.summaryLevel);
  });

  test("warning threshold band", () => {
    const result = calculateKritiklikRiskMatrisiVeBakimStratejisiSecimCalculator(defaultInputs);
    expect(["warning", "critical", "low"]).toContain(result.summaryLevel);
  });

  test("critical threshold band", () => {
    const result = calculateKritiklikRiskMatrisiVeBakimStratejisiSecimCalculator(criticalBandInputs);
    expect(["low", "warning", "critical"]).toContain(result.summaryLevel);
  });

  test("invalid missing input fails validation and calculator throws", () => {
    const broken = { ...defaultInputs, downtimeMinutes: undefined } as unknown as KritiklikRiskMatrisiVeBakimStratejisiSecimCalculatorInputs;
    const validation = validateKritiklikRiskMatrisiVeBakimStratejisiSecimCalculatorInputs(broken);
    expect(validation.ok).toBe(false);
    expect(() => calculateKritiklikRiskMatrisiVeBakimStratejisiSecimCalculator(broken)).toThrow();
  });

  test("invalid negative input fails validation and calculator throws", () => {
    expectValidationFailure({ downtimeMinutes: -1 });
  });
  test("invalid zero divisor/base fails validation and calculator throws", () => {
    const validation = validateKritiklikRiskMatrisiVeBakimStratejisiSecimCalculatorInputs({ ...defaultInputs, lostProductionUnits: 0 });
    expect(validation.ok).toBe(false);
    if (validation.ok) return;
    expect(() => calculateKritiklikRiskMatrisiVeBakimStratejisiSecimCalculator({ ...defaultInputs, lostProductionUnits: 0 })).toThrow();
  });

  test("invalid NaN input fails validation and calculator throws", () => {
    expectValidationFailure({ repairCost: Number.NaN });
  });

  test("invalid Infinity input fails validation and calculator throws", () => {
    expectValidationFailure({ repairCost: Number.POSITIVE_INFINITY });
  });

    test("contract metadata matches slug", () => {
    const contract = KRITIKLIK_RISK_MATRISI_VE_BAKIM_STRATEJISI_SECIM_CALCULATOR_CRITICAL_FORMULA_CONTRACTS[0];
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
    const calculatorResult = calculateKritiklikRiskMatrisiVeBakimStratejisiSecimCalculator(defaultInputs);
    expect(engineResult.outputs.find((output) => output.id === "totalExposure")?.raw).toBeCloseTo(calculatorResult.totalExposure, 2);
    expect(engineResult.outputs.find((output) => output.id === "variancePercent")?.raw).toBeCloseTo(calculatorResult.variancePercent, 2);
  });
});
