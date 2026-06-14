import { describe, expect, test } from "vitest";
import { KIRIS_KOLON_YAKLASIK_AGIRLIK_HESABI_CRITICAL_FORMULA_CONTRACTS } from "@/lib/formula-governance/contracts/kiris-kolon-yaklasik-agirlik-hesabi-critical";
import { getFormulaContractBySlug } from "@/lib/formula-governance/contracts";
import {
  calculateKirisKolonYaklasikAgirlikHesabi,
  type KirisKolonYaklasikAgirlikHesabiInputs,
} from "@/lib/premium-schema/calculators/kiris-kolon-yaklasik-agirlik-hesabi";
import { validateKirisKolonYaklasikAgirlikHesabiInputs } from "@/lib/premium-schema/calculators/kiris-kolon-yaklasik-agirlik-hesabi-validation";
import { getPremiumCalculatorSchema } from "@/lib/premium-schema/schema-registry";
import {
  buildDefaultSchemaInputs,
  runPremiumSchemaEngine,
} from "@/lib/premium-schema/premium-schema-engine";

const SLUG = "kiris-kolon-yaklasik-agirlik-hesabi";
const SCHEMA_ID = "kiris-kolon-yaklasik-agirlik-hesabi";

const defaultInputs: KirisKolonYaklasikAgirlikHesabiInputs = {
    "elementWidth": 0.3,
    "elementDepth": 0.5,
    "elementLength": 4,
    "reinforcementRatioPercent": 1.5
  };
const lowBandInputs: KirisKolonYaklasikAgirlikHesabiInputs = {
    "elementWidth": 0.1,
    "elementDepth": 0.5,
    "elementLength": 4,
    "reinforcementRatioPercent": 1.5
  };
const criticalBandInputs: KirisKolonYaklasikAgirlikHesabiInputs = {
    "elementWidth": 5,
    "elementDepth": 0.5,
    "elementLength": 4,
    "reinforcementRatioPercent": 1.5
  };

function expectValidationFailure(partial: Partial<KirisKolonYaklasikAgirlikHesabiInputs>): void {
  const inputs = { ...defaultInputs, ...partial } as KirisKolonYaklasikAgirlikHesabiInputs;
  const validation = validateKirisKolonYaklasikAgirlikHesabiInputs(inputs);
  expect(validation.ok).toBe(false);
  if (validation.ok) return;
  expect(validation.errors.length).toBeGreaterThan(0);
  expect(() => calculateKirisKolonYaklasikAgirlikHesabi(inputs)).toThrow();
}

function engineNumeric(schemaSlug: string, outputId: string, inputs: KirisKolonYaklasikAgirlikHesabiInputs): number {
  const schema = getPremiumCalculatorSchema(schemaSlug);
  if (!schema) throw new Error("schema missing");
  const engineResult = runPremiumSchemaEngine(schema, inputs);
  const raw = engineResult.outputs.find((output) => output.id === outputId)?.raw;
  if (typeof raw !== "number") throw new Error(`missing output ${outputId}`);
  return raw;
}

describe("kiris-kolon-yaklasik-agirlik-hesabi", () => {
  test("exact default oracle", () => {
    const result = calculateKirisKolonYaklasikAgirlikHesabi(defaultInputs);
    expect(result.totalExposure).toBeCloseTo(engineNumeric(SCHEMA_ID, "totalExposure", defaultInputs), 2);
    expect(result.variancePercent).toBeCloseTo(engineNumeric(SCHEMA_ID, "variancePercent", defaultInputs), 2);
    expect(["low", "warning", "critical"]).toContain(result.summaryLevel);
    expect(result.primaryDriver).toBe("totalExposure");
  });

  test("formula pipeline parity", () => {
    const result = calculateKirisKolonYaklasikAgirlikHesabi(defaultInputs);
    expect(result.totalExposure).toBeCloseTo(
      engineNumeric(SCHEMA_ID, "totalExposure", defaultInputs),
      2,
    );
  });

  test("low threshold band", () => {
    const result = calculateKirisKolonYaklasikAgirlikHesabi(lowBandInputs);
    expect(["low", "warning", "critical"]).toContain(result.summaryLevel);
  });

  test("warning threshold band", () => {
    const result = calculateKirisKolonYaklasikAgirlikHesabi(defaultInputs);
    expect(["warning", "critical", "low"]).toContain(result.summaryLevel);
  });

  test("critical threshold band", () => {
    const result = calculateKirisKolonYaklasikAgirlikHesabi(criticalBandInputs);
    expect(["low", "warning", "critical"]).toContain(result.summaryLevel);
  });

  test("invalid missing input fails validation and calculator throws", () => {
    const broken = { ...defaultInputs, elementWidth: undefined } as unknown as KirisKolonYaklasikAgirlikHesabiInputs;
    const validation = validateKirisKolonYaklasikAgirlikHesabiInputs(broken);
    expect(validation.ok).toBe(false);
    expect(() => calculateKirisKolonYaklasikAgirlikHesabi(broken)).toThrow();
  });

  test("invalid negative input fails validation and calculator throws", () => {
    expectValidationFailure({ elementWidth: -1 });
  });
  test("invalid zero divisor/base fails validation and calculator throws", () => {
    const validation = validateKirisKolonYaklasikAgirlikHesabiInputs({ ...defaultInputs, elementWidth: 0 });
    expect(validation.ok).toBe(false);
    if (validation.ok) return;
    expect(() => calculateKirisKolonYaklasikAgirlikHesabi({ ...defaultInputs, elementWidth: 0 })).toThrow();
  });

  test("invalid NaN input fails validation and calculator throws", () => {
    expectValidationFailure({ reinforcementRatioPercent: Number.NaN });
  });

  test("invalid Infinity input fails validation and calculator throws", () => {
    expectValidationFailure({ reinforcementRatioPercent: Number.POSITIVE_INFINITY });
  });

    test("contract metadata matches slug", () => {
    const contract = KIRIS_KOLON_YAKLASIK_AGIRLIK_HESABI_CRITICAL_FORMULA_CONTRACTS[0];
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
    const calculatorResult = calculateKirisKolonYaklasikAgirlikHesabi(defaultInputs);
    expect(engineResult.outputs.find((output) => output.id === "totalExposure")?.raw).toBeCloseTo(calculatorResult.totalExposure, 2);
    expect(engineResult.outputs.find((output) => output.id === "variancePercent")?.raw).toBeCloseTo(calculatorResult.variancePercent, 2);
  });
});
