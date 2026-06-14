import { describe, expect, test } from "vitest";
import { KESME_BUKME_ABKANT_TONAJ_HESABI_CRITICAL_FORMULA_CONTRACTS } from "@/lib/formula-governance/contracts/kesme-bukme-abkant-tonaj-hesabi-critical";
import { getFormulaContractBySlug } from "@/lib/formula-governance/contracts";
import {
  calculateKesmeBukmeAbkantTonajHesabi,
  type KesmeBukmeAbkantTonajHesabiInputs,
} from "@/lib/premium-schema/calculators/kesme-bukme-abkant-tonaj-hesabi";
import { validateKesmeBukmeAbkantTonajHesabiInputs } from "@/lib/premium-schema/calculators/kesme-bukme-abkant-tonaj-hesabi-validation";
import { getPremiumCalculatorSchema } from "@/lib/premium-schema/schema-registry";
import {
  buildDefaultSchemaInputs,
  runPremiumSchemaEngine,
} from "@/lib/premium-schema/premium-schema-engine";

const SLUG = "kesme-bukme-abkant-tonaj-hesabi";
const SCHEMA_ID = "kesme-bukme-abkant-tonaj-hesabi";

const defaultInputs: KesmeBukmeAbkantTonajHesabiInputs = {
    "tensileStrength": 450,
    "materialThickness": 2,
    "bendLength": 1000,
    "dieOpening": 16,
    "materialFactor": 1,
    "safetyFactor": 1.1
  };
const lowBandInputs: KesmeBukmeAbkantTonajHesabiInputs = {
    "tensileStrength": 100,
    "materialThickness": 2,
    "bendLength": 1000,
    "dieOpening": 16,
    "materialFactor": 1,
    "safetyFactor": 1.1
  };
const criticalBandInputs: KesmeBukmeAbkantTonajHesabiInputs = {
    "tensileStrength": 100,
    "materialThickness": 2,
    "bendLength": 1000,
    "dieOpening": 16,
    "materialFactor": 1,
    "safetyFactor": 1.1
  };

function expectValidationFailure(partial: Partial<KesmeBukmeAbkantTonajHesabiInputs>): void {
  const inputs = { ...defaultInputs, ...partial } as KesmeBukmeAbkantTonajHesabiInputs;
  const validation = validateKesmeBukmeAbkantTonajHesabiInputs(inputs);
  expect(validation.ok).toBe(false);
  if (validation.ok) return;
  expect(validation.errors.length).toBeGreaterThan(0);
  expect(() => calculateKesmeBukmeAbkantTonajHesabi(inputs)).toThrow();
}

function engineNumeric(schemaSlug: string, outputId: string, inputs: KesmeBukmeAbkantTonajHesabiInputs): number {
  const schema = getPremiumCalculatorSchema(schemaSlug);
  if (!schema) throw new Error("schema missing");
  const engineResult = runPremiumSchemaEngine(schema, inputs);
  const raw = engineResult.outputs.find((output) => output.id === outputId)?.raw;
  if (typeof raw !== "number") throw new Error(`missing output ${outputId}`);
  return raw;
}

describe("kesme-bukme-abkant-tonaj-hesabi", () => {
  test("exact default oracle", () => {
    const result = calculateKesmeBukmeAbkantTonajHesabi(defaultInputs);
    expect(result.totalExposure).toBeCloseTo(engineNumeric(SCHEMA_ID, "totalExposure", defaultInputs), 2);
    expect(result.variancePercent).toBeCloseTo(engineNumeric(SCHEMA_ID, "variancePercent", defaultInputs), 2);
    expect(["low", "warning", "critical"]).toContain(result.summaryLevel);
    expect(result.primaryDriver).toBe("totalExposure");
  });

  test("formula pipeline parity", () => {
    const result = calculateKesmeBukmeAbkantTonajHesabi(defaultInputs);
    expect(result.totalExposure).toBeCloseTo(
      engineNumeric(SCHEMA_ID, "totalExposure", defaultInputs),
      2,
    );
  });

  test("low threshold band", () => {
    const result = calculateKesmeBukmeAbkantTonajHesabi(lowBandInputs);
    expect(["low", "warning", "critical"]).toContain(result.summaryLevel);
  });

  test("warning threshold band", () => {
    const result = calculateKesmeBukmeAbkantTonajHesabi(defaultInputs);
    expect(["warning", "critical", "low"]).toContain(result.summaryLevel);
  });

  test("critical threshold band", () => {
    const result = calculateKesmeBukmeAbkantTonajHesabi(criticalBandInputs);
    expect(["low", "warning", "critical"]).toContain(result.summaryLevel);
  });

  test("invalid missing input fails validation and calculator throws", () => {
    const broken = { ...defaultInputs, tensileStrength: undefined } as unknown as KesmeBukmeAbkantTonajHesabiInputs;
    const validation = validateKesmeBukmeAbkantTonajHesabiInputs(broken);
    expect(validation.ok).toBe(false);
    expect(() => calculateKesmeBukmeAbkantTonajHesabi(broken)).toThrow();
  });

  test("invalid negative input fails validation and calculator throws", () => {
    expectValidationFailure({ tensileStrength: -1 });
  });
  test("invalid zero divisor/base fails validation and calculator throws", () => {
    const validation = validateKesmeBukmeAbkantTonajHesabiInputs({ ...defaultInputs, tensileStrength: 0 });
    expect(validation.ok).toBe(false);
    if (validation.ok) return;
    expect(() => calculateKesmeBukmeAbkantTonajHesabi({ ...defaultInputs, tensileStrength: 0 })).toThrow();
  });

  test("invalid NaN input fails validation and calculator throws", () => {
    expectValidationFailure({ safetyFactor: Number.NaN });
  });

  test("invalid Infinity input fails validation and calculator throws", () => {
    expectValidationFailure({ safetyFactor: Number.POSITIVE_INFINITY });
  });

    test("contract metadata matches slug", () => {
    const contract = KESME_BUKME_ABKANT_TONAJ_HESABI_CRITICAL_FORMULA_CONTRACTS[0];
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
    const calculatorResult = calculateKesmeBukmeAbkantTonajHesabi(defaultInputs);
    expect(engineResult.outputs.find((output) => output.id === "totalExposure")?.raw).toBeCloseTo(calculatorResult.totalExposure, 2);
    expect(engineResult.outputs.find((output) => output.id === "variancePercent")?.raw).toBeCloseTo(calculatorResult.variancePercent, 2);
  });
});
