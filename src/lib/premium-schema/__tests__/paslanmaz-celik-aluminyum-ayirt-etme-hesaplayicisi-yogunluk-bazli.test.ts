import { describe, expect, test } from "vitest";
import { PASLANMAZ_CELIK_ALUMINYUM_AYIRT_ETME_HESAPLAYICISI_YOGUNLUK_BAZLI_CRITICAL_FORMULA_CONTRACTS } from "@/lib/formula-governance/contracts/paslanmaz-celik-aluminyum-ayirt-etme-hesaplayicisi-yogunluk-bazli-critical";
import { getFormulaContractBySlug } from "@/lib/formula-governance/contracts";
import {
  calculatePaslanmazCelikAluminyumAyirtEtmeHesaplayicisiYogunlukBazli,
  type PaslanmazCelikAluminyumAyirtEtmeHesaplayicisiYogunlukBazliInputs,
} from "@/lib/premium-schema/calculators/paslanmaz-celik-aluminyum-ayirt-etme-hesaplayicisi-yogunluk-bazli";
import { validatePaslanmazCelikAluminyumAyirtEtmeHesaplayicisiYogunlukBazliInputs } from "@/lib/premium-schema/calculators/paslanmaz-celik-aluminyum-ayirt-etme-hesaplayicisi-yogunluk-bazli-validation";
import { getPremiumCalculatorSchema } from "@/lib/premium-schema/schema-registry";
import {
  buildDefaultSchemaInputs,
  runPremiumSchemaEngine,
} from "@/lib/premium-schema/premium-schema-engine";

const SLUG = "paslanmaz-celik-aluminyum-ayirt-etme-hesaplayicisi-yogunluk-bazli";
const SCHEMA_ID = "paslanmaz-celik-aluminyum-ayirt-etme-hesaplayicisi-yogunluk-bazli";

const defaultInputs: PaslanmazCelikAluminyumAyirtEtmeHesaplayicisiYogunlukBazliInputs = {
    "sampleMass": 100,
    "sampleVolume": 12.7,
    "tolerancePercent": 5
  };
const lowBandInputs: PaslanmazCelikAluminyumAyirtEtmeHesaplayicisiYogunlukBazliInputs = {
    "sampleMass": 0.1,
    "sampleVolume": 12.7,
    "tolerancePercent": 5
  };
const criticalBandInputs: PaslanmazCelikAluminyumAyirtEtmeHesaplayicisiYogunlukBazliInputs = {
    "sampleMass": 6,
    "sampleVolume": 12.7,
    "tolerancePercent": 5
  };

function expectValidationFailure(partial: Partial<PaslanmazCelikAluminyumAyirtEtmeHesaplayicisiYogunlukBazliInputs>): void {
  const inputs = { ...defaultInputs, ...partial } as PaslanmazCelikAluminyumAyirtEtmeHesaplayicisiYogunlukBazliInputs;
  const validation = validatePaslanmazCelikAluminyumAyirtEtmeHesaplayicisiYogunlukBazliInputs(inputs);
  expect(validation.ok).toBe(false);
  if (validation.ok) return;
  expect(validation.errors.length).toBeGreaterThan(0);
  expect(() => calculatePaslanmazCelikAluminyumAyirtEtmeHesaplayicisiYogunlukBazli(inputs)).toThrow();
}

function engineNumeric(schemaSlug: string, outputId: string, inputs: PaslanmazCelikAluminyumAyirtEtmeHesaplayicisiYogunlukBazliInputs): number {
  const schema = getPremiumCalculatorSchema(schemaSlug);
  if (!schema) throw new Error("schema missing");
  const engineResult = runPremiumSchemaEngine(schema, inputs);
  const raw = engineResult.outputs.find((output) => output.id === outputId)?.raw;
  if (typeof raw !== "number") throw new Error(`missing output ${outputId}`);
  return raw;
}

