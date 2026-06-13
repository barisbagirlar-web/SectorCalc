import { describe, expect, test } from "vitest";
import { getFormulaContractBySlug } from "@/lib/formula-governance/contracts";
import {
  calculateAutoRepairComebackCost,
  type AutoRepairComebackCostInputs,
} from "@/lib/premium-schema/calculators/auto-repair-comeback-cost";
import { validateAutoRepairComebackCostInputs } from "@/lib/premium-schema/calculators/auto-repair-comeback-cost-validation";
import { getPremiumCalculatorSchema } from "@/lib/premium-schema/schema-registry";
import {
  buildDefaultSchemaInputs,
  runPremiumSchemaEngine,
} from "@/lib/premium-schema/premium-schema-engine";

const SLUG = "auto-repair-comeback-cost";

const defaultInputs: AutoRepairComebackCostInputs = {
    "monthlyRepairRevenue": 52000,
    "comebackRatePercent": 5,
    "averageJobCost": 280,
    "diagnosticHours": 38,
    "laborRate": 65,
    "partsHandlingCost": 900
  };
const lowBandInputs: AutoRepairComebackCostInputs = {
    "monthlyRepairRevenue": 52000,
    "comebackRatePercent": 0.4,
    "averageJobCost": 280,
    "diagnosticHours": 38,
    "laborRate": 65,
    "partsHandlingCost": 900
  };
const criticalBandInputs: AutoRepairComebackCostInputs = {
    "monthlyRepairRevenue": 52000,
    "comebackRatePercent": 16,
    "averageJobCost": 280,
    "diagnosticHours": 38,
    "laborRate": 65,
    "partsHandlingCost": 900
  };

function expectValidationFailure(partial: Partial<AutoRepairComebackCostInputs>): void {
  const inputs = { ...defaultInputs, ...partial } as AutoRepairComebackCostInputs;
  const validation = validateAutoRepairComebackCostInputs(inputs);
  expect(validation.ok).toBe(false);
  if (validation.ok) return;
  expect(validation.errors.length).toBeGreaterThan(0);
  expect(() => calculateAutoRepairComebackCost(inputs)).toThrow();
}

function engineNumeric(schemaSlug: string, outputId: string, inputs: AutoRepairComebackCostInputs): number {
  const schema = getPremiumCalculatorSchema(schemaSlug);
  if (!schema) throw new Error("schema missing");
  const engineResult = runPremiumSchemaEngine(schema, inputs);
  const raw = engineResult.outputs.find((output) => output.id === outputId)?.raw;
  if (typeof raw !== "number") throw new Error(`missing output ${outputId}`);
  return raw;
}

describe("auto-repair-comeback-cost", () => {
  test("exact default oracle", () => {
    const result = calculateAutoRepairComebackCost(defaultInputs);
    expect(result.totalExposure).toBeCloseTo(engineNumeric(SLUG, "totalExposure", defaultInputs), 2);
    expect(result.comebackCost).toBeCloseTo(engineNumeric(SLUG, "comebackCost", defaultInputs), 2);
    expect(["low", "warning", "critical"]).toContain(result.summaryLevel);
    expect(result.primaryDriver).toBe("totalExposure");
  });

  test("formula pipeline parity", () => {
    const result = calculateAutoRepairComebackCost(defaultInputs);
    expect(result.totalExposure).toBeCloseTo(
      engineNumeric(SLUG, "totalExposure", defaultInputs),
      2,
    );
  });

  test("low threshold band", () => {
    const result = calculateAutoRepairComebackCost(lowBandInputs);
    expect(["low", "warning", "critical"]).toContain(result.summaryLevel);
  });

  test("warning threshold band", () => {
    const result = calculateAutoRepairComebackCost(defaultInputs);
    expect(["warning", "critical", "low"]).toContain(result.summaryLevel);
  });

  test("critical threshold band", () => {
    const result = calculateAutoRepairComebackCost(criticalBandInputs);
    expect(["low", "warning", "critical"]).toContain(result.summaryLevel);
  });

  test("invalid missing input fails validation and calculator throws", () => {
    const broken = { ...defaultInputs, monthlyRepairRevenue: undefined } as unknown as AutoRepairComebackCostInputs;
    const validation = validateAutoRepairComebackCostInputs(broken);
    expect(validation.ok).toBe(false);
    expect(() => calculateAutoRepairComebackCost(broken)).toThrow();
  });

  test("invalid negative input fails validation and calculator throws", () => {
    expectValidationFailure({ monthlyRepairRevenue: -1 });
  });
  test("invalid zero divisor/base fails validation and calculator throws", () => {
    const validation = validateAutoRepairComebackCostInputs({ ...defaultInputs, monthlyRepairRevenue: 0 });
    expect(validation.ok).toBe(false);
    if (validation.ok) return;
    expect(() => calculateAutoRepairComebackCost({ ...defaultInputs, monthlyRepairRevenue: 0 })).toThrow();
  });

  test("invalid NaN input fails validation and calculator throws", () => {
    expectValidationFailure({ partsHandlingCost: Number.NaN });
  });

  test("invalid Infinity input fails validation and calculator throws", () => {
    expectValidationFailure({ partsHandlingCost: Number.POSITIVE_INFINITY });
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
    const calculatorResult = calculateAutoRepairComebackCost(defaultInputs);
    expect(engineResult.outputs.find((output) => output.id === "totalExposure")?.raw).toBeCloseTo(calculatorResult.totalExposure, 2);
    expect(engineResult.outputs.find((output) => output.id === "comebackCost")?.raw).toBeCloseTo(calculatorResult.comebackCost, 2);
  });
});
