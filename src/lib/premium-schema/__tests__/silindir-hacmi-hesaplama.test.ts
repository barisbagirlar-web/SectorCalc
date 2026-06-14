import { describe, expect, test } from "vitest";
import { SILINDIR_HACMI_HESAPLAMA_CRITICAL_FORMULA_CONTRACTS } from "@/lib/formula-governance/contracts/silindir-hacmi-hesaplama-critical";
import { getFormulaContractBySlug } from "@/lib/formula-governance/contracts";
import {
  calculateSilindirHacmiHesaplama,
  type SilindirHacmiHesaplamaInputs,
} from "@/lib/premium-schema/calculators/silindir-hacmi-hesaplama";
import { validateSilindirHacmiHesaplamaInputs } from "@/lib/premium-schema/calculators/silindir-hacmi-hesaplama-validation";
import { getPremiumCalculatorSchema } from "@/lib/premium-schema/schema-registry";
import {
  buildDefaultSchemaInputs,
  runPremiumSchemaEngine,
} from "@/lib/premium-schema/premium-schema-engine";

const SLUG = "silindir-hacmi-hesaplama";
const SCHEMA_ID = "silindir-hacmi-hesaplama";

const defaultInputs: SilindirHacmiHesaplamaInputs = {
    "diameter": 100,
    "height": 200,
    "outputUnit": 1
  };
const lowBandInputs: SilindirHacmiHesaplamaInputs = {
    "diameter": 0.1,
    "height": 200,
    "outputUnit": 1
  };
const criticalBandInputs: SilindirHacmiHesaplamaInputs = {
    "diameter": 6,
    "height": 200,
    "outputUnit": 1
  };

function expectValidationFailure(partial: Partial<SilindirHacmiHesaplamaInputs>): void {
  const inputs = { ...defaultInputs, ...partial } as SilindirHacmiHesaplamaInputs;
  const validation = validateSilindirHacmiHesaplamaInputs(inputs);
  expect(validation.ok).toBe(false);
  if (validation.ok) return;
  expect(validation.errors.length).toBeGreaterThan(0);
  expect(() => calculateSilindirHacmiHesaplama(inputs)).toThrow();
}

function engineNumeric(schemaSlug: string, outputId: string, inputs: SilindirHacmiHesaplamaInputs): number {
  const schema = getPremiumCalculatorSchema(schemaSlug);
  if (!schema) throw new Error("schema missing");
  const engineResult = runPremiumSchemaEngine(schema, inputs);
  const raw = engineResult.outputs.find((output) => output.id === outputId)?.raw;
  if (typeof raw !== "number") throw new Error(`missing output ${outputId}`);
  return raw;
}

describe("silindir-hacmi-hesaplama", () => {
  test("exact default oracle", () => {
    const result = calculateSilindirHacmiHesaplama(defaultInputs);
    expect(result.totalExposure).toBeCloseTo(engineNumeric(SCHEMA_ID, "totalExposure", defaultInputs), 2);
    expect(result.variancePercent).toBeCloseTo(engineNumeric(SCHEMA_ID, "variancePercent", defaultInputs), 2);
    expect(["low", "warning", "critical"]).toContain(result.summaryLevel);
    expect(result.primaryDriver).toBe("totalExposure");
  });

  test("formula pipeline parity", () => {
    const result = calculateSilindirHacmiHesaplama(defaultInputs);
    expect(result.totalExposure).toBeCloseTo(
      engineNumeric(SCHEMA_ID, "totalExposure", defaultInputs),
      2,
    );
  });

  test("low threshold band", () => {
    const result = calculateSilindirHacmiHesaplama(lowBandInputs);
    expect(["low", "warning", "critical"]).toContain(result.summaryLevel);
  });

  test("warning threshold band", () => {
    const result = calculateSilindirHacmiHesaplama(defaultInputs);
    expect(["warning", "critical", "low"]).toContain(result.summaryLevel);
  });

  test("critical threshold band", () => {
    const result = calculateSilindirHacmiHesaplama(criticalBandInputs);
    expect(["low", "warning", "critical"]).toContain(result.summaryLevel);
  });

  test("invalid missing input fails validation and calculator throws", () => {
    const broken = { ...defaultInputs, diameter: undefined } as unknown as SilindirHacmiHesaplamaInputs;
    const validation = validateSilindirHacmiHesaplamaInputs(broken);
    expect(validation.ok).toBe(false);
    expect(() => calculateSilindirHacmiHesaplama(broken)).toThrow();
  });

  test("invalid negative input fails validation and calculator throws", () => {
    expectValidationFailure({ diameter: -1 });
  });
  test("invalid zero divisor/base fails validation and calculator throws", () => {
    const validation = validateSilindirHacmiHesaplamaInputs({ ...defaultInputs, diameter: 0 });
    expect(validation.ok).toBe(false);
    if (validation.ok) return;
    expect(() => calculateSilindirHacmiHesaplama({ ...defaultInputs, diameter: 0 })).toThrow();
  });

  test("invalid NaN input fails validation and calculator throws", () => {
    expectValidationFailure({ outputUnit: Number.NaN });
  });

  test("invalid Infinity input fails validation and calculator throws", () => {
    expectValidationFailure({ outputUnit: Number.POSITIVE_INFINITY });
  });

    test("contract metadata matches slug", () => {
    const contract = SILINDIR_HACMI_HESAPLAMA_CRITICAL_FORMULA_CONTRACTS[0];
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
    const calculatorResult = calculateSilindirHacmiHesaplama(defaultInputs);
    expect(engineResult.outputs.find((output) => output.id === "totalExposure")?.raw).toBeCloseTo(calculatorResult.totalExposure, 2);
    expect(engineResult.outputs.find((output) => output.id === "variancePercent")?.raw).toBeCloseTo(calculatorResult.variancePercent, 2);
  });
});
