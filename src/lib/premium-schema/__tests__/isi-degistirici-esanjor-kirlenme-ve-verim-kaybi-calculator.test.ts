import { describe, expect, test } from "vitest";
import { ISI_DEGISTIRICI_ESANJOR_KIRLENME_VE_VERIM_KAYBI_CALCULATOR_CRITICAL_FORMULA_CONTRACTS } from "@/lib/formula-governance/contracts/isi-degistirici-esanjor-kirlenme-ve-verim-kaybi-calculator-critical";
import { getFormulaContractBySlug } from "@/lib/formula-governance/contracts";
import {
  calculateIsiDegistiriciEsanjorKirlenmeVeVerimKaybiCalculator,
  type IsiDegistiriciEsanjorKirlenmeVeVerimKaybiCalculatorInputs,
} from "@/lib/premium-schema/calculators/isi-degistirici-esanjor-kirlenme-ve-verim-kaybi-calculator";
import { validateIsiDegistiriciEsanjorKirlenmeVeVerimKaybiCalculatorInputs } from "@/lib/premium-schema/calculators/isi-degistirici-esanjor-kirlenme-ve-verim-kaybi-calculator-validation";
import { getPremiumCalculatorSchema } from "@/lib/premium-schema/schema-registry";
import {
  buildDefaultSchemaInputs,
  runPremiumSchemaEngine,
} from "@/lib/premium-schema/premium-schema-engine";

const SLUG = "isi-degistirici-esanjor-kirlenme-ve-verim-kaybi-calculator";
const SCHEMA_ID = "isi-degistirici-esanjor-kirlenme-ve-verim-kaybi-calculator";

const defaultInputs: IsiDegistiriciEsanjorKirlenmeVeVerimKaybiCalculatorInputs = {
    "heatTransferArea": 100,
    "heatDuty": 500000,
    "lmtdClean": 30,
    "lmtdActual": 25,
    "maxFoulingFactor": 0.0005,
    "operatingHoursPerYear": 8000
  };
const lowBandInputs: IsiDegistiriciEsanjorKirlenmeVeVerimKaybiCalculatorInputs = {
    "heatTransferArea": 0.1,
    "heatDuty": 500000,
    "lmtdClean": 30,
    "lmtdActual": 25,
    "maxFoulingFactor": 0.0005,
    "operatingHoursPerYear": 8000
  };
const criticalBandInputs: IsiDegistiriciEsanjorKirlenmeVeVerimKaybiCalculatorInputs = {
    "heatTransferArea": 6,
    "heatDuty": 500000,
    "lmtdClean": 30,
    "lmtdActual": 25,
    "maxFoulingFactor": 0.0005,
    "operatingHoursPerYear": 8000
  };

function expectValidationFailure(partial: Partial<IsiDegistiriciEsanjorKirlenmeVeVerimKaybiCalculatorInputs>): void {
  const inputs = { ...defaultInputs, ...partial } as IsiDegistiriciEsanjorKirlenmeVeVerimKaybiCalculatorInputs;
  const validation = validateIsiDegistiriciEsanjorKirlenmeVeVerimKaybiCalculatorInputs(inputs);
  expect(validation.ok).toBe(false);
  if (validation.ok) return;
  expect(validation.errors.length).toBeGreaterThan(0);
  expect(() => calculateIsiDegistiriciEsanjorKirlenmeVeVerimKaybiCalculator(inputs)).toThrow();
}

function engineNumeric(schemaSlug: string, outputId: string, inputs: IsiDegistiriciEsanjorKirlenmeVeVerimKaybiCalculatorInputs): number {
  const schema = getPremiumCalculatorSchema(schemaSlug);
  if (!schema) throw new Error("schema missing");
  const engineResult = runPremiumSchemaEngine(schema, inputs);
  const raw = engineResult.outputs.find((output) => output.id === outputId)?.raw;
  if (typeof raw !== "number") throw new Error(`missing output ${outputId}`);
  return raw;
}

