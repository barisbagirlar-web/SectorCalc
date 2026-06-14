import { describe, expect, test } from "vitest";
import { NPU_NPI_PROFIL_AGIRLIK_HESAPLAMA_CRITICAL_FORMULA_CONTRACTS } from "@/lib/formula-governance/contracts/npu-npi-profil-agirlik-hesaplama-critical";
import { getFormulaContractBySlug } from "@/lib/formula-governance/contracts";
import {
  calculateNpuNpiProfilAgirlikHesaplama,
  type NpuNpiProfilAgirlikHesaplamaInputs,
} from "@/lib/premium-schema/calculators/npu-npi-profil-agirlik-hesaplama";
import { validateNpuNpiProfilAgirlikHesaplamaInputs } from "@/lib/premium-schema/calculators/npu-npi-profil-agirlik-hesaplama-validation";
import { getPremiumCalculatorSchema } from "@/lib/premium-schema/schema-registry";
import {
  buildDefaultSchemaInputs,
  runPremiumSchemaEngine,
} from "@/lib/premium-schema/premium-schema-engine";

const SLUG = "npu-npi-profil-agirlik-hesaplama";
const SCHEMA_ID = "npu-npi-profil-agirlik-hesaplama";

const defaultInputs: NpuNpiProfilAgirlikHesaplamaInputs = {
    "profileHeight": 200,
    "flangeWidth": 100,
    "webThickness": 8,
    "flangeThickness": 10,
    "profileLength": 6,
    "nominalWeightPerMeter": 25
  };
const lowBandInputs: NpuNpiProfilAgirlikHesaplamaInputs = {
    "profileHeight": 50,
    "flangeWidth": 100,
    "webThickness": 8,
    "flangeThickness": 10,
    "profileLength": 6,
    "nominalWeightPerMeter": 25
  };
const criticalBandInputs: NpuNpiProfilAgirlikHesaplamaInputs = {
    "profileHeight": 50,
    "flangeWidth": 100,
    "webThickness": 8,
    "flangeThickness": 10,
    "profileLength": 6,
    "nominalWeightPerMeter": 25
  };

function expectValidationFailure(partial: Partial<NpuNpiProfilAgirlikHesaplamaInputs>): void {
  const inputs = { ...defaultInputs, ...partial } as NpuNpiProfilAgirlikHesaplamaInputs;
  const validation = validateNpuNpiProfilAgirlikHesaplamaInputs(inputs);
  expect(validation.ok).toBe(false);
  if (validation.ok) return;
  expect(validation.errors.length).toBeGreaterThan(0);
  expect(() => calculateNpuNpiProfilAgirlikHesaplama(inputs)).toThrow();
}

function engineNumeric(schemaSlug: string, outputId: string, inputs: NpuNpiProfilAgirlikHesaplamaInputs): number {
  const schema = getPremiumCalculatorSchema(schemaSlug);
  if (!schema) throw new Error("schema missing");
  const engineResult = runPremiumSchemaEngine(schema, inputs);
  const raw = engineResult.outputs.find((output) => output.id === outputId)?.raw;
  if (typeof raw !== "number") throw new Error(`missing output ${outputId}`);
  return raw;
}

describe("npu-npi-profil-agirlik-hesaplama", () => {
  test("exact default oracle", () => {
    const result = calculateNpuNpiProfilAgirlikHesaplama(defaultInputs);
    expect(result.totalExposure).toBeCloseTo(engineNumeric(SCHEMA_ID, "totalExposure", defaultInputs), 2);
    expect(result.variancePercent).toBeCloseTo(engineNumeric(SCHEMA_ID, "variancePercent", defaultInputs), 2);
    expect(["low", "warning", "critical"]).toContain(result.summaryLevel);
    expect(result.primaryDriver).toBe("totalExposure");
  });

  test("formula pipeline parity", () => {
    const result = calculateNpuNpiProfilAgirlikHesaplama(defaultInputs);
    expect(result.totalExposure).toBeCloseTo(
      engineNumeric(SCHEMA_ID, "totalExposure", defaultInputs),
      2,
    );
  });

  test("low threshold band", () => {
    const result = calculateNpuNpiProfilAgirlikHesaplama(lowBandInputs);
    expect(["low", "warning", "critical"]).toContain(result.summaryLevel);
  });

  test("warning threshold band", () => {
    const result = calculateNpuNpiProfilAgirlikHesaplama(defaultInputs);
    expect(["warning", "critical", "low"]).toContain(result.summaryLevel);
  });

  test("critical threshold band", () => {
    const result = calculateNpuNpiProfilAgirlikHesaplama(criticalBandInputs);
    expect(["low", "warning", "critical"]).toContain(result.summaryLevel);
  });

  test("invalid missing input fails validation and calculator throws", () => {
    const broken = { ...defaultInputs, profileHeight: undefined } as unknown as NpuNpiProfilAgirlikHesaplamaInputs;
    const validation = validateNpuNpiProfilAgirlikHesaplamaInputs(broken);
    expect(validation.ok).toBe(false);
    expect(() => calculateNpuNpiProfilAgirlikHesaplama(broken)).toThrow();
  });

  test("invalid negative input fails validation and calculator throws", () => {
    expectValidationFailure({ profileHeight: -1 });
  });
  test("invalid zero divisor/base fails validation and calculator throws", () => {
    const validation = validateNpuNpiProfilAgirlikHesaplamaInputs({ ...defaultInputs, profileHeight: 0 });
    expect(validation.ok).toBe(false);
    if (validation.ok) return;
    expect(() => calculateNpuNpiProfilAgirlikHesaplama({ ...defaultInputs, profileHeight: 0 })).toThrow();
  });

  test("invalid NaN input fails validation and calculator throws", () => {
    expectValidationFailure({ nominalWeightPerMeter: Number.NaN });
  });

  test("invalid Infinity input fails validation and calculator throws", () => {
    expectValidationFailure({ nominalWeightPerMeter: Number.POSITIVE_INFINITY });
  });

    test("contract metadata matches slug", () => {
    const contract = NPU_NPI_PROFIL_AGIRLIK_HESAPLAMA_CRITICAL_FORMULA_CONTRACTS[0];
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
    const calculatorResult = calculateNpuNpiProfilAgirlikHesaplama(defaultInputs);
    expect(engineResult.outputs.find((output) => output.id === "totalExposure")?.raw).toBeCloseTo(calculatorResult.totalExposure, 2);
    expect(engineResult.outputs.find((output) => output.id === "variancePercent")?.raw).toBeCloseTo(calculatorResult.variancePercent, 2);
  });
});
