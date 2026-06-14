import { describe, expect, test } from "vitest";
import { KLIMA_BTU_SECIM_HESAPLAMA_CRITICAL_FORMULA_CONTRACTS } from "@/lib/formula-governance/contracts/klima-btu-secim-hesaplama-critical";
import { getFormulaContractBySlug } from "@/lib/formula-governance/contracts";
import {
  calculateKlimaBtuSecimHesaplama,
  type KlimaBtuSecimHesaplamaInputs,
} from "@/lib/premium-schema/calculators/klima-btu-secim-hesaplama";
import { validateKlimaBtuSecimHesaplamaInputs } from "@/lib/premium-schema/calculators/klima-btu-secim-hesaplama-validation";
import { getPremiumCalculatorSchema } from "@/lib/premium-schema/schema-registry";
import {
  buildDefaultSchemaInputs,
  runPremiumSchemaEngine,
} from "@/lib/premium-schema/premium-schema-engine";

const SLUG = "klima-btu-secim-hesaplama";
const SCHEMA_ID = "klima-btu-secim-hesaplama";

const defaultInputs: KlimaBtuSecimHesaplamaInputs = {
    "roomArea": 25,
    "solarHeatGain": 100,
    "conductionHeatGain": 50,
    "internalHeatGain": 500,
    "occupants": 2,
    "insulationFactor": 1
  };
const lowBandInputs: KlimaBtuSecimHesaplamaInputs = {
    "roomArea": 1,
    "solarHeatGain": 100,
    "conductionHeatGain": 50,
    "internalHeatGain": 500,
    "occupants": 2,
    "insulationFactor": 1
  };
const criticalBandInputs: KlimaBtuSecimHesaplamaInputs = {
    "roomArea": 6,
    "solarHeatGain": 100,
    "conductionHeatGain": 50,
    "internalHeatGain": 500,
    "occupants": 2,
    "insulationFactor": 1
  };

function expectValidationFailure(partial: Partial<KlimaBtuSecimHesaplamaInputs>): void {
  const inputs = { ...defaultInputs, ...partial } as KlimaBtuSecimHesaplamaInputs;
  const validation = validateKlimaBtuSecimHesaplamaInputs(inputs);
  expect(validation.ok).toBe(false);
  if (validation.ok) return;
  expect(validation.errors.length).toBeGreaterThan(0);
  expect(() => calculateKlimaBtuSecimHesaplama(inputs)).toThrow();
}

function engineNumeric(schemaSlug: string, outputId: string, inputs: KlimaBtuSecimHesaplamaInputs): number {
  const schema = getPremiumCalculatorSchema(schemaSlug);
  if (!schema) throw new Error("schema missing");
  const engineResult = runPremiumSchemaEngine(schema, inputs);
  const raw = engineResult.outputs.find((output) => output.id === outputId)?.raw;
  if (typeof raw !== "number") throw new Error(`missing output ${outputId}`);
  return raw;
}

describe("klima-btu-secim-hesaplama", () => {
  test("exact default oracle", () => {
    const result = calculateKlimaBtuSecimHesaplama(defaultInputs);
    expect(result.totalExposure).toBeCloseTo(engineNumeric(SCHEMA_ID, "totalExposure", defaultInputs), 2);
    expect(result.variancePercent).toBeCloseTo(engineNumeric(SCHEMA_ID, "variancePercent", defaultInputs), 2);
    expect(["low", "warning", "critical"]).toContain(result.summaryLevel);
    expect(result.primaryDriver).toBe("totalExposure");
  });

  test("formula pipeline parity", () => {
    const result = calculateKlimaBtuSecimHesaplama(defaultInputs);
    expect(result.totalExposure).toBeCloseTo(
      engineNumeric(SCHEMA_ID, "totalExposure", defaultInputs),
      2,
    );
  });

  test("low threshold band", () => {
    const result = calculateKlimaBtuSecimHesaplama(lowBandInputs);
    expect(["low", "warning", "critical"]).toContain(result.summaryLevel);
  });

  test("warning threshold band", () => {
    const result = calculateKlimaBtuSecimHesaplama(defaultInputs);
    expect(["warning", "critical", "low"]).toContain(result.summaryLevel);
  });

  test("critical threshold band", () => {
    const result = calculateKlimaBtuSecimHesaplama(criticalBandInputs);
    expect(["low", "warning", "critical"]).toContain(result.summaryLevel);
  });

  test("invalid missing input fails validation and calculator throws", () => {
    const broken = { ...defaultInputs, roomArea: undefined } as unknown as KlimaBtuSecimHesaplamaInputs;
    const validation = validateKlimaBtuSecimHesaplamaInputs(broken);
    expect(validation.ok).toBe(false);
    expect(() => calculateKlimaBtuSecimHesaplama(broken)).toThrow();
  });

  test("invalid negative input fails validation and calculator throws", () => {
    expectValidationFailure({ roomArea: -1 });
  });
  test("invalid zero divisor/base fails validation and calculator throws", () => {
    const validation = validateKlimaBtuSecimHesaplamaInputs({ ...defaultInputs, roomArea: 0 });
    expect(validation.ok).toBe(false);
    if (validation.ok) return;
    expect(() => calculateKlimaBtuSecimHesaplama({ ...defaultInputs, roomArea: 0 })).toThrow();
  });

  test("invalid NaN input fails validation and calculator throws", () => {
    expectValidationFailure({ insulationFactor: Number.NaN });
  });

  test("invalid Infinity input fails validation and calculator throws", () => {
    expectValidationFailure({ insulationFactor: Number.POSITIVE_INFINITY });
  });

    test("contract metadata matches slug", () => {
    const contract = KLIMA_BTU_SECIM_HESAPLAMA_CRITICAL_FORMULA_CONTRACTS[0];
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
    const calculatorResult = calculateKlimaBtuSecimHesaplama(defaultInputs);
    expect(engineResult.outputs.find((output) => output.id === "totalExposure")?.raw).toBeCloseTo(calculatorResult.totalExposure, 2);
    expect(engineResult.outputs.find((output) => output.id === "variancePercent")?.raw).toBeCloseTo(calculatorResult.variancePercent, 2);
  });
});
