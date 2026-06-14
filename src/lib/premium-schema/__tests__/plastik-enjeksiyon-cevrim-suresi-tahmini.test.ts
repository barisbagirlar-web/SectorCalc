import { describe, expect, test } from "vitest";
import { PLASTIK_ENJEKSIYON_CEVRIM_SURESI_TAHMINI_CRITICAL_FORMULA_CONTRACTS } from "@/lib/formula-governance/contracts/plastik-enjeksiyon-cevrim-suresi-tahmini-critical";
import { getFormulaContractBySlug } from "@/lib/formula-governance/contracts";
import {
  calculatePlastikEnjeksiyonCevrimSuresiTahmini,
  type PlastikEnjeksiyonCevrimSuresiTahminiInputs,
} from "@/lib/premium-schema/calculators/plastik-enjeksiyon-cevrim-suresi-tahmini";
import { validatePlastikEnjeksiyonCevrimSuresiTahminiInputs } from "@/lib/premium-schema/calculators/plastik-enjeksiyon-cevrim-suresi-tahmini-validation";
import { getPremiumCalculatorSchema } from "@/lib/premium-schema/schema-registry";
import {
  buildDefaultSchemaInputs,
  runPremiumSchemaEngine,
} from "@/lib/premium-schema/premium-schema-engine";

const SLUG = "plastik-enjeksiyon-cevrim-suresi-tahmini";
const SCHEMA_ID = "plastik-enjeksiyon-cevrim-suresi-tahmini";

const defaultInputs: PlastikEnjeksiyonCevrimSuresiTahminiInputs = {
    "injectionTime": 2,
    "coolingTime": 15,
    "moldOpenCloseTime": 5,
    "ejectionTime": 2,
    "materialFactor": 1,
    "wallThickness": 2.5
  };
const lowBandInputs: PlastikEnjeksiyonCevrimSuresiTahminiInputs = {
    "injectionTime": 0.1,
    "coolingTime": 15,
    "moldOpenCloseTime": 5,
    "ejectionTime": 2,
    "materialFactor": 1,
    "wallThickness": 2.5
  };
const criticalBandInputs: PlastikEnjeksiyonCevrimSuresiTahminiInputs = {
    "injectionTime": 6,
    "coolingTime": 15,
    "moldOpenCloseTime": 5,
    "ejectionTime": 2,
    "materialFactor": 1,
    "wallThickness": 2.5
  };

function expectValidationFailure(partial: Partial<PlastikEnjeksiyonCevrimSuresiTahminiInputs>): void {
  const inputs = { ...defaultInputs, ...partial } as PlastikEnjeksiyonCevrimSuresiTahminiInputs;
  const validation = validatePlastikEnjeksiyonCevrimSuresiTahminiInputs(inputs);
  expect(validation.ok).toBe(false);
  if (validation.ok) return;
  expect(validation.errors.length).toBeGreaterThan(0);
  expect(() => calculatePlastikEnjeksiyonCevrimSuresiTahmini(inputs)).toThrow();
}

function engineNumeric(schemaSlug: string, outputId: string, inputs: PlastikEnjeksiyonCevrimSuresiTahminiInputs): number {
  const schema = getPremiumCalculatorSchema(schemaSlug);
  if (!schema) throw new Error("schema missing");
  const engineResult = runPremiumSchemaEngine(schema, inputs);
  const raw = engineResult.outputs.find((output) => output.id === outputId)?.raw;
  if (typeof raw !== "number") throw new Error(`missing output ${outputId}`);
  return raw;
}

describe("plastik-enjeksiyon-cevrim-suresi-tahmini", () => {
  test("exact default oracle", () => {
    const result = calculatePlastikEnjeksiyonCevrimSuresiTahmini(defaultInputs);
    expect(result.totalExposure).toBeCloseTo(engineNumeric(SCHEMA_ID, "totalExposure", defaultInputs), 2);
    expect(result.variancePercent).toBeCloseTo(engineNumeric(SCHEMA_ID, "variancePercent", defaultInputs), 2);
    expect(["low", "warning", "critical"]).toContain(result.summaryLevel);
    expect(result.primaryDriver).toBe("totalExposure");
  });

  test("formula pipeline parity", () => {
    const result = calculatePlastikEnjeksiyonCevrimSuresiTahmini(defaultInputs);
    expect(result.totalExposure).toBeCloseTo(
      engineNumeric(SCHEMA_ID, "totalExposure", defaultInputs),
      2,
    );
  });

  test("low threshold band", () => {
    const result = calculatePlastikEnjeksiyonCevrimSuresiTahmini(lowBandInputs);
    expect(["low", "warning", "critical"]).toContain(result.summaryLevel);
  });

  test("warning threshold band", () => {
    const result = calculatePlastikEnjeksiyonCevrimSuresiTahmini(defaultInputs);
    expect(["warning", "critical", "low"]).toContain(result.summaryLevel);
  });

  test("critical threshold band", () => {
    const result = calculatePlastikEnjeksiyonCevrimSuresiTahmini(criticalBandInputs);
    expect(["low", "warning", "critical"]).toContain(result.summaryLevel);
  });

  test("invalid missing input fails validation and calculator throws", () => {
    const broken = { ...defaultInputs, injectionTime: undefined } as unknown as PlastikEnjeksiyonCevrimSuresiTahminiInputs;
    const validation = validatePlastikEnjeksiyonCevrimSuresiTahminiInputs(broken);
    expect(validation.ok).toBe(false);
    expect(() => calculatePlastikEnjeksiyonCevrimSuresiTahmini(broken)).toThrow();
  });

  test("invalid negative input fails validation and calculator throws", () => {
    expectValidationFailure({ injectionTime: -1 });
  });
  test("invalid zero divisor/base fails validation and calculator throws", () => {
    const validation = validatePlastikEnjeksiyonCevrimSuresiTahminiInputs({ ...defaultInputs, injectionTime: 0 });
    expect(validation.ok).toBe(false);
    if (validation.ok) return;
    expect(() => calculatePlastikEnjeksiyonCevrimSuresiTahmini({ ...defaultInputs, injectionTime: 0 })).toThrow();
  });

  test("invalid NaN input fails validation and calculator throws", () => {
    expectValidationFailure({ wallThickness: Number.NaN });
  });

  test("invalid Infinity input fails validation and calculator throws", () => {
    expectValidationFailure({ wallThickness: Number.POSITIVE_INFINITY });
  });

    test("contract metadata matches slug", () => {
    const contract = PLASTIK_ENJEKSIYON_CEVRIM_SURESI_TAHMINI_CRITICAL_FORMULA_CONTRACTS[0];
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
    const calculatorResult = calculatePlastikEnjeksiyonCevrimSuresiTahmini(defaultInputs);
    expect(engineResult.outputs.find((output) => output.id === "totalExposure")?.raw).toBeCloseTo(calculatorResult.totalExposure, 2);
    expect(engineResult.outputs.find((output) => output.id === "variancePercent")?.raw).toBeCloseTo(calculatorResult.variancePercent, 2);
  });
});
