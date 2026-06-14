import { describe, expect, test } from "vitest";
import { KAZA_MALIYETI_DOGRUDAN_VE_DOLAYLI_TOPLAM_KAYIP_CALCULATOR_CRITICAL_FORMULA_CONTRACTS } from "@/lib/formula-governance/contracts/kaza-maliyeti-dogrudan-ve-dolayli-toplam-kayip-calculator-critical";
import { getFormulaContractBySlug } from "@/lib/formula-governance/contracts";
import {
  calculateKazaMaliyetiDogrudanVeDolayliToplamKayipCalculator,
  type KazaMaliyetiDogrudanVeDolayliToplamKayipCalculatorInputs,
} from "@/lib/premium-schema/calculators/kaza-maliyeti-dogrudan-ve-dolayli-toplam-kayip-calculator";
import { validateKazaMaliyetiDogrudanVeDolayliToplamKayipCalculatorInputs } from "@/lib/premium-schema/calculators/kaza-maliyeti-dogrudan-ve-dolayli-toplam-kayip-calculator-validation";
import { getPremiumCalculatorSchema } from "@/lib/premium-schema/schema-registry";
import {
  buildDefaultSchemaInputs,
  runPremiumSchemaEngine,
} from "@/lib/premium-schema/premium-schema-engine";

const SLUG = "kaza-maliyeti-dogrudan-ve-dolayli-toplam-kayip-calculator";
const SCHEMA_ID = "kaza-maliyeti-dogrudan-ve-dolayli-toplam-kayip-calculator";

const defaultInputs: KazaMaliyetiDogrudanVeDolayliToplamKayipCalculatorInputs = {
    "numberOfAccidents": 1,
    "medicalCostPerAccident": 5000,
    "propertyDamageCostPerAccident": 2000,
    "lostTimeCostPerAccident": 3000,
    "indirectMultiplier": 4,
    "annualRevenue": 1000000
  };
const lowBandInputs: KazaMaliyetiDogrudanVeDolayliToplamKayipCalculatorInputs = {
    "numberOfAccidents": 1,
    "medicalCostPerAccident": 5000,
    "propertyDamageCostPerAccident": 2000,
    "lostTimeCostPerAccident": 3000,
    "indirectMultiplier": 4,
    "annualRevenue": 1000000
  };
const criticalBandInputs: KazaMaliyetiDogrudanVeDolayliToplamKayipCalculatorInputs = {
    "numberOfAccidents": 6,
    "medicalCostPerAccident": 5000,
    "propertyDamageCostPerAccident": 2000,
    "lostTimeCostPerAccident": 3000,
    "indirectMultiplier": 4,
    "annualRevenue": 1000000
  };

function expectValidationFailure(partial: Partial<KazaMaliyetiDogrudanVeDolayliToplamKayipCalculatorInputs>): void {
  const inputs = { ...defaultInputs, ...partial } as KazaMaliyetiDogrudanVeDolayliToplamKayipCalculatorInputs;
  const validation = validateKazaMaliyetiDogrudanVeDolayliToplamKayipCalculatorInputs(inputs);
  expect(validation.ok).toBe(false);
  if (validation.ok) return;
  expect(validation.errors.length).toBeGreaterThan(0);
  expect(() => calculateKazaMaliyetiDogrudanVeDolayliToplamKayipCalculator(inputs)).toThrow();
}

function engineNumeric(schemaSlug: string, outputId: string, inputs: KazaMaliyetiDogrudanVeDolayliToplamKayipCalculatorInputs): number {
  const schema = getPremiumCalculatorSchema(schemaSlug);
  if (!schema) throw new Error("schema missing");
  const engineResult = runPremiumSchemaEngine(schema, inputs);
  const raw = engineResult.outputs.find((output) => output.id === outputId)?.raw;
  if (typeof raw !== "number") throw new Error(`missing output ${outputId}`);
  return raw;
}

