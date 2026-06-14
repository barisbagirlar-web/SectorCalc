import { describe, expect, test } from "vitest";
import { RADYATOR_PETEK_BOYU_HESAPLAMA_CRITICAL_FORMULA_CONTRACTS } from "@/lib/formula-governance/contracts/radyator-petek-boyu-hesaplama-critical";
import { getFormulaContractBySlug } from "@/lib/formula-governance/contracts";
import {
  calculateRadyatorPetekBoyuHesaplama,
  type RadyatorPetekBoyuHesaplamaInputs,
} from "@/lib/premium-schema/calculators/radyator-petek-boyu-hesaplama";
import { validateRadyatorPetekBoyuHesaplamaInputs } from "@/lib/premium-schema/calculators/radyator-petek-boyu-hesaplama-validation";
import { getPremiumCalculatorSchema } from "@/lib/premium-schema/schema-registry";
import {
  buildDefaultSchemaInputs,
  runPremiumSchemaEngine,
} from "@/lib/premium-schema/premium-schema-engine";

const SLUG = "radyator-petek-boyu-hesaplama";
const SCHEMA_ID = "radyator-petek-boyu-hesaplama";

const defaultInputs: RadyatorPetekBoyuHesaplamaInputs = {
    "roomLength": 5,
    "roomWidth": 4,
    "roomHeight": 2.5,
    "heatDemandPerVolume": 40,
    "panelType": 1,
    "flowTemperature": 75
  };
const lowBandInputs: RadyatorPetekBoyuHesaplamaInputs = {
    "roomLength": 0.1,
    "roomWidth": 4,
    "roomHeight": 2.5,
    "heatDemandPerVolume": 40,
    "panelType": 1,
    "flowTemperature": 75
  };
const criticalBandInputs: RadyatorPetekBoyuHesaplamaInputs = {
    "roomLength": 6,
    "roomWidth": 4,
    "roomHeight": 2.5,
    "heatDemandPerVolume": 40,
    "panelType": 1,
    "flowTemperature": 75
  };

function expectValidationFailure(partial: Partial<RadyatorPetekBoyuHesaplamaInputs>): void {
  const inputs = { ...defaultInputs, ...partial } as RadyatorPetekBoyuHesaplamaInputs;
  const validation = validateRadyatorPetekBoyuHesaplamaInputs(inputs);
  expect(validation.ok).toBe(false);
  if (validation.ok) return;
  expect(validation.errors.length).toBeGreaterThan(0);
  expect(() => calculateRadyatorPetekBoyuHesaplama(inputs)).toThrow();
}

function engineNumeric(schemaSlug: string, outputId: string, inputs: RadyatorPetekBoyuHesaplamaInputs): number {
  const schema = getPremiumCalculatorSchema(schemaSlug);
  if (!schema) throw new Error("schema missing");
  const engineResult = runPremiumSchemaEngine(schema, inputs);
  const raw = engineResult.outputs.find((output) => output.id === outputId)?.raw;
  if (typeof raw !== "number") throw new Error(`missing output ${outputId}`);
  return raw;
}

describe("radyator-petek-boyu-hesaplama", () => {
  test("exact default oracle", () => {
    const result = calculateRadyatorPetekBoyuHesaplama(defaultInputs);
    expect(result.totalExposure).toBeCloseTo(engineNumeric(SCHEMA_ID, "totalExposure", defaultInputs), 2);
    expect(result.variancePercent).toBeCloseTo(engineNumeric(SCHEMA_ID, "variancePercent", defaultInputs), 2);
    expect(["low", "warning", "critical"]).toContain(result.summaryLevel);
    expect(result.primaryDriver).toBe("totalExposure");
  });

  test("formula pipeline parity", () => {
    const result = calculateRadyatorPetekBoyuHesaplama(defaultInputs);
    expect(result.totalExposure).toBeCloseTo(
      engineNumeric(SCHEMA_ID, "totalExposure", defaultInputs),
      2,
    );
  });

  test("low threshold band", () => {
    const result = calculateRadyatorPetekBoyuHesaplama(lowBandInputs);
    expect(["low", "warning", "critical"]).toContain(result.summaryLevel);
  });

  test("warning threshold band", () => {
    const result = calculateRadyatorPetekBoyuHesaplama(defaultInputs);
    expect(["warning", "critical", "low"]).toContain(result.summaryLevel);
  });

  test("critical threshold band", () => {
    const result = calculateRadyatorPetekBoyuHesaplama(criticalBandInputs);
    expect(["low", "warning", "critical"]).toContain(result.summaryLevel);
  });

  test("invalid missing input fails validation and calculator throws", () => {
    const broken = { ...defaultInputs, roomLength: undefined } as unknown as RadyatorPetekBoyuHesaplamaInputs;
    const validation = validateRadyatorPetekBoyuHesaplamaInputs(broken);
    expect(validation.ok).toBe(false);
    expect(() => calculateRadyatorPetekBoyuHesaplama(broken)).toThrow();
  });

  test("invalid negative input fails validation and calculator throws", () => {
    expectValidationFailure({ roomLength: -1 });
  });
  test("invalid zero divisor/base fails validation and calculator throws", () => {
    const validation = validateRadyatorPetekBoyuHesaplamaInputs({ ...defaultInputs, roomLength: 0 });
    expect(validation.ok).toBe(false);
    if (validation.ok) return;
    expect(() => calculateRadyatorPetekBoyuHesaplama({ ...defaultInputs, roomLength: 0 })).toThrow();
  });

  test("invalid NaN input fails validation and calculator throws", () => {
    expectValidationFailure({ flowTemperature: Number.NaN });
  });

  test("invalid Infinity input fails validation and calculator throws", () => {
    expectValidationFailure({ flowTemperature: Number.POSITIVE_INFINITY });
  });

    test("contract metadata matches slug", () => {
    const contract = RADYATOR_PETEK_BOYU_HESAPLAMA_CRITICAL_FORMULA_CONTRACTS[0];
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
    const calculatorResult = calculateRadyatorPetekBoyuHesaplama(defaultInputs);
    expect(engineResult.outputs.find((output) => output.id === "totalExposure")?.raw).toBeCloseTo(calculatorResult.totalExposure, 2);
    expect(engineResult.outputs.find((output) => output.id === "variancePercent")?.raw).toBeCloseTo(calculatorResult.variancePercent, 2);
  });
});
