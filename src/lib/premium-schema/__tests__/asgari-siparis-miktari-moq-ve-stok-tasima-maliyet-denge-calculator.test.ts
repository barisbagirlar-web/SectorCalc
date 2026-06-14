import { describe, expect, test } from "vitest";
import { ASGARI_SIPARIS_MIKTARI_MOQ_VE_STOK_TASIMA_MALIYET_DENGE_CALCULATOR_CRITICAL_FORMULA_CONTRACTS } from "@/lib/formula-governance/contracts/asgari-siparis-miktari-moq-ve-stok-tasima-maliyet-denge-calculator-critical";
import { getFormulaContractBySlug } from "@/lib/formula-governance/contracts";
import {
  calculateAsgariSiparisMiktariMoqVeStokTasimaMaliyetDengeCalculator,
  type AsgariSiparisMiktariMoqVeStokTasimaMaliyetDengeCalculatorInputs,
} from "@/lib/premium-schema/calculators/asgari-siparis-miktari-moq-ve-stok-tasima-maliyet-denge-calculator";
import { validateAsgariSiparisMiktariMoqVeStokTasimaMaliyetDengeCalculatorInputs } from "@/lib/premium-schema/calculators/asgari-siparis-miktari-moq-ve-stok-tasima-maliyet-denge-calculator-validation";
import { getPremiumCalculatorSchema } from "@/lib/premium-schema/schema-registry";
import {
  buildDefaultSchemaInputs,
  runPremiumSchemaEngine,
} from "@/lib/premium-schema/premium-schema-engine";

const SLUG = "asgari-siparis-miktari-moq-ve-stok-tasima-maliyet-denge-calculator";
const SCHEMA_ID = "asgari-siparis-miktari-moq-ve-stok-tasima-maliyet-denge-calculator";

const defaultInputs: AsgariSiparisMiktariMoqVeStokTasimaMaliyetDengeCalculatorInputs = {
    "averageInventoryValue": 100000,
    "inventoryUnits": 1000,
    "unitCost": 100,
    "holdingCostRatePercent": 20,
    "obsolescenceRatePercent": 5,
    "excessUnits": 100
  };
const lowBandInputs: AsgariSiparisMiktariMoqVeStokTasimaMaliyetDengeCalculatorInputs = {
    "averageInventoryValue": 0.1,
    "inventoryUnits": 1000,
    "unitCost": 100,
    "holdingCostRatePercent": 20,
    "obsolescenceRatePercent": 5,
    "excessUnits": 100
  };
const criticalBandInputs: AsgariSiparisMiktariMoqVeStokTasimaMaliyetDengeCalculatorInputs = {
    "averageInventoryValue": 6,
    "inventoryUnits": 1000,
    "unitCost": 100,
    "holdingCostRatePercent": 20,
    "obsolescenceRatePercent": 5,
    "excessUnits": 100
  };

function expectValidationFailure(partial: Partial<AsgariSiparisMiktariMoqVeStokTasimaMaliyetDengeCalculatorInputs>): void {
  const inputs = { ...defaultInputs, ...partial } as AsgariSiparisMiktariMoqVeStokTasimaMaliyetDengeCalculatorInputs;
  const validation = validateAsgariSiparisMiktariMoqVeStokTasimaMaliyetDengeCalculatorInputs(inputs);
  expect(validation.ok).toBe(false);
  if (validation.ok) return;
  expect(validation.errors.length).toBeGreaterThan(0);
  expect(() => calculateAsgariSiparisMiktariMoqVeStokTasimaMaliyetDengeCalculator(inputs)).toThrow();
}

function engineNumeric(schemaSlug: string, outputId: string, inputs: AsgariSiparisMiktariMoqVeStokTasimaMaliyetDengeCalculatorInputs): number {
  const schema = getPremiumCalculatorSchema(schemaSlug);
  if (!schema) throw new Error("schema missing");
  const engineResult = runPremiumSchemaEngine(schema, inputs);
  const raw = engineResult.outputs.find((output) => output.id === outputId)?.raw;
  if (typeof raw !== "number") throw new Error(`missing output ${outputId}`);
  return raw;
}