describe("kaza-maliyeti-dogrudan-ve-dolayli-toplam-kayip-calculator", () => {
  test("exact default oracle", () => {
    const result = calculateKazaMaliyetiDogrudanVeDolayliToplamKayipCalculator(defaultInputs);
    expect(result.totalExposure).toBeCloseTo(engineNumeric(SCHEMA_ID, "totalExposure", defaultInputs), 2);
    expect(result.variancePercent).toBeCloseTo(engineNumeric(SCHEMA_ID, "variancePercent", defaultInputs), 2);
    expect(["low", "warning", "critical"]).toContain(result.summaryLevel);
    expect(result.primaryDriver).toBe("totalExposure");
  });

  test("formula pipeline parity", () => {
    const result = calculateKazaMaliyetiDogrudanVeDolayliToplamKayipCalculator(defaultInputs);
    expect(result.totalExposure).toBeCloseTo(
      engineNumeric(SCHEMA_ID, "totalExposure", defaultInputs),
      2,
    );
  });

  test("low threshold band", () => {
    const result = calculateKazaMaliyetiDogrudanVeDolayliToplamKayipCalculator(lowBandInputs);
    expect(["low", "warning", "critical"]).toContain(result.summaryLevel);
  });

  test("warning threshold band", () => {
    const result = calculateKazaMaliyetiDogrudanVeDolayliToplamKayipCalculator(defaultInputs);
    expect(["warning", "critical", "low"]).toContain(result.summaryLevel);
  });

  test("critical threshold band", () => {
    const result = calculateKazaMaliyetiDogrudanVeDolayliToplamKayipCalculator(criticalBandInputs);
    expect(["low", "warning", "critical"]).toContain(result.summaryLevel);
  });

  test("invalid missing input fails validation and calculator throws", () => {
    const broken = { ...defaultInputs, numberOfAccidents: undefined } as unknown as KazaMaliyetiDogrudanVeDolayliToplamKayipCalculatorInputs;
    const validation = validateKazaMaliyetiDogrudanVeDolayliToplamKayipCalculatorInputs(broken);
    expect(validation.ok).toBe(false);
    expect(() => calculateKazaMaliyetiDogrudanVeDolayliToplamKayipCalculator(broken)).toThrow();
  });

  test("invalid negative input fails validation and calculator throws", () => {
    expectValidationFailure({ numberOfAccidents: -1 });
  });
  test("invalid zero divisor/base fails validation and calculator throws", () => {
    const validation = validateKazaMaliyetiDogrudanVeDolayliToplamKayipCalculatorInputs({ ...defaultInputs, numberOfAccidents: 0 });
    expect(validation.ok).toBe(false);
    if (validation.ok) return;
    expect(() => calculateKazaMaliyetiDogrudanVeDolayliToplamKayipCalculator({ ...defaultInputs, numberOfAccidents: 0 })).toThrow();
  });

  test("invalid NaN input fails validation and calculator throws", () => {
    expectValidationFailure({ annualRevenue: Number.NaN });
  });

  test("invalid Infinity input fails validation and calculator throws", () => {
    expectValidationFailure({ annualRevenue: Number.POSITIVE_INFINITY });
  });

    test("contract metadata matches slug", () => {
    const contract = KAZA_MALIYETI_DOGRUDAN_VE_DOLAYLI_TOPLAM_KAYIP_CALCULATOR_CRITICAL_FORMULA_CONTRACTS[0];
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
    const calculatorResult = calculateKazaMaliyetiDogrudanVeDolayliToplamKayipCalculator(defaultInputs);
    expect(engineResult.outputs.find((output) => output.id === "totalExposure")?.raw).toBeCloseTo(calculatorResult.totalExposure, 2);
    expect(engineResult.outputs.find((output) => output.id === "variancePercent")?.raw).toBeCloseTo(calculatorResult.variancePercent, 2);
  });
});
