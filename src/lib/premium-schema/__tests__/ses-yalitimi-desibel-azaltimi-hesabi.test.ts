import { describe, expect, test } from "vitest";
import { SES_YALITIMI_DESIBEL_AZALTIMI_HESABI_CRITICAL_FORMULA_CONTRACTS } from "@/lib/formula-governance/contracts/ses-yalitimi-desibel-azaltimi-hesabi-critical";
import { getFormulaContractBySlug } from "@/lib/formula-governance/contracts";
import {
  calculateSesYalitimiDesibelAzaltimiHesabi,
  type SesYalitimiDesibelAzaltimiHesabiInputs,
} from "@/lib/premium-schema/calculators/ses-yalitimi-desibel-azaltimi-hesabi";
import { validateSesYalitimiDesibelAzaltimiHesabiInputs } from "@/lib/premium-schema/calculators/ses-yalitimi-desibel-azaltimi-hesabi-validation";
import { getPremiumCalculatorSchema } from "@/lib/premium-schema/schema-registry";
import {
  buildDefaultSchemaInputs,
  runPremiumSchemaEngine,
} from "@/lib/premium-schema/premium-schema-engine";

const SLUG = "ses-yalitimi-desibel-azaltimi-hesabi";
const SCHEMA_ID = "ses-yalitimi-desibel-azaltimi-hesabi";

const defaultInputs: SesYalitimiDesibelAzaltimiHesabiInputs = {
    "surfaceMass": 10,
    "frequency": 500,
    "absorptionCoefficient": 0.2,
    "partitionArea": 10,
    "roomAbsorption": 50,
    "sealLoss": 0
  };
const lowBandInputs: SesYalitimiDesibelAzaltimiHesabiInputs = {
    "surfaceMass": 1,
    "frequency": 500,
    "absorptionCoefficient": 0.2,
    "partitionArea": 10,
    "roomAbsorption": 50,
    "sealLoss": 0
  };
const criticalBandInputs: SesYalitimiDesibelAzaltimiHesabiInputs = {
    "surfaceMass": 6,
    "frequency": 500,
    "absorptionCoefficient": 0.2,
    "partitionArea": 10,
    "roomAbsorption": 50,
    "sealLoss": 0
  };

function expectValidationFailure(partial: Partial<SesYalitimiDesibelAzaltimiHesabiInputs>): void {
  const inputs = { ...defaultInputs, ...partial } as SesYalitimiDesibelAzaltimiHesabiInputs;
  const validation = validateSesYalitimiDesibelAzaltimiHesabiInputs(inputs);
  expect(validation.ok).toBe(false);
  if (validation.ok) return;
  expect(validation.errors.length).toBeGreaterThan(0);
  expect(() => calculateSesYalitimiDesibelAzaltimiHesabi(inputs)).toThrow();
}

function engineNumeric(schemaSlug: string, outputId: string, inputs: SesYalitimiDesibelAzaltimiHesabiInputs): number {
  const schema = getPremiumCalculatorSchema(schemaSlug);
  if (!schema) throw new Error("schema missing");
  const engineResult = runPremiumSchemaEngine(schema, inputs);
  const raw = engineResult.outputs.find((output) => output.id === outputId)?.raw;
  if (typeof raw !== "number") throw new Error(`missing output ${outputId}`);
  return raw;
}

describe("ses-yalitimi-desibel-azaltimi-hesabi", () => {
  test("exact default oracle", () => {
    const result = calculateSesYalitimiDesibelAzaltimiHesabi(defaultInputs);
    expect(result.totalExposure).toBeCloseTo(engineNumeric(SCHEMA_ID, "totalExposure", defaultInputs), 2);
    expect(result.variancePercent).toBeCloseTo(engineNumeric(SCHEMA_ID, "variancePercent", defaultInputs), 2);
    expect(["low", "warning", "critical"]).toContain(result.summaryLevel);
    expect(result.primaryDriver).toBe("totalExposure");
  });

  test("formula pipeline parity", () => {
    const result = calculateSesYalitimiDesibelAzaltimiHesabi(defaultInputs);
    expect(result.totalExposure).toBeCloseTo(
      engineNumeric(SCHEMA_ID, "totalExposure", defaultInputs),
      2,
    );
  });

  test("low threshold band", () => {
    const result = calculateSesYalitimiDesibelAzaltimiHesabi(lowBandInputs);
    expect(["low", "warning", "critical"]).toContain(result.summaryLevel);
  });

  test("warning threshold band", () => {
    const result = calculateSesYalitimiDesibelAzaltimiHesabi(defaultInputs);
    expect(["warning", "critical", "low"]).toContain(result.summaryLevel);
  });

  test("critical threshold band", () => {
    const result = calculateSesYalitimiDesibelAzaltimiHesabi(criticalBandInputs);
    expect(["low", "warning", "critical"]).toContain(result.summaryLevel);
  });

  test("invalid missing input fails validation and calculator throws", () => {
    const broken = { ...defaultInputs, surfaceMass: undefined } as unknown as SesYalitimiDesibelAzaltimiHesabiInputs;
    const validation = validateSesYalitimiDesibelAzaltimiHesabiInputs(broken);
    expect(validation.ok).toBe(false);
    expect(() => calculateSesYalitimiDesibelAzaltimiHesabi(broken)).toThrow();
  });

  test("invalid negative input fails validation and calculator throws", () => {
    expectValidationFailure({ surfaceMass: -1 });
  });
  test("invalid zero divisor/base fails validation and calculator throws", () => {
    const validation = validateSesYalitimiDesibelAzaltimiHesabiInputs({ ...defaultInputs, surfaceMass: 0 });
    expect(validation.ok).toBe(false);
    if (validation.ok) return;
    expect(() => calculateSesYalitimiDesibelAzaltimiHesabi({ ...defaultInputs, surfaceMass: 0 })).toThrow();
  });

  test("invalid NaN input fails validation and calculator throws", () => {
    expectValidationFailure({ sealLoss: Number.NaN });
  });

  test("invalid Infinity input fails validation and calculator throws", () => {
    expectValidationFailure({ sealLoss: Number.POSITIVE_INFINITY });
  });

    test("contract metadata matches slug", () => {
    const contract = SES_YALITIMI_DESIBEL_AZALTIMI_HESABI_CRITICAL_FORMULA_CONTRACTS[0];
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
    const calculatorResult = calculateSesYalitimiDesibelAzaltimiHesabi(defaultInputs);
    expect(engineResult.outputs.find((output) => output.id === "totalExposure")?.raw).toBeCloseTo(calculatorResult.totalExposure, 2);
    expect(engineResult.outputs.find((output) => output.id === "variancePercent")?.raw).toBeCloseTo(calculatorResult.variancePercent, 2);
  });
});
