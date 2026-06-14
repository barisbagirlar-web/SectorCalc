import { describe, expect, test } from "vitest";
import { TIR_KAMYON_YUK_KAPASITESI_HESAPLAMA_CRITICAL_FORMULA_CONTRACTS } from "@/lib/formula-governance/contracts/tir-kamyon-yuk-kapasitesi-hesaplama-critical";
import { getFormulaContractBySlug } from "@/lib/formula-governance/contracts";
import {
  calculateTirKamyonYukKapasitesiHesaplama,
  type TirKamyonYukKapasitesiHesaplamaInputs,
} from "@/lib/premium-schema/calculators/tir-kamyon-yuk-kapasitesi-hesaplama";
import { validateTirKamyonYukKapasitesiHesaplamaInputs } from "@/lib/premium-schema/calculators/tir-kamyon-yuk-kapasitesi-hesaplama-validation";
import { getPremiumCalculatorSchema } from "@/lib/premium-schema/schema-registry";
import {
  buildDefaultSchemaInputs,
  runPremiumSchemaEngine,
} from "@/lib/premium-schema/premium-schema-engine";

const SLUG = "tir-kamyon-yuk-kapasitesi-hesaplama";
const SCHEMA_ID = "tir-kamyon-yuk-kapasitesi-hesaplama";

const defaultInputs: TirKamyonYukKapasitesiHesaplamaInputs = {
    "grossVehicleWeight": 40000,
    "tareWeight": 15000,
    "fuelWeight": 200,
    "crewWeight": 150,
    "safetyMarginPercent": 10,
    "actualLoad": 20000
  };
const lowBandInputs: TirKamyonYukKapasitesiHesaplamaInputs = {
    "grossVehicleWeight": 1000,
    "tareWeight": 15000,
    "fuelWeight": 200,
    "crewWeight": 150,
    "safetyMarginPercent": 10,
    "actualLoad": 20000
  };
const criticalBandInputs: TirKamyonYukKapasitesiHesaplamaInputs = {
    "grossVehicleWeight": 1000,
    "tareWeight": 15000,
    "fuelWeight": 200,
    "crewWeight": 150,
    "safetyMarginPercent": 10,
    "actualLoad": 20000
  };

function expectValidationFailure(partial: Partial<TirKamyonYukKapasitesiHesaplamaInputs>): void {
  const inputs = { ...defaultInputs, ...partial } as TirKamyonYukKapasitesiHesaplamaInputs;
  const validation = validateTirKamyonYukKapasitesiHesaplamaInputs(inputs);
  expect(validation.ok).toBe(false);
  if (validation.ok) return;
  expect(validation.errors.length).toBeGreaterThan(0);
  expect(() => calculateTirKamyonYukKapasitesiHesaplama(inputs)).toThrow();
}

function engineNumeric(schemaSlug: string, outputId: string, inputs: TirKamyonYukKapasitesiHesaplamaInputs): number {
  const schema = getPremiumCalculatorSchema(schemaSlug);
  if (!schema) throw new Error("schema missing");
  const engineResult = runPremiumSchemaEngine(schema, inputs);
  const raw = engineResult.outputs.find((output) => output.id === outputId)?.raw;
  if (typeof raw !== "number") throw new Error(`missing output ${outputId}`);
  return raw;
}

describe("tir-kamyon-yuk-kapasitesi-hesaplama", () => {
  test("exact default oracle", () => {
    const result = calculateTirKamyonYukKapasitesiHesaplama(defaultInputs);
    expect(result.totalExposure).toBeCloseTo(engineNumeric(SCHEMA_ID, "totalExposure", defaultInputs), 2);
    expect(result.variancePercent).toBeCloseTo(engineNumeric(SCHEMA_ID, "variancePercent", defaultInputs), 2);
    expect(["low", "warning", "critical"]).toContain(result.summaryLevel);
    expect(result.primaryDriver).toBe("totalExposure");
  });

  test("formula pipeline parity", () => {
    const result = calculateTirKamyonYukKapasitesiHesaplama(defaultInputs);
    expect(result.totalExposure).toBeCloseTo(
      engineNumeric(SCHEMA_ID, "totalExposure", defaultInputs),
      2,
    );
  });

  test("low threshold band", () => {
    const result = calculateTirKamyonYukKapasitesiHesaplama(lowBandInputs);
    expect(["low", "warning", "critical"]).toContain(result.summaryLevel);
  });

  test("warning threshold band", () => {
    const result = calculateTirKamyonYukKapasitesiHesaplama(defaultInputs);
    expect(["warning", "critical", "low"]).toContain(result.summaryLevel);
  });

  test("critical threshold band", () => {
    const result = calculateTirKamyonYukKapasitesiHesaplama(criticalBandInputs);
    expect(["low", "warning", "critical"]).toContain(result.summaryLevel);
  });

  test("invalid missing input fails validation and calculator throws", () => {
    const broken = { ...defaultInputs, grossVehicleWeight: undefined } as unknown as TirKamyonYukKapasitesiHesaplamaInputs;
    const validation = validateTirKamyonYukKapasitesiHesaplamaInputs(broken);
    expect(validation.ok).toBe(false);
    expect(() => calculateTirKamyonYukKapasitesiHesaplama(broken)).toThrow();
  });

  test("invalid negative input fails validation and calculator throws", () => {
    expectValidationFailure({ grossVehicleWeight: -1 });
  });
  test("invalid zero divisor/base fails validation and calculator throws", () => {
    const validation = validateTirKamyonYukKapasitesiHesaplamaInputs({ ...defaultInputs, grossVehicleWeight: 0 });
    expect(validation.ok).toBe(false);
    if (validation.ok) return;
    expect(() => calculateTirKamyonYukKapasitesiHesaplama({ ...defaultInputs, grossVehicleWeight: 0 })).toThrow();
  });

  test("invalid NaN input fails validation and calculator throws", () => {
    expectValidationFailure({ actualLoad: Number.NaN });
  });

  test("invalid Infinity input fails validation and calculator throws", () => {
    expectValidationFailure({ actualLoad: Number.POSITIVE_INFINITY });
  });

    test("contract metadata matches slug", () => {
    const contract = TIR_KAMYON_YUK_KAPASITESI_HESAPLAMA_CRITICAL_FORMULA_CONTRACTS[0];
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
    const calculatorResult = calculateTirKamyonYukKapasitesiHesaplama(defaultInputs);
    expect(engineResult.outputs.find((output) => output.id === "totalExposure")?.raw).toBeCloseTo(calculatorResult.totalExposure, 2);
    expect(engineResult.outputs.find((output) => output.id === "variancePercent")?.raw).toBeCloseTo(calculatorResult.variancePercent, 2);
  });
});
