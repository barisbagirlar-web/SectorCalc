import { describe, expect, test } from "vitest";
import { CELIK_CATI_MAKAS_YAKLASIK_AGIRLIGI_CRITICAL_FORMULA_CONTRACTS } from "@/lib/formula-governance/contracts/celik-cati-makas-yaklasik-agirligi-critical";
import { getFormulaContractBySlug } from "@/lib/formula-governance/contracts";
import {
  calculateCelikCatiMakasYaklasikAgirligi,
  type CelikCatiMakasYaklasikAgirligiInputs,
} from "@/lib/premium-schema/calculators/celik-cati-makas-yaklasik-agirligi";
import { validateCelikCatiMakasYaklasikAgirligiInputs } from "@/lib/premium-schema/calculators/celik-cati-makas-yaklasik-agirligi-validation";
import { getPremiumCalculatorSchema } from "@/lib/premium-schema/schema-registry";
import {
  buildDefaultSchemaInputs,
  runPremiumSchemaEngine,
} from "@/lib/premium-schema/premium-schema-engine";

const SLUG = "celik-cati-makas-yaklasik-agirligi";
const SCHEMA_ID = "celik-cati-makas-yaklasik-agirligi";

const defaultInputs: CelikCatiMakasYaklasikAgirligiInputs = {
    "spanLength": 10,
    "trussHeight": 2,
    "trussType": 1
  };
const lowBandInputs: CelikCatiMakasYaklasikAgirligiInputs = {
    "spanLength": 1,
    "trussHeight": 2,
    "trussType": 1
  };
const criticalBandInputs: CelikCatiMakasYaklasikAgirligiInputs = {
    "spanLength": 6,
    "trussHeight": 2,
    "trussType": 1
  };

function expectValidationFailure(partial: Partial<CelikCatiMakasYaklasikAgirligiInputs>): void {
  const inputs = { ...defaultInputs, ...partial } as CelikCatiMakasYaklasikAgirligiInputs;
  const validation = validateCelikCatiMakasYaklasikAgirligiInputs(inputs);
  expect(validation.ok).toBe(false);
  if (validation.ok) return;
  expect(validation.errors.length).toBeGreaterThan(0);
  expect(() => calculateCelikCatiMakasYaklasikAgirligi(inputs)).toThrow();
}

function engineNumeric(schemaSlug: string, outputId: string, inputs: CelikCatiMakasYaklasikAgirligiInputs): number {
  const schema = getPremiumCalculatorSchema(schemaSlug);
  if (!schema) throw new Error("schema missing");
  const engineResult = runPremiumSchemaEngine(schema, inputs);
  const raw = engineResult.outputs.find((output) => output.id === outputId)?.raw;
  if (typeof raw !== "number") throw new Error(`missing output ${outputId}`);
  return raw;
}

describe("celik-cati-makas-yaklasik-agirligi", () => {
  test("exact default oracle", () => {
    const result = calculateCelikCatiMakasYaklasikAgirligi(defaultInputs);
    expect(result.totalExposure).toBeCloseTo(engineNumeric(SCHEMA_ID, "totalExposure", defaultInputs), 2);
    expect(result.variancePercent).toBeCloseTo(engineNumeric(SCHEMA_ID, "variancePercent", defaultInputs), 2);
    expect(["low", "warning", "critical"]).toContain(result.summaryLevel);
    expect(result.primaryDriver).toBe("totalExposure");
  });

  test("formula pipeline parity", () => {
    const result = calculateCelikCatiMakasYaklasikAgirligi(defaultInputs);
    expect(result.totalExposure).toBeCloseTo(
      engineNumeric(SCHEMA_ID, "totalExposure", defaultInputs),
      2,
    );
  });

  test("low threshold band", () => {
    const result = calculateCelikCatiMakasYaklasikAgirligi(lowBandInputs);
    expect(["low", "warning", "critical"]).toContain(result.summaryLevel);
  });

  test("warning threshold band", () => {
    const result = calculateCelikCatiMakasYaklasikAgirligi(defaultInputs);
    expect(["warning", "critical", "low"]).toContain(result.summaryLevel);
  });

  test("critical threshold band", () => {
    const result = calculateCelikCatiMakasYaklasikAgirligi(criticalBandInputs);
    expect(["low", "warning", "critical"]).toContain(result.summaryLevel);
  });

  test("invalid missing input fails validation and calculator throws", () => {
    const broken = { ...defaultInputs, spanLength: undefined } as unknown as CelikCatiMakasYaklasikAgirligiInputs;
    const validation = validateCelikCatiMakasYaklasikAgirligiInputs(broken);
    expect(validation.ok).toBe(false);
    expect(() => calculateCelikCatiMakasYaklasikAgirligi(broken)).toThrow();
  });

  test("invalid negative input fails validation and calculator throws", () => {
    expectValidationFailure({ spanLength: -1 });
  });
  test("invalid zero divisor/base fails validation and calculator throws", () => {
    const validation = validateCelikCatiMakasYaklasikAgirligiInputs({ ...defaultInputs, spanLength: 0 });
    expect(validation.ok).toBe(false);
    if (validation.ok) return;
    expect(() => calculateCelikCatiMakasYaklasikAgirligi({ ...defaultInputs, spanLength: 0 })).toThrow();
  });

  test("invalid NaN input fails validation and calculator throws", () => {
    expectValidationFailure({ trussType: Number.NaN });
  });

  test("invalid Infinity input fails validation and calculator throws", () => {
    expectValidationFailure({ trussType: Number.POSITIVE_INFINITY });
  });

    test("contract metadata matches slug", () => {
    const contract = CELIK_CATI_MAKAS_YAKLASIK_AGIRLIGI_CRITICAL_FORMULA_CONTRACTS[0];
    expect(contract).toBeDefined();
    if (!contract) return;
    expect(contract.slug).toBe(SLUG);
    expect(contract.requiredInputs.length).toBeGreaterThan(0);
    expect(contract.assumptions.join(" ")).toContain("deterministic");
  });

  test("engine parity test", () => {
    const schema = getPremiumCalculatorSchema(SCHEMA_ID);
    expect(schema).not.toBeNull();
    if (!schema) return;
    const schemaInputs = buildDefaultSchemaInputs(schema);
    const engineResult = runPremiumSchemaEngine(schema, schemaInputs);
    const calculatorResult = calculateCelikCatiMakasYaklasikAgirligi(defaultInputs);
    expect(engineResult.outputs.find((output) => output.id === "totalExposure")?.raw).toBeCloseTo(calculatorResult.totalExposure, 2);
    expect(engineResult.outputs.find((output) => output.id === "variancePercent")?.raw).toBeCloseTo(calculatorResult.variancePercent, 2);
  });
});
