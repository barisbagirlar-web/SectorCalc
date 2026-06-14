import { describe, expect, test } from "vitest";
import { CNC_QUOTE_RISK_ANALYZER_CRITICAL_FORMULA_CONTRACTS } from "@/lib/formula-governance/contracts/cnc-quote-risk-analyzer-critical";
import { getFormulaContractBySlug } from "@/lib/formula-governance/contracts";
import {
  calculateCncQuoteRiskAnalyzer,
  type CncQuoteRiskAnalyzerInputs,
} from "@/lib/premium-schema/calculators/cnc-quote-risk-analyzer";
import { validateCncQuoteRiskAnalyzerInputs } from "@/lib/premium-schema/calculators/cnc-quote-risk-analyzer-validation";
import { getPremiumCalculatorSchema } from "@/lib/premium-schema/schema-registry";
import {
  buildDefaultSchemaInputs,
  runPremiumSchemaEngine,
} from "@/lib/premium-schema/premium-schema-engine";

const SLUG = "cnc-quote-risk-analyzer";

const defaultInputs: CncQuoteRiskAnalyzerInputs = {
    "machineRate": 90,
    "plannedHours": 8,
    "downtimeHours": 1.2,
    "materialCost": 400,
    "scrapRate": 6,
    "availability": 82,
    "performance": 88,
    "quality": 95,
    "quotedPrice": 5000
  };
const lowBandInputs: CncQuoteRiskAnalyzerInputs = {
    "machineRate": 0.9,
    "plannedHours": 8,
    "downtimeHours": 1.2,
    "materialCost": 400,
    "scrapRate": 6,
    "availability": 82,
    "performance": 88,
    "quality": 95,
    "quotedPrice": 5000
  };
const criticalBandInputs: CncQuoteRiskAnalyzerInputs = {
    "machineRate": 90000,
    "plannedHours": 8,
    "downtimeHours": 1.2,
    "materialCost": 400,
    "scrapRate": 6,
    "availability": 82,
    "performance": 88,
    "quality": 95,
    "quotedPrice": 5000
  };

function expectValidationFailure(partial: Partial<CncQuoteRiskAnalyzerInputs>): void {
  const inputs = { ...defaultInputs, ...partial } as CncQuoteRiskAnalyzerInputs;
  const validation = validateCncQuoteRiskAnalyzerInputs(inputs);
  expect(validation.ok).toBe(false);
  if (validation.ok) return;
  expect(validation.errors.length).toBeGreaterThan(0);
  expect(() => calculateCncQuoteRiskAnalyzer(inputs)).toThrow();
}

function engineNumeric(schemaSlug: string, outputId: string, inputs: CncQuoteRiskAnalyzerInputs): number {
  const schema = getPremiumCalculatorSchema(schemaSlug);
  if (!schema) throw new Error("schema missing");
  const engineResult = runPremiumSchemaEngine(schema, inputs);
  const raw = engineResult.outputs.find((output) => output.id === outputId)?.raw;
  if (typeof raw !== "number") throw new Error(`missing output ${outputId}`);
  return raw;
}

describe("cnc-quote-risk-analyzer", () => {
  test("exact default oracle", () => {
    const result = calculateCncQuoteRiskAnalyzer(defaultInputs);
    expect(result.oeeScore).toBeCloseTo(engineNumeric(SLUG, "oeeScore", defaultInputs), 2);
    expect(result.availabilityLossCost).toBeCloseTo(engineNumeric(SLUG, "availabilityLossCost", defaultInputs), 2);
    expect(result.totalExposure).toBeCloseTo(engineNumeric(SLUG, "totalExposure", defaultInputs), 2);
    expect(["low", "warning", "critical"]).toContain(result.summaryLevel);
    expect(result.primaryDriver).toBe("totalExposure");
  });

  test("formula pipeline parity", () => {
    const result = calculateCncQuoteRiskAnalyzer(defaultInputs);
    expect(result.totalExposure).toBeCloseTo(
      engineNumeric(SLUG, "totalExposure", defaultInputs),
      2,
    );
  });

  test("low threshold band", () => {
    const result = calculateCncQuoteRiskAnalyzer(lowBandInputs);
    expect(["low", "warning", "critical"]).toContain(result.summaryLevel);
  });

  test("warning threshold band", () => {
    const result = calculateCncQuoteRiskAnalyzer(defaultInputs);
    expect(["warning", "critical", "low"]).toContain(result.summaryLevel);
  });

  test("critical threshold band", () => {
    const result = calculateCncQuoteRiskAnalyzer(criticalBandInputs);
    expect(["low", "warning", "critical"]).toContain(result.summaryLevel);
  });

  test("invalid missing input fails validation and calculator throws", () => {
    const broken = { ...defaultInputs, machineRate: undefined } as unknown as CncQuoteRiskAnalyzerInputs;
    const validation = validateCncQuoteRiskAnalyzerInputs(broken);
    expect(validation.ok).toBe(false);
    expect(() => calculateCncQuoteRiskAnalyzer(broken)).toThrow();
  });

  test("invalid negative input fails validation and calculator throws", () => {
    expectValidationFailure({ machineRate: -1 });
  });
  test("invalid zero divisor/base fails validation and calculator throws", () => {
    const validation = validateCncQuoteRiskAnalyzerInputs({ ...defaultInputs, plannedHours: 0 });
    expect(validation.ok).toBe(false);
    if (validation.ok) return;
    expect(() => calculateCncQuoteRiskAnalyzer({ ...defaultInputs, plannedHours: 0 })).toThrow();
  });

  test("invalid NaN input fails validation and calculator throws", () => {
    expectValidationFailure({ quotedPrice: Number.NaN });
  });

  test("invalid Infinity input fails validation and calculator throws", () => {
    expectValidationFailure({ quotedPrice: Number.POSITIVE_INFINITY });
  });

    test("contract metadata matches slug", () => {
    const contract = CNC_QUOTE_RISK_ANALYZER_CRITICAL_FORMULA_CONTRACTS[0];
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
    const calculatorResult = calculateCncQuoteRiskAnalyzer(defaultInputs);
    expect(engineResult.outputs.find((output) => output.id === "oeeScore")?.raw).toBeCloseTo(calculatorResult.oeeScore, 2);
    expect(engineResult.outputs.find((output) => output.id === "availabilityLossCost")?.raw).toBeCloseTo(calculatorResult.availabilityLossCost, 2);
    expect(engineResult.outputs.find((output) => output.id === "totalExposure")?.raw).toBeCloseTo(calculatorResult.totalExposure, 2);
  });
});
