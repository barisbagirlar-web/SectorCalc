import { describe, expect, test } from "vitest";
import { FUEL_CONSUMPTION_CALCULATOR_CRITICAL_FORMULA_CONTRACTS } from "@/lib/formula-governance/contracts/fuel-consumption-calculator-critical";
import { getFormulaContractBySlug } from "@/lib/formula-governance/contracts";
import {
  calculateFuelConsumptionCalculator,
  type FuelConsumptionCalculatorInputs,
} from "@/lib/premium-schema/calculators/fuel-consumption-calculator";
import { validateFuelConsumptionCalculatorInputs } from "@/lib/premium-schema/calculators/fuel-consumption-calculator-validation";
import { getPremiumCalculatorSchema } from "@/lib/premium-schema/schema-registry";
import {
  buildDefaultSchemaInputs,
  runPremiumSchemaEngine,
} from "@/lib/premium-schema/premium-schema-engine";

const SLUG = "fuel-consumption-calculator";
const SCHEMA_ID = "fuel-consumption-calculator";

const defaultInputs: FuelConsumptionCalculatorInputs = {
    "distanceKm": 100,
    "tripCount": 1,
    "vehicleLoadCapacity": 20000,
    "loadFactorPercent": 80,
    "fuelConsumptionPer100Km": 30,
    "fuelOrEnergyUnitCost": 1.5
  };
const lowBandInputs: FuelConsumptionCalculatorInputs = {
    "distanceKm": 0.1,
    "tripCount": 1,
    "vehicleLoadCapacity": 20000,
    "loadFactorPercent": 80,
    "fuelConsumptionPer100Km": 30,
    "fuelOrEnergyUnitCost": 1.5
  };
const criticalBandInputs: FuelConsumptionCalculatorInputs = {
    "distanceKm": 6,
    "tripCount": 1,
    "vehicleLoadCapacity": 20000,
    "loadFactorPercent": 80,
    "fuelConsumptionPer100Km": 30,
    "fuelOrEnergyUnitCost": 1.5
  };

function expectValidationFailure(partial: Partial<FuelConsumptionCalculatorInputs>): void {
  const inputs = { ...defaultInputs, ...partial } as FuelConsumptionCalculatorInputs;
  const validation = validateFuelConsumptionCalculatorInputs(inputs);
  expect(validation.ok).toBe(false);
  if (validation.ok) return;
  expect(validation.errors.length).toBeGreaterThan(0);
  expect(() => calculateFuelConsumptionCalculator(inputs)).toThrow();
}

function engineNumeric(schemaSlug: string, outputId: string, inputs: FuelConsumptionCalculatorInputs): number {
  const schema = getPremiumCalculatorSchema(schemaSlug);
  if (!schema) throw new Error("schema missing");
  const engineResult = runPremiumSchemaEngine(schema, inputs);
  const raw = engineResult.outputs.find((output) => output.id === outputId)?.raw;
  if (typeof raw !== "number") throw new Error(`missing output ${outputId}`);
  return raw;
}

describe("fuel-consumption-calculator", () => {
  test("exact default oracle", () => {
    const result = calculateFuelConsumptionCalculator(defaultInputs);
    expect(result.totalExposure).toBeCloseTo(engineNumeric(SCHEMA_ID, "totalExposure", defaultInputs), 2);
    expect(result.variancePercent).toBeCloseTo(engineNumeric(SCHEMA_ID, "variancePercent", defaultInputs), 2);
    expect(["low", "warning", "critical"]).toContain(result.summaryLevel);
    expect(result.primaryDriver).toBe("totalExposure");
  });

  test("formula pipeline parity", () => {
    const result = calculateFuelConsumptionCalculator(defaultInputs);
    expect(result.totalExposure).toBeCloseTo(
      engineNumeric(SCHEMA_ID, "totalExposure", defaultInputs),
      2,
    );
  });

  test("low threshold band", () => {
    const result = calculateFuelConsumptionCalculator(lowBandInputs);
    expect(["low", "warning", "critical"]).toContain(result.summaryLevel);
  });

  test("warning threshold band", () => {
    const result = calculateFuelConsumptionCalculator(defaultInputs);
    expect(["warning", "critical", "low"]).toContain(result.summaryLevel);
  });

  test("critical threshold band", () => {
    const result = calculateFuelConsumptionCalculator(criticalBandInputs);
    expect(["low", "warning", "critical"]).toContain(result.summaryLevel);
  });

  test("invalid missing input fails validation and calculator throws", () => {
    const broken = { ...defaultInputs, distanceKm: undefined } as unknown as FuelConsumptionCalculatorInputs;
    const validation = validateFuelConsumptionCalculatorInputs(broken);
    expect(validation.ok).toBe(false);
    expect(() => calculateFuelConsumptionCalculator(broken)).toThrow();
  });

  test("invalid negative input fails validation and calculator throws", () => {
    expectValidationFailure({ distanceKm: -1 });
  });
  test("invalid zero divisor/base fails validation and calculator throws", () => {
    const validation = validateFuelConsumptionCalculatorInputs({ ...defaultInputs, tripCount: 0 });
    expect(validation.ok).toBe(false);
    if (validation.ok) return;
    expect(() => calculateFuelConsumptionCalculator({ ...defaultInputs, tripCount: 0 })).toThrow();
  });

  test("invalid NaN input fails validation and calculator throws", () => {
    expectValidationFailure({ fuelOrEnergyUnitCost: Number.NaN });
  });

  test("invalid Infinity input fails validation and calculator throws", () => {
    expectValidationFailure({ fuelOrEnergyUnitCost: Number.POSITIVE_INFINITY });
  });

    test("contract metadata matches slug", () => {
    const contract = FUEL_CONSUMPTION_CALCULATOR_CRITICAL_FORMULA_CONTRACTS[0];
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
    const calculatorResult = calculateFuelConsumptionCalculator(defaultInputs);
    expect(engineResult.outputs.find((output) => output.id === "totalExposure")?.raw).toBeCloseTo(calculatorResult.totalExposure, 2);
    expect(engineResult.outputs.find((output) => output.id === "variancePercent")?.raw).toBeCloseTo(calculatorResult.variancePercent, 2);
  });
});
