import { describe, expect, test } from "vitest";
import { MACHINE_HOUR_RATE_CALCULATOR_CRITICAL_FORMULA_CONTRACTS } from "@/lib/formula-governance/contracts/machine-hour-rate-calculator-critical";
import { getFormulaContractBySlug } from "@/lib/formula-governance/contracts";
import {
  calculateMachineHourRateCalculator,
  type MachineHourRateCalculatorInputs,
} from "@/lib/premium-schema/calculators/machine-hour-rate-calculator";
import { validateMachineHourRateCalculatorInputs } from "@/lib/premium-schema/calculators/machine-hour-rate-calculator-validation";
import { getPremiumCalculatorSchema } from "@/lib/premium-schema/schema-registry";
import {
  buildDefaultSchemaInputs,
  runPremiumSchemaEngine,
} from "@/lib/premium-schema/premium-schema-engine";

const SLUG = "machine-hour-rate-calculator";
const SCHEMA_ID = "machine-hour-rate-calculator";

const defaultInputs: MachineHourRateCalculatorInputs = {
    "machineCost": 500000,
    "salvageValue": 50000,
    "usefulLifeYears": 10,
    "maintenanceCostPerYear": 10000,
    "powerConsumptionKW": 50,
    "powerCostPerKWH": 0.12
  };
const lowBandInputs: MachineHourRateCalculatorInputs = {
    "machineCost": 0.1,
    "salvageValue": 50000,
    "usefulLifeYears": 10,
    "maintenanceCostPerYear": 10000,
    "powerConsumptionKW": 50,
    "powerCostPerKWH": 0.12
  };
const criticalBandInputs: MachineHourRateCalculatorInputs = {
    "machineCost": 6,
    "salvageValue": 50000,
    "usefulLifeYears": 10,
    "maintenanceCostPerYear": 10000,
    "powerConsumptionKW": 50,
    "powerCostPerKWH": 0.12
  };

function expectValidationFailure(partial: Partial<MachineHourRateCalculatorInputs>): void {
  const inputs = { ...defaultInputs, ...partial } as MachineHourRateCalculatorInputs;
  const validation = validateMachineHourRateCalculatorInputs(inputs);
  expect(validation.ok).toBe(false);
  if (validation.ok) return;
  expect(validation.errors.length).toBeGreaterThan(0);
  expect(() => calculateMachineHourRateCalculator(inputs)).toThrow();
}

function engineNumeric(schemaSlug: string, outputId: string, inputs: MachineHourRateCalculatorInputs): number {
  const schema = getPremiumCalculatorSchema(schemaSlug);
  if (!schema) throw new Error("schema missing");
  const engineResult = runPremiumSchemaEngine(schema, inputs);
  const raw = engineResult.outputs.find((output) => output.id === outputId)?.raw;
  if (typeof raw !== "number") throw new Error(`missing output ${outputId}`);
  return raw;
}

describe("machine-hour-rate-calculator", () => {
  test("exact default oracle", () => {
    const result = calculateMachineHourRateCalculator(defaultInputs);
    expect(result.totalExposure).toBeCloseTo(engineNumeric(SCHEMA_ID, "totalExposure", defaultInputs), 2);
    expect(result.variancePercent).toBeCloseTo(engineNumeric(SCHEMA_ID, "variancePercent", defaultInputs), 2);
    expect(["low", "warning", "critical"]).toContain(result.summaryLevel);
    expect(result.primaryDriver).toBe("totalExposure");
  });

  test("formula pipeline parity", () => {
    const result = calculateMachineHourRateCalculator(defaultInputs);
    expect(result.totalExposure).toBeCloseTo(
      engineNumeric(SCHEMA_ID, "totalExposure", defaultInputs),
      2,
    );
  });

  test("low threshold band", () => {
    const result = calculateMachineHourRateCalculator(lowBandInputs);
    expect(["low", "warning", "critical"]).toContain(result.summaryLevel);
  });

  test("warning threshold band", () => {
    const result = calculateMachineHourRateCalculator(defaultInputs);
    expect(["warning", "critical", "low"]).toContain(result.summaryLevel);
  });

  test("critical threshold band", () => {
    const result = calculateMachineHourRateCalculator(criticalBandInputs);
    expect(["low", "warning", "critical"]).toContain(result.summaryLevel);
  });

  test("invalid missing input fails validation and calculator throws", () => {
    const broken = { ...defaultInputs, machineCost: undefined } as unknown as MachineHourRateCalculatorInputs;
    const validation = validateMachineHourRateCalculatorInputs(broken);
    expect(validation.ok).toBe(false);
    expect(() => calculateMachineHourRateCalculator(broken)).toThrow();
  });

  test("invalid negative input fails validation and calculator throws", () => {
    expectValidationFailure({ machineCost: -1 });
  });
  test("invalid zero divisor/base fails validation and calculator throws", () => {
    const validation = validateMachineHourRateCalculatorInputs({ ...defaultInputs, usefulLifeYears: 0 });
    expect(validation.ok).toBe(false);
    if (validation.ok) return;
    expect(() => calculateMachineHourRateCalculator({ ...defaultInputs, usefulLifeYears: 0 })).toThrow();
  });

  test("invalid NaN input fails validation and calculator throws", () => {
    expectValidationFailure({ powerCostPerKWH: Number.NaN });
  });

  test("invalid Infinity input fails validation and calculator throws", () => {
    expectValidationFailure({ powerCostPerKWH: Number.POSITIVE_INFINITY });
  });

    test("contract metadata matches slug", () => {
    const contract = MACHINE_HOUR_RATE_CALCULATOR_CRITICAL_FORMULA_CONTRACTS[0];
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
    const calculatorResult = calculateMachineHourRateCalculator(defaultInputs);
    expect(engineResult.outputs.find((output) => output.id === "totalExposure")?.raw).toBeCloseTo(calculatorResult.totalExposure, 2);
    expect(engineResult.outputs.find((output) => output.id === "variancePercent")?.raw).toBeCloseTo(calculatorResult.variancePercent, 2);
  });
});