describe("asgari-siparis-miktari-moq-ve-stok-tasima-maliyet-denge-calculator", () => {
  test("exact default oracle", () => {
    const result = calculateAsgariSiparisMiktariMoqVeStokTasimaMaliyetDengeCalculator(defaultInputs);
    expect(result.totalExposure).toBeCloseTo(engineNumeric(SCHEMA_ID, "totalExposure", defaultInputs), 2);
    expect(result.variancePercent).toBeCloseTo(engineNumeric(SCHEMA_ID, "variancePercent", defaultInputs), 2);
    expect(["low", "warning", "critical"]).toContain(result.summaryLevel);
    expect(result.primaryDriver).toBe("totalExposure");
  });

  test("formula pipeline parity", () => {
    const result = calculateAsgariSiparisMiktariMoqVeStokTasimaMaliyetDengeCalculator(defaultInputs);
    expect(result.totalExposure).toBeCloseTo(
      engineNumeric(SCHEMA_ID, "totalExposure", defaultInputs),
      2,
    );
  });

  test("low threshold band", () => {
    const result = calculateAsgariSiparisMiktariMoqVeStokTasimaMaliyetDengeCalculator(lowBandInputs);
    expect(["low", "warning", "critical"]).toContain(result.summaryLevel);
  });

  test("warning threshold band", () => {
    const result = calculateAsgariSiparisMiktariMoqVeStokTasimaMaliyetDengeCalculator(defaultInputs);
    expect(["warning", "critical", "low"]).toContain(result.summaryLevel);
  });

  test("critical threshold band", () => {
    const result = calculateAsgariSiparisMiktariMoqVeStokTasimaMaliyetDengeCalculator(criticalBandInputs);
    expect(["low", "warning", "critical"]).toContain(result.summaryLevel);
  });

  test("invalid missing input fails validation and calculator throws", () => {
    const broken = { ...defaultInputs, averageInventoryValue: undefined } as unknown as AsgariSiparisMiktariMoqVeStokTasimaMaliyetDengeCalculatorInputs;
    const validation = validateAsgariSiparisMiktariMoqVeStokTasimaMaliyetDengeCalculatorInputs(broken);
    expect(validation.ok).toBe(false);
    expect(() => calculateAsgariSiparisMiktariMoqVeStokTasimaMaliyetDengeCalculator(broken)).toThrow();
  });

  test("invalid negative input fails validation and calculator throws", () => {
    expectValidationFailure({ averageInventoryValue: -1 });
  });
  test("invalid zero divisor/base fails validation and calculator throws", () => {
    const validation = validateAsgariSiparisMiktariMoqVeStokTasimaMaliyetDengeCalculatorInputs({ ...defaultInputs, inventoryUnits: 0 });
    expect(validation.ok).toBe(false);
    if (validation.ok) return;
    expect(() => calculateAsgariSiparisMiktariMoqVeStokTasimaMaliyetDengeCalculator({ ...defaultInputs, inventoryUnits: 0 })).toThrow();
  });

  test("invalid NaN input fails validation and calculator throws", () => {
    expectValidationFailure({ excessUnits: Number.NaN });
  });

  test("invalid Infinity input fails validation and calculator throws", () => {
    expectValidationFailure({ excessUnits: Number.POSITIVE_INFINITY });
  });

    test("contract metadata matches slug", () => {
    const contract = ASGARI_SIPARIS_MIKTARI_MOQ_VE_STOK_TASIMA_MALIYET_DENGE_CALCULATOR_CRITICAL_FORMULA_CONTRACTS[0];
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
    const calculatorResult = calculateAsgariSiparisMiktariMoqVeStokTasimaMaliyetDengeCalculator(defaultInputs);
    expect(engineResult.outputs.find((output) => output.id === "totalExposure")?.raw).toBeCloseTo(calculatorResult.totalExposure, 2);
    expect(engineResult.outputs.find((output) => output.id === "variancePercent")?.raw).toBeCloseTo(calculatorResult.variancePercent, 2);
  });
});
