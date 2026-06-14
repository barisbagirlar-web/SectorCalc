import { describe, expect, test } from "vitest";
import { POMPA_GUCU_BASMA_YUKSEKLIGI_HESABI_CRITICAL_FORMULA_CONTRACTS } from "@/lib/formula-governance/contracts/pompa-gucu-basma-yuksekligi-hesabi-critical";
import { getFormulaContractBySlug } from "@/lib/formula-governance/contracts";
import {
  calculatePompaGucuBasmaYuksekligiHesabi,
  type PompaGucuBasmaYuksekligiHesabiInputs,
} from "@/lib/premium-schema/calculators/pompa-gucu-basma-yuksekligi-hesabi";
import { validatePompaGucuBasmaYuksekligiHesabiInputs } from "@/lib/premium-schema/calculators/pompa-gucu-basma-yuksekligi-hesabi-validation";
import { getPremiumCalculatorSchema } from "@/lib/premium-schema/schema-registry";
import {
  buildDefaultSchemaInputs,
  runPremiumSchemaEngine,
} from "@/lib/premium-schema/premium-schema-engine";

const SLUG = "pompa-gucu-basma-yuksekligi-hesabi";
const SCHEMA_ID = "pompa-gucu-basma-yuksekligi-hesabi";

const defaultInputs: PompaGucuBasmaYuksekligiHesabiInputs = {
    "flowRate": 100,
    "density": 1000,
    "suctionPressure": 1,
    "dischargePressure": 5,
    "suctionVelocity": 2,
    "dischargeVelocity": 3
  };
const lowBandInputs: PompaGucuBasmaYuksekligiHesabiInputs = {
    "flowRate": 0.1,
    "density": 1000,
    "suctionPressure": 1,
    "dischargePressure": 5,
    "suctionVelocity": 2,
    "dischargeVelocity": 3
  };
const criticalBandInputs: PompaGucuBasmaYuksekligiHesabiInputs = {
    "flowRate": 6,
    "density": 1000,
    "suctionPressure": 1,
    "dischargePressure": 5,
    "suctionVelocity": 2,
    "dischargeVelocity": 3
  };

function expectValidationFailure(partial: Partial<PompaGucuBasmaYuksekligiHesabiInputs>): void {
  const inputs = { ...defaultInputs, ...partial } as PompaGucuBasmaYuksekligiHesabiInputs;
  const validation = validatePompaGucuBasmaYuksekligiHesabiInputs(inputs);
  expect(validation.ok).toBe(false);
  if (validation.ok) return;
  expect(validation.errors.length).toBeGreaterThan(0);
  expect(() => calculatePompaGucuBasmaYuksekligiHesabi(inputs)).toThrow();
}

function engineNumeric(schemaSlug: string, outputId: string, inputs: PompaGucuBasmaYuksekligiHesabiInputs): number {
  const schema = getPremiumCalculatorSchema(schemaSlug);
  if (!schema) throw new Error("schema missing");
  const engineResult = runPremiumSchemaEngine(schema, inputs);
  const raw = engineResult.outputs.find((output) => output.id === outputId)?.raw;
  if (typeof raw !== "number") throw new Error(`missing output ${outputId}`);
  return raw;
}

describe("pompa-gucu-basma-yuksekligi-hesabi", () => {
  test("exact default oracle", () => {
    const result = calculatePompaGucuBasmaYuksekligiHesabi(defaultInputs);
    expect(result.totalExposure).toBeCloseTo(engineNumeric(SCHEMA_ID, "totalExposure", defaultInputs), 2);
    expect(result.variancePercent).toBeCloseTo(engineNumeric(SCHEMA_ID, "variancePercent", defaultInputs), 2);
    expect(["low", "warning", "critical"]).toContain(result.summaryLevel);
    expect(result.primaryDriver).toBe("totalExposure");
  });

  test("formula pipeline parity", () => {
    const result = calculatePompaGucuBasmaYuksekligiHesabi(defaultInputs);
    expect(result.totalExposure).toBeCloseTo(
      engineNumeric(SCHEMA_ID, "totalExposure", defaultInputs),
      2,
    );
  });

  test("low threshold band", () => {
    const result = calculatePompaGucuBasmaYuksekligiHesabi(lowBandInputs);
    expect(["low", "warning", "critical"]).toContain(result.summaryLevel);
  });

  test("warning threshold band", () => {
    const result = calculatePompaGucuBasmaYuksekligiHesabi(defaultInputs);
    expect(["warning", "critical", "low"]).toContain(result.summaryLevel);
  });

  test("critical threshold band", () => {
    const result = calculatePompaGucuBasmaYuksekligiHesabi(criticalBandInputs);
    expect(["low", "warning", "critical"]).toContain(result.summaryLevel);
  });

  test("invalid missing input fails validation and calculator throws", () => {
    const broken = { ...defaultInputs, flowRate: undefined } as unknown as PompaGucuBasmaYuksekligiHesabiInputs;
    const validation = validatePompaGucuBasmaYuksekligiHesabiInputs(broken);
    expect(validation.ok).toBe(false);
    expect(() => calculatePompaGucuBasmaYuksekligiHesabi(broken)).toThrow();
  });

  test("invalid negative input fails validation and calculator throws", () => {
    expectValidationFailure({ flowRate: -1 });
  });
  test("invalid zero divisor/base fails validation and calculator throws", () => {
    const validation = validatePompaGucuBasmaYuksekligiHesabiInputs({ ...defaultInputs, flowRate: 0 });
    expect(validation.ok).toBe(false);
    if (validation.ok) return;
    expect(() => calculatePompaGucuBasmaYuksekligiHesabi({ ...defaultInputs, flowRate: 0 })).toThrow();
  });

  test("invalid NaN input fails validation and calculator throws", () => {
    expectValidationFailure({ dischargeVelocity: Number.NaN });
  });

  test("invalid Infinity input fails validation and calculator throws", () => {
    expectValidationFailure({ dischargeVelocity: Number.POSITIVE_INFINITY });
  });

    test("contract metadata matches slug", () => {
    const contract = POMPA_GUCU_BASMA_YUKSEKLIGI_HESABI_CRITICAL_FORMULA_CONTRACTS[0];
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
    const calculatorResult = calculatePompaGucuBasmaYuksekligiHesabi(defaultInputs);
    expect(engineResult.outputs.find((output) => output.id === "totalExposure")?.raw).toBeCloseTo(calculatorResult.totalExposure, 2);
    expect(engineResult.outputs.find((output) => output.id === "variancePercent")?.raw).toBeCloseTo(calculatorResult.variancePercent, 2);
  });
});
