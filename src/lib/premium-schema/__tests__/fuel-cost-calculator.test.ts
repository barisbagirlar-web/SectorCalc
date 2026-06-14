import { describe, expect, test } from "vitest";
import { FUEL_COST_CALCULATOR_CRITICAL_FORMULA_CONTRACTS } from "@/lib/formula-governance/contracts/fuel-cost-calculator-critical";
import { getFormulaContractBySlug } from "@/lib/formula-governance/contracts";
import {
  calculateFuelCostCalculator,
  type FuelCostCalculatorInputs,
} from "@/lib/premium-schema/calculators/fuel-cost-calculator";
import { validateFuelCostCalculatorInputs } from "@/lib/premium-schema/calculators/fuel-cost-calculator-validation";
import { getPremiumCalculatorSchema } from "@/lib/premium-schema/schema-registry";
import {
  buildDefaultSchemaInputs,
  runPremiumSchemaEngine,
} from "@/lib/premium-schema/premium-schema-engine";

const SLUG = "fuel-cost-calculator";
const SCHEMA_ID = "fuel-cost-calculator";

const defaultInputs: FuelCostCalculatorInputs = {
    "distanceKm": 100,
    "tripCount": 1,
    "vehicleLoadCapacity": 20000,
    "loadFactorPercent": 80,
    "fuelConsumptionPer100Km": 30,
    "fuelOrEnergyUnitCost": 1.5
  };
const lowBandInputs: FuelCostCalculatorInputs = {
    "distanceKm": 0.1,
    "tripCount": 1,
    "vehicleLoadCapacity": 20000,
    "loadFactorPercent": 80,
    "fuelConsumptionPer100Km": 30,
    "fuelOrEnergyUnitCost": 1.5
  };
const criticalBandInputs: FuelCostCalculatorInputs = {
    "distanceKm": 6,
    "tripCount": 1,
    "vehicleLoadCapacity": 20000,
    "loadFactorPercent": 80,
    "fuelConsumptionPer100Km": 30,
    "fuelOrEnergyUnitCost": 1.5
  };

function expectValidationFailure(partial: Partial<FuelCostCalculatorInputs>): void {
  const inputs = { ...defaultInputs, ...partial } as FuelCostCalculatorInputs;
  const validation = validateFuelCostCalculatorInputs(inputs);
  expect(validation.ok).toBe(false);
  if (validation.ok) return;
  expect(validation.errors.length).toBeGreaterThan(0);
  expect(() => calculateFuelCostCalculator(inputs)).toThrow();
}

function engineNumeric(schemaSlug: string, outputId: string, inputs: FuelCostCalculatorInputs): number {
  const schema = getPremiumCalculatorSchema(schemaSlug);
  if (!schema) throw new Error("schema missing");
  const engineResult = runPremiumSchemaEngine(schema, inputs);
  const raw = engineResult.outputs.find((output) => output.id === outputId)?.raw;
  if (typeof raw !== "number") throw new Error(`missing output ${outputId}`);
  return raw;
}

describe("fuel-cost-calculator", () => {
  test("exact default oracle", () => {
    const result = calculateFuelCostCalculator(defaultInputs);
    expect(result.totalExposure).toBeCloseTo(engineNumeric(SCHEMA_ID, "totalExposure", defaultInputs), 2);
    expect(result.variancePercent).toBeCloseTo(engineNumeric(SCHEMA_ID, "variancePercent", defaultInputs), 2);
    expect(["low", "warning", "critical"]).toContain(result.summaryLevel);
    expect(result.primaryDriver).toBe("totalExposure");
  });

  test("formula pipeline parity", () => {
    const result = calculateFuelCostCalculator(defaultInputs);
    expect(result.totalExposure).toBeCloseTo(
      engineNumeric(SCHEMA_ID, "totalExposure", defaultInputs),
      2,
    );
  });

  test("low threshold band", () => {
    const result = calculateFuelCostCalculator(lowBandInputs);
    expect(["low", "warning", "critical"]).toContain(result.summaryLevel);
  });

  test("warning threshold band", () => {
    const result = calculateFuelCostCalculator(defaultInputs);
    expect(["warning", "critical", "low"]).toContain(result.summaryLevel);
  });

  test("critical threshold band", () => {
    const result = calculateFuelCostCalculator(criticalBandInputs);
    expect(["low", "warning", "critical"]).toContain(result.summaryLevel);
  });

  test("invalid missing input fails validation and calculator throws", () => {
    const broken = { ...defaultInputs, distanceKm: undefined } as unknown as FuelCostCalculatorInputs;
    const validation = validateFuelCostCalculatorInputs(broken);
    expect(validation.ok).toBe(false);
    expect(() => calculateFuelCostCalculator(broken)).toThrow();
  });

  test("invalid negative input fails validation and calculator throws", () => {
    expectValidationFailure({ distanceKm: -1 });
  });
  test("invalid zero divisor/base fails validation and calculator throws", () => {
    const validation = validateFuelCostCalculatorInputs({ ...defaultInputs, tripCount: 0 });
    expect(validation.ok).toBe(false);
    if (validation.ok) return;
    expect(() => calculateFuelCostCalculator({ ...defaultInputs, tripCount: 0 })).toThrow();
  });

  test("invalid NaN input fails validation and calculator throws", () => {
    expectValidationFailure({ fuelOrEnergyUnitCost: Number.NaN });
  });

  test("invalid Infinity input fails validation and calculator throws", () => {
    expectValidationFailure({ fuelOrEnergyUnitCost: Number.POSITIVE_INFINITY });
  });

    test("contract metadata matches slug", () => {
    const contract = FUEL_COST_CALCULATOR_CRITICAL_FORMULA_CONTRACTS[0];
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
    const calculatorResult = calculateFuelCostCalculator(defaultInputs);
    expect(engineResult.outputs.find((output) => output.id === "totalExposure")?.raw).toBeCloseTo(calculatorResult.totalExposure, 2);
    expect(engineResult.outputs.find((output) => output.id === "variancePercent")?.raw).toBeCloseTo(calculatorResult.variancePercent, 2);
  });
});
