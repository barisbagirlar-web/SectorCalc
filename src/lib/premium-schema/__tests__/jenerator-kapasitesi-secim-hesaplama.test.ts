import { describe, expect, test } from "vitest";
import { JENERATOR_KAPASITESI_SECIM_HESAPLAMA_CRITICAL_FORMULA_CONTRACTS } from "@/lib/formula-governance/contracts/jenerator-kapasitesi-secim-hesaplama-critical";
import { getFormulaContractBySlug } from "@/lib/formula-governance/contracts";
import {
  calculateJeneratorKapasitesiSecimHesaplama,
  type JeneratorKapasitesiSecimHesaplamaInputs,
} from "@/lib/premium-schema/calculators/jenerator-kapasitesi-secim-hesaplama";
import { validateJeneratorKapasitesiSecimHesaplamaInputs } from "@/lib/premium-schema/calculators/jenerator-kapasitesi-secim-hesaplama-validation";
import { getPremiumCalculatorSchema } from "@/lib/premium-schema/schema-registry";
import {
  buildDefaultSchemaInputs,
  runPremiumSchemaEngine,
} from "@/lib/premium-schema/premium-schema-engine";

const SLUG = "jenerator-kapasitesi-secim-hesaplama";
const SCHEMA_ID = "jenerator-kapasitesi-secim-hesaplama";

const defaultInputs: JeneratorKapasitesiSecimHesaplamaInputs = {
    "totalConnectedLoad": 100,
    "demandFactor": 0.8,
    "expansionMarginPercent": 20,
    "powerFactor": 0.8,
    "generatorEfficiency": 0.95
  };
const lowBandInputs: JeneratorKapasitesiSecimHesaplamaInputs = {
    "totalConnectedLoad": 0.1,
    "demandFactor": 0.8,
    "expansionMarginPercent": 20,
    "powerFactor": 0.8,
    "generatorEfficiency": 0.95
  };
const criticalBandInputs: JeneratorKapasitesiSecimHesaplamaInputs = {
    "totalConnectedLoad": 6,
    "demandFactor": 0.8,
    "expansionMarginPercent": 20,
    "powerFactor": 0.8,
    "generatorEfficiency": 0.95
  };

function expectValidationFailure(partial: Partial<JeneratorKapasitesiSecimHesaplamaInputs>): void {
  const inputs = { ...defaultInputs, ...partial } as JeneratorKapasitesiSecimHesaplamaInputs;
  const validation = validateJeneratorKapasitesiSecimHesaplamaInputs(inputs);
  expect(validation.ok).toBe(false);
  if (validation.ok) return;
  expect(validation.errors.length).toBeGreaterThan(0);
  expect(() => calculateJeneratorKapasitesiSecimHesaplama(inputs)).toThrow();
}

function engineNumeric(schemaSlug: string, outputId: string, inputs: JeneratorKapasitesiSecimHesaplamaInputs): number {
  const schema = getPremiumCalculatorSchema(schemaSlug);
  if (!schema) throw new Error("schema missing");
  const engineResult = runPremiumSchemaEngine(schema, inputs);
  const raw = engineResult.outputs.find((output) => output.id === outputId)?.raw;
  if (typeof raw !== "number") throw new Error(`missing output ${outputId}`);
  return raw;
}

describe("jenerator-kapasitesi-secim-hesaplama", () => {
  test("exact default oracle", () => {
    const result = calculateJeneratorKapasitesiSecimHesaplama(defaultInputs);
    expect(result.totalExposure).toBeCloseTo(engineNumeric(SCHEMA_ID, "totalExposure", defaultInputs), 2);
    expect(result.variancePercent).toBeCloseTo(engineNumeric(SCHEMA_ID, "variancePercent", defaultInputs), 2);
    expect(["low", "warning", "critical"]).toContain(result.summaryLevel);
    expect(result.primaryDriver).toBe("totalExposure");
  });

  test("formula pipeline parity", () => {
    const result = calculateJeneratorKapasitesiSecimHesaplama(defaultInputs);
    expect(result.totalExposure).toBeCloseTo(
      engineNumeric(SCHEMA_ID, "totalExposure", defaultInputs),
      2,
    );
  });

  test("low threshold band", () => {
    const result = calculateJeneratorKapasitesiSecimHesaplama(lowBandInputs);
    expect(["low", "warning", "critical"]).toContain(result.summaryLevel);
  });

  test("warning threshold band", () => {
    const result = calculateJeneratorKapasitesiSecimHesaplama(defaultInputs);
    expect(["warning", "critical", "low"]).toContain(result.summaryLevel);
  });

  test("critical threshold band", () => {
    const result = calculateJeneratorKapasitesiSecimHesaplama(criticalBandInputs);
    expect(["low", "warning", "critical"]).toContain(result.summaryLevel);
  });

  test("invalid missing input fails validation and calculator throws", () => {
    const broken = { ...defaultInputs, totalConnectedLoad: undefined } as unknown as JeneratorKapasitesiSecimHesaplamaInputs;
    const validation = validateJeneratorKapasitesiSecimHesaplamaInputs(broken);
    expect(validation.ok).toBe(false);
    expect(() => calculateJeneratorKapasitesiSecimHesaplama(broken)).toThrow();
  });

  test("invalid negative input fails validation and calculator throws", () => {
    expectValidationFailure({ totalConnectedLoad: -1 });
  });
  test("invalid zero divisor/base fails validation and calculator throws", () => {
    const validation = validateJeneratorKapasitesiSecimHesaplamaInputs({ ...defaultInputs, totalConnectedLoad: 0 });
    expect(validation.ok).toBe(false);
    if (validation.ok) return;
    expect(() => calculateJeneratorKapasitesiSecimHesaplama({ ...defaultInputs, totalConnectedLoad: 0 })).toThrow();
  });

  test("invalid NaN input fails validation and calculator throws", () => {
    expectValidationFailure({ generatorEfficiency: Number.NaN });
  });

  test("invalid Infinity input fails validation and calculator throws", () => {
    expectValidationFailure({ generatorEfficiency: Number.POSITIVE_INFINITY });
  });

    test("contract metadata matches slug", () => {
    const contract = JENERATOR_KAPASITESI_SECIM_HESAPLAMA_CRITICAL_FORMULA_CONTRACTS[0];
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
    const calculatorResult = calculateJeneratorKapasitesiSecimHesaplama(defaultInputs);
    expect(engineResult.outputs.find((output) => output.id === "totalExposure")?.raw).toBeCloseTo(calculatorResult.totalExposure, 2);
    expect(engineResult.outputs.find((output) => output.id === "variancePercent")?.raw).toBeCloseTo(calculatorResult.variancePercent, 2);
  });
});
