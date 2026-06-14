import { describe, expect, test } from "vitest";
import { LASTIK_OMRU_DEGISIM_KM_HESAPLAMA_CRITICAL_FORMULA_CONTRACTS } from "@/lib/formula-governance/contracts/lastik-omru-degisim-km-hesaplama-critical";
import { getFormulaContractBySlug } from "@/lib/formula-governance/contracts";
import {
  calculateLastikOmruDegisimKmHesaplama,
  type LastikOmruDegisimKmHesaplamaInputs,
} from "@/lib/premium-schema/calculators/lastik-omru-degisim-km-hesaplama";
import { validateLastikOmruDegisimKmHesaplamaInputs } from "@/lib/premium-schema/calculators/lastik-omru-degisim-km-hesaplama-validation";
import { getPremiumCalculatorSchema } from "@/lib/premium-schema/schema-registry";
import {
  buildDefaultSchemaInputs,
  runPremiumSchemaEngine,
} from "@/lib/premium-schema/premium-schema-engine";

const SLUG = "lastik-omru-degisim-km-hesaplama";
const SCHEMA_ID = "lastik-omru-degisim-km-hesaplama";

const defaultInputs: LastikOmruDegisimKmHesaplamaInputs = {
    "initialTreadDepth": 8,
    "currentTreadDepth": 5,
    "replacementThreshold": 1.6,
    "wearRatePer10kKm": 1,
    "loadFactor": 1,
    "roadConditionFactor": 1
  };
const lowBandInputs: LastikOmruDegisimKmHesaplamaInputs = {
    "initialTreadDepth": 1,
    "currentTreadDepth": 5,
    "replacementThreshold": 1.6,
    "wearRatePer10kKm": 1,
    "loadFactor": 1,
    "roadConditionFactor": 1
  };
const criticalBandInputs: LastikOmruDegisimKmHesaplamaInputs = {
    "initialTreadDepth": 6,
    "currentTreadDepth": 5,
    "replacementThreshold": 1.6,
    "wearRatePer10kKm": 1,
    "loadFactor": 1,
    "roadConditionFactor": 1
  };

function expectValidationFailure(partial: Partial<LastikOmruDegisimKmHesaplamaInputs>): void {
  const inputs = { ...defaultInputs, ...partial } as LastikOmruDegisimKmHesaplamaInputs;
  const validation = validateLastikOmruDegisimKmHesaplamaInputs(inputs);
  expect(validation.ok).toBe(false);
  if (validation.ok) return;
  expect(validation.errors.length).toBeGreaterThan(0);
  expect(() => calculateLastikOmruDegisimKmHesaplama(inputs)).toThrow();
}

function engineNumeric(schemaSlug: string, outputId: string, inputs: LastikOmruDegisimKmHesaplamaInputs): number {
  const schema = getPremiumCalculatorSchema(schemaSlug);
  if (!schema) throw new Error("schema missing");
  const engineResult = runPremiumSchemaEngine(schema, inputs);
  const raw = engineResult.outputs.find((output) => output.id === outputId)?.raw;
  if (typeof raw !== "number") throw new Error(`missing output ${outputId}`);
  return raw;
}

describe("lastik-omru-degisim-km-hesaplama", () => {
  test("exact default oracle", () => {
    const result = calculateLastikOmruDegisimKmHesaplama(defaultInputs);
    expect(result.totalExposure).toBeCloseTo(engineNumeric(SCHEMA_ID, "totalExposure", defaultInputs), 2);
    expect(result.variancePercent).toBeCloseTo(engineNumeric(SCHEMA_ID, "variancePercent", defaultInputs), 2);
    expect(["low", "warning", "critical"]).toContain(result.summaryLevel);
    expect(result.primaryDriver).toBe("totalExposure");
  });

  test("formula pipeline parity", () => {
    const result = calculateLastikOmruDegisimKmHesaplama(defaultInputs);
    expect(result.totalExposure).toBeCloseTo(
      engineNumeric(SCHEMA_ID, "totalExposure", defaultInputs),
      2,
    );
  });

  test("low threshold band", () => {
    const result = calculateLastikOmruDegisimKmHesaplama(lowBandInputs);
    expect(["low", "warning", "critical"]).toContain(result.summaryLevel);
  });

  test("warning threshold band", () => {
    const result = calculateLastikOmruDegisimKmHesaplama(defaultInputs);
    expect(["warning", "critical", "low"]).toContain(result.summaryLevel);
  });

  test("critical threshold band", () => {
    const result = calculateLastikOmruDegisimKmHesaplama(criticalBandInputs);
    expect(["low", "warning", "critical"]).toContain(result.summaryLevel);
  });

  test("invalid missing input fails validation and calculator throws", () => {
    const broken = { ...defaultInputs, initialTreadDepth: undefined } as unknown as LastikOmruDegisimKmHesaplamaInputs;
    const validation = validateLastikOmruDegisimKmHesaplamaInputs(broken);
    expect(validation.ok).toBe(false);
    expect(() => calculateLastikOmruDegisimKmHesaplama(broken)).toThrow();
  });

  test("invalid negative input fails validation and calculator throws", () => {
    expectValidationFailure({ initialTreadDepth: -1 });
  });
  test("invalid zero divisor/base fails validation and calculator throws", () => {
    const validation = validateLastikOmruDegisimKmHesaplamaInputs({ ...defaultInputs, initialTreadDepth: 0 });
    expect(validation.ok).toBe(false);
    if (validation.ok) return;
    expect(() => calculateLastikOmruDegisimKmHesaplama({ ...defaultInputs, initialTreadDepth: 0 })).toThrow();
  });

  test("invalid NaN input fails validation and calculator throws", () => {
    expectValidationFailure({ roadConditionFactor: Number.NaN });
  });

  test("invalid Infinity input fails validation and calculator throws", () => {
    expectValidationFailure({ roadConditionFactor: Number.POSITIVE_INFINITY });
  });

    test("contract metadata matches slug", () => {
    const contract = LASTIK_OMRU_DEGISIM_KM_HESAPLAMA_CRITICAL_FORMULA_CONTRACTS[0];
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
    const calculatorResult = calculateLastikOmruDegisimKmHesaplama(defaultInputs);
    expect(engineResult.outputs.find((output) => output.id === "totalExposure")?.raw).toBeCloseTo(calculatorResult.totalExposure, 2);
    expect(engineResult.outputs.find((output) => output.id === "variancePercent")?.raw).toBeCloseTo(calculatorResult.variancePercent, 2);
  });
});
