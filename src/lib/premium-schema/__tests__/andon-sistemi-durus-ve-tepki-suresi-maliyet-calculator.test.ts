import { describe, expect, test } from "vitest";
import { ANDON_SISTEMI_DURUS_VE_TEPKI_SURESI_MALIYET_CALCULATOR_CRITICAL_FORMULA_CONTRACTS } from "@/lib/formula-governance/contracts/andon-sistemi-durus-ve-tepki-suresi-maliyet-calculator-critical";
import { getFormulaContractBySlug } from "@/lib/formula-governance/contracts";
import {
  calculateAndonSistemiDurusVeTepkiSuresiMaliyetCalculator,
  type AndonSistemiDurusVeTepkiSuresiMaliyetCalculatorInputs,
} from "@/lib/premium-schema/calculators/andon-sistemi-durus-ve-tepki-suresi-maliyet-calculator";
import { validateAndonSistemiDurusVeTepkiSuresiMaliyetCalculatorInputs } from "@/lib/premium-schema/calculators/andon-sistemi-durus-ve-tepki-suresi-maliyet-calculator-validation";
import { getPremiumCalculatorSchema } from "@/lib/premium-schema/schema-registry";
import {
  buildDefaultSchemaInputs,
  runPremiumSchemaEngine,
} from "@/lib/premium-schema/premium-schema-engine";

const SLUG = "andon-sistemi-durus-ve-tepki-suresi-maliyet-calculator";
const SCHEMA_ID = "andon-sistemi-durus-ve-tepki-suresi-maliyet-calculator";

const defaultInputs: AndonSistemiDurusVeTepkiSuresiMaliyetCalculatorInputs = {
    "directMaterialCost": 500,
    "directLaborCost": 300,
    "machineOrEquipmentCost": 200,
    "overheadPercent": 20,
    "contingencyPercent": 10,
    "targetGrossMarginPercent": 25
  };
const lowBandInputs: AndonSistemiDurusVeTepkiSuresiMaliyetCalculatorInputs = {
    "directMaterialCost": 0.1,
    "directLaborCost": 300,
    "machineOrEquipmentCost": 200,
    "overheadPercent": 20,
    "contingencyPercent": 10,
    "targetGrossMarginPercent": 25
  };
const criticalBandInputs: AndonSistemiDurusVeTepkiSuresiMaliyetCalculatorInputs = {
    "directMaterialCost": 6,
    "directLaborCost": 300,
    "machineOrEquipmentCost": 200,
    "overheadPercent": 20,
    "contingencyPercent": 10,
    "targetGrossMarginPercent": 25
  };

function expectValidationFailure(partial: Partial<AndonSistemiDurusVeTepkiSuresiMaliyetCalculatorInputs>): void {
  const inputs = { ...defaultInputs, ...partial } as AndonSistemiDurusVeTepkiSuresiMaliyetCalculatorInputs;
  const validation = validateAndonSistemiDurusVeTepkiSuresiMaliyetCalculatorInputs(inputs);
  expect(validation.ok).toBe(false);
  if (validation.ok) return;
  expect(validation.errors.length).toBeGreaterThan(0);
  expect(() => calculateAndonSistemiDurusVeTepkiSuresiMaliyetCalculator(inputs)).toThrow();
}

function engineNumeric(schemaSlug: string, outputId: string, inputs: AndonSistemiDurusVeTepkiSuresiMaliyetCalculatorInputs): number {
  const schema = getPremiumCalculatorSchema(schemaSlug);
  if (!schema) throw new Error("schema missing");
  const engineResult = runPremiumSchemaEngine(schema, inputs);
  const raw = engineResult.outputs.find((output) => output.id === outputId)?.raw;
  if (typeof raw !== "number") throw new Error(`missing output ${outputId}`);
  return raw;
}

describe("andon-sistemi-durus-ve-tepki-suresi-maliyet-calculator", () => {
  test("exact default oracle", () => {
    const result = calculateAndonSistemiDurusVeTepkiSuresiMaliyetCalculator(defaultInputs);
    expect(result.totalExposure).toBeCloseTo(engineNumeric(SCHEMA_ID, "totalExposure", defaultInputs), 2);
    expect(result.variancePercent).toBeCloseTo(engineNumeric(SCHEMA_ID, "variancePercent", defaultInputs), 2);
    expect(["low", "warning", "critical"]).toContain(result.summaryLevel);
    expect(result.primaryDriver).toBe("totalExposure");
  });

  test("formula pipeline parity", () => {
    const result = calculateAndonSistemiDurusVeTepkiSuresiMaliyetCalculator(defaultInputs);
    expect(result.totalExposure).toBeCloseTo(
      engineNumeric(SCHEMA_ID, "totalExposure", defaultInputs),
      2,
    );
  });

  test("low threshold band", () => {
    const result = calculateAndonSistemiDurusVeTepkiSuresiMaliyetCalculator(lowBandInputs);
    expect(["low", "warning", "critical"]).toContain(result.summaryLevel);
  });

  test("warning threshold band", () => {
    const result = calculateAndonSistemiDurusVeTepkiSuresiMaliyetCalculator(defaultInputs);
    expect(["warning", "critical", "low"]).toContain(result.summaryLevel);
  });

  test("critical threshold band", () => {
    const result = calculateAndonSistemiDurusVeTepkiSuresiMaliyetCalculator(criticalBandInputs);
    expect(["low", "warning", "critical"]).toContain(result.summaryLevel);
  });

  test("invalid missing input fails validation and calculator throws", () => {
    const broken = { ...defaultInputs, directMaterialCost: undefined } as unknown as AndonSistemiDurusVeTepkiSuresiMaliyetCalculatorInputs;
    const validation = validateAndonSistemiDurusVeTepkiSuresiMaliyetCalculatorInputs(broken);
    expect(validation.ok).toBe(false);
    expect(() => calculateAndonSistemiDurusVeTepkiSuresiMaliyetCalculator(broken)).toThrow();
  });

  test("invalid negative input fails validation and calculator throws", () => {
    expectValidationFailure({ directMaterialCost: -1 });
  });
  test("invalid zero divisor/base fails validation and calculator throws", () => {
    const validation = validateAndonSistemiDurusVeTepkiSuresiMaliyetCalculatorInputs({ ...defaultInputs, targetGrossMarginPercent: 0 });
    expect(validation.ok).toBe(false);
    if (validation.ok) return;
    expect(() => calculateAndonSistemiDurusVeTepkiSuresiMaliyetCalculator({ ...defaultInputs, targetGrossMarginPercent: 0 })).toThrow();
  });

  test("invalid NaN input fails validation and calculator throws", () => {
    expectValidationFailure({ targetGrossMarginPercent: Number.NaN });
  });

  test("invalid Infinity input fails validation and calculator throws", () => {
    expectValidationFailure({ targetGrossMarginPercent: Number.POSITIVE_INFINITY });
  });

    test("contract metadata matches slug", () => {
    const contract = ANDON_SISTEMI_DURUS_VE_TEPKI_SURESI_MALIYET_CALCULATOR_CRITICAL_FORMULA_CONTRACTS[0];
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
    const calculatorResult = calculateAndonSistemiDurusVeTepkiSuresiMaliyetCalculator(defaultInputs);
    expect(engineResult.outputs.find((output) => output.id === "totalExposure")?.raw).toBeCloseTo(calculatorResult.totalExposure, 2);
    expect(engineResult.outputs.find((output) => output.id === "variancePercent")?.raw).toBeCloseTo(calculatorResult.variancePercent, 2);
  });
});
