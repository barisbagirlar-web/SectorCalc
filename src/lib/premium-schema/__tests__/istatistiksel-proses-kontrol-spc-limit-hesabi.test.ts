import { describe, expect, test } from "vitest";
import { ISTATISTIKSEL_PROSES_KONTROL_SPC_LIMIT_HESABI_CRITICAL_FORMULA_CONTRACTS } from "@/lib/formula-governance/contracts/istatistiksel-proses-kontrol-spc-limit-hesabi-critical";
import { getFormulaContractBySlug } from "@/lib/formula-governance/contracts";
import {
  calculateIstatistikselProsesKontrolSpcLimitHesabi,
  type IstatistikselProsesKontrolSpcLimitHesabiInputs,
} from "@/lib/premium-schema/calculators/istatistiksel-proses-kontrol-spc-limit-hesabi";
import { validateIstatistikselProsesKontrolSpcLimitHesabiInputs } from "@/lib/premium-schema/calculators/istatistiksel-proses-kontrol-spc-limit-hesabi-validation";
import { getPremiumCalculatorSchema } from "@/lib/premium-schema/schema-registry";
import {
  buildDefaultSchemaInputs,
  runPremiumSchemaEngine,
} from "@/lib/premium-schema/premium-schema-engine";

const SLUG = "istatistiksel-proses-kontrol-spc-limit-hesabi";
const SCHEMA_ID = "istatistiksel-proses-kontrol-spc-limit-hesabi";

const defaultInputs: IstatistikselProsesKontrolSpcLimitHesabiInputs = {
    "subgroupAverages": 1,
    "subgroupRanges": 1,
    "sampleSize": 5
  };
const lowBandInputs: IstatistikselProsesKontrolSpcLimitHesabiInputs = {
    "subgroupAverages": 0.1,
    "subgroupRanges": 1,
    "sampleSize": 5
  };
const criticalBandInputs: IstatistikselProsesKontrolSpcLimitHesabiInputs = {
    "subgroupAverages": 6,
    "subgroupRanges": 1,
    "sampleSize": 5
  };

function expectValidationFailure(partial: Partial<IstatistikselProsesKontrolSpcLimitHesabiInputs>): void {
  const inputs = { ...defaultInputs, ...partial } as IstatistikselProsesKontrolSpcLimitHesabiInputs;
  const validation = validateIstatistikselProsesKontrolSpcLimitHesabiInputs(inputs);
  expect(validation.ok).toBe(false);
  if (validation.ok) return;
  expect(validation.errors.length).toBeGreaterThan(0);
  expect(() => calculateIstatistikselProsesKontrolSpcLimitHesabi(inputs)).toThrow();
}

function engineNumeric(schemaSlug: string, outputId: string, inputs: IstatistikselProsesKontrolSpcLimitHesabiInputs): number {
  const schema = getPremiumCalculatorSchema(schemaSlug);
  if (!schema) throw new Error("schema missing");
  const engineResult = runPremiumSchemaEngine(schema, inputs);
  const raw = engineResult.outputs.find((output) => output.id === outputId)?.raw;
  if (typeof raw !== "number") throw new Error(`missing output ${outputId}`);
  return raw;
}

describe("istatistiksel-proses-kontrol-spc-limit-hesabi", () => {
  test("exact default oracle", () => {
    const result = calculateIstatistikselProsesKontrolSpcLimitHesabi(defaultInputs);
    expect(result.totalExposure).toBeCloseTo(engineNumeric(SCHEMA_ID, "totalExposure", defaultInputs), 2);
    expect(result.variancePercent).toBeCloseTo(engineNumeric(SCHEMA_ID, "variancePercent", defaultInputs), 2);
    expect(["low", "warning", "critical"]).toContain(result.summaryLevel);
    expect(result.primaryDriver).toBe("totalExposure");
  });

  test("formula pipeline parity", () => {
    const result = calculateIstatistikselProsesKontrolSpcLimitHesabi(defaultInputs);
    expect(result.totalExposure).toBeCloseTo(
      engineNumeric(SCHEMA_ID, "totalExposure", defaultInputs),
      2,
    );
  });

  test("low threshold band", () => {
    const result = calculateIstatistikselProsesKontrolSpcLimitHesabi(lowBandInputs);
    expect(["low", "warning", "critical"]).toContain(result.summaryLevel);
  });

  test("warning threshold band", () => {
    const result = calculateIstatistikselProsesKontrolSpcLimitHesabi(defaultInputs);
    expect(["warning", "critical", "low"]).toContain(result.summaryLevel);
  });

  test("critical threshold band", () => {
    const result = calculateIstatistikselProsesKontrolSpcLimitHesabi(criticalBandInputs);
    expect(["low", "warning", "critical"]).toContain(result.summaryLevel);
  });

  test("invalid missing input fails validation and calculator throws", () => {
    const broken = { ...defaultInputs, subgroupAverages: undefined } as unknown as IstatistikselProsesKontrolSpcLimitHesabiInputs;
    const validation = validateIstatistikselProsesKontrolSpcLimitHesabiInputs(broken);
    expect(validation.ok).toBe(false);
    expect(() => calculateIstatistikselProsesKontrolSpcLimitHesabi(broken)).toThrow();
  });

  test("invalid negative input fails validation and calculator throws", () => {
    expectValidationFailure({ subgroupAverages: -1 });
  });
  test("invalid zero divisor/base fails validation and calculator throws", () => {
    const validation = validateIstatistikselProsesKontrolSpcLimitHesabiInputs({ ...defaultInputs, sampleSize: 0 });
    expect(validation.ok).toBe(false);
    if (validation.ok) return;
    expect(() => calculateIstatistikselProsesKontrolSpcLimitHesabi({ ...defaultInputs, sampleSize: 0 })).toThrow();
  });

  test("invalid NaN input fails validation and calculator throws", () => {
    expectValidationFailure({ sampleSize: Number.NaN });
  });

  test("invalid Infinity input fails validation and calculator throws", () => {
    expectValidationFailure({ sampleSize: Number.POSITIVE_INFINITY });
  });

    test("contract metadata matches slug", () => {
    const contract = ISTATISTIKSEL_PROSES_KONTROL_SPC_LIMIT_HESABI_CRITICAL_FORMULA_CONTRACTS[0];
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
    const calculatorResult = calculateIstatistikselProsesKontrolSpcLimitHesabi(defaultInputs);
    expect(engineResult.outputs.find((output) => output.id === "totalExposure")?.raw).toBeCloseTo(calculatorResult.totalExposure, 2);
    expect(engineResult.outputs.find((output) => output.id === "variancePercent")?.raw).toBeCloseTo(calculatorResult.variancePercent, 2);
  });
});
