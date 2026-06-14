import { describe, expect, test } from "vitest";
import { MIL_AKS_CAPI_HESABI_EGILME_BURULMA_CRITICAL_FORMULA_CONTRACTS } from "@/lib/formula-governance/contracts/mil-aks-capi-hesabi-egilme-burulma-critical";
import { getFormulaContractBySlug } from "@/lib/formula-governance/contracts";
import {
  calculateMilAksCapiHesabiEgilmeBurulma,
  type MilAksCapiHesabiEgilmeBurulmaInputs,
} from "@/lib/premium-schema/calculators/mil-aks-capi-hesabi-egilme-burulma";
import { validateMilAksCapiHesabiEgilmeBurulmaInputs } from "@/lib/premium-schema/calculators/mil-aks-capi-hesabi-egilme-burulma-validation";
import { getPremiumCalculatorSchema } from "@/lib/premium-schema/schema-registry";
import {
  buildDefaultSchemaInputs,
  runPremiumSchemaEngine,
} from "@/lib/premium-schema/premium-schema-engine";

const SLUG = "mil-aks-capi-hesabi-egilme-burulma";
const SCHEMA_ID = "mil-aks-capi-hesabi-egilme-burulma";

const defaultInputs: MilAksCapiHesabiEgilmeBurulmaInputs = {
    "bendingMoment": 100000,
    "torsionMoment": 50000,
    "yieldStrength": 250,
    "safetyFactor": 2,
    "fatigueStressConcentrationFactor": 1.5,
    "hasKeyway": 1
  };
const lowBandInputs: MilAksCapiHesabiEgilmeBurulmaInputs = {
    "bendingMoment": 0.1,
    "torsionMoment": 50000,
    "yieldStrength": 250,
    "safetyFactor": 2,
    "fatigueStressConcentrationFactor": 1.5,
    "hasKeyway": 1
  };
const criticalBandInputs: MilAksCapiHesabiEgilmeBurulmaInputs = {
    "bendingMoment": 6,
    "torsionMoment": 50000,
    "yieldStrength": 250,
    "safetyFactor": 2,
    "fatigueStressConcentrationFactor": 1.5,
    "hasKeyway": 1
  };

function expectValidationFailure(partial: Partial<MilAksCapiHesabiEgilmeBurulmaInputs>): void {
  const inputs = { ...defaultInputs, ...partial } as MilAksCapiHesabiEgilmeBurulmaInputs;
  const validation = validateMilAksCapiHesabiEgilmeBurulmaInputs(inputs);
  expect(validation.ok).toBe(false);
  if (validation.ok) return;
  expect(validation.errors.length).toBeGreaterThan(0);
  expect(() => calculateMilAksCapiHesabiEgilmeBurulma(inputs)).toThrow();
}

function engineNumeric(schemaSlug: string, outputId: string, inputs: MilAksCapiHesabiEgilmeBurulmaInputs): number {
  const schema = getPremiumCalculatorSchema(schemaSlug);
  if (!schema) throw new Error("schema missing");
  const engineResult = runPremiumSchemaEngine(schema, inputs);
  const raw = engineResult.outputs.find((output) => output.id === outputId)?.raw;
  if (typeof raw !== "number") throw new Error(`missing output ${outputId}`);
  return raw;
}

describe("mil-aks-capi-hesabi-egilme-burulma", () => {
  test("exact default oracle", () => {
    const result = calculateMilAksCapiHesabiEgilmeBurulma(defaultInputs);
    expect(result.totalExposure).toBeCloseTo(engineNumeric(SCHEMA_ID, "totalExposure", defaultInputs), 2);
    expect(result.variancePercent).toBeCloseTo(engineNumeric(SCHEMA_ID, "variancePercent", defaultInputs), 2);
    expect(["low", "warning", "critical"]).toContain(result.summaryLevel);
    expect(result.primaryDriver).toBe("totalExposure");
  });

  test("formula pipeline parity", () => {
    const result = calculateMilAksCapiHesabiEgilmeBurulma(defaultInputs);
    expect(result.totalExposure).toBeCloseTo(
      engineNumeric(SCHEMA_ID, "totalExposure", defaultInputs),
      2,
    );
  });

  test("low threshold band", () => {
    const result = calculateMilAksCapiHesabiEgilmeBurulma(lowBandInputs);
    expect(["low", "warning", "critical"]).toContain(result.summaryLevel);
  });

  test("warning threshold band", () => {
    const result = calculateMilAksCapiHesabiEgilmeBurulma(defaultInputs);
    expect(["warning", "critical", "low"]).toContain(result.summaryLevel);
  });

  test("critical threshold band", () => {
    const result = calculateMilAksCapiHesabiEgilmeBurulma(criticalBandInputs);
    expect(["low", "warning", "critical"]).toContain(result.summaryLevel);
  });

  test("invalid missing input fails validation and calculator throws", () => {
    const broken = { ...defaultInputs, bendingMoment: undefined } as unknown as MilAksCapiHesabiEgilmeBurulmaInputs;
    const validation = validateMilAksCapiHesabiEgilmeBurulmaInputs(broken);
    expect(validation.ok).toBe(false);
    expect(() => calculateMilAksCapiHesabiEgilmeBurulma(broken)).toThrow();
  });

  test("invalid negative input fails validation and calculator throws", () => {
    expectValidationFailure({ bendingMoment: -1 });
  });
  test("invalid zero divisor/base fails validation and calculator throws", () => {
    const validation = validateMilAksCapiHesabiEgilmeBurulmaInputs({ ...defaultInputs, yieldStrength: 0 });
    expect(validation.ok).toBe(false);
    if (validation.ok) return;
    expect(() => calculateMilAksCapiHesabiEgilmeBurulma({ ...defaultInputs, yieldStrength: 0 })).toThrow();
  });

  test("invalid NaN input fails validation and calculator throws", () => {
    expectValidationFailure({ hasKeyway: Number.NaN });
  });

  test("invalid Infinity input fails validation and calculator throws", () => {
    expectValidationFailure({ hasKeyway: Number.POSITIVE_INFINITY });
  });

    test("contract metadata matches slug", () => {
    const contract = MIL_AKS_CAPI_HESABI_EGILME_BURULMA_CRITICAL_FORMULA_CONTRACTS[0];
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
    const calculatorResult = calculateMilAksCapiHesabiEgilmeBurulma(defaultInputs);
    expect(engineResult.outputs.find((output) => output.id === "totalExposure")?.raw).toBeCloseTo(calculatorResult.totalExposure, 2);
    expect(engineResult.outputs.find((output) => output.id === "variancePercent")?.raw).toBeCloseTo(calculatorResult.variancePercent, 2);
  });
});
