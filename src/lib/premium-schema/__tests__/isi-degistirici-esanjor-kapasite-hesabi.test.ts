import { describe, expect, test } from "vitest";
import { ISI_DEGISTIRICI_ESANJOR_KAPASITE_HESABI_CRITICAL_FORMULA_CONTRACTS } from "@/lib/formula-governance/contracts/isi-degistirici-esanjor-kapasite-hesabi-critical";
import { getFormulaContractBySlug } from "@/lib/formula-governance/contracts";
import {
  calculateIsiDegistiriciEsanjorKapasiteHesabi,
  type IsiDegistiriciEsanjorKapasiteHesabiInputs,
} from "@/lib/premium-schema/calculators/isi-degistirici-esanjor-kapasite-hesabi";
import { validateIsiDegistiriciEsanjorKapasiteHesabiInputs } from "@/lib/premium-schema/calculators/isi-degistirici-esanjor-kapasite-hesabi-validation";
import { getPremiumCalculatorSchema } from "@/lib/premium-schema/schema-registry";
import {
  buildDefaultSchemaInputs,
  runPremiumSchemaEngine,
} from "@/lib/premium-schema/premium-schema-engine";

const SLUG = "isi-degistirici-esanjor-kapasite-hesabi";
const SCHEMA_ID = "isi-degistirici-esanjor-kapasite-hesabi";

const defaultInputs: IsiDegistiriciEsanjorKapasiteHesabiInputs = {
    "hotFluidInletTemp": 90,
    "hotFluidOutletTemp": 60,
    "coldFluidInletTemp": 20,
    "coldFluidOutletTemp": 40,
    "overallHeatTransferCoefficient": 500,
    "foulingMarginPercent": 10
  };
const lowBandInputs: IsiDegistiriciEsanjorKapasiteHesabiInputs = {
    "hotFluidInletTemp": 0.1,
    "hotFluidOutletTemp": 60,
    "coldFluidInletTemp": 20,
    "coldFluidOutletTemp": 40,
    "overallHeatTransferCoefficient": 500,
    "foulingMarginPercent": 10
  };
const criticalBandInputs: IsiDegistiriciEsanjorKapasiteHesabiInputs = {
    "hotFluidInletTemp": 6,
    "hotFluidOutletTemp": 60,
    "coldFluidInletTemp": 20,
    "coldFluidOutletTemp": 40,
    "overallHeatTransferCoefficient": 500,
    "foulingMarginPercent": 10
  };

function expectValidationFailure(partial: Partial<IsiDegistiriciEsanjorKapasiteHesabiInputs>): void {
  const inputs = { ...defaultInputs, ...partial } as IsiDegistiriciEsanjorKapasiteHesabiInputs;
  const validation = validateIsiDegistiriciEsanjorKapasiteHesabiInputs(inputs);
  expect(validation.ok).toBe(false);
  if (validation.ok) return;
  expect(validation.errors.length).toBeGreaterThan(0);
  expect(() => calculateIsiDegistiriciEsanjorKapasiteHesabi(inputs)).toThrow();
}

function engineNumeric(schemaSlug: string, outputId: string, inputs: IsiDegistiriciEsanjorKapasiteHesabiInputs): number {
  const schema = getPremiumCalculatorSchema(schemaSlug);
  if (!schema) throw new Error("schema missing");
  const engineResult = runPremiumSchemaEngine(schema, inputs);
  const raw = engineResult.outputs.find((output) => output.id === outputId)?.raw;
  if (typeof raw !== "number") throw new Error(`missing output ${outputId}`);
  return raw;
}

describe("isi-degistirici-esanjor-kapasite-hesabi", () => {
  test("exact default oracle", () => {
    const result = calculateIsiDegistiriciEsanjorKapasiteHesabi(defaultInputs);
    expect(result.totalExposure).toBeCloseTo(engineNumeric(SCHEMA_ID, "totalExposure", defaultInputs), 2);
    expect(result.variancePercent).toBeCloseTo(engineNumeric(SCHEMA_ID, "variancePercent", defaultInputs), 2);
    expect(["low", "warning", "critical"]).toContain(result.summaryLevel);
    expect(result.primaryDriver).toBe("totalExposure");
  });

  test("formula pipeline parity", () => {
    const result = calculateIsiDegistiriciEsanjorKapasiteHesabi(defaultInputs);
    expect(result.totalExposure).toBeCloseTo(
      engineNumeric(SCHEMA_ID, "totalExposure", defaultInputs),
      2,
    );
  });

  test("low threshold band", () => {
    const result = calculateIsiDegistiriciEsanjorKapasiteHesabi(lowBandInputs);
    expect(["low", "warning", "critical"]).toContain(result.summaryLevel);
  });

  test("warning threshold band", () => {
    const result = calculateIsiDegistiriciEsanjorKapasiteHesabi(defaultInputs);
    expect(["warning", "critical", "low"]).toContain(result.summaryLevel);
  });

  test("critical threshold band", () => {
    const result = calculateIsiDegistiriciEsanjorKapasiteHesabi(criticalBandInputs);
    expect(["low", "warning", "critical"]).toContain(result.summaryLevel);
  });

  test("invalid missing input fails validation and calculator throws", () => {
    const broken = { ...defaultInputs, hotFluidInletTemp: undefined } as unknown as IsiDegistiriciEsanjorKapasiteHesabiInputs;
    const validation = validateIsiDegistiriciEsanjorKapasiteHesabiInputs(broken);
    expect(validation.ok).toBe(false);
    expect(() => calculateIsiDegistiriciEsanjorKapasiteHesabi(broken)).toThrow();
  });

  test("invalid negative input fails validation and calculator throws", () => {
    expectValidationFailure({ overallHeatTransferCoefficient: -1 });
  });
  test("invalid zero divisor/base fails validation and calculator throws", () => {
    const validation = validateIsiDegistiriciEsanjorKapasiteHesabiInputs({ ...defaultInputs, overallHeatTransferCoefficient: 0 });
    expect(validation.ok).toBe(false);
    if (validation.ok) return;
    expect(() => calculateIsiDegistiriciEsanjorKapasiteHesabi({ ...defaultInputs, overallHeatTransferCoefficient: 0 })).toThrow();
  });

  test("invalid NaN input fails validation and calculator throws", () => {
    expectValidationFailure({ foulingMarginPercent: Number.NaN });
  });

  test("invalid Infinity input fails validation and calculator throws", () => {
    expectValidationFailure({ foulingMarginPercent: Number.POSITIVE_INFINITY });
  });

    test("contract metadata matches slug", () => {
    const contract = ISI_DEGISTIRICI_ESANJOR_KAPASITE_HESABI_CRITICAL_FORMULA_CONTRACTS[0];
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
    const calculatorResult = calculateIsiDegistiriciEsanjorKapasiteHesabi(defaultInputs);
    expect(engineResult.outputs.find((output) => output.id === "totalExposure")?.raw).toBeCloseTo(calculatorResult.totalExposure, 2);
    expect(engineResult.outputs.find((output) => output.id === "variancePercent")?.raw).toBeCloseTo(calculatorResult.variancePercent, 2);
  });
});
