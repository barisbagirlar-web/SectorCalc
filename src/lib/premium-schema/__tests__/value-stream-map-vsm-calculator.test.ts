import { describe, expect, test } from "vitest";
import { getFormulaContractBySlug } from "@/lib/formula-governance/contracts";
import {
  calculateValueStreamMapVsmCalculator,
  type ValueStreamMapVsmCalculatorInputs,
} from "@/lib/premium-schema/calculators/value-stream-map-vsm-calculator";
import { validateValueStreamMapVsmCalculatorInputs } from "@/lib/premium-schema/calculators/value-stream-map-vsm-calculator-validation";
import { getPremiumCalculatorSchema } from "@/lib/premium-schema/schema-registry";
import {
  buildDefaultSchemaInputs,
  runPremiumSchemaEngine,
} from "@/lib/premium-schema/premium-schema-engine";

const SLUG = "value-stream-map-vsm-calculator";

const defaultInputs: ValueStreamMapVsmCalculatorInputs = {
    "processMinutes": 18,
    "waitMinutes": 240,
    "transportMinutes": 45
  };
const lowBandInputs: ValueStreamMapVsmCalculatorInputs = {
    "processMinutes": 0.18,
    "waitMinutes": 240,
    "transportMinutes": 45
  };
const criticalBandInputs: ValueStreamMapVsmCalculatorInputs = {
    "processMinutes": 18000,
    "waitMinutes": 240,
    "transportMinutes": 45
  };

function expectValidationFailure(partial: Partial<ValueStreamMapVsmCalculatorInputs>): void {
  const inputs = { ...defaultInputs, ...partial } as ValueStreamMapVsmCalculatorInputs;
  const validation = validateValueStreamMapVsmCalculatorInputs(inputs);
  expect(validation.ok).toBe(false);
  if (validation.ok) return;
  expect(validation.errors.length).toBeGreaterThan(0);
  expect(() => calculateValueStreamMapVsmCalculator(inputs)).toThrow();
}

function engineNumeric(schemaSlug: string, outputId: string, inputs: ValueStreamMapVsmCalculatorInputs): number {
  const schema = getPremiumCalculatorSchema(schemaSlug);
  if (!schema) throw new Error("schema missing");
  const engineResult = runPremiumSchemaEngine(schema, inputs);
  const raw = engineResult.outputs.find((output) => output.id === outputId)?.raw;
  if (typeof raw !== "number") throw new Error(`missing output ${outputId}`);
  return raw;
}

describe("value-stream-map-vsm-calculator", () => {
  test("exact default oracle", () => {
    const result = calculateValueStreamMapVsmCalculator(defaultInputs);
    expect(result.totalLeadMinutes).toBeCloseTo(engineNumeric(SLUG, "totalLeadMinutes", defaultInputs), 2);
    expect(result.valueAddedPercent).toBeCloseTo(engineNumeric(SLUG, "valueAddedPercent", defaultInputs), 2);
    expect(["low", "warning", "critical"]).toContain(result.summaryLevel);
    expect(result.primaryDriver).toBe("totalLeadMinutes");
  });

  test("formula pipeline parity", () => {
    const result = calculateValueStreamMapVsmCalculator(defaultInputs);
    expect(result.totalLeadMinutes).toBeCloseTo(
      engineNumeric(SLUG, "totalLeadMinutes", defaultInputs),
      2,
    );
  });

  test("low threshold band", () => {
    const lowResult = calculateValueStreamMapVsmCalculator(lowBandInputs);
    const defaultResult = calculateValueStreamMapVsmCalculator(defaultInputs);
    const rank = { low: 0, warning: 1, critical: 2 } as const;
    expect(rank[lowResult.summaryLevel]).toBeLessThanOrEqual(rank[defaultResult.summaryLevel]);
  });

  test("warning threshold band", () => {
    const result = calculateValueStreamMapVsmCalculator(defaultInputs);
    expect(["warning", "critical", "low"]).toContain(result.summaryLevel);
  });

  test("critical threshold band", () => {
    const result = calculateValueStreamMapVsmCalculator(criticalBandInputs);
    expect(["warning", "critical"]).toContain(result.summaryLevel);
  });

  test("invalid missing input fails validation and calculator throws", () => {
    const broken = { ...defaultInputs, processMinutes: undefined } as unknown as ValueStreamMapVsmCalculatorInputs;
    const validation = validateValueStreamMapVsmCalculatorInputs(broken);
    expect(validation.ok).toBe(false);
    expect(() => calculateValueStreamMapVsmCalculator(broken)).toThrow();
  });

  test("invalid negative input fails validation and calculator throws", () => {
    expectValidationFailure({ processMinutes: -1 });
  });

  test("invalid NaN input fails validation and calculator throws", () => {
    expectValidationFailure({ transportMinutes: Number.NaN });
  });

  test("invalid Infinity input fails validation and calculator throws", () => {
    expectValidationFailure({ transportMinutes: Number.POSITIVE_INFINITY });
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
    const calculatorResult = calculateValueStreamMapVsmCalculator(defaultInputs);
    expect(engineResult.outputs.find((output) => output.id === "totalLeadMinutes")?.raw).toBeCloseTo(calculatorResult.totalLeadMinutes, 2);
    expect(engineResult.outputs.find((output) => output.id === "valueAddedPercent")?.raw).toBeCloseTo(calculatorResult.valueAddedPercent, 2);
  });
});
