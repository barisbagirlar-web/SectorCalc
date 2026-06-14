import { describe, expect, test } from "vitest";
import { MILLWORK_BID_RISK_ANALYZER_CRITICAL_FORMULA_CONTRACTS } from "@/lib/formula-governance/contracts/millwork-bid-risk-analyzer-critical";
import { getFormulaContractBySlug } from "@/lib/formula-governance/contracts";
import {
  calculateMillworkBidRiskAnalyzer,
  type MillworkBidRiskAnalyzerInputs,
} from "@/lib/premium-schema/calculators/millwork-bid-risk-analyzer";
import { validateMillworkBidRiskAnalyzerInputs } from "@/lib/premium-schema/calculators/millwork-bid-risk-analyzer-validation";
import { getPremiumCalculatorSchema } from "@/lib/premium-schema/schema-registry";
import {
  buildDefaultSchemaInputs,
  runPremiumSchemaEngine,
} from "@/lib/premium-schema/premium-schema-engine";

const SLUG = "millwork-bid-risk-analyzer";

const defaultInputs: MillworkBidRiskAnalyzerInputs = {
    "fabricCost": 22000,
    "cuttingWastePercent": 6,
    "targetWastePercent": 3,
    "shrinkagePercent": 4,
    "dyeReworkCost": 1500
  };
const lowBandInputs: MillworkBidRiskAnalyzerInputs = {
    "fabricCost": 22000,
    "cuttingWastePercent": 0.5,
    "targetWastePercent": 3,
    "shrinkagePercent": 4,
    "dyeReworkCost": 1500
  };
const criticalBandInputs: MillworkBidRiskAnalyzerInputs = {
    "fabricCost": 22000,
    "cuttingWastePercent": 18,
    "targetWastePercent": 3,
    "shrinkagePercent": 4,
    "dyeReworkCost": 1500
  };

function expectValidationFailure(partial: Partial<MillworkBidRiskAnalyzerInputs>): void {
  const inputs = { ...defaultInputs, ...partial } as MillworkBidRiskAnalyzerInputs;
  const validation = validateMillworkBidRiskAnalyzerInputs(inputs);
  expect(validation.ok).toBe(false);
  if (validation.ok) return;
  expect(validation.errors.length).toBeGreaterThan(0);
  expect(() => calculateMillworkBidRiskAnalyzer(inputs)).toThrow();
}

function engineNumeric(schemaSlug: string, outputId: string, inputs: MillworkBidRiskAnalyzerInputs): number {
  const schema = getPremiumCalculatorSchema(schemaSlug);
  if (!schema) throw new Error("schema missing");
  const engineResult = runPremiumSchemaEngine(schema, inputs);
  const raw = engineResult.outputs.find((output) => output.id === outputId)?.raw;
  if (typeof raw !== "number") throw new Error(`missing output ${outputId}`);
  return raw;
}

describe("millwork-bid-risk-analyzer", () => {
  test("exact default oracle", () => {
    const result = calculateMillworkBidRiskAnalyzer(defaultInputs);
    expect(result.totalExposure).toBeCloseTo(engineNumeric(SLUG, "totalExposure", defaultInputs), 2);
    expect(result.excessCuttingWaste).toBeCloseTo(engineNumeric(SLUG, "excessCuttingWaste", defaultInputs), 2);
    expect(["low", "warning", "critical"]).toContain(result.summaryLevel);
    expect(result.primaryDriver).toBe("totalExposure");
  });

  test("formula pipeline parity", () => {
    const result = calculateMillworkBidRiskAnalyzer(defaultInputs);
    expect(result.totalExposure).toBeCloseTo(
      engineNumeric(SLUG, "totalExposure", defaultInputs),
      2,
    );
  });

  test("low threshold band", () => {
    const result = calculateMillworkBidRiskAnalyzer(lowBandInputs);
    expect(["low", "warning", "critical"]).toContain(result.summaryLevel);
  });

  test("warning threshold band", () => {
    const result = calculateMillworkBidRiskAnalyzer(defaultInputs);
    expect(["warning", "critical", "low"]).toContain(result.summaryLevel);
  });

  test("critical threshold band", () => {
    const result = calculateMillworkBidRiskAnalyzer(criticalBandInputs);
    expect(["low", "warning", "critical"]).toContain(result.summaryLevel);
  });

  test("invalid missing input fails validation and calculator throws", () => {
    const broken = { ...defaultInputs, fabricCost: undefined } as unknown as MillworkBidRiskAnalyzerInputs;
    const validation = validateMillworkBidRiskAnalyzerInputs(broken);
    expect(validation.ok).toBe(false);
    expect(() => calculateMillworkBidRiskAnalyzer(broken)).toThrow();
  });

  test("invalid negative input fails validation and calculator throws", () => {
    expectValidationFailure({ fabricCost: -1 });
  });

  test("invalid NaN input fails validation and calculator throws", () => {
    expectValidationFailure({ dyeReworkCost: Number.NaN });
  });

  test("invalid Infinity input fails validation and calculator throws", () => {
    expectValidationFailure({ dyeReworkCost: Number.POSITIVE_INFINITY });
  });

    test("contract metadata matches slug", () => {
    const contract = MILLWORK_BID_RISK_ANALYZER_CRITICAL_FORMULA_CONTRACTS[0];
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
    const calculatorResult = calculateMillworkBidRiskAnalyzer(defaultInputs);
    expect(engineResult.outputs.find((output) => output.id === "totalExposure")?.raw).toBeCloseTo(calculatorResult.totalExposure, 2);
    expect(engineResult.outputs.find((output) => output.id === "excessCuttingWaste")?.raw).toBeCloseTo(calculatorResult.excessCuttingWaste, 2);
  });
});
