import { describe, expect, test } from "vitest";
import { FAZLA_MESAI_VS_YENI_ISE_ALIM_BASABAS_CALCULATOR_CRITICAL_FORMULA_CONTRACTS } from "@/lib/formula-governance/contracts/fazla-mesai-vs-yeni-ise-alim-basabas-calculator-critical";
import { getFormulaContractBySlug } from "@/lib/formula-governance/contracts";
import {
  calculateFazlaMesaiVsYeniIseAlimBasabasCalculator,
  type FazlaMesaiVsYeniIseAlimBasabasCalculatorInputs,
} from "@/lib/premium-schema/calculators/fazla-mesai-vs-yeni-ise-alim-basabas-calculator";
import { validateFazlaMesaiVsYeniIseAlimBasabasCalculatorInputs } from "@/lib/premium-schema/calculators/fazla-mesai-vs-yeni-ise-alim-basabas-calculator-validation";
import { getPremiumCalculatorSchema } from "@/lib/premium-schema/schema-registry";
import {
  buildDefaultSchemaInputs,
  runPremiumSchemaEngine,
} from "@/lib/premium-schema/premium-schema-engine";

const SLUG = "fazla-mesai-vs-yeni-ise-alim-basabas-calculator";
const SCHEMA_ID = "fazla-mesai-vs-yeni-ise-alim-basabas-calculator";

const defaultInputs: FazlaMesaiVsYeniIseAlimBasabasCalculatorInputs = {
    "overtimeHoursPerMonth": 40,
    "overtimeRatePerHour": 25,
    "overtimePremiumPercent": 50,
    "recruitmentCostPerHire": 2000,
    "trainingCostPerHire": 3000,
    "newHireMonthlySalary": 3000
  };
const lowBandInputs: FazlaMesaiVsYeniIseAlimBasabasCalculatorInputs = {
    "overtimeHoursPerMonth": 0.1,
    "overtimeRatePerHour": 25,
    "overtimePremiumPercent": 50,
    "recruitmentCostPerHire": 2000,
    "trainingCostPerHire": 3000,
    "newHireMonthlySalary": 3000
  };
const criticalBandInputs: FazlaMesaiVsYeniIseAlimBasabasCalculatorInputs = {
    "overtimeHoursPerMonth": 6,
    "overtimeRatePerHour": 25,
    "overtimePremiumPercent": 50,
    "recruitmentCostPerHire": 2000,
    "trainingCostPerHire": 3000,
    "newHireMonthlySalary": 3000
  };

function expectValidationFailure(partial: Partial<FazlaMesaiVsYeniIseAlimBasabasCalculatorInputs>): void {
  const inputs = { ...defaultInputs, ...partial } as FazlaMesaiVsYeniIseAlimBasabasCalculatorInputs;
  const validation = validateFazlaMesaiVsYeniIseAlimBasabasCalculatorInputs(inputs);
  expect(validation.ok).toBe(false);
  if (validation.ok) return;
  expect(validation.errors.length).toBeGreaterThan(0);
  expect(() => calculateFazlaMesaiVsYeniIseAlimBasabasCalculator(inputs)).toThrow();
}

function engineNumeric(schemaSlug: string, outputId: string, inputs: FazlaMesaiVsYeniIseAlimBasabasCalculatorInputs): number {
  const schema = getPremiumCalculatorSchema(schemaSlug);
  if (!schema) throw new Error("schema missing");
  const engineResult = runPremiumSchemaEngine(schema, inputs);
  const raw = engineResult.outputs.find((output) => output.id === outputId)?.raw;
  if (typeof raw !== "number") throw new Error(`missing output ${outputId}`);
  return raw;
}

describe("fazla-mesai-vs-yeni-ise-alim-basabas-calculator", () => {
  test("exact default oracle", () => {
    const result = calculateFazlaMesaiVsYeniIseAlimBasabasCalculator(defaultInputs);
    expect(result.totalExposure).toBeCloseTo(engineNumeric(SCHEMA_ID, "totalExposure", defaultInputs), 2);
    expect(result.variancePercent).toBeCloseTo(engineNumeric(SCHEMA_ID, "variancePercent", defaultInputs), 2);
    expect(["low", "warning", "critical"]).toContain(result.summaryLevel);
    expect(result.primaryDriver).toBe("totalExposure");
  });

  test("formula pipeline parity", () => {
    const result = calculateFazlaMesaiVsYeniIseAlimBasabasCalculator(defaultInputs);
    expect(result.totalExposure).toBeCloseTo(
      engineNumeric(SCHEMA_ID, "totalExposure", defaultInputs),
      2,
    );
  });

  test("low threshold band", () => {
    const result = calculateFazlaMesaiVsYeniIseAlimBasabasCalculator(lowBandInputs);
    expect(["low", "warning", "critical"]).toContain(result.summaryLevel);
  });

  test("warning threshold band", () => {
    const result = calculateFazlaMesaiVsYeniIseAlimBasabasCalculator(defaultInputs);
    expect(["warning", "critical", "low"]).toContain(result.summaryLevel);
  });

  test("critical threshold band", () => {
    const result = calculateFazlaMesaiVsYeniIseAlimBasabasCalculator(criticalBandInputs);
    expect(["low", "warning", "critical"]).toContain(result.summaryLevel);
  });

  test("invalid missing input fails validation and calculator throws", () => {
    const broken = { ...defaultInputs, overtimeHoursPerMonth: undefined } as unknown as FazlaMesaiVsYeniIseAlimBasabasCalculatorInputs;
    const validation = validateFazlaMesaiVsYeniIseAlimBasabasCalculatorInputs(broken);
    expect(validation.ok).toBe(false);
    expect(() => calculateFazlaMesaiVsYeniIseAlimBasabasCalculator(broken)).toThrow();
  });

  test("invalid negative input fails validation and calculator throws", () => {
    expectValidationFailure({ overtimeHoursPerMonth: -1 });
  });

  test("invalid NaN input fails validation and calculator throws", () => {
    expectValidationFailure({ newHireMonthlySalary: Number.NaN });
  });

  test("invalid Infinity input fails validation and calculator throws", () => {
    expectValidationFailure({ newHireMonthlySalary: Number.POSITIVE_INFINITY });
  });

    test("contract metadata matches slug", () => {
    const contract = FAZLA_MESAI_VS_YENI_ISE_ALIM_BASABAS_CALCULATOR_CRITICAL_FORMULA_CONTRACTS[0];
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
    const calculatorResult = calculateFazlaMesaiVsYeniIseAlimBasabasCalculator(defaultInputs);
    expect(engineResult.outputs.find((output) => output.id === "totalExposure")?.raw).toBeCloseTo(calculatorResult.totalExposure, 2);
    expect(engineResult.outputs.find((output) => output.id === "variancePercent")?.raw).toBeCloseTo(calculatorResult.variancePercent, 2);
  });
});
