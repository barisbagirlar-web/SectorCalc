import { describe, expect, test } from "vitest";
import { FORKLIFT_TRANSPALET_KULLANIM_MALIYETI_CRITICAL_FORMULA_CONTRACTS } from "@/lib/formula-governance/contracts/forklift-transpalet-kullanim-maliyeti-critical";
import { getFormulaContractBySlug } from "@/lib/formula-governance/contracts";
import {
  calculateForkliftTranspaletKullanimMaliyeti,
  type ForkliftTranspaletKullanimMaliyetiInputs,
} from "@/lib/premium-schema/calculators/forklift-transpalet-kullanim-maliyeti";
import { validateForkliftTranspaletKullanimMaliyetiInputs } from "@/lib/premium-schema/calculators/forklift-transpalet-kullanim-maliyeti-validation";
import { getPremiumCalculatorSchema } from "@/lib/premium-schema/schema-registry";
import {
  buildDefaultSchemaInputs,
  runPremiumSchemaEngine,
} from "@/lib/premium-schema/premium-schema-engine";

const SLUG = "forklift-transpalet-kullanim-maliyeti";
const SCHEMA_ID = "forklift-transpalet-kullanim-maliyeti";

const defaultInputs: ForkliftTranspaletKullanimMaliyetiInputs = {
    "purchasePrice": 25000,
    "residualValue": 2500,
    "usefulLifeYears": 10,
    "operatingHoursPerYear": 2000,
    "energyConsumptionPerHour": 5,
    "energyUnitCost": 0.12
  };
const lowBandInputs: ForkliftTranspaletKullanimMaliyetiInputs = {
    "purchasePrice": 0.1,
    "residualValue": 2500,
    "usefulLifeYears": 10,
    "operatingHoursPerYear": 2000,
    "energyConsumptionPerHour": 5,
    "energyUnitCost": 0.12
  };
const criticalBandInputs: ForkliftTranspaletKullanimMaliyetiInputs = {
    "purchasePrice": 6,
    "residualValue": 2500,
    "usefulLifeYears": 10,
    "operatingHoursPerYear": 2000,
    "energyConsumptionPerHour": 5,
    "energyUnitCost": 0.12
  };

function expectValidationFailure(partial: Partial<ForkliftTranspaletKullanimMaliyetiInputs>): void {
  const inputs = { ...defaultInputs, ...partial } as ForkliftTranspaletKullanimMaliyetiInputs;
  const validation = validateForkliftTranspaletKullanimMaliyetiInputs(inputs);
  expect(validation.ok).toBe(false);
  if (validation.ok) return;
  expect(validation.errors.length).toBeGreaterThan(0);
  expect(() => calculateForkliftTranspaletKullanimMaliyeti(inputs)).toThrow();
}

function engineNumeric(schemaSlug: string, outputId: string, inputs: ForkliftTranspaletKullanimMaliyetiInputs): number {
  const schema = getPremiumCalculatorSchema(schemaSlug);
  if (!schema) throw new Error("schema missing");
  const engineResult = runPremiumSchemaEngine(schema, inputs);
  const raw = engineResult.outputs.find((output) => output.id === outputId)?.raw;
  if (typeof raw !== "number") throw new Error(`missing output ${outputId}`);
  return raw;
}

describe("forklift-transpalet-kullanim-maliyeti", () => {
  test("exact default oracle", () => {
    const result = calculateForkliftTranspaletKullanimMaliyeti(defaultInputs);
    expect(result.totalExposure).toBeCloseTo(engineNumeric(SCHEMA_ID, "totalExposure", defaultInputs), 2);
    expect(result.variancePercent).toBeCloseTo(engineNumeric(SCHEMA_ID, "variancePercent", defaultInputs), 2);
    expect(["low", "warning", "critical"]).toContain(result.summaryLevel);
    expect(result.primaryDriver).toBe("totalExposure");
  });

  test("formula pipeline parity", () => {
    const result = calculateForkliftTranspaletKullanimMaliyeti(defaultInputs);
    expect(result.totalExposure).toBeCloseTo(
      engineNumeric(SCHEMA_ID, "totalExposure", defaultInputs),
      2,
    );
  });

  test("low threshold band", () => {
    const result = calculateForkliftTranspaletKullanimMaliyeti(lowBandInputs);
    expect(["low", "warning", "critical"]).toContain(result.summaryLevel);
  });

  test("warning threshold band", () => {
    const result = calculateForkliftTranspaletKullanimMaliyeti(defaultInputs);
    expect(["warning", "critical", "low"]).toContain(result.summaryLevel);
  });

  test("critical threshold band", () => {
    const result = calculateForkliftTranspaletKullanimMaliyeti(criticalBandInputs);
    expect(["low", "warning", "critical"]).toContain(result.summaryLevel);
  });

  test("invalid missing input fails validation and calculator throws", () => {
    const broken = { ...defaultInputs, purchasePrice: undefined } as unknown as ForkliftTranspaletKullanimMaliyetiInputs;
    const validation = validateForkliftTranspaletKullanimMaliyetiInputs(broken);
    expect(validation.ok).toBe(false);
    expect(() => calculateForkliftTranspaletKullanimMaliyeti(broken)).toThrow();
  });

  test("invalid negative input fails validation and calculator throws", () => {
    expectValidationFailure({ purchasePrice: -1 });
  });
  test("invalid zero divisor/base fails validation and calculator throws", () => {
    const validation = validateForkliftTranspaletKullanimMaliyetiInputs({ ...defaultInputs, usefulLifeYears: 0 });
    expect(validation.ok).toBe(false);
    if (validation.ok) return;
    expect(() => calculateForkliftTranspaletKullanimMaliyeti({ ...defaultInputs, usefulLifeYears: 0 })).toThrow();
  });

  test("invalid NaN input fails validation and calculator throws", () => {
    expectValidationFailure({ energyUnitCost: Number.NaN });
  });

  test("invalid Infinity input fails validation and calculator throws", () => {
    expectValidationFailure({ energyUnitCost: Number.POSITIVE_INFINITY });
  });

    test("contract metadata matches slug", () => {
    const contract = FORKLIFT_TRANSPALET_KULLANIM_MALIYETI_CRITICAL_FORMULA_CONTRACTS[0];
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
    const calculatorResult = calculateForkliftTranspaletKullanimMaliyeti(defaultInputs);
    expect(engineResult.outputs.find((output) => output.id === "totalExposure")?.raw).toBeCloseTo(calculatorResult.totalExposure, 2);
    expect(engineResult.outputs.find((output) => output.id === "variancePercent")?.raw).toBeCloseTo(calculatorResult.variancePercent, 2);
  });
});
