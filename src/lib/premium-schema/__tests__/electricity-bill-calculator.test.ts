import { describe, expect, test } from "vitest";
import { ELECTRICITY_BILL_CALCULATOR_CRITICAL_FORMULA_CONTRACTS } from "@/lib/formula-governance/contracts/electricity-bill-calculator-critical";
import { getFormulaContractBySlug } from "@/lib/formula-governance/contracts";
import {
  calculateElectricityBillCalculator,
  type ElectricityBillCalculatorInputs,
} from "@/lib/premium-schema/calculators/electricity-bill-calculator";
import { validateElectricityBillCalculatorInputs } from "@/lib/premium-schema/calculators/electricity-bill-calculator-validation";
import { getPremiumCalculatorSchema } from "@/lib/premium-schema/schema-registry";
import {
  buildDefaultSchemaInputs,
  runPremiumSchemaEngine,
} from "@/lib/premium-schema/premium-schema-engine";

const SLUG = "electricity-bill-calculator";
const SCHEMA_ID = "electricity-bill-calculator";

const defaultInputs: ElectricityBillCalculatorInputs = {
    "powerKw": 100,
    "runtimeHours": 8,
    "energyConsumptionKwh": 800,
    "tariffPerKwh": 0.12,
    "peakDemandKw": 150,
    "efficiencyPercent": 90
  };
const lowBandInputs: ElectricityBillCalculatorInputs = {
    "powerKw": 0.1,
    "runtimeHours": 8,
    "energyConsumptionKwh": 800,
    "tariffPerKwh": 0.12,
    "peakDemandKw": 150,
    "efficiencyPercent": 90
  };
const criticalBandInputs: ElectricityBillCalculatorInputs = {
    "powerKw": 6,
    "runtimeHours": 8,
    "energyConsumptionKwh": 800,
    "tariffPerKwh": 0.12,
    "peakDemandKw": 150,
    "efficiencyPercent": 90
  };

function expectValidationFailure(partial: Partial<ElectricityBillCalculatorInputs>): void {
  const inputs = { ...defaultInputs, ...partial } as ElectricityBillCalculatorInputs;
  const validation = validateElectricityBillCalculatorInputs(inputs);
  expect(validation.ok).toBe(false);
  if (validation.ok) return;
  expect(validation.errors.length).toBeGreaterThan(0);
  expect(() => calculateElectricityBillCalculator(inputs)).toThrow();
}

function engineNumeric(schemaSlug: string, outputId: string, inputs: ElectricityBillCalculatorInputs): number {
  const schema = getPremiumCalculatorSchema(schemaSlug);
  if (!schema) throw new Error("schema missing");
  const engineResult = runPremiumSchemaEngine(schema, inputs);
  const raw = engineResult.outputs.find((output) => output.id === outputId)?.raw;
  if (typeof raw !== "number") throw new Error(`missing output ${outputId}`);
  return raw;
}

describe("electricity-bill-calculator", () => {
  test("exact default oracle", () => {
    const result = calculateElectricityBillCalculator(defaultInputs);
    expect(result.totalExposure).toBeCloseTo(engineNumeric(SCHEMA_ID, "totalExposure", defaultInputs), 2);
    expect(result.variancePercent).toBeCloseTo(engineNumeric(SCHEMA_ID, "variancePercent", defaultInputs), 2);
    expect(["low", "warning", "critical"]).toContain(result.summaryLevel);
    expect(result.primaryDriver).toBe("totalExposure");
  });

  test("formula pipeline parity", () => {
    const result = calculateElectricityBillCalculator(defaultInputs);
    expect(result.totalExposure).toBeCloseTo(
      engineNumeric(SCHEMA_ID, "totalExposure", defaultInputs),
      2,
    );
  });

  test("low threshold band", () => {
    const result = calculateElectricityBillCalculator(lowBandInputs);
    expect(["low", "warning", "critical"]).toContain(result.summaryLevel);
  });

  test("warning threshold band", () => {
    const result = calculateElectricityBillCalculator(defaultInputs);
    expect(["warning", "critical", "low"]).toContain(result.summaryLevel);
  });

  test("critical threshold band", () => {
    const result = calculateElectricityBillCalculator(criticalBandInputs);
    expect(["low", "warning", "critical"]).toContain(result.summaryLevel);
  });

  test("invalid missing input fails validation and calculator throws", () => {
    const broken = { ...defaultInputs, powerKw: undefined } as unknown as ElectricityBillCalculatorInputs;
    const validation = validateElectricityBillCalculatorInputs(broken);
    expect(validation.ok).toBe(false);
    expect(() => calculateElectricityBillCalculator(broken)).toThrow();
  });

  test("invalid negative input fails validation and calculator throws", () => {
    expectValidationFailure({ powerKw: -1 });
  });
  test("invalid zero divisor/base fails validation and calculator throws", () => {
    const validation = validateElectricityBillCalculatorInputs({ ...defaultInputs, efficiencyPercent: 0 });
    expect(validation.ok).toBe(false);
    if (validation.ok) return;
    expect(() => calculateElectricityBillCalculator({ ...defaultInputs, efficiencyPercent: 0 })).toThrow();
  });

  test("invalid NaN input fails validation and calculator throws", () => {
    expectValidationFailure({ efficiencyPercent: Number.NaN });
  });

  test("invalid Infinity input fails validation and calculator throws", () => {
    expectValidationFailure({ efficiencyPercent: Number.POSITIVE_INFINITY });
  });

    test("contract metadata matches slug", () => {
    const contract = ELECTRICITY_BILL_CALCULATOR_CRITICAL_FORMULA_CONTRACTS[0];
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
    const calculatorResult = calculateElectricityBillCalculator(defaultInputs);
    expect(engineResult.outputs.find((output) => output.id === "totalExposure")?.raw).toBeCloseTo(calculatorResult.totalExposure, 2);
    expect(engineResult.outputs.find((output) => output.id === "variancePercent")?.raw).toBeCloseTo(calculatorResult.variancePercent, 2);
  });
});
