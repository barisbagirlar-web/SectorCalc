import { describe, expect, test } from "vitest";
import { WELDING_BID_RISK_ANALYZER_CRITICAL_FORMULA_CONTRACTS } from "@/lib/formula-governance/contracts/welding-bid-risk-analyzer-critical";
import { getFormulaContractBySlug } from "@/lib/formula-governance/contracts";
import {
  calculateWeldingBidRiskAnalyzer,
  type WeldingBidRiskAnalyzerInputs,
} from "@/lib/premium-schema/calculators/welding-bid-risk-analyzer";
import { validateWeldingBidRiskAnalyzerInputs } from "@/lib/premium-schema/calculators/welding-bid-risk-analyzer-validation";
import { getPremiumCalculatorSchema } from "@/lib/premium-schema/schema-registry";
import {
  buildDefaultSchemaInputs,
  runPremiumSchemaEngine,
} from "@/lib/premium-schema/premium-schema-engine";

const SLUG = "welding-bid-risk-analyzer";

const defaultInputs: WeldingBidRiskAnalyzerInputs = {
    "monthlyToolCost": 3200,
    "partsProduced": 4800,
    "toolChangeMinutes": 18,
    "changesPerMonth": 42,
    "hourlyCost": 85,
    "coolantCost": 420
  };
const lowBandInputs: WeldingBidRiskAnalyzerInputs = {
    "monthlyToolCost": 32,
    "partsProduced": 4800,
    "toolChangeMinutes": 18,
    "changesPerMonth": 42,
    "hourlyCost": 85,
    "coolantCost": 420
  };
const criticalBandInputs: WeldingBidRiskAnalyzerInputs = {
    "monthlyToolCost": 3200000,
    "partsProduced": 4800,
    "toolChangeMinutes": 18,
    "changesPerMonth": 42,
    "hourlyCost": 85,
    "coolantCost": 420
  };

function expectValidationFailure(partial: Partial<WeldingBidRiskAnalyzerInputs>): void {
  const inputs = { ...defaultInputs, ...partial } as WeldingBidRiskAnalyzerInputs;
  const validation = validateWeldingBidRiskAnalyzerInputs(inputs);
  expect(validation.ok).toBe(false);
  if (validation.ok) return;
  expect(validation.errors.length).toBeGreaterThan(0);
  expect(() => calculateWeldingBidRiskAnalyzer(inputs)).toThrow();
}

function engineNumeric(schemaSlug: string, outputId: string, inputs: WeldingBidRiskAnalyzerInputs): number {
  const schema = getPremiumCalculatorSchema(schemaSlug);
  if (!schema) throw new Error("schema missing");
  const engineResult = runPremiumSchemaEngine(schema, inputs);
  const raw = engineResult.outputs.find((output) => output.id === outputId)?.raw;
  if (typeof raw !== "number") throw new Error(`missing output ${outputId}`);
  return raw;
}

describe("welding-bid-risk-analyzer", () => {
  test("exact default oracle", () => {
    const result = calculateWeldingBidRiskAnalyzer(defaultInputs);
    expect(result.totalExposure).toBeCloseTo(engineNumeric(SLUG, "totalExposure", defaultInputs), 2);
    expect(result.toolCostPerPart).toBeCloseTo(engineNumeric(SLUG, "toolCostPerPart", defaultInputs), 2);
    expect(["low", "warning", "critical"]).toContain(result.summaryLevel);
    expect(result.primaryDriver).toBe("totalExposure");
  });

  test("formula pipeline parity", () => {
    const result = calculateWeldingBidRiskAnalyzer(defaultInputs);
    expect(result.totalExposure).toBeCloseTo(
      engineNumeric(SLUG, "totalExposure", defaultInputs),
      2,
    );
  });

  test("low threshold band", () => {
    const result = calculateWeldingBidRiskAnalyzer(lowBandInputs);
    expect(["low", "warning", "critical"]).toContain(result.summaryLevel);
  });

  test("warning threshold band", () => {
    const result = calculateWeldingBidRiskAnalyzer(defaultInputs);
    expect(["warning", "critical", "low"]).toContain(result.summaryLevel);
  });

  test("critical threshold band", () => {
    const result = calculateWeldingBidRiskAnalyzer(criticalBandInputs);
    expect(["low", "warning", "critical"]).toContain(result.summaryLevel);
  });

  test("invalid missing input fails validation and calculator throws", () => {
    const broken = { ...defaultInputs, monthlyToolCost: undefined } as unknown as WeldingBidRiskAnalyzerInputs;
    const validation = validateWeldingBidRiskAnalyzerInputs(broken);
    expect(validation.ok).toBe(false);
    expect(() => calculateWeldingBidRiskAnalyzer(broken)).toThrow();
  });

  test("invalid negative input fails validation and calculator throws", () => {
    expectValidationFailure({ monthlyToolCost: -1 });
  });
  test("invalid zero divisor/base fails validation and calculator throws", () => {
    const validation = validateWeldingBidRiskAnalyzerInputs({ ...defaultInputs, partsProduced: 0 });
    expect(validation.ok).toBe(false);
    if (validation.ok) return;
    expect(() => calculateWeldingBidRiskAnalyzer({ ...defaultInputs, partsProduced: 0 })).toThrow();
  });

  test("invalid NaN input fails validation and calculator throws", () => {
    expectValidationFailure({ coolantCost: Number.NaN });
  });

  test("invalid Infinity input fails validation and calculator throws", () => {
    expectValidationFailure({ coolantCost: Number.POSITIVE_INFINITY });
  });

    test("contract metadata matches slug", () => {
    const contract = WELDING_BID_RISK_ANALYZER_CRITICAL_FORMULA_CONTRACTS[0];
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
    const calculatorResult = calculateWeldingBidRiskAnalyzer(defaultInputs);
    expect(engineResult.outputs.find((output) => output.id === "totalExposure")?.raw).toBeCloseTo(calculatorResult.totalExposure, 2);
    expect(engineResult.outputs.find((output) => output.id === "toolCostPerPart")?.raw).toBeCloseTo(calculatorResult.toolCostPerPart, 2);
  });
});
