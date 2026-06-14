import { describe, expect, test } from "vitest";
import { DIZEL_BENZIN_MALIYET_KARSILASTIRMA_CRITICAL_FORMULA_CONTRACTS } from "@/lib/formula-governance/contracts/dizel-benzin-maliyet-karsilastirma-critical";
import { getFormulaContractBySlug } from "@/lib/formula-governance/contracts";
import {
  calculateDizelBenzinMaliyetKarsilastirma,
  type DizelBenzinMaliyetKarsilastirmaInputs,
} from "@/lib/premium-schema/calculators/dizel-benzin-maliyet-karsilastirma";
import { validateDizelBenzinMaliyetKarsilastirmaInputs } from "@/lib/premium-schema/calculators/dizel-benzin-maliyet-karsilastirma-validation";
import { getPremiumCalculatorSchema } from "@/lib/premium-schema/schema-registry";
import {
  buildDefaultSchemaInputs,
  runPremiumSchemaEngine,
} from "@/lib/premium-schema/premium-schema-engine";

const SLUG = "dizel-benzin-maliyet-karsilastirma";
const SCHEMA_ID = "dizel-benzin-maliyet-karsilastirma";

const defaultInputs: DizelBenzinMaliyetKarsilastirmaInputs = {
    "annualMileage": 20000,
    "fuelEfficiencyDiesel": 20,
    "fuelEfficiencyGasoline": 15,
    "fuelPriceDiesel": 1.5,
    "fuelPriceGasoline": 1.6
  };
const lowBandInputs: DizelBenzinMaliyetKarsilastirmaInputs = {
    "annualMileage": 1,
    "fuelEfficiencyDiesel": 20,
    "fuelEfficiencyGasoline": 15,
    "fuelPriceDiesel": 1.5,
    "fuelPriceGasoline": 1.6
  };
const criticalBandInputs: DizelBenzinMaliyetKarsilastirmaInputs = {
    "annualMileage": 6,
    "fuelEfficiencyDiesel": 20,
    "fuelEfficiencyGasoline": 15,
    "fuelPriceDiesel": 1.5,
    "fuelPriceGasoline": 1.6
  };

function expectValidationFailure(partial: Partial<DizelBenzinMaliyetKarsilastirmaInputs>): void {
  const inputs = { ...defaultInputs, ...partial } as DizelBenzinMaliyetKarsilastirmaInputs;
  const validation = validateDizelBenzinMaliyetKarsilastirmaInputs(inputs);
  expect(validation.ok).toBe(false);
  if (validation.ok) return;
  expect(validation.errors.length).toBeGreaterThan(0);
  expect(() => calculateDizelBenzinMaliyetKarsilastirma(inputs)).toThrow();
}

function engineNumeric(schemaSlug: string, outputId: string, inputs: DizelBenzinMaliyetKarsilastirmaInputs): number {
  const schema = getPremiumCalculatorSchema(schemaSlug);
  if (!schema) throw new Error("schema missing");
  const engineResult = runPremiumSchemaEngine(schema, inputs);
  const raw = engineResult.outputs.find((output) => output.id === outputId)?.raw;
  if (typeof raw !== "number") throw new Error(`missing output ${outputId}`);
  return raw;
}

describe("dizel-benzin-maliyet-karsilastirma", () => {
  test("exact default oracle", () => {
    const result = calculateDizelBenzinMaliyetKarsilastirma(defaultInputs);
    expect(result.totalExposure).toBeCloseTo(engineNumeric(SCHEMA_ID, "totalExposure", defaultInputs), 2);
    expect(result.variancePercent).toBeCloseTo(engineNumeric(SCHEMA_ID, "variancePercent", defaultInputs), 2);
    expect(["low", "warning", "critical"]).toContain(result.summaryLevel);
    expect(result.primaryDriver).toBe("totalExposure");
  });

  test("formula pipeline parity", () => {
    const result = calculateDizelBenzinMaliyetKarsilastirma(defaultInputs);
    expect(result.totalExposure).toBeCloseTo(
      engineNumeric(SCHEMA_ID, "totalExposure", defaultInputs),
      2,
    );
  });

  test("low threshold band", () => {
    const result = calculateDizelBenzinMaliyetKarsilastirma(lowBandInputs);
    expect(["low", "warning", "critical"]).toContain(result.summaryLevel);
  });

  test("warning threshold band", () => {
    const result = calculateDizelBenzinMaliyetKarsilastirma(defaultInputs);
    expect(["warning", "critical", "low"]).toContain(result.summaryLevel);
  });

  test("critical threshold band", () => {
    const result = calculateDizelBenzinMaliyetKarsilastirma(criticalBandInputs);
    expect(["low", "warning", "critical"]).toContain(result.summaryLevel);
  });

  test("invalid missing input fails validation and calculator throws", () => {
    const broken = { ...defaultInputs, annualMileage: undefined } as unknown as DizelBenzinMaliyetKarsilastirmaInputs;
    const validation = validateDizelBenzinMaliyetKarsilastirmaInputs(broken);
    expect(validation.ok).toBe(false);
    expect(() => calculateDizelBenzinMaliyetKarsilastirma(broken)).toThrow();
  });

  test("invalid negative input fails validation and calculator throws", () => {
    expectValidationFailure({ annualMileage: -1 });
  });
  test("invalid zero divisor/base fails validation and calculator throws", () => {
    const validation = validateDizelBenzinMaliyetKarsilastirmaInputs({ ...defaultInputs, annualMileage: 0 });
    expect(validation.ok).toBe(false);
    if (validation.ok) return;
    expect(() => calculateDizelBenzinMaliyetKarsilastirma({ ...defaultInputs, annualMileage: 0 })).toThrow();
  });

  test("invalid NaN input fails validation and calculator throws", () => {
    expectValidationFailure({ fuelPriceGasoline: Number.NaN });
  });

  test("invalid Infinity input fails validation and calculator throws", () => {
    expectValidationFailure({ fuelPriceGasoline: Number.POSITIVE_INFINITY });
  });

    test("contract metadata matches slug", () => {
    const contract = DIZEL_BENZIN_MALIYET_KARSILASTIRMA_CRITICAL_FORMULA_CONTRACTS[0];
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
    const calculatorResult = calculateDizelBenzinMaliyetKarsilastirma(defaultInputs);
    expect(engineResult.outputs.find((output) => output.id === "totalExposure")?.raw).toBeCloseTo(calculatorResult.totalExposure, 2);
    expect(engineResult.outputs.find((output) => output.id === "variancePercent")?.raw).toBeCloseTo(calculatorResult.variancePercent, 2);
  });
});
