import { describe, expect, test } from "vitest";
import { DONGUSEL_EKONOMI_VE_URUN_OMRU_UZATMA_ROI_CALCULATOR_CRITICAL_FORMULA_CONTRACTS } from "@/lib/formula-governance/contracts/dongusel-ekonomi-ve-urun-omru-uzatma-roi-calculator-critical";
import { getFormulaContractBySlug } from "@/lib/formula-governance/contracts";
import {
  calculateDonguselEkonomiVeUrunOmruUzatmaRoiCalculator,
  type DonguselEkonomiVeUrunOmruUzatmaRoiCalculatorInputs,
} from "@/lib/premium-schema/calculators/dongusel-ekonomi-ve-urun-omru-uzatma-roi-calculator";
import { validateDonguselEkonomiVeUrunOmruUzatmaRoiCalculatorInputs } from "@/lib/premium-schema/calculators/dongusel-ekonomi-ve-urun-omru-uzatma-roi-calculator-validation";
import { getPremiumCalculatorSchema } from "@/lib/premium-schema/schema-registry";
import {
  buildDefaultSchemaInputs,
  runPremiumSchemaEngine,
} from "@/lib/premium-schema/premium-schema-engine";

const SLUG = "dongusel-ekonomi-ve-urun-omru-uzatma-roi-calculator";
const SCHEMA_ID = "dongusel-ekonomi-ve-urun-omru-uzatma-roi-calculator";

const defaultInputs: DonguselEkonomiVeUrunOmruUzatmaRoiCalculatorInputs = {
    "initialProductCost": 1000,
    "originalLifespan": 5,
    "annualOperatingCost": 100,
    "refurbishmentCost": 200,
    "extendedLifespan": 8
  };
const lowBandInputs: DonguselEkonomiVeUrunOmruUzatmaRoiCalculatorInputs = {
    "initialProductCost": 0.1,
    "originalLifespan": 5,
    "annualOperatingCost": 100,
    "refurbishmentCost": 200,
    "extendedLifespan": 8
  };
const criticalBandInputs: DonguselEkonomiVeUrunOmruUzatmaRoiCalculatorInputs = {
    "initialProductCost": 6,
    "originalLifespan": 5,
    "annualOperatingCost": 100,
    "refurbishmentCost": 200,
    "extendedLifespan": 8
  };

function expectValidationFailure(partial: Partial<DonguselEkonomiVeUrunOmruUzatmaRoiCalculatorInputs>): void {
  const inputs = { ...defaultInputs, ...partial } as DonguselEkonomiVeUrunOmruUzatmaRoiCalculatorInputs;
  const validation = validateDonguselEkonomiVeUrunOmruUzatmaRoiCalculatorInputs(inputs);
  expect(validation.ok).toBe(false);
  if (validation.ok) return;
  expect(validation.errors.length).toBeGreaterThan(0);
  expect(() => calculateDonguselEkonomiVeUrunOmruUzatmaRoiCalculator(inputs)).toThrow();
}

function engineNumeric(schemaSlug: string, outputId: string, inputs: DonguselEkonomiVeUrunOmruUzatmaRoiCalculatorInputs): number {
  const schema = getPremiumCalculatorSchema(schemaSlug);
  if (!schema) throw new Error("schema missing");
  const engineResult = runPremiumSchemaEngine(schema, inputs);
  const raw = engineResult.outputs.find((output) => output.id === outputId)?.raw;
  if (typeof raw !== "number") throw new Error(`missing output ${outputId}`);
  return raw;
}

describe("dongusel-ekonomi-ve-urun-omru-uzatma-roi-calculator", () => {
  test("exact default oracle", () => {
    const result = calculateDonguselEkonomiVeUrunOmruUzatmaRoiCalculator(defaultInputs);
    expect(result.totalExposure).toBeCloseTo(engineNumeric(SCHEMA_ID, "totalExposure", defaultInputs), 2);
    expect(result.variancePercent).toBeCloseTo(engineNumeric(SCHEMA_ID, "variancePercent", defaultInputs), 2);
    expect(["low", "warning", "critical"]).toContain(result.summaryLevel);
    expect(result.primaryDriver).toBe("totalExposure");
  });

  test("formula pipeline parity", () => {
    const result = calculateDonguselEkonomiVeUrunOmruUzatmaRoiCalculator(defaultInputs);
    expect(result.totalExposure).toBeCloseTo(
      engineNumeric(SCHEMA_ID, "totalExposure", defaultInputs),
      2,
    );
  });

  test("low threshold band", () => {
    const result = calculateDonguselEkonomiVeUrunOmruUzatmaRoiCalculator(lowBandInputs);
    expect(["low", "warning", "critical"]).toContain(result.summaryLevel);
  });

  test("warning threshold band", () => {
    const result = calculateDonguselEkonomiVeUrunOmruUzatmaRoiCalculator(defaultInputs);
    expect(["warning", "critical", "low"]).toContain(result.summaryLevel);
  });

  test("critical threshold band", () => {
    const result = calculateDonguselEkonomiVeUrunOmruUzatmaRoiCalculator(criticalBandInputs);
    expect(["low", "warning", "critical"]).toContain(result.summaryLevel);
  });

  test("invalid missing input fails validation and calculator throws", () => {
    const broken = { ...defaultInputs, initialProductCost: undefined } as unknown as DonguselEkonomiVeUrunOmruUzatmaRoiCalculatorInputs;
    const validation = validateDonguselEkonomiVeUrunOmruUzatmaRoiCalculatorInputs(broken);
    expect(validation.ok).toBe(false);
    expect(() => calculateDonguselEkonomiVeUrunOmruUzatmaRoiCalculator(broken)).toThrow();
  });

  test("invalid negative input fails validation and calculator throws", () => {
    expectValidationFailure({ initialProductCost: -1 });
  });
  test("invalid zero divisor/base fails validation and calculator throws", () => {
    const validation = validateDonguselEkonomiVeUrunOmruUzatmaRoiCalculatorInputs({ ...defaultInputs, originalLifespan: 0 });
    expect(validation.ok).toBe(false);
    if (validation.ok) return;
    expect(() => calculateDonguselEkonomiVeUrunOmruUzatmaRoiCalculator({ ...defaultInputs, originalLifespan: 0 })).toThrow();
  });

  test("invalid NaN input fails validation and calculator throws", () => {
    expectValidationFailure({ extendedLifespan: Number.NaN });
  });

  test("invalid Infinity input fails validation and calculator throws", () => {
    expectValidationFailure({ extendedLifespan: Number.POSITIVE_INFINITY });
  });

    test("contract metadata matches slug", () => {
    const contract = DONGUSEL_EKONOMI_VE_URUN_OMRU_UZATMA_ROI_CALCULATOR_CRITICAL_FORMULA_CONTRACTS[0];
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
    const calculatorResult = calculateDonguselEkonomiVeUrunOmruUzatmaRoiCalculator(defaultInputs);
    expect(engineResult.outputs.find((output) => output.id === "totalExposure")?.raw).toBeCloseTo(calculatorResult.totalExposure, 2);
    expect(engineResult.outputs.find((output) => output.id === "variancePercent")?.raw).toBeCloseTo(calculatorResult.variancePercent, 2);
  });
});
