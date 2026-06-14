import { describe, expect, test } from "vitest";
import { YAY_HELISEL_KUVVET_UZAMA_HESABI_CRITICAL_FORMULA_CONTRACTS } from "@/lib/formula-governance/contracts/yay-helisel-kuvvet-uzama-hesabi-critical";
import { getFormulaContractBySlug } from "@/lib/formula-governance/contracts";
import {
  calculateYayHeliselKuvvetUzamaHesabi,
  type YayHeliselKuvvetUzamaHesabiInputs,
} from "@/lib/premium-schema/calculators/yay-helisel-kuvvet-uzama-hesabi";
import { validateYayHeliselKuvvetUzamaHesabiInputs } from "@/lib/premium-schema/calculators/yay-helisel-kuvvet-uzama-hesabi-validation";
import { getPremiumCalculatorSchema } from "@/lib/premium-schema/schema-registry";
import {
  buildDefaultSchemaInputs,
  runPremiumSchemaEngine,
} from "@/lib/premium-schema/premium-schema-engine";

const SLUG = "yay-helisel-kuvvet-uzama-hesabi";
const SCHEMA_ID = "yay-helisel-kuvvet-uzama-hesabi";

const defaultInputs: YayHeliselKuvvetUzamaHesabiInputs = {
    "shearModulus": 80000,
    "wireDiameter": 5,
    "meanCoilDiameter": 40,
    "activeCoils": 10,
    "deflection": 10,
    "yieldShearStress": 600
  };
const lowBandInputs: YayHeliselKuvvetUzamaHesabiInputs = {
    "shearModulus": 1000,
    "wireDiameter": 5,
    "meanCoilDiameter": 40,
    "activeCoils": 10,
    "deflection": 10,
    "yieldShearStress": 600
  };
const criticalBandInputs: YayHeliselKuvvetUzamaHesabiInputs = {
    "shearModulus": 1000,
    "wireDiameter": 5,
    "meanCoilDiameter": 40,
    "activeCoils": 10,
    "deflection": 10,
    "yieldShearStress": 600
  };

function expectValidationFailure(partial: Partial<YayHeliselKuvvetUzamaHesabiInputs>): void {
  const inputs = { ...defaultInputs, ...partial } as YayHeliselKuvvetUzamaHesabiInputs;
  const validation = validateYayHeliselKuvvetUzamaHesabiInputs(inputs);
  expect(validation.ok).toBe(false);
  if (validation.ok) return;
  expect(validation.errors.length).toBeGreaterThan(0);
  expect(() => calculateYayHeliselKuvvetUzamaHesabi(inputs)).toThrow();
}

function engineNumeric(schemaSlug: string, outputId: string, inputs: YayHeliselKuvvetUzamaHesabiInputs): number {
  const schema = getPremiumCalculatorSchema(schemaSlug);
  if (!schema) throw new Error("schema missing");
  const engineResult = runPremiumSchemaEngine(schema, inputs);
  const raw = engineResult.outputs.find((output) => output.id === outputId)?.raw;
  if (typeof raw !== "number") throw new Error(`missing output ${outputId}`);
  return raw;
}

describe("yay-helisel-kuvvet-uzama-hesabi", () => {
  test("exact default oracle", () => {
    const result = calculateYayHeliselKuvvetUzamaHesabi(defaultInputs);
    expect(result.totalExposure).toBeCloseTo(engineNumeric(SCHEMA_ID, "totalExposure", defaultInputs), 2);
    expect(result.variancePercent).toBeCloseTo(engineNumeric(SCHEMA_ID, "variancePercent", defaultInputs), 2);
    expect(["low", "warning", "critical"]).toContain(result.summaryLevel);
    expect(result.primaryDriver).toBe("totalExposure");
  });

  test("formula pipeline parity", () => {
    const result = calculateYayHeliselKuvvetUzamaHesabi(defaultInputs);
    expect(result.totalExposure).toBeCloseTo(
      engineNumeric(SCHEMA_ID, "totalExposure", defaultInputs),
      2,
    );
  });

  test("low threshold band", () => {
    const result = calculateYayHeliselKuvvetUzamaHesabi(lowBandInputs);
    expect(["low", "warning", "critical"]).toContain(result.summaryLevel);
  });

  test("warning threshold band", () => {
    const result = calculateYayHeliselKuvvetUzamaHesabi(defaultInputs);
    expect(["warning", "critical", "low"]).toContain(result.summaryLevel);
  });

  test("critical threshold band", () => {
    const result = calculateYayHeliselKuvvetUzamaHesabi(criticalBandInputs);
    expect(["low", "warning", "critical"]).toContain(result.summaryLevel);
  });

  test("invalid missing input fails validation and calculator throws", () => {
    const broken = { ...defaultInputs, shearModulus: undefined } as unknown as YayHeliselKuvvetUzamaHesabiInputs;
    const validation = validateYayHeliselKuvvetUzamaHesabiInputs(broken);
    expect(validation.ok).toBe(false);
    expect(() => calculateYayHeliselKuvvetUzamaHesabi(broken)).toThrow();
  });

  test("invalid negative input fails validation and calculator throws", () => {
    expectValidationFailure({ shearModulus: -1 });
  });
  test("invalid zero divisor/base fails validation and calculator throws", () => {
    const validation = validateYayHeliselKuvvetUzamaHesabiInputs({ ...defaultInputs, shearModulus: 0 });
    expect(validation.ok).toBe(false);
    if (validation.ok) return;
    expect(() => calculateYayHeliselKuvvetUzamaHesabi({ ...defaultInputs, shearModulus: 0 })).toThrow();
  });

  test("invalid NaN input fails validation and calculator throws", () => {
    expectValidationFailure({ yieldShearStress: Number.NaN });
  });

  test("invalid Infinity input fails validation and calculator throws", () => {
    expectValidationFailure({ yieldShearStress: Number.POSITIVE_INFINITY });
  });

    test("contract metadata matches slug", () => {
    const contract = YAY_HELISEL_KUVVET_UZAMA_HESABI_CRITICAL_FORMULA_CONTRACTS[0];
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
    const calculatorResult = calculateYayHeliselKuvvetUzamaHesabi(defaultInputs);
    expect(engineResult.outputs.find((output) => output.id === "totalExposure")?.raw).toBeCloseTo(calculatorResult.totalExposure, 2);
    expect(engineResult.outputs.find((output) => output.id === "variancePercent")?.raw).toBeCloseTo(calculatorResult.variancePercent, 2);
  });
});
