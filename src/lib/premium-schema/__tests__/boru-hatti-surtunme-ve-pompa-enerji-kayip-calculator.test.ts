import { describe, expect, test } from "vitest";
import { BORU_HATTI_SURTUNME_VE_POMPA_ENERJI_KAYIP_CALCULATOR_CRITICAL_FORMULA_CONTRACTS } from "@/lib/formula-governance/contracts/boru-hatti-surtunme-ve-pompa-enerji-kayip-calculator-critical";
import { getFormulaContractBySlug } from "@/lib/formula-governance/contracts";
import {
  calculateBoruHattiSurtunmeVePompaEnerjiKayipCalculator,
  type BoruHattiSurtunmeVePompaEnerjiKayipCalculatorInputs,
} from "@/lib/premium-schema/calculators/boru-hatti-surtunme-ve-pompa-enerji-kayip-calculator";
import { validateBoruHattiSurtunmeVePompaEnerjiKayipCalculatorInputs } from "@/lib/premium-schema/calculators/boru-hatti-surtunme-ve-pompa-enerji-kayip-calculator-validation";
import { getPremiumCalculatorSchema } from "@/lib/premium-schema/schema-registry";
import {
  buildDefaultSchemaInputs,
  runPremiumSchemaEngine,
} from "@/lib/premium-schema/premium-schema-engine";

const SLUG = "boru-hatti-surtunme-ve-pompa-enerji-kayip-calculator";
const SCHEMA_ID = "boru-hatti-surtunme-ve-pompa-enerji-kayip-calculator";

const defaultInputs: BoruHattiSurtunmeVePompaEnerjiKayipCalculatorInputs = {
    "pipeLengthM": 100,
    "pipeDiameterM": 0.2,
    "flowRateM3PerS": 0.05,
    "frictionFactor": 0.02,
    "fluidDensityKgPerM3": 1000,
    "pumpEfficiencyPercent": 75
  };
const lowBandInputs: BoruHattiSurtunmeVePompaEnerjiKayipCalculatorInputs = {
    "pipeLengthM": 0.1,
    "pipeDiameterM": 0.2,
    "flowRateM3PerS": 0.05,
    "frictionFactor": 0.02,
    "fluidDensityKgPerM3": 1000,
    "pumpEfficiencyPercent": 75
  };
const criticalBandInputs: BoruHattiSurtunmeVePompaEnerjiKayipCalculatorInputs = {
    "pipeLengthM": 6,
    "pipeDiameterM": 0.2,
    "flowRateM3PerS": 0.05,
    "frictionFactor": 0.02,
    "fluidDensityKgPerM3": 1000,
    "pumpEfficiencyPercent": 75
  };

function expectValidationFailure(partial: Partial<BoruHattiSurtunmeVePompaEnerjiKayipCalculatorInputs>): void {
  const inputs = { ...defaultInputs, ...partial } as BoruHattiSurtunmeVePompaEnerjiKayipCalculatorInputs;
  const validation = validateBoruHattiSurtunmeVePompaEnerjiKayipCalculatorInputs(inputs);
  expect(validation.ok).toBe(false);
  if (validation.ok) return;
  expect(validation.errors.length).toBeGreaterThan(0);
  expect(() => calculateBoruHattiSurtunmeVePompaEnerjiKayipCalculator(inputs)).toThrow();
}

function engineNumeric(schemaSlug: string, outputId: string, inputs: BoruHattiSurtunmeVePompaEnerjiKayipCalculatorInputs): number {
  const schema = getPremiumCalculatorSchema(schemaSlug);
  if (!schema) throw new Error("schema missing");
  const engineResult = runPremiumSchemaEngine(schema, inputs);
  const raw = engineResult.outputs.find((output) => output.id === outputId)?.raw;
  if (typeof raw !== "number") throw new Error(`missing output ${outputId}`);
  return raw;
}

describe("boru-hatti-surtunme-ve-pompa-enerji-kayip-calculator", () => {
  test("exact default oracle", () => {
    const result = calculateBoruHattiSurtunmeVePompaEnerjiKayipCalculator(defaultInputs);
    expect(result.totalExposure).toBeCloseTo(engineNumeric(SCHEMA_ID, "totalExposure", defaultInputs), 2);
    expect(result.variancePercent).toBeCloseTo(engineNumeric(SCHEMA_ID, "variancePercent", defaultInputs), 2);
    expect(["low", "warning", "critical"]).toContain(result.summaryLevel);
    expect(result.primaryDriver).toBe("totalExposure");
  });

  test("formula pipeline parity", () => {
    const result = calculateBoruHattiSurtunmeVePompaEnerjiKayipCalculator(defaultInputs);
    expect(result.totalExposure).toBeCloseTo(
      engineNumeric(SCHEMA_ID, "totalExposure", defaultInputs),
      2,
    );
  });

  test("low threshold band", () => {
    const result = calculateBoruHattiSurtunmeVePompaEnerjiKayipCalculator(lowBandInputs);
    expect(["low", "warning", "critical"]).toContain(result.summaryLevel);
  });

  test("warning threshold band", () => {
    const result = calculateBoruHattiSurtunmeVePompaEnerjiKayipCalculator(defaultInputs);
    expect(["warning", "critical", "low"]).toContain(result.summaryLevel);
  });

  test("critical threshold band", () => {
    const result = calculateBoruHattiSurtunmeVePompaEnerjiKayipCalculator(criticalBandInputs);
    expect(["low", "warning", "critical"]).toContain(result.summaryLevel);
  });

  test("invalid missing input fails validation and calculator throws", () => {
    const broken = { ...defaultInputs, pipeLengthM: undefined } as unknown as BoruHattiSurtunmeVePompaEnerjiKayipCalculatorInputs;
    const validation = validateBoruHattiSurtunmeVePompaEnerjiKayipCalculatorInputs(broken);
    expect(validation.ok).toBe(false);
    expect(() => calculateBoruHattiSurtunmeVePompaEnerjiKayipCalculator(broken)).toThrow();
  });

  test("invalid negative input fails validation and calculator throws", () => {
    expectValidationFailure({ pipeLengthM: -1 });
  });
  test("invalid zero divisor/base fails validation and calculator throws", () => {
    const validation = validateBoruHattiSurtunmeVePompaEnerjiKayipCalculatorInputs({ ...defaultInputs, pipeLengthM: 0 });
    expect(validation.ok).toBe(false);
    if (validation.ok) return;
    expect(() => calculateBoruHattiSurtunmeVePompaEnerjiKayipCalculator({ ...defaultInputs, pipeLengthM: 0 })).toThrow();
  });

  test("invalid NaN input fails validation and calculator throws", () => {
    expectValidationFailure({ pumpEfficiencyPercent: Number.NaN });
  });

  test("invalid Infinity input fails validation and calculator throws", () => {
    expectValidationFailure({ pumpEfficiencyPercent: Number.POSITIVE_INFINITY });
  });

    test("contract metadata matches slug", () => {
    const contract = BORU_HATTI_SURTUNME_VE_POMPA_ENERJI_KAYIP_CALCULATOR_CRITICAL_FORMULA_CONTRACTS[0];
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
    const calculatorResult = calculateBoruHattiSurtunmeVePompaEnerjiKayipCalculator(defaultInputs);
    expect(engineResult.outputs.find((output) => output.id === "totalExposure")?.raw).toBeCloseTo(calculatorResult.totalExposure, 2);
    expect(engineResult.outputs.find((output) => output.id === "variancePercent")?.raw).toBeCloseTo(calculatorResult.variancePercent, 2);
  });
});
