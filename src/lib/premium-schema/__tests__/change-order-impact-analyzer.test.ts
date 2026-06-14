import { describe, expect, test } from "vitest";
import { CHANGE_ORDER_IMPACT_ANALYZER_CRITICAL_FORMULA_CONTRACTS } from "@/lib/formula-governance/contracts/change-order-impact-analyzer-critical";
import { getFormulaContractBySlug } from "@/lib/formula-governance/contracts";
import {
  calculateChangeOrderImpactAnalyzer,
  type ChangeOrderImpactAnalyzerInputs,
} from "@/lib/premium-schema/calculators/change-order-impact-analyzer";
import { validateChangeOrderImpactAnalyzerInputs } from "@/lib/premium-schema/calculators/change-order-impact-analyzer-validation";
import { getPremiumCalculatorSchema } from "@/lib/premium-schema/schema-registry";
import {
  buildDefaultSchemaInputs,
  runPremiumSchemaEngine,
} from "@/lib/premium-schema/premium-schema-engine";

const SLUG = "change-order-impact-analyzer";

const defaultInputs: ChangeOrderImpactAnalyzerInputs = {
    "dailySiteCost": 1250,
    "delayDays": 6,
    "laborBudget": 28000,
    "laborOverrunPercent": 8,
    "materialBudget": 46000,
    "materialOverrunPercent": 5
  };
const lowBandInputs: ChangeOrderImpactAnalyzerInputs = {
    "dailySiteCost": 1250,
    "delayDays": 0.30000000000000004,
    "laborBudget": 28000,
    "laborOverrunPercent": 8,
    "materialBudget": 46000,
    "materialOverrunPercent": 5
  };
const criticalBandInputs: ChangeOrderImpactAnalyzerInputs = {
    "dailySiteCost": 1250,
    "delayDays": 20,
    "laborBudget": 28000,
    "laborOverrunPercent": 8,
    "materialBudget": 46000,
    "materialOverrunPercent": 5
  };

function expectValidationFailure(partial: Partial<ChangeOrderImpactAnalyzerInputs>): void {
  const inputs = { ...defaultInputs, ...partial } as ChangeOrderImpactAnalyzerInputs;
  const validation = validateChangeOrderImpactAnalyzerInputs(inputs);
  expect(validation.ok).toBe(false);
  if (validation.ok) return;
  expect(validation.errors.length).toBeGreaterThan(0);
  expect(() => calculateChangeOrderImpactAnalyzer(inputs)).toThrow();
}

function engineNumeric(schemaSlug: string, outputId: string, inputs: ChangeOrderImpactAnalyzerInputs): number {
  const schema = getPremiumCalculatorSchema(schemaSlug);
  if (!schema) throw new Error("schema missing");
  const engineResult = runPremiumSchemaEngine(schema, inputs);
  const raw = engineResult.outputs.find((output) => output.id === outputId)?.raw;
  if (typeof raw !== "number") throw new Error(`missing output ${outputId}`);
  return raw;
}

describe("change-order-impact-analyzer", () => {
  test("exact default oracle", () => {
    const result = calculateChangeOrderImpactAnalyzer(defaultInputs);
    expect(result.totalExposure).toBeCloseTo(engineNumeric(SLUG, "totalExposure", defaultInputs), 2);
    expect(result.delayCost).toBeCloseTo(engineNumeric(SLUG, "delayCost", defaultInputs), 2);
    expect(["low", "warning", "critical"]).toContain(result.summaryLevel);
    expect(result.primaryDriver).toBe("totalExposure");
  });

  test("formula pipeline parity", () => {
    const result = calculateChangeOrderImpactAnalyzer(defaultInputs);
    expect(result.totalExposure).toBeCloseTo(
      engineNumeric(SLUG, "totalExposure", defaultInputs),
      2,
    );
  });

  test("low threshold band", () => {
    const result = calculateChangeOrderImpactAnalyzer(lowBandInputs);
    expect(["low", "warning", "critical"]).toContain(result.summaryLevel);
  });

  test("warning threshold band", () => {
    const result = calculateChangeOrderImpactAnalyzer(defaultInputs);
    expect(["warning", "critical", "low"]).toContain(result.summaryLevel);
  });

  test("critical threshold band", () => {
    const result = calculateChangeOrderImpactAnalyzer(criticalBandInputs);
    expect(["low", "warning", "critical"]).toContain(result.summaryLevel);
  });

  test("invalid missing input fails validation and calculator throws", () => {
    const broken = { ...defaultInputs, dailySiteCost: undefined } as unknown as ChangeOrderImpactAnalyzerInputs;
    const validation = validateChangeOrderImpactAnalyzerInputs(broken);
    expect(validation.ok).toBe(false);
    expect(() => calculateChangeOrderImpactAnalyzer(broken)).toThrow();
  });

  test("invalid negative input fails validation and calculator throws", () => {
    expectValidationFailure({ dailySiteCost: -1 });
  });
  test("invalid zero divisor/base fails validation and calculator throws", () => {
    const validation = validateChangeOrderImpactAnalyzerInputs({ ...defaultInputs, delayDays: 0 });
    expect(validation.ok).toBe(false);
    if (validation.ok) return;
    expect(() => calculateChangeOrderImpactAnalyzer({ ...defaultInputs, delayDays: 0 })).toThrow();
  });

  test("invalid NaN input fails validation and calculator throws", () => {
    expectValidationFailure({ materialOverrunPercent: Number.NaN });
  });

  test("invalid Infinity input fails validation and calculator throws", () => {
    expectValidationFailure({ materialOverrunPercent: Number.POSITIVE_INFINITY });
  });

    test("contract metadata matches slug", () => {
    const contract = CHANGE_ORDER_IMPACT_ANALYZER_CRITICAL_FORMULA_CONTRACTS[0];
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
    const calculatorResult = calculateChangeOrderImpactAnalyzer(defaultInputs);
    expect(engineResult.outputs.find((output) => output.id === "totalExposure")?.raw).toBeCloseTo(calculatorResult.totalExposure, 2);
    expect(engineResult.outputs.find((output) => output.id === "delayCost")?.raw).toBeCloseTo(calculatorResult.delayCost, 2);
  });
});
