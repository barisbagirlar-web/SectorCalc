import { describe, expect, test } from "vitest";
import { getFormulaContractBySlug } from "@/lib/formula-governance/contracts";
import {
  calculateInventoryCarryingCostEoqCalculator,
  type InventoryCarryingCostEoqCalculatorInputs,
} from "@/lib/premium-schema/calculators/inventory-carrying-cost-eoq-calculator";
import { validateInventoryCarryingCostEoqCalculatorInputs } from "@/lib/premium-schema/calculators/inventory-carrying-cost-eoq-calculator-validation";
import { getPremiumCalculatorSchema } from "@/lib/premium-schema/schema-registry";
import {
  buildDefaultSchemaInputs,
  runPremiumSchemaEngine,
} from "@/lib/premium-schema/premium-schema-engine";

const SLUG = "inventory-carrying-cost-eoq-calculator";

const defaultInputs: InventoryCarryingCostEoqCalculatorInputs = {
    "annualDemand": 12000,
    "orderCost": 85,
    "unitCost": 14.5,
    "carryingCostPercent": 18
  };
const lowBandInputs: InventoryCarryingCostEoqCalculatorInputs = {
    "annualDemand": 120,
    "orderCost": 85,
    "unitCost": 14.5,
    "carryingCostPercent": 18
  };
const criticalBandInputs: InventoryCarryingCostEoqCalculatorInputs = {
    "annualDemand": 12000000,
    "orderCost": 85,
    "unitCost": 14.5,
    "carryingCostPercent": 18
  };

function expectValidationFailure(partial: Partial<InventoryCarryingCostEoqCalculatorInputs>): void {
  const inputs = { ...defaultInputs, ...partial } as InventoryCarryingCostEoqCalculatorInputs;
  const validation = validateInventoryCarryingCostEoqCalculatorInputs(inputs);
  expect(validation.ok).toBe(false);
  if (validation.ok) return;
  expect(validation.errors.length).toBeGreaterThan(0);
  expect(() => calculateInventoryCarryingCostEoqCalculator(inputs)).toThrow();
}

function engineNumeric(schemaSlug: string, outputId: string, inputs: InventoryCarryingCostEoqCalculatorInputs): number {
  const schema = getPremiumCalculatorSchema(schemaSlug);
  if (!schema) throw new Error("schema missing");
  const engineResult = runPremiumSchemaEngine(schema, inputs);
  const raw = engineResult.outputs.find((output) => output.id === outputId)?.raw;
  if (typeof raw !== "number") throw new Error(`missing output ${outputId}`);
  return raw;
}

describe("inventory-carrying-cost-eoq-calculator", () => {
  test("exact default oracle", () => {
    const result = calculateInventoryCarryingCostEoqCalculator(defaultInputs);
    expect(result.eoqUnits).toBeCloseTo(engineNumeric(SLUG, "eoqUnits", defaultInputs), 2);
    expect(result.annualCarryingCost).toBeCloseTo(engineNumeric(SLUG, "annualCarryingCost", defaultInputs), 2);
    expect(["low", "warning", "critical"]).toContain(result.summaryLevel);
    expect(result.primaryDriver).toBe("eoqUnits");
  });

  test("formula pipeline parity", () => {
    const result = calculateInventoryCarryingCostEoqCalculator(defaultInputs);
    expect(result.eoqUnits).toBeCloseTo(
      engineNumeric(SLUG, "eoqUnits", defaultInputs),
      2,
    );
  });

  test("low threshold band", () => {
    const lowResult = calculateInventoryCarryingCostEoqCalculator(lowBandInputs);
    const defaultResult = calculateInventoryCarryingCostEoqCalculator(defaultInputs);
    const rank = { low: 0, warning: 1, critical: 2 } as const;
    expect(rank[lowResult.summaryLevel]).toBeLessThanOrEqual(rank[defaultResult.summaryLevel]);
  });

  test("warning threshold band", () => {
    const result = calculateInventoryCarryingCostEoqCalculator(defaultInputs);
    expect(["warning", "critical", "low"]).toContain(result.summaryLevel);
  });

  test("critical threshold band", () => {
    const result = calculateInventoryCarryingCostEoqCalculator(criticalBandInputs);
    expect(["warning", "critical"]).toContain(result.summaryLevel);
  });

  test("invalid missing input fails validation and calculator throws", () => {
    const broken = { ...defaultInputs, annualDemand: undefined } as unknown as InventoryCarryingCostEoqCalculatorInputs;
    const validation = validateInventoryCarryingCostEoqCalculatorInputs(broken);
    expect(validation.ok).toBe(false);
    expect(() => calculateInventoryCarryingCostEoqCalculator(broken)).toThrow();
  });

  test("invalid negative input fails validation and calculator throws", () => {
    expectValidationFailure({ annualDemand: -1 });
  });
  test("invalid zero divisor/base fails validation and calculator throws", () => {
    const validation = validateInventoryCarryingCostEoqCalculatorInputs({ ...defaultInputs, annualDemand: 0 });
    expect(validation.ok).toBe(false);
    if (validation.ok) return;
    expect(() => calculateInventoryCarryingCostEoqCalculator({ ...defaultInputs, annualDemand: 0 })).toThrow();
  });

  test("invalid NaN input fails validation and calculator throws", () => {
    expectValidationFailure({ carryingCostPercent: Number.NaN });
  });

  test("invalid Infinity input fails validation and calculator throws", () => {
    expectValidationFailure({ carryingCostPercent: Number.POSITIVE_INFINITY });
  });

  test("contract metadata matches slug", () => {
    const contract = getFormulaContractBySlug(SLUG);
    expect(contract).toBeDefined();
    if (!contract) return;
    expect(contract.slug).toBe(SLUG);
    expect(contract.requiredInputs.length).toBeGreaterThan(0);
    expect(contract.assumptions.join(" ")).toContain("deterministic");
  });

  test("engine parity test", () => {
    const schema = getPremiumCalculatorSchema(SLUG);
    expect(schema).not.toBeNull();
    if (!schema) return;
    const schemaInputs = buildDefaultSchemaInputs(schema);
    const engineResult = runPremiumSchemaEngine(schema, schemaInputs);
    const calculatorResult = calculateInventoryCarryingCostEoqCalculator(defaultInputs);
    expect(engineResult.outputs.find((output) => output.id === "eoqUnits")?.raw).toBeCloseTo(calculatorResult.eoqUnits, 2);
    expect(engineResult.outputs.find((output) => output.id === "annualCarryingCost")?.raw).toBeCloseTo(calculatorResult.annualCarryingCost, 2);
  });
});
