import { describe, expect, test } from "vitest";
import { getFormulaContractBySlug } from "@/lib/formula-governance/contracts";
import {
  calculateCbamComplianceVerdict,
  type CbamComplianceVerdictInputs,
} from "@/lib/premium-schema/calculators/cbam-compliance-verdict";
import { validateCbamComplianceVerdictInputs } from "@/lib/premium-schema/calculators/cbam-compliance-verdict-validation";
import { getPremiumCalculatorSchema } from "@/lib/premium-schema/schema-registry";
import {
  buildDefaultSchemaInputs,
  runPremiumSchemaEngine,
} from "@/lib/premium-schema/premium-schema-engine";

const SLUG = "cbam-compliance-verdict";

const defaultInputs: CbamComplianceVerdictInputs = {
    "embeddedEmissionsTon": 150,
    "declaredEmissionsTon": 120,
    "certificateCoveragePct": 70,
    "dataCompletenessPct": 80,
    "cbamCertificatePrice": 85,
    "eurTryRate": 35
  };
const lowBandInputs: CbamComplianceVerdictInputs = {
    "embeddedEmissionsTon": 1.5,
    "declaredEmissionsTon": 120,
    "certificateCoveragePct": 70,
    "dataCompletenessPct": 80,
    "cbamCertificatePrice": 85,
    "eurTryRate": 35
  };
const criticalBandInputs: CbamComplianceVerdictInputs = {
    "embeddedEmissionsTon": 150000,
    "declaredEmissionsTon": 120,
    "certificateCoveragePct": 70,
    "dataCompletenessPct": 80,
    "cbamCertificatePrice": 85,
    "eurTryRate": 35
  };

function expectValidationFailure(partial: Partial<CbamComplianceVerdictInputs>): void {
  const inputs = { ...defaultInputs, ...partial } as CbamComplianceVerdictInputs;
  const validation = validateCbamComplianceVerdictInputs(inputs);
  expect(validation.ok).toBe(false);
  if (validation.ok) return;
  expect(validation.errors.length).toBeGreaterThan(0);
  expect(() => calculateCbamComplianceVerdict(inputs)).toThrow();
}

function engineNumeric(schemaSlug: string, outputId: string, inputs: CbamComplianceVerdictInputs): number {
  const schema = getPremiumCalculatorSchema(schemaSlug);
  if (!schema) throw new Error("schema missing");
  const engineResult = runPremiumSchemaEngine(schema, inputs);
  const raw = engineResult.outputs.find((output) => output.id === outputId)?.raw;
  if (typeof raw !== "number") throw new Error(`missing output ${outputId}`);
  return raw;
}

describe("cbam-compliance-verdict", () => {
  test("exact default oracle", () => {
    const result = calculateCbamComplianceVerdict(defaultInputs);
    expect(result.financialExposure).toBeCloseTo(engineNumeric(SLUG, "financialExposure", defaultInputs), 2);
    expect(result.riskScore).toBeCloseTo(engineNumeric(SLUG, "riskScore", defaultInputs), 2);
    expect(["low", "warning", "critical"]).toContain(result.summaryLevel);
    expect(result.primaryDriver).toBe("financialExposure");
  });

  test("formula pipeline parity", () => {
    const result = calculateCbamComplianceVerdict(defaultInputs);
    expect(result.financialExposure).toBeCloseTo(
      engineNumeric(SLUG, "financialExposure", defaultInputs),
      2,
    );
  });

  test("low threshold band", () => {
    const result = calculateCbamComplianceVerdict(lowBandInputs);
    expect(["low", "warning", "critical"]).toContain(result.summaryLevel);
  });

  test("warning threshold band", () => {
    const result = calculateCbamComplianceVerdict(defaultInputs);
    expect(["warning", "critical", "low"]).toContain(result.summaryLevel);
  });

  test("critical threshold band", () => {
    const result = calculateCbamComplianceVerdict(criticalBandInputs);
    expect(["low", "warning", "critical"]).toContain(result.summaryLevel);
  });

  test("invalid missing input fails validation and calculator throws", () => {
    const broken = { ...defaultInputs, embeddedEmissionsTon: undefined } as unknown as CbamComplianceVerdictInputs;
    const validation = validateCbamComplianceVerdictInputs(broken);
    expect(validation.ok).toBe(false);
    expect(() => calculateCbamComplianceVerdict(broken)).toThrow();
  });

  test("invalid negative input fails validation and calculator throws", () => {
    expectValidationFailure({ embeddedEmissionsTon: -1 });
  });
  test("invalid zero divisor/base fails validation and calculator throws", () => {
    const validation = validateCbamComplianceVerdictInputs({ ...defaultInputs, eurTryRate: 0 });
    expect(validation.ok).toBe(false);
    if (validation.ok) return;
    expect(() => calculateCbamComplianceVerdict({ ...defaultInputs, eurTryRate: 0 })).toThrow();
  });

  test("invalid NaN input fails validation and calculator throws", () => {
    expectValidationFailure({ eurTryRate: Number.NaN });
  });

  test("invalid Infinity input fails validation and calculator throws", () => {
    expectValidationFailure({ eurTryRate: Number.POSITIVE_INFINITY });
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
    const calculatorResult = calculateCbamComplianceVerdict(defaultInputs);
    expect(engineResult.outputs.find((output) => output.id === "financialExposure")?.raw).toBeCloseTo(calculatorResult.financialExposure, 2);
    expect(engineResult.outputs.find((output) => output.id === "riskScore")?.raw).toBeCloseTo(calculatorResult.riskScore, 2);
  });
});