describe("paslanmaz-celik-aluminyum-ayirt-etme-hesaplayicisi-yogunluk-bazli", () => {
  test("exact default oracle", () => {
    const result = calculatePaslanmazCelikAluminyumAyirtEtmeHesaplayicisiYogunlukBazli(defaultInputs);
    expect(result.totalExposure).toBeCloseTo(engineNumeric(SCHEMA_ID, "totalExposure", defaultInputs), 2);
    expect(result.variancePercent).toBeCloseTo(engineNumeric(SCHEMA_ID, "variancePercent", defaultInputs), 2);
    expect(["low", "warning", "critical"]).toContain(result.summaryLevel);
    expect(result.primaryDriver).toBe("totalExposure");
  });

  test("formula pipeline parity", () => {
    const result = calculatePaslanmazCelikAluminyumAyirtEtmeHesaplayicisiYogunlukBazli(defaultInputs);
    expect(result.totalExposure).toBeCloseTo(
      engineNumeric(SCHEMA_ID, "totalExposure", defaultInputs),
      2,
    );
  });

  test("low threshold band", () => {
    const result = calculatePaslanmazCelikAluminyumAyirtEtmeHesaplayicisiYogunlukBazli(lowBandInputs);
    expect(["low", "warning", "critical"]).toContain(result.summaryLevel);
  });

  test("warning threshold band", () => {
    const result = calculatePaslanmazCelikAluminyumAyirtEtmeHesaplayicisiYogunlukBazli(defaultInputs);
    expect(["warning", "critical", "low"]).toContain(result.summaryLevel);
  });

  test("critical threshold band", () => {
    const result = calculatePaslanmazCelikAluminyumAyirtEtmeHesaplayicisiYogunlukBazli(criticalBandInputs);
    expect(["low", "warning", "critical"]).toContain(result.summaryLevel);
  });

  test("invalid missing input fails validation and calculator throws", () => {
    const broken = { ...defaultInputs, sampleMass: undefined } as unknown as PaslanmazCelikAluminyumAyirtEtmeHesaplayicisiYogunlukBazliInputs;
    const validation = validatePaslanmazCelikAluminyumAyirtEtmeHesaplayicisiYogunlukBazliInputs(broken);
    expect(validation.ok).toBe(false);
    expect(() => calculatePaslanmazCelikAluminyumAyirtEtmeHesaplayicisiYogunlukBazli(broken)).toThrow();
  });

  test("invalid negative input fails validation and calculator throws", () => {
    expectValidationFailure({ sampleMass: -1 });
  });
  test("invalid zero divisor/base fails validation and calculator throws", () => {
    const validation = validatePaslanmazCelikAluminyumAyirtEtmeHesaplayicisiYogunlukBazliInputs({ ...defaultInputs, sampleMass: 0 });
    expect(validation.ok).toBe(false);
    if (validation.ok) return;
    expect(() => calculatePaslanmazCelikAluminyumAyirtEtmeHesaplayicisiYogunlukBazli({ ...defaultInputs, sampleMass: 0 })).toThrow();
  });

  test("invalid NaN input fails validation and calculator throws", () => {
    expectValidationFailure({ tolerancePercent: Number.NaN });
  });

  test("invalid Infinity input fails validation and calculator throws", () => {
    expectValidationFailure({ tolerancePercent: Number.POSITIVE_INFINITY });
  });

    test("contract metadata matches slug", () => {
    const contract = PASLANMAZ_CELIK_ALUMINYUM_AYIRT_ETME_HESAPLAYICISI_YOGUNLUK_BAZLI_CRITICAL_FORMULA_CONTRACTS[0];
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
    const calculatorResult = calculatePaslanmazCelikAluminyumAyirtEtmeHesaplayicisiYogunlukBazli(defaultInputs);
    expect(engineResult.outputs.find((output) => output.id === "totalExposure")?.raw).toBeCloseTo(calculatorResult.totalExposure, 2);
    expect(engineResult.outputs.find((output) => output.id === "variancePercent")?.raw).toBeCloseTo(calculatorResult.variancePercent, 2);
  });
});
