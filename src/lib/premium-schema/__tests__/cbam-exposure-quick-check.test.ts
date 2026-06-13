import { describe, expect, test } from "vitest";
import { getFormulaContractBySlug } from "@/lib/formula-governance/contracts";
import {
  calculateCbamExposureQuickCheck,
  type CbamExposureQuickCheckInputs,
} from "@/lib/premium-schema/calculators/cbam-exposure-quick-check";
import { validateCbamExposureQuickCheckInputs } from "@/lib/premium-schema/calculators/cbam-exposure-quick-check-validation";
import { getPremiumCalculatorSchema } from "@/lib/premium-schema/schema-registry";
import {
  buildDefaultSchemaInputs,
  runPremiumSchemaEngine,
} from "@/lib/premium-schema/premium-schema-engine";

const SLUG = "cbam-exposure-quick-check";

const defaultInputs: CbamExposureQuickCheckInputs = {
    "embeddedEmissionsTon": 120,
    "cbamCertificatePrice": 85,
    "eurTryRate": 35,
    "productQuantity": 1000,
    "adminCost": 2500
  };
const lowBandInputs: CbamExposureQuickCheckInputs = {
    "embeddedEmissionsTon": 1.2,
    "cbamCertificatePrice": 85,
    "eurTryRate": 35,
    "productQuantity": 1000,
    "adminCost": 2500
  };
const criticalBandInputs: CbamExposureQuickCheckInputs = {
    "embeddedEmissionsTon": 120000,
    "cbamCertificatePrice": 85,
    "eurTryRate": 35,
    "productQuantity": 1000,
    "adminCost": 2500
  };

function expectValidationFailure(partial: Partial<CbamExposureQuickCheckInputs>): void {
  const inputs = { ...defaultInputs, ...partial } as CbamExposureQuickCheckInputs;
  const validation = validateCbamExposureQuickCheckInputs(inputs);
  expect(validation.ok).toBe(false);
  if (validation.ok) return;
  expect(validation.errors.length).toBeGreaterThan(0);
  expect(() => calculateCbamExposureQuickCheck(inputs)).toThrow();
}

function engineNumeric(schemaSlug: string, outputId: string, inputs: CbamExposureQuickCheckInputs): number {
  const schema = getPremiumCalculatorSchema(schemaSlug);
  if (!schema) throw new Error("schema missing");
  const engineResult = runPremiumSchemaEngine(schema, inputs);
  const raw = engineResult.outputs.find((output) => output.id === outputId)?.raw;
  if (typeof raw !== "number") throw new Error(`missing output ${outputId}`);
  return raw;
}

describe("cbam-exposure-quick-check", () => {
  test("exact default oracle", () => {
    const result = calculateCbamExposureQuickCheck(defaultInputs);
    expect(result.totalExposure).toBeCloseTo(engineNumeric(SLUG, "totalExposure", defaultInputs), 2);
    expect(result.cbamCost).toBeCloseTo(engineNumeric(SLUG, "cbamCost", defaultInputs), 2);
    expect(["low", "warning", "critical"]).toContain(result.summaryLevel);
    expect(result.primaryDriver).toBe("totalExposure");
  });

  test("formula pipeline parity", () => {
    const result = calculateCbamExposureQuickCheck(defaultInputs);
    expect(result.totalExposure).toBeCloseTo(
      engineNumeric(SLUG, "totalExposure", defaultInputs),
      2,
    );
  });

  test("low threshold band", () => {
    const result = calculateCbamExposureQuickCheck(lowBandInputs);
    expect(["low", "warning", "critical"]).toContain(result.summaryLevel);
  });

  test("warning threshold band", () => {
    const result = calculateCbamExposureQuickCheck(defaultInputs);
    expect(["warning", "critical", "low"]).toContain(result.summaryLevel);
  });

  test("critical threshold band", () => {
    const result = calculateCbamExposureQuickCheck(criticalBandInputs);
    expect(["low", "warning", "critical"]).toContain(result.summaryLevel);
  });

  test("invalid missing input fails validation and calculator throws", () => {
    const broken = { ...defaultInputs, embeddedEmissionsTon: undefined } as unknown as CbamExposureQuickCheckInputs;
    const validation = validateCbamExposureQuickCheckInputs(broken);
    expect(validation.ok).toBe(false);
    expect(() => calculateCbamExposureQuickCheck(broken)).toThrow();
  });

  test("invalid negative input fails validation and calculator throws", () => {
    expectValidationFailure({ embeddedEmissionsTon: -1 });
  });
  test("invalid zero divisor/base fails validation and calculator throws", () => {
    const validation = validateCbamExposureQuickCheckInputs({ ...defaultInputs, eurTryRate: 0 });
    expect(validation.ok).toBe(false);
    if (validation.ok) return;
    expect(() => calculateCbamExposureQuickCheck({ ...defaultInputs, eurTryRate: 0 })).toThrow();
  });

  test("invalid NaN input fails validation and calculator throws", () => {
    expectValidationFailure({ adminCost: Number.NaN });
  });

  test("invalid Infinity input fails validation and calculator throws", () => {
    expectValidationFailure({ adminCost: Number.POSITIVE_INFINITY });
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
    const calculatorResult = calculateCbamExposureQuickCheck(defaultInputs);
    expect(engineResult.outputs.find((output) => output.id === "totalExposure")?.raw).toBeCloseTo(calculatorResult.totalExposure, 2);
    expect(engineResult.outputs.find((output) => output.id === "cbamCost")?.raw).toBeCloseTo(calculatorResult.cbamCost, 2);
  });
});
