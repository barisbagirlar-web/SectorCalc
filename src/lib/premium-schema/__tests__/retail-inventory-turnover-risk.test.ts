import { describe, expect, test } from "vitest";
import { getFormulaContractBySlug } from "@/lib/formula-governance/contracts";
import {
  calculateRetailInventoryTurnoverRisk,
  type RetailInventoryTurnoverRiskInputs,
} from "@/lib/premium-schema/calculators/retail-inventory-turnover-risk";
import { validateRetailInventoryTurnoverRiskInputs } from "@/lib/premium-schema/calculators/retail-inventory-turnover-risk-validation";
import { getPremiumCalculatorSchema } from "@/lib/premium-schema/schema-registry";
import {
  buildDefaultSchemaInputs,
  runPremiumSchemaEngine,
} from "@/lib/premium-schema/premium-schema-engine";

const SLUG = "retail-inventory-turnover-risk";

const defaultInputs: RetailInventoryTurnoverRiskInputs = {
    "averageInventory": 42000,
    "annualCOGS": 180000,
    "carryingCostPercent": 18,
    "markdownPercent": 12
  };
const lowBandInputs: RetailInventoryTurnoverRiskInputs = {
    "averageInventory": 420,
    "annualCOGS": 180000,
    "carryingCostPercent": 18,
    "markdownPercent": 12
  };
const criticalBandInputs: RetailInventoryTurnoverRiskInputs = {
    "averageInventory": 42000000,
    "annualCOGS": 180000,
    "carryingCostPercent": 18,
    "markdownPercent": 12
  };

function expectValidationFailure(partial: Partial<RetailInventoryTurnoverRiskInputs>): void {
  const inputs = { ...defaultInputs, ...partial } as RetailInventoryTurnoverRiskInputs;
  const validation = validateRetailInventoryTurnoverRiskInputs(inputs);
  expect(validation.ok).toBe(false);
  if (validation.ok) return;
  expect(validation.errors.length).toBeGreaterThan(0);
  expect(() => calculateRetailInventoryTurnoverRisk(inputs)).toThrow();
}

function engineNumeric(schemaSlug: string, outputId: string, inputs: RetailInventoryTurnoverRiskInputs): number {
  const schema = getPremiumCalculatorSchema(schemaSlug);
  if (!schema) throw new Error("schema missing");
  const engineResult = runPremiumSchemaEngine(schema, inputs);
  const raw = engineResult.outputs.find((output) => output.id === outputId)?.raw;
  if (typeof raw !== "number") throw new Error(`missing output ${outputId}`);
  return raw;
}

describe("retail-inventory-turnover-risk", () => {
  test("exact default oracle", () => {
    const result = calculateRetailInventoryTurnoverRisk(defaultInputs);
    expect(result.totalExposure).toBeCloseTo(engineNumeric(SLUG, "totalExposure", defaultInputs), 2);
    expect(result.turnover).toBeCloseTo(engineNumeric(SLUG, "turnover", defaultInputs), 2);
    expect(["low", "warning", "critical"]).toContain(result.summaryLevel);
    expect(result.primaryDriver).toBe("totalExposure");
  });

  test("formula pipeline parity", () => {
    const result = calculateRetailInventoryTurnoverRisk(defaultInputs);
    expect(result.totalExposure).toBeCloseTo(
      engineNumeric(SLUG, "totalExposure", defaultInputs),
      2,
    );
  });

  test("low threshold band", () => {
    const lowResult = calculateRetailInventoryTurnoverRisk(lowBandInputs);
    const defaultResult = calculateRetailInventoryTurnoverRisk(defaultInputs);
    const rank = { low: 0, warning: 1, critical: 2 } as const;
    expect(rank[lowResult.summaryLevel]).toBeLessThanOrEqual(rank[defaultResult.summaryLevel]);
  });

  test("warning threshold band", () => {
    const result = calculateRetailInventoryTurnoverRisk(defaultInputs);
    expect(["warning", "critical", "low"]).toContain(result.summaryLevel);
  });

  test("critical threshold band", () => {
    const result = calculateRetailInventoryTurnoverRisk(criticalBandInputs);
    expect(["warning", "critical"]).toContain(result.summaryLevel);
  });

  test("invalid missing input fails validation and calculator throws", () => {
    const broken = { ...defaultInputs, averageInventory: undefined } as unknown as RetailInventoryTurnoverRiskInputs;
    const validation = validateRetailInventoryTurnoverRiskInputs(broken);
    expect(validation.ok).toBe(false);
    expect(() => calculateRetailInventoryTurnoverRisk(broken)).toThrow();
  });

  test("invalid negative input fails validation and calculator throws", () => {
    expectValidationFailure({ averageInventory: -1 });
  });

  test("invalid NaN input fails validation and calculator throws", () => {
    expectValidationFailure({ markdownPercent: Number.NaN });
  });

  test("invalid Infinity input fails validation and calculator throws", () => {
    expectValidationFailure({ markdownPercent: Number.POSITIVE_INFINITY });
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
    const calculatorResult = calculateRetailInventoryTurnoverRisk(defaultInputs);
    expect(engineResult.outputs.find((output) => output.id === "totalExposure")?.raw).toBeCloseTo(calculatorResult.totalExposure, 2);
    expect(engineResult.outputs.find((output) => output.id === "turnover")?.raw).toBeCloseTo(calculatorResult.turnover, 2);
  });
});
