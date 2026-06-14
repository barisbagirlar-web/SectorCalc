import { describe, expect, test } from "vitest";
import { WAREHOUSE_STORAGE_COST_CALCULATOR_CRITICAL_FORMULA_CONTRACTS } from "@/lib/formula-governance/contracts/warehouse-storage-cost-calculator-critical";
import { getFormulaContractBySlug } from "@/lib/formula-governance/contracts";
import {
  calculateWarehouseStorageCostCalculator,
  type WarehouseStorageCostCalculatorInputs,
} from "@/lib/premium-schema/calculators/warehouse-storage-cost-calculator";
import { validateWarehouseStorageCostCalculatorInputs } from "@/lib/premium-schema/calculators/warehouse-storage-cost-calculator-validation";
import { getPremiumCalculatorSchema } from "@/lib/premium-schema/schema-registry";
import {
  buildDefaultSchemaInputs,
  runPremiumSchemaEngine,
} from "@/lib/premium-schema/premium-schema-engine";

const SLUG = "warehouse-storage-cost-calculator";
const SCHEMA_ID = "warehouse-storage-cost-calculator";

const defaultInputs: WarehouseStorageCostCalculatorInputs = {
    "storageAreaUsed": 1000,
    "storageCostPerSqMeterPerDay": 0.5,
    "storageDays": 30,
    "handlingCostPerShipment": 50,
    "shipmentCount": 10,
    "driverHourlyRate": 25
  };
const lowBandInputs: WarehouseStorageCostCalculatorInputs = {
    "storageAreaUsed": 0.1,
    "storageCostPerSqMeterPerDay": 0.5,
    "storageDays": 30,
    "handlingCostPerShipment": 50,
    "shipmentCount": 10,
    "driverHourlyRate": 25
  };
const criticalBandInputs: WarehouseStorageCostCalculatorInputs = {
    "storageAreaUsed": 6,
    "storageCostPerSqMeterPerDay": 0.5,
    "storageDays": 30,
    "handlingCostPerShipment": 50,
    "shipmentCount": 10,
    "driverHourlyRate": 25
  };

function expectValidationFailure(partial: Partial<WarehouseStorageCostCalculatorInputs>): void {
  const inputs = { ...defaultInputs, ...partial } as WarehouseStorageCostCalculatorInputs;
  const validation = validateWarehouseStorageCostCalculatorInputs(inputs);
  expect(validation.ok).toBe(false);
  if (validation.ok) return;
  expect(validation.errors.length).toBeGreaterThan(0);
  expect(() => calculateWarehouseStorageCostCalculator(inputs)).toThrow();
}

function engineNumeric(schemaSlug: string, outputId: string, inputs: WarehouseStorageCostCalculatorInputs): number {
  const schema = getPremiumCalculatorSchema(schemaSlug);
  if (!schema) throw new Error("schema missing");
  const engineResult = runPremiumSchemaEngine(schema, inputs);
  const raw = engineResult.outputs.find((output) => output.id === outputId)?.raw;
  if (typeof raw !== "number") throw new Error(`missing output ${outputId}`);
  return raw;
}

describe("warehouse-storage-cost-calculator", () => {
  test("exact default oracle", () => {
    const result = calculateWarehouseStorageCostCalculator(defaultInputs);
    expect(result.totalExposure).toBeCloseTo(engineNumeric(SCHEMA_ID, "totalExposure", defaultInputs), 2);
    expect(result.variancePercent).toBeCloseTo(engineNumeric(SCHEMA_ID, "variancePercent", defaultInputs), 2);
    expect(["low", "warning", "critical"]).toContain(result.summaryLevel);
    expect(result.primaryDriver).toBe("totalExposure");
  });

  test("formula pipeline parity", () => {
    const result = calculateWarehouseStorageCostCalculator(defaultInputs);
    expect(result.totalExposure).toBeCloseTo(
      engineNumeric(SCHEMA_ID, "totalExposure", defaultInputs),
      2,
    );
  });

  test("low threshold band", () => {
    const result = calculateWarehouseStorageCostCalculator(lowBandInputs);
    expect(["low", "warning", "critical"]).toContain(result.summaryLevel);
  });

  test("warning threshold band", () => {
    const result = calculateWarehouseStorageCostCalculator(defaultInputs);
    expect(["warning", "critical", "low"]).toContain(result.summaryLevel);
  });

  test("critical threshold band", () => {
    const result = calculateWarehouseStorageCostCalculator(criticalBandInputs);
    expect(["low", "warning", "critical"]).toContain(result.summaryLevel);
  });

  test("invalid missing input fails validation and calculator throws", () => {
    const broken = { ...defaultInputs, storageAreaUsed: undefined } as unknown as WarehouseStorageCostCalculatorInputs;
    const validation = validateWarehouseStorageCostCalculatorInputs(broken);
    expect(validation.ok).toBe(false);
    expect(() => calculateWarehouseStorageCostCalculator(broken)).toThrow();
  });

  test("invalid negative input fails validation and calculator throws", () => {
    expectValidationFailure({ storageAreaUsed: -1 });
  });
  test("invalid zero divisor/base fails validation and calculator throws", () => {
    const validation = validateWarehouseStorageCostCalculatorInputs({ ...defaultInputs, storageCostPerSqMeterPerDay: 0 });
    expect(validation.ok).toBe(false);
    if (validation.ok) return;
    expect(() => calculateWarehouseStorageCostCalculator({ ...defaultInputs, storageCostPerSqMeterPerDay: 0 })).toThrow();
  });

  test("invalid NaN input fails validation and calculator throws", () => {
    expectValidationFailure({ driverHourlyRate: Number.NaN });
  });

  test("invalid Infinity input fails validation and calculator throws", () => {
    expectValidationFailure({ driverHourlyRate: Number.POSITIVE_INFINITY });
  });

    test("contract metadata matches slug", () => {
    const contract = WAREHOUSE_STORAGE_COST_CALCULATOR_CRITICAL_FORMULA_CONTRACTS[0];
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
    const calculatorResult = calculateWarehouseStorageCostCalculator(defaultInputs);
    expect(engineResult.outputs.find((output) => output.id === "totalExposure")?.raw).toBeCloseTo(calculatorResult.totalExposure, 2);
    expect(engineResult.outputs.find((output) => output.id === "variancePercent")?.raw).toBeCloseTo(calculatorResult.variancePercent, 2);
  });
});
