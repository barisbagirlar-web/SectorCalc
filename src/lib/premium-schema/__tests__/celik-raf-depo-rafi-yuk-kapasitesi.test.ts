import { describe, expect, test } from "vitest";
import { CELIK_RAF_DEPO_RAFI_YUK_KAPASITESI_CRITICAL_FORMULA_CONTRACTS } from "@/lib/formula-governance/contracts/celik-raf-depo-rafi-yuk-kapasitesi-critical";
import { getFormulaContractBySlug } from "@/lib/formula-governance/contracts";
import {
  calculateCelikRafDepoRafiYukKapasitesi,
  type CelikRafDepoRafiYukKapasitesiInputs,
} from "@/lib/premium-schema/calculators/celik-raf-depo-rafi-yuk-kapasitesi";
import { validateCelikRafDepoRafiYukKapasitesiInputs } from "@/lib/premium-schema/calculators/celik-raf-depo-rafi-yuk-kapasitesi-validation";
import { getPremiumCalculatorSchema } from "@/lib/premium-schema/schema-registry";
import {
  buildDefaultSchemaInputs,
  runPremiumSchemaEngine,
} from "@/lib/premium-schema/premium-schema-engine";

const SLUG = "celik-raf-depo-rafi-yuk-kapasitesi";
const SCHEMA_ID = "celik-raf-depo-rafi-yuk-kapasitesi";

const defaultInputs: CelikRafDepoRafiYukKapasitesiInputs = {
    "beamLength": 2.5,
    "beamWidth": 0.1,
    "beamHeight": 0.15,
    "columnHeight": 6,
    "numberOfLevels": 4,
    "numberOfColumns": 4
  };
const lowBandInputs: CelikRafDepoRafiYukKapasitesiInputs = {
    "beamLength": 0.5,
    "beamWidth": 0.1,
    "beamHeight": 0.15,
    "columnHeight": 6,
    "numberOfLevels": 4,
    "numberOfColumns": 4
  };
const criticalBandInputs: CelikRafDepoRafiYukKapasitesiInputs = {
    "beamLength": 5,
    "beamWidth": 0.1,
    "beamHeight": 0.15,
    "columnHeight": 6,
    "numberOfLevels": 4,
    "numberOfColumns": 4
  };

function expectValidationFailure(partial: Partial<CelikRafDepoRafiYukKapasitesiInputs>): void {
  const inputs = { ...defaultInputs, ...partial } as CelikRafDepoRafiYukKapasitesiInputs;
  const validation = validateCelikRafDepoRafiYukKapasitesiInputs(inputs);
  expect(validation.ok).toBe(false);
  if (validation.ok) return;
  expect(validation.errors.length).toBeGreaterThan(0);
  expect(() => calculateCelikRafDepoRafiYukKapasitesi(inputs)).toThrow();
}

function engineNumeric(schemaSlug: string, outputId: string, inputs: CelikRafDepoRafiYukKapasitesiInputs): number {
  const schema = getPremiumCalculatorSchema(schemaSlug);
  if (!schema) throw new Error("schema missing");
  const engineResult = runPremiumSchemaEngine(schema, inputs);
  const raw = engineResult.outputs.find((output) => output.id === outputId)?.raw;
  if (typeof raw !== "number") throw new Error(`missing output ${outputId}`);
  return raw;
}

describe("celik-raf-depo-rafi-yuk-kapasitesi", () => {
  test("exact default oracle", () => {
    const result = calculateCelikRafDepoRafiYukKapasitesi(defaultInputs);
    expect(result.totalExposure).toBeCloseTo(engineNumeric(SCHEMA_ID, "totalExposure", defaultInputs), 2);
    expect(result.variancePercent).toBeCloseTo(engineNumeric(SCHEMA_ID, "variancePercent", defaultInputs), 2);
    expect(["low", "warning", "critical"]).toContain(result.summaryLevel);
    expect(result.primaryDriver).toBe("totalExposure");
  });

  test("formula pipeline parity", () => {
    const result = calculateCelikRafDepoRafiYukKapasitesi(defaultInputs);
    expect(result.totalExposure).toBeCloseTo(
      engineNumeric(SCHEMA_ID, "totalExposure", defaultInputs),
      2,
    );
  });

  test("low threshold band", () => {
    const result = calculateCelikRafDepoRafiYukKapasitesi(lowBandInputs);
    expect(["low", "warning", "critical"]).toContain(result.summaryLevel);
  });

  test("warning threshold band", () => {
    const result = calculateCelikRafDepoRafiYukKapasitesi(defaultInputs);
    expect(["warning", "critical", "low"]).toContain(result.summaryLevel);
  });

  test("critical threshold band", () => {
    const result = calculateCelikRafDepoRafiYukKapasitesi(criticalBandInputs);
    expect(["low", "warning", "critical"]).toContain(result.summaryLevel);
  });

  test("invalid missing input fails validation and calculator throws", () => {
    const broken = { ...defaultInputs, beamLength: undefined } as unknown as CelikRafDepoRafiYukKapasitesiInputs;
    const validation = validateCelikRafDepoRafiYukKapasitesiInputs(broken);
    expect(validation.ok).toBe(false);
    expect(() => calculateCelikRafDepoRafiYukKapasitesi(broken)).toThrow();
  });

  test("invalid negative input fails validation and calculator throws", () => {
    expectValidationFailure({ beamLength: -1 });
  });
  test("invalid zero divisor/base fails validation and calculator throws", () => {
    const validation = validateCelikRafDepoRafiYukKapasitesiInputs({ ...defaultInputs, beamLength: 0 });
    expect(validation.ok).toBe(false);
    if (validation.ok) return;
    expect(() => calculateCelikRafDepoRafiYukKapasitesi({ ...defaultInputs, beamLength: 0 })).toThrow();
  });

  test("invalid NaN input fails validation and calculator throws", () => {
    expectValidationFailure({ numberOfColumns: Number.NaN });
  });

  test("invalid Infinity input fails validation and calculator throws", () => {
    expectValidationFailure({ numberOfColumns: Number.POSITIVE_INFINITY });
  });

    test("contract metadata matches slug", () => {
    const contract = CELIK_RAF_DEPO_RAFI_YUK_KAPASITESI_CRITICAL_FORMULA_CONTRACTS[0];
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
    const calculatorResult = calculateCelikRafDepoRafiYukKapasitesi(defaultInputs);
    expect(engineResult.outputs.find((output) => output.id === "totalExposure")?.raw).toBeCloseTo(calculatorResult.totalExposure, 2);
    expect(engineResult.outputs.find((output) => output.id === "variancePercent")?.raw).toBeCloseTo(calculatorResult.variancePercent, 2);
  });
});
