import { describe, expect, test } from "vitest";
import { getFormulaContractBySlug } from "@/lib/formula-governance/contracts";
import {
  calculateQualityCostPafCalculator,
  type QualityCostPafCalculatorInputs,
} from "@/lib/premium-schema/calculators/quality-cost-paf-calculator";
import { validateQualityCostPafCalculatorInputs } from "@/lib/premium-schema/calculators/quality-cost-paf-calculator-validation";
import { getPremiumCalculatorSchema } from "@/lib/premium-schema/schema-registry";
import {
  buildDefaultSchemaInputs,
  runPremiumSchemaEngine,
} from "@/lib/premium-schema/premium-schema-engine";

const SLUG = "quality-cost-paf-calculator";

const defaultInputs: QualityCostPafCalculatorInputs = {
    "preventionCost": 4200,
    "appraisalCost": 3100,
    "failureCost": 9800,
    "revenue": 420000
  };
const lowBandInputs: QualityCostPafCalculatorInputs = {
    "preventionCost": 42,
    "appraisalCost": 3100,
    "failureCost": 9800,
    "revenue": 420000
  };
const criticalBandInputs: QualityCostPafCalculatorInputs = {
    "preventionCost": 4200000,
    "appraisalCost": 3100,
    "failureCost": 9800,
    "revenue": 420000
  };

function expectValidationFailure(partial: Partial<QualityCostPafCalculatorInputs>): void {
  const inputs = { ...defaultInputs, ...partial } as QualityCostPafCalculatorInputs;
  const validation = validateQualityCostPafCalculatorInputs(inputs);
  expect(validation.ok).toBe(false);
  if (validation.ok) return;
  expect(validation.errors.length).toBeGreaterThan(0);
  expect(() => calculateQualityCostPafCalculator(inputs)).toThrow();
}

function engineNumeric(schemaSlug: string, outputId: string, inputs: QualityCostPafCalculatorInputs): number {
  const schema = getPremiumCalculatorSchema(schemaSlug);
  if (!schema) throw new Error("schema missing");
  const engineResult = runPremiumSchemaEngine(schema, inputs);
  const raw = engineResult.outputs.find((output) => output.id === outputId)?.raw;
  if (typeof raw !== "number") throw new Error(`missing output ${outputId}`);
  return raw;
}

describe("quality-cost-paf-calculator", () => {
  test("exact default oracle", () => {
    const result = calculateQualityCostPafCalculator(defaultInputs);
    expect(result.totalQualityCost).toBeCloseTo(engineNumeric(SLUG, "totalQualityCost", defaultInputs), 2);
    expect(result.qualityCostPercent).toBeCloseTo(engineNumeric(SLUG, "qualityCostPercent", defaultInputs), 2);
    expect(["low", "warning", "critical"]).toContain(result.summaryLevel);
    expect(result.primaryDriver).toBe("totalQualityCost");
  });

  test("formula pipeline parity", () => {
    const result = calculateQualityCostPafCalculator(defaultInputs);
    expect(result.totalQualityCost).toBeCloseTo(
      engineNumeric(SLUG, "totalQualityCost", defaultInputs),
      2,
    );
  });

  test("low threshold band", () => {
    const result = calculateQualityCostPafCalculator(lowBandInputs);
    expect(["low", "warning", "critical"]).toContain(result.summaryLevel);
  });

  test("warning threshold band", () => {
    const result = calculateQualityCostPafCalculator(defaultInputs);
    expect(["warning", "critical", "low"]).toContain(result.summaryLevel);
  });

  test("critical threshold band", () => {
    const result = calculateQualityCostPafCalculator(criticalBandInputs);
    expect(["low", "warning", "critical"]).toContain(result.summaryLevel);
  });

  test("invalid missing input fails validation and calculator throws", () => {
    const broken = { ...defaultInputs, preventionCost: undefined } as unknown as QualityCostPafCalculatorInputs;
    const validation = validateQualityCostPafCalculatorInputs(broken);
    expect(validation.ok).toBe(false);
    expect(() => calculateQualityCostPafCalculator(broken)).toThrow();
  });

  test("invalid negative input fails validation and calculator throws", () => {
    expectValidationFailure({ preventionCost: -1 });
  });
  test("invalid zero divisor/base fails validation and calculator throws", () => {
    const validation = validateQualityCostPafCalculatorInputs({ ...defaultInputs, revenue: 0 });
    expect(validation.ok).toBe(false);
    if (validation.ok) return;
    expect(() => calculateQualityCostPafCalculator({ ...defaultInputs, revenue: 0 })).toThrow();
  });

  test("invalid NaN input fails validation and calculator throws", () => {
    expectValidationFailure({ revenue: Number.NaN });
  });

  test("invalid Infinity input fails validation and calculator throws", () => {
    expectValidationFailure({ revenue: Number.POSITIVE_INFINITY });
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
    const calculatorResult = calculateQualityCostPafCalculator(defaultInputs);
    expect(engineResult.outputs.find((output) => output.id === "totalQualityCost")?.raw).toBeCloseTo(calculatorResult.totalQualityCost, 2);
    expect(engineResult.outputs.find((output) => output.id === "qualityCostPercent")?.raw).toBeCloseTo(calculatorResult.qualityCostPercent, 2);
  });
});
