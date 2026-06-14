import { describe, expect, test } from "vitest";
import { DELIVERY_COST_CALCULATOR_CRITICAL_FORMULA_CONTRACTS } from "@/lib/formula-governance/contracts/delivery-cost-calculator-critical";
import { getFormulaContractBySlug } from "@/lib/formula-governance/contracts";
import {
  calculateDeliveryCostCalculator,
  type DeliveryCostCalculatorInputs,
} from "@/lib/premium-schema/calculators/delivery-cost-calculator";
import { validateDeliveryCostCalculatorInputs } from "@/lib/premium-schema/calculators/delivery-cost-calculator-validation";
import { getPremiumCalculatorSchema } from "@/lib/premium-schema/schema-registry";
import {
  buildDefaultSchemaInputs,
  runPremiumSchemaEngine,
} from "@/lib/premium-schema/premium-schema-engine";

const SLUG = "delivery-cost-calculator";
const SCHEMA_ID = "delivery-cost-calculator";

const defaultInputs: DeliveryCostCalculatorInputs = {
    "distanceKm": 100,
    "tripCount": 1,
    "vehicleLoadCapacity": 10000,
    "loadFactorPercent": 80,
    "fuelConsumptionPer100Km": 30,
    "fuelOrEnergyUnitCost": 1.5
  };
const lowBandInputs: DeliveryCostCalculatorInputs = {
    "distanceKm": 0.1,
    "tripCount": 1,
    "vehicleLoadCapacity": 10000,
    "loadFactorPercent": 80,
    "fuelConsumptionPer100Km": 30,
    "fuelOrEnergyUnitCost": 1.5
  };
const criticalBandInputs: DeliveryCostCalculatorInputs = {
    "distanceKm": 6,
    "tripCount": 1,
    "vehicleLoadCapacity": 10000,
    "loadFactorPercent": 80,
    "fuelConsumptionPer100Km": 30,
    "fuelOrEnergyUnitCost": 1.5
  };

function expectValidationFailure(partial: Partial<DeliveryCostCalculatorInputs>): void {
  const inputs = { ...defaultInputs, ...partial } as DeliveryCostCalculatorInputs;
  const validation = validateDeliveryCostCalculatorInputs(inputs);
  expect(validation.ok).toBe(false);
  if (validation.ok) return;
  expect(validation.errors.length).toBeGreaterThan(0);
  expect(() => calculateDeliveryCostCalculator(inputs)).toThrow();
}

function engineNumeric(schemaSlug: string, outputId: string, inputs: DeliveryCostCalculatorInputs): number {
  const schema = getPremiumCalculatorSchema(schemaSlug);
  if (!schema) throw new Error("schema missing");
  const engineResult = runPremiumSchemaEngine(schema, inputs);
  const raw = engineResult.outputs.find((output) => output.id === outputId)?.raw;
  if (typeof raw !== "number") throw new Error(`missing output ${outputId}`);
  return raw;
}

describe("delivery-cost-calculator", () => {
  test("exact default oracle", () => {
    const result = calculateDeliveryCostCalculator(defaultInputs);
    expect(result.totalExposure).toBeCloseTo(engineNumeric(SCHEMA_ID, "totalExposure", defaultInputs), 2);
    expect(result.variancePercent).toBeCloseTo(engineNumeric(SCHEMA_ID, "variancePercent", defaultInputs), 2);
    expect(["low", "warning", "critical"]).toContain(result.summaryLevel);
    expect(result.primaryDriver).toBe("totalExposure");
  });

  test("formula pipeline parity", () => {
    const result = calculateDeliveryCostCalculator(defaultInputs);
    expect(result.totalExposure).toBeCloseTo(
      engineNumeric(SCHEMA_ID, "totalExposure", defaultInputs),
      2,
    );
  });

  test("low threshold band", () => {
    const result = calculateDeliveryCostCalculator(lowBandInputs);
    expect(["low", "warning", "critical"]).toContain(result.summaryLevel);
  });

  test("warning threshold band", () => {
    const result = calculateDeliveryCostCalculator(defaultInputs);
    expect(["warning", "critical", "low"]).toContain(result.summaryLevel);
  });

  test("critical threshold band", () => {
    const result = calculateDeliveryCostCalculator(criticalBandInputs);
    expect(["low", "warning", "critical"]).toContain(result.summaryLevel);
  });

  test("invalid missing input fails validation and calculator throws", () => {
    const broken = { ...defaultInputs, distanceKm: undefined } as unknown as DeliveryCostCalculatorInputs;
    const validation = validateDeliveryCostCalculatorInputs(broken);
    expect(validation.ok).toBe(false);
    expect(() => calculateDeliveryCostCalculator(broken)).toThrow();
  });

  test("invalid negative input fails validation and calculator throws", () => {
    expectValidationFailure({ distanceKm: -1 });
  });
  test("invalid zero divisor/base fails validation and calculator throws", () => {
    const validation = validateDeliveryCostCalculatorInputs({ ...defaultInputs, tripCount: 0 });
    expect(validation.ok).toBe(false);
    if (validation.ok) return;
    expect(() => calculateDeliveryCostCalculator({ ...defaultInputs, tripCount: 0 })).toThrow();
  });

  test("invalid NaN input fails validation and calculator throws", () => {
    expectValidationFailure({ fuelOrEnergyUnitCost: Number.NaN });
  });

  test("invalid Infinity input fails validation and calculator throws", () => {
    expectValidationFailure({ fuelOrEnergyUnitCost: Number.POSITIVE_INFINITY });
  });

    test("contract metadata matches slug", () => {
    const contract = DELIVERY_COST_CALCULATOR_CRITICAL_FORMULA_CONTRACTS[0];
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
    const calculatorResult = calculateDeliveryCostCalculator(defaultInputs);
    expect(engineResult.outputs.find((output) => output.id === "totalExposure")?.raw).toBeCloseTo(calculatorResult.totalExposure, 2);
    expect(engineResult.outputs.find((output) => output.id === "variancePercent")?.raw).toBeCloseTo(calculatorResult.variancePercent, 2);
  });
});
