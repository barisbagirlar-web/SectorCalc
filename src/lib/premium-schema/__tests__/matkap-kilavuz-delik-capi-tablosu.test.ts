import { describe, expect, test } from "vitest";
import { MATKAP_KILAVUZ_DELIK_CAPI_TABLOSU_CRITICAL_FORMULA_CONTRACTS } from "@/lib/formula-governance/contracts/matkap-kilavuz-delik-capi-tablosu-critical";
import { getFormulaContractBySlug } from "@/lib/formula-governance/contracts";
import {
  calculateMatkapKilavuzDelikCapiTablosu,
  type MatkapKilavuzDelikCapiTablosuInputs,
} from "@/lib/premium-schema/calculators/matkap-kilavuz-delik-capi-tablosu";
import { validateMatkapKilavuzDelikCapiTablosuInputs } from "@/lib/premium-schema/calculators/matkap-kilavuz-delik-capi-tablosu-validation";
import { getPremiumCalculatorSchema } from "@/lib/premium-schema/schema-registry";
import {
  buildDefaultSchemaInputs,
  runPremiumSchemaEngine,
} from "@/lib/premium-schema/premium-schema-engine";

const SLUG = "matkap-kilavuz-delik-capi-tablosu";
const SCHEMA_ID = "matkap-kilavuz-delik-capi-tablosu";

const defaultInputs: MatkapKilavuzDelikCapiTablosuInputs = {
    "nominalThreadDiameter": 10,
    "threadPitch": 1.5,
    "materialType": 1
  };
const lowBandInputs: MatkapKilavuzDelikCapiTablosuInputs = {
    "nominalThreadDiameter": 1,
    "threadPitch": 1.5,
    "materialType": 1
  };
const criticalBandInputs: MatkapKilavuzDelikCapiTablosuInputs = {
    "nominalThreadDiameter": 6,
    "threadPitch": 1.5,
    "materialType": 1
  };

function expectValidationFailure(partial: Partial<MatkapKilavuzDelikCapiTablosuInputs>): void {
  const inputs = { ...defaultInputs, ...partial } as MatkapKilavuzDelikCapiTablosuInputs;
  const validation = validateMatkapKilavuzDelikCapiTablosuInputs(inputs);
  expect(validation.ok).toBe(false);
  if (validation.ok) return;
  expect(validation.errors.length).toBeGreaterThan(0);
  expect(() => calculateMatkapKilavuzDelikCapiTablosu(inputs)).toThrow();
}

function engineNumeric(schemaSlug: string, outputId: string, inputs: MatkapKilavuzDelikCapiTablosuInputs): number {
  const schema = getPremiumCalculatorSchema(schemaSlug);
  if (!schema) throw new Error("schema missing");
  const engineResult = runPremiumSchemaEngine(schema, inputs);
  const raw = engineResult.outputs.find((output) => output.id === outputId)?.raw;
  if (typeof raw !== "number") throw new Error(`missing output ${outputId}`);
  return raw;
}

describe("matkap-kilavuz-delik-capi-tablosu", () => {
  test("exact default oracle", () => {
    const result = calculateMatkapKilavuzDelikCapiTablosu(defaultInputs);
    expect(result.totalExposure).toBeCloseTo(engineNumeric(SCHEMA_ID, "totalExposure", defaultInputs), 2);
    expect(result.variancePercent).toBeCloseTo(engineNumeric(SCHEMA_ID, "variancePercent", defaultInputs), 2);
    expect(["low", "warning", "critical"]).toContain(result.summaryLevel);
    expect(result.primaryDriver).toBe("totalExposure");
  });

  test("formula pipeline parity", () => {
    const result = calculateMatkapKilavuzDelikCapiTablosu(defaultInputs);
    expect(result.totalExposure).toBeCloseTo(
      engineNumeric(SCHEMA_ID, "totalExposure", defaultInputs),
      2,
    );
  });

  test("low threshold band", () => {
    const result = calculateMatkapKilavuzDelikCapiTablosu(lowBandInputs);
    expect(["low", "warning", "critical"]).toContain(result.summaryLevel);
  });

  test("warning threshold band", () => {
    const result = calculateMatkapKilavuzDelikCapiTablosu(defaultInputs);
    expect(["warning", "critical", "low"]).toContain(result.summaryLevel);
  });

  test("critical threshold band", () => {
    const result = calculateMatkapKilavuzDelikCapiTablosu(criticalBandInputs);
    expect(["low", "warning", "critical"]).toContain(result.summaryLevel);
  });

  test("invalid missing input fails validation and calculator throws", () => {
    const broken = { ...defaultInputs, nominalThreadDiameter: undefined } as unknown as MatkapKilavuzDelikCapiTablosuInputs;
    const validation = validateMatkapKilavuzDelikCapiTablosuInputs(broken);
    expect(validation.ok).toBe(false);
    expect(() => calculateMatkapKilavuzDelikCapiTablosu(broken)).toThrow();
  });

  test("invalid negative input fails validation and calculator throws", () => {
    expectValidationFailure({ nominalThreadDiameter: -1 });
  });
  test("invalid zero divisor/base fails validation and calculator throws", () => {
    const validation = validateMatkapKilavuzDelikCapiTablosuInputs({ ...defaultInputs, nominalThreadDiameter: 0 });
    expect(validation.ok).toBe(false);
    if (validation.ok) return;
    expect(() => calculateMatkapKilavuzDelikCapiTablosu({ ...defaultInputs, nominalThreadDiameter: 0 })).toThrow();
  });

  test("invalid NaN input fails validation and calculator throws", () => {
    expectValidationFailure({ materialType: Number.NaN });
  });

  test("invalid Infinity input fails validation and calculator throws", () => {
    expectValidationFailure({ materialType: Number.POSITIVE_INFINITY });
  });

    test("contract metadata matches slug", () => {
    const contract = MATKAP_KILAVUZ_DELIK_CAPI_TABLOSU_CRITICAL_FORMULA_CONTRACTS[0];
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
    const calculatorResult = calculateMatkapKilavuzDelikCapiTablosu(defaultInputs);
    expect(engineResult.outputs.find((output) => output.id === "totalExposure")?.raw).toBeCloseTo(calculatorResult.totalExposure, 2);
    expect(engineResult.outputs.find((output) => output.id === "variancePercent")?.raw).toBeCloseTo(calculatorResult.variancePercent, 2);
  });
});
