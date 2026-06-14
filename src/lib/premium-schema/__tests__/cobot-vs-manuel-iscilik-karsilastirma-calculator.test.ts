import { describe, expect, test } from "vitest";
import { COBOT_VS_MANUEL_ISCILIK_KARSILASTIRMA_CALCULATOR_CRITICAL_FORMULA_CONTRACTS } from "@/lib/formula-governance/contracts/cobot-vs-manuel-iscilik-karsilastirma-calculator-critical";
import { getFormulaContractBySlug } from "@/lib/formula-governance/contracts";
import {
  calculateCobotVsManuelIscilikKarsilastirmaCalculator,
  type CobotVsManuelIscilikKarsilastirmaCalculatorInputs,
} from "@/lib/premium-schema/calculators/cobot-vs-manuel-iscilik-karsilastirma-calculator";
import { validateCobotVsManuelIscilikKarsilastirmaCalculatorInputs } from "@/lib/premium-schema/calculators/cobot-vs-manuel-iscilik-karsilastirma-calculator-validation";
import { getPremiumCalculatorSchema } from "@/lib/premium-schema/schema-registry";
import {
  buildDefaultSchemaInputs,
  runPremiumSchemaEngine,
} from "@/lib/premium-schema/premium-schema-engine";

const SLUG = "cobot-vs-manuel-iscilik-karsilastirma-calculator";
const SCHEMA_ID = "cobot-vs-manuel-iscilik-karsilastirma-calculator";

const defaultInputs: CobotVsManuelIscilikKarsilastirmaCalculatorInputs = {
    "manualLaborHourlyRate": 25,
    "manualHoursPerYear": 2080,
    "numberOfWorkers": 2,
    "cobotPurchasePrice": 50000,
    "cobotDepreciationYears": 5,
    "cobotMaintenanceAnnual": 2000
  };
const lowBandInputs: CobotVsManuelIscilikKarsilastirmaCalculatorInputs = {
    "manualLaborHourlyRate": 0.1,
    "manualHoursPerYear": 2080,
    "numberOfWorkers": 2,
    "cobotPurchasePrice": 50000,
    "cobotDepreciationYears": 5,
    "cobotMaintenanceAnnual": 2000
  };
const criticalBandInputs: CobotVsManuelIscilikKarsilastirmaCalculatorInputs = {
    "manualLaborHourlyRate": 6,
    "manualHoursPerYear": 2080,
    "numberOfWorkers": 2,
    "cobotPurchasePrice": 50000,
    "cobotDepreciationYears": 5,
    "cobotMaintenanceAnnual": 2000
  };

function expectValidationFailure(partial: Partial<CobotVsManuelIscilikKarsilastirmaCalculatorInputs>): void {
  const inputs = { ...defaultInputs, ...partial } as CobotVsManuelIscilikKarsilastirmaCalculatorInputs;
  const validation = validateCobotVsManuelIscilikKarsilastirmaCalculatorInputs(inputs);
  expect(validation.ok).toBe(false);
  if (validation.ok) return;
  expect(validation.errors.length).toBeGreaterThan(0);
  expect(() => calculateCobotVsManuelIscilikKarsilastirmaCalculator(inputs)).toThrow();
}

function engineNumeric(schemaSlug: string, outputId: string, inputs: CobotVsManuelIscilikKarsilastirmaCalculatorInputs): number {
  const schema = getPremiumCalculatorSchema(schemaSlug);
  if (!schema) throw new Error("schema missing");
  const engineResult = runPremiumSchemaEngine(schema, inputs);
  const raw = engineResult.outputs.find((output) => output.id === outputId)?.raw;
  if (typeof raw !== "number") throw new Error(`missing output ${outputId}`);
  return raw;
}

describe("cobot-vs-manuel-iscilik-karsilastirma-calculator", () => {
  test("exact default oracle", () => {
    const result = calculateCobotVsManuelIscilikKarsilastirmaCalculator(defaultInputs);
    expect(result.totalExposure).toBeCloseTo(engineNumeric(SCHEMA_ID, "totalExposure", defaultInputs), 2);
    expect(result.variancePercent).toBeCloseTo(engineNumeric(SCHEMA_ID, "variancePercent", defaultInputs), 2);
    expect(["low", "warning", "critical"]).toContain(result.summaryLevel);
    expect(result.primaryDriver).toBe("totalExposure");
  });

  test("formula pipeline parity", () => {
    const result = calculateCobotVsManuelIscilikKarsilastirmaCalculator(defaultInputs);
    expect(result.totalExposure).toBeCloseTo(
      engineNumeric(SCHEMA_ID, "totalExposure", defaultInputs),
      2,
    );
  });

  test("low threshold band", () => {
    const result = calculateCobotVsManuelIscilikKarsilastirmaCalculator(lowBandInputs);
    expect(["low", "warning", "critical"]).toContain(result.summaryLevel);
  });

  test("warning threshold band", () => {
    const result = calculateCobotVsManuelIscilikKarsilastirmaCalculator(defaultInputs);
    expect(["warning", "critical", "low"]).toContain(result.summaryLevel);
  });

  test("critical threshold band", () => {
    const result = calculateCobotVsManuelIscilikKarsilastirmaCalculator(criticalBandInputs);
    expect(["low", "warning", "critical"]).toContain(result.summaryLevel);
  });

  test("invalid missing input fails validation and calculator throws", () => {
    const broken = { ...defaultInputs, manualLaborHourlyRate: undefined } as unknown as CobotVsManuelIscilikKarsilastirmaCalculatorInputs;
    const validation = validateCobotVsManuelIscilikKarsilastirmaCalculatorInputs(broken);
    expect(validation.ok).toBe(false);
    expect(() => calculateCobotVsManuelIscilikKarsilastirmaCalculator(broken)).toThrow();
  });

  test("invalid negative input fails validation and calculator throws", () => {
    expectValidationFailure({ manualLaborHourlyRate: -1 });
  });
  test("invalid zero divisor/base fails validation and calculator throws", () => {
    const validation = validateCobotVsManuelIscilikKarsilastirmaCalculatorInputs({ ...defaultInputs, manualHoursPerYear: 0 });
    expect(validation.ok).toBe(false);
    if (validation.ok) return;
    expect(() => calculateCobotVsManuelIscilikKarsilastirmaCalculator({ ...defaultInputs, manualHoursPerYear: 0 })).toThrow();
  });

  test("invalid NaN input fails validation and calculator throws", () => {
    expectValidationFailure({ cobotMaintenanceAnnual: Number.NaN });
  });

  test("invalid Infinity input fails validation and calculator throws", () => {
    expectValidationFailure({ cobotMaintenanceAnnual: Number.POSITIVE_INFINITY });
  });

    test("contract metadata matches slug", () => {
    const contract = COBOT_VS_MANUEL_ISCILIK_KARSILASTIRMA_CALCULATOR_CRITICAL_FORMULA_CONTRACTS[0];
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
    const calculatorResult = calculateCobotVsManuelIscilikKarsilastirmaCalculator(defaultInputs);
    expect(engineResult.outputs.find((output) => output.id === "totalExposure")?.raw).toBeCloseTo(calculatorResult.totalExposure, 2);
    expect(engineResult.outputs.find((output) => output.id === "variancePercent")?.raw).toBeCloseTo(calculatorResult.variancePercent, 2);
  });
});
