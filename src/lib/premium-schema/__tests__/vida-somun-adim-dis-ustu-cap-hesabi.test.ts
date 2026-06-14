import { describe, expect, test } from "vitest";
import { VIDA_SOMUN_ADIM_DIS_USTU_CAP_HESABI_CRITICAL_FORMULA_CONTRACTS } from "@/lib/formula-governance/contracts/vida-somun-adim-dis-ustu-cap-hesabi-critical";
import { getFormulaContractBySlug } from "@/lib/formula-governance/contracts";
import {
  calculateVidaSomunAdimDisUstuCapHesabi,
  type VidaSomunAdimDisUstuCapHesabiInputs,
} from "@/lib/premium-schema/calculators/vida-somun-adim-dis-ustu-cap-hesabi";
import { validateVidaSomunAdimDisUstuCapHesabiInputs } from "@/lib/premium-schema/calculators/vida-somun-adim-dis-ustu-cap-hesabi-validation";
import { getPremiumCalculatorSchema } from "@/lib/premium-schema/schema-registry";
import {
  buildDefaultSchemaInputs,
  runPremiumSchemaEngine,
} from "@/lib/premium-schema/premium-schema-engine";

const SLUG = "vida-somun-adim-dis-ustu-cap-hesabi";
const SCHEMA_ID = "vida-somun-adim-dis-ustu-cap-hesabi";

const defaultInputs: VidaSomunAdimDisUstuCapHesabiInputs = {
    "nominalDiameter": 10,
    "pitch": 1.5,
    "threadClass": 1
  };
const lowBandInputs: VidaSomunAdimDisUstuCapHesabiInputs = {
    "nominalDiameter": 1,
    "pitch": 1.5,
    "threadClass": 1
  };
const criticalBandInputs: VidaSomunAdimDisUstuCapHesabiInputs = {
    "nominalDiameter": 6,
    "pitch": 1.5,
    "threadClass": 1
  };

function expectValidationFailure(partial: Partial<VidaSomunAdimDisUstuCapHesabiInputs>): void {
  const inputs = { ...defaultInputs, ...partial } as VidaSomunAdimDisUstuCapHesabiInputs;
  const validation = validateVidaSomunAdimDisUstuCapHesabiInputs(inputs);
  expect(validation.ok).toBe(false);
  if (validation.ok) return;
  expect(validation.errors.length).toBeGreaterThan(0);
  expect(() => calculateVidaSomunAdimDisUstuCapHesabi(inputs)).toThrow();
}

function engineNumeric(schemaSlug: string, outputId: string, inputs: VidaSomunAdimDisUstuCapHesabiInputs): number {
  const schema = getPremiumCalculatorSchema(schemaSlug);
  if (!schema) throw new Error("schema missing");
  const engineResult = runPremiumSchemaEngine(schema, inputs);
  const raw = engineResult.outputs.find((output) => output.id === outputId)?.raw;
  if (typeof raw !== "number") throw new Error(`missing output ${outputId}`);
  return raw;
}

describe("vida-somun-adim-dis-ustu-cap-hesabi", () => {
  test("exact default oracle", () => {
    const result = calculateVidaSomunAdimDisUstuCapHesabi(defaultInputs);
    expect(result.totalExposure).toBeCloseTo(engineNumeric(SCHEMA_ID, "totalExposure", defaultInputs), 2);
    expect(result.variancePercent).toBeCloseTo(engineNumeric(SCHEMA_ID, "variancePercent", defaultInputs), 2);
    expect(["low", "warning", "critical"]).toContain(result.summaryLevel);
    expect(result.primaryDriver).toBe("totalExposure");
  });

  test("formula pipeline parity", () => {
    const result = calculateVidaSomunAdimDisUstuCapHesabi(defaultInputs);
    expect(result.totalExposure).toBeCloseTo(
      engineNumeric(SCHEMA_ID, "totalExposure", defaultInputs),
      2,
    );
  });

  test("low threshold band", () => {
    const result = calculateVidaSomunAdimDisUstuCapHesabi(lowBandInputs);
    expect(["low", "warning", "critical"]).toContain(result.summaryLevel);
  });

  test("warning threshold band", () => {
    const result = calculateVidaSomunAdimDisUstuCapHesabi(defaultInputs);
    expect(["warning", "critical", "low"]).toContain(result.summaryLevel);
  });

  test("critical threshold band", () => {
    const result = calculateVidaSomunAdimDisUstuCapHesabi(criticalBandInputs);
    expect(["low", "warning", "critical"]).toContain(result.summaryLevel);
  });

  test("invalid missing input fails validation and calculator throws", () => {
    const broken = { ...defaultInputs, nominalDiameter: undefined } as unknown as VidaSomunAdimDisUstuCapHesabiInputs;
    const validation = validateVidaSomunAdimDisUstuCapHesabiInputs(broken);
    expect(validation.ok).toBe(false);
    expect(() => calculateVidaSomunAdimDisUstuCapHesabi(broken)).toThrow();
  });

  test("invalid negative input fails validation and calculator throws", () => {
    expectValidationFailure({ nominalDiameter: -1 });
  });
  test("invalid zero divisor/base fails validation and calculator throws", () => {
    const validation = validateVidaSomunAdimDisUstuCapHesabiInputs({ ...defaultInputs, nominalDiameter: 0 });
    expect(validation.ok).toBe(false);
    if (validation.ok) return;
    expect(() => calculateVidaSomunAdimDisUstuCapHesabi({ ...defaultInputs, nominalDiameter: 0 })).toThrow();
  });

  test("invalid NaN input fails validation and calculator throws", () => {
    expectValidationFailure({ threadClass: Number.NaN });
  });

  test("invalid Infinity input fails validation and calculator throws", () => {
    expectValidationFailure({ threadClass: Number.POSITIVE_INFINITY });
  });

    test("contract metadata matches slug", () => {
    const contract = VIDA_SOMUN_ADIM_DIS_USTU_CAP_HESABI_CRITICAL_FORMULA_CONTRACTS[0];
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
    const calculatorResult = calculateVidaSomunAdimDisUstuCapHesabi(defaultInputs);
    expect(engineResult.outputs.find((output) => output.id === "totalExposure")?.raw).toBeCloseTo(calculatorResult.totalExposure, 2);
    expect(engineResult.outputs.find((output) => output.id === "variancePercent")?.raw).toBeCloseTo(calculatorResult.variancePercent, 2);
  });
});