describe("isi-degistirici-esanjor-kirlenme-ve-verim-kaybi-calculator", () => {
  test("exact default oracle", () => {
    const result = calculateIsiDegistiriciEsanjorKirlenmeVeVerimKaybiCalculator(defaultInputs);
    expect(result.totalExposure).toBeCloseTo(engineNumeric(SCHEMA_ID, "totalExposure", defaultInputs), 2);
    expect(result.variancePercent).toBeCloseTo(engineNumeric(SCHEMA_ID, "variancePercent", defaultInputs), 2);
    expect(["low", "warning", "critical"]).toContain(result.summaryLevel);
    expect(result.primaryDriver).toBe("totalExposure");
  });

  test("formula pipeline parity", () => {
    const result = calculateIsiDegistiriciEsanjorKirlenmeVeVerimKaybiCalculator(defaultInputs);
    expect(result.totalExposure).toBeCloseTo(
      engineNumeric(SCHEMA_ID, "totalExposure", defaultInputs),
      2,
    );
  });

  test("low threshold band", () => {
    const result = calculateIsiDegistiriciEsanjorKirlenmeVeVerimKaybiCalculator(lowBandInputs);
    expect(["low", "warning", "critical"]).toContain(result.summaryLevel);
  });

  test("warning threshold band", () => {
    const result = calculateIsiDegistiriciEsanjorKirlenmeVeVerimKaybiCalculator(defaultInputs);
    expect(["warning", "critical", "low"]).toContain(result.summaryLevel);
  });

  test("critical threshold band", () => {
    const result = calculateIsiDegistiriciEsanjorKirlenmeVeVerimKaybiCalculator(criticalBandInputs);
    expect(["low", "warning", "critical"]).toContain(result.summaryLevel);
  });

  test("invalid missing input fails validation and calculator throws", () => {
    const broken = { ...defaultInputs, heatTransferArea: undefined } as unknown as IsiDegistiriciEsanjorKirlenmeVeVerimKaybiCalculatorInputs;
    const validation = validateIsiDegistiriciEsanjorKirlenmeVeVerimKaybiCalculatorInputs(broken);
    expect(validation.ok).toBe(false);
    expect(() => calculateIsiDegistiriciEsanjorKirlenmeVeVerimKaybiCalculator(broken)).toThrow();
  });

  test("invalid negative input fails validation and calculator throws", () => {
    expectValidationFailure({ heatTransferArea: -1 });
  });
  test("invalid zero divisor/base fails validation and calculator throws", () => {
    const validation = validateIsiDegistiriciEsanjorKirlenmeVeVerimKaybiCalculatorInputs({ ...defaultInputs, heatTransferArea: 0 });
    expect(validation.ok).toBe(false);
    if (validation.ok) return;
    expect(() => calculateIsiDegistiriciEsanjorKirlenmeVeVerimKaybiCalculator({ ...defaultInputs, heatTransferArea: 0 })).toThrow();
  });

  test("invalid NaN input fails validation and calculator throws", () => {
    expectValidationFailure({ operatingHoursPerYear: Number.NaN });
  });

  test("invalid Infinity input fails validation and calculator throws", () => {
    expectValidationFailure({ operatingHoursPerYear: Number.POSITIVE_INFINITY });
  });

    test("contract metadata matches slug", () => {
    const contract = ISI_DEGISTIRICI_ESANJOR_KIRLENME_VE_VERIM_KAYBI_CALCULATOR_CRITICAL_FORMULA_CONTRACTS[0];
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
    const calculatorResult = calculateIsiDegistiriciEsanjorKirlenmeVeVerimKaybiCalculator(defaultInputs);
    expect(engineResult.outputs.find((output) => output.id === "totalExposure")?.raw).toBeCloseTo(calculatorResult.totalExposure, 2);
    expect(engineResult.outputs.find((output) => output.id === "variancePercent")?.raw).toBeCloseTo(calculatorResult.variancePercent, 2);
  });
});
