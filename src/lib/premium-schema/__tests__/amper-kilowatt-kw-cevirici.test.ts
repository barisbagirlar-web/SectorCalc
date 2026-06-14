import { describe, expect, test } from "vitest";
import { AMPER_KILOWATT_KW_CEVIRICI_CRITICAL_FORMULA_CONTRACTS } from "@/lib/formula-governance/contracts/amper-kilowatt-kw-cevirici-critical";
import { getFormulaContractBySlug } from "@/lib/formula-governance/contracts";
import {
  calculateAmperKilowattKwCevirici,
  type AmperKilowattKwCeviriciInputs,
} from "@/lib/premium-schema/calculators/amper-kilowatt-kw-cevirici";
import { validateAmperKilowattKwCeviriciInputs } from "@/lib/premium-schema/calculators/amper-kilowatt-kw-cevirici-validation";
import { getPremiumCalculatorSchema } from "@/lib/premium-schema/schema-registry";
import {
  buildDefaultSchemaInputs,
  runPremiumSchemaEngine,
} from "@/lib/premium-schema/premium-schema-engine";

const SLUG = "amper-kilowatt-kw-cevirici";
const SCHEMA_ID = "amper-kilowatt-kw-cevirici";

const defaultInputs: AmperKilowattKwCeviriciInputs = {
    "currentAmperes": 10,
    "voltageVolts": 230,
    "powerFactor": 0.95,
    "phaseType": 1
  };
const lowBandInputs: AmperKilowattKwCeviriciInputs = {
    "currentAmperes": 0.1,
    "voltageVolts": 230,
    "powerFactor": 0.95,
    "phaseType": 1
  };
const criticalBandInputs: AmperKilowattKwCeviriciInputs = {
    "currentAmperes": 6,
    "voltageVolts": 230,
    "powerFactor": 0.95,
    "phaseType": 1
  };

function expectValidationFailure(partial: Partial<AmperKilowattKwCeviriciInputs>): void {
  const inputs = { ...defaultInputs, ...partial } as AmperKilowattKwCeviriciInputs;
  const validation = validateAmperKilowattKwCeviriciInputs(inputs);
  expect(validation.ok).toBe(false);
  if (validation.ok) return;
  expect(validation.errors.length).toBeGreaterThan(0);
  expect(() => calculateAmperKilowattKwCevirici(inputs)).toThrow();
}

function engineNumeric(schemaSlug: string, outputId: string, inputs: AmperKilowattKwCeviriciInputs): number {
  const schema = getPremiumCalculatorSchema(schemaSlug);
  if (!schema) throw new Error("schema missing");
  const engineResult = runPremiumSchemaEngine(schema, inputs);
  const raw = engineResult.outputs.find((output) => output.id === outputId)?.raw;
  if (typeof raw !== "number") throw new Error(`missing output ${outputId}`);
  return raw;
}

describe("amper-kilowatt-kw-cevirici", () => {
  test("exact default oracle", () => {
    const result = calculateAmperKilowattKwCevirici(defaultInputs);
    expect(result.totalExposure).toBeCloseTo(engineNumeric(SCHEMA_ID, "totalExposure", defaultInputs), 2);
    expect(result.variancePercent).toBeCloseTo(engineNumeric(SCHEMA_ID, "variancePercent", defaultInputs), 2);
    expect(["low", "warning", "critical"]).toContain(result.summaryLevel);
    expect(result.primaryDriver).toBe("totalExposure");
  });

  test("formula pipeline parity", () => {
    const result = calculateAmperKilowattKwCevirici(defaultInputs);
    expect(result.totalExposure).toBeCloseTo(
      engineNumeric(SCHEMA_ID, "totalExposure", defaultInputs),
      2,
    );
  });

  test("low threshold band", () => {
    const result = calculateAmperKilowattKwCevirici(lowBandInputs);
    expect(["low", "warning", "critical"]).toContain(result.summaryLevel);
  });

  test("warning threshold band", () => {
    const result = calculateAmperKilowattKwCevirici(defaultInputs);
    expect(["warning", "critical", "low"]).toContain(result.summaryLevel);
  });

  test("critical threshold band", () => {
    const result = calculateAmperKilowattKwCevirici(criticalBandInputs);
    expect(["low", "warning", "critical"]).toContain(result.summaryLevel);
  });

  test("invalid missing input fails validation and calculator throws", () => {
    const broken = { ...defaultInputs, currentAmperes: undefined } as unknown as AmperKilowattKwCeviriciInputs;
    const validation = validateAmperKilowattKwCeviriciInputs(broken);
    expect(validation.ok).toBe(false);
    expect(() => calculateAmperKilowattKwCevirici(broken)).toThrow();
  });

  test("invalid negative input fails validation and calculator throws", () => {
    expectValidationFailure({ currentAmperes: -1 });
  });
  test("invalid zero divisor/base fails validation and calculator throws", () => {
    const validation = validateAmperKilowattKwCeviriciInputs({ ...defaultInputs, currentAmperes: 0 });
    expect(validation.ok).toBe(false);
    if (validation.ok) return;
    expect(() => calculateAmperKilowattKwCevirici({ ...defaultInputs, currentAmperes: 0 })).toThrow();
  });

  test("invalid NaN input fails validation and calculator throws", () => {
    expectValidationFailure({ phaseType: Number.NaN });
  });

  test("invalid Infinity input fails validation and calculator throws", () => {
    expectValidationFailure({ phaseType: Number.POSITIVE_INFINITY });
  });

    test("contract metadata matches slug", () => {
    const contract = AMPER_KILOWATT_KW_CEVIRICI_CRITICAL_FORMULA_CONTRACTS[0];
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
    const calculatorResult = calculateAmperKilowattKwCevirici(defaultInputs);
    expect(engineResult.outputs.find((output) => output.id === "totalExposure")?.raw).toBeCloseTo(calculatorResult.totalExposure, 2);
    expect(engineResult.outputs.find((output) => output.id === "variancePercent")?.raw).toBeCloseTo(calculatorResult.variancePercent, 2);
  });
});
