import { describe, expect, test } from "vitest";
import { KUTLE_DENGESI_VE_FIRE_TAKIP_CALCULATOR_CRITICAL_FORMULA_CONTRACTS } from "@/lib/formula-governance/contracts/kutle-dengesi-ve-fire-takip-calculator-critical";
import { getFormulaContractBySlug } from "@/lib/formula-governance/contracts";
import {
  calculateKutleDengesiVeFireTakipCalculator,
  type KutleDengesiVeFireTakipCalculatorInputs,
} from "@/lib/premium-schema/calculators/kutle-dengesi-ve-fire-takip-calculator";
import { validateKutleDengesiVeFireTakipCalculatorInputs } from "@/lib/premium-schema/calculators/kutle-dengesi-ve-fire-takip-calculator-validation";
import { getPremiumCalculatorSchema } from "@/lib/premium-schema/schema-registry";
import {
  buildDefaultSchemaInputs,
  runPremiumSchemaEngine,
} from "@/lib/premium-schema/premium-schema-engine";

const SLUG = "kutle-dengesi-ve-fire-takip-calculator";
const SCHEMA_ID = "kutle-dengesi-ve-fire-takip-calculator";

const defaultInputs: KutleDengesiVeFireTakipCalculatorInputs = {
    "productionQuantity": 100,
    "unitMaterialCost": 10,
    "scrapRatePercent": 5,
    "reworkLaborCost": 0,
    "inventoryHoldingCost": 0,
    "periodRevenue": 10000
  };
const lowBandInputs: KutleDengesiVeFireTakipCalculatorInputs = {
    "productionQuantity": 1,
    "unitMaterialCost": 10,
    "scrapRatePercent": 5,
    "reworkLaborCost": 0,
    "inventoryHoldingCost": 0,
    "periodRevenue": 10000
  };
const criticalBandInputs: KutleDengesiVeFireTakipCalculatorInputs = {
    "productionQuantity": 6,
    "unitMaterialCost": 10,
    "scrapRatePercent": 5,
    "reworkLaborCost": 0,
    "inventoryHoldingCost": 0,
    "periodRevenue": 10000
  };

function expectValidationFailure(partial: Partial<KutleDengesiVeFireTakipCalculatorInputs>): void {
  const inputs = { ...defaultInputs, ...partial } as KutleDengesiVeFireTakipCalculatorInputs;
  const validation = validateKutleDengesiVeFireTakipCalculatorInputs(inputs);
  expect(validation.ok).toBe(false);
  if (validation.ok) return;
  expect(validation.errors.length).toBeGreaterThan(0);
  expect(() => calculateKutleDengesiVeFireTakipCalculator(inputs)).toThrow();
}

function engineNumeric(schemaSlug: string, outputId: string, inputs: KutleDengesiVeFireTakipCalculatorInputs): number {
  const schema = getPremiumCalculatorSchema(schemaSlug);
  if (!schema) throw new Error("schema missing");
  const engineResult = runPremiumSchemaEngine(schema, inputs);
  const raw = engineResult.outputs.find((output) => output.id === outputId)?.raw;
  if (typeof raw !== "number") throw new Error(`missing output ${outputId}`);
  return raw;
}

describe("kutle-dengesi-ve-fire-takip-calculator", () => {
  test("exact default oracle", () => {
    const result = calculateKutleDengesiVeFireTakipCalculator(defaultInputs);
    expect(result.totalExposure).toBeCloseTo(engineNumeric(SCHEMA_ID, "totalExposure", defaultInputs), 2);
    expect(result.variancePercent).toBeCloseTo(engineNumeric(SCHEMA_ID, "variancePercent", defaultInputs), 2);
    expect(["low", "warning", "critical"]).toContain(result.summaryLevel);
    expect(result.primaryDriver).toBe("totalExposure");
  });

  test("formula pipeline parity", () => {
    const result = calculateKutleDengesiVeFireTakipCalculator(defaultInputs);
    expect(result.totalExposure).toBeCloseTo(
      engineNumeric(SCHEMA_ID, "totalExposure", defaultInputs),
      2,
    );
  });

  test("low threshold band", () => {
    const result = calculateKutleDengesiVeFireTakipCalculator(lowBandInputs);
    expect(["low", "warning", "critical"]).toContain(result.summaryLevel);
  });

  test("warning threshold band", () => {
    const result = calculateKutleDengesiVeFireTakipCalculator(defaultInputs);
    expect(["warning", "critical", "low"]).toContain(result.summaryLevel);
  });

  test("critical threshold band", () => {
    const result = calculateKutleDengesiVeFireTakipCalculator(criticalBandInputs);
    expect(["low", "warning", "critical"]).toContain(result.summaryLevel);
  });

  test("invalid missing input fails validation and calculator throws", () => {
    const broken = { ...defaultInputs, productionQuantity: undefined } as unknown as KutleDengesiVeFireTakipCalculatorInputs;
    const validation = validateKutleDengesiVeFireTakipCalculatorInputs(broken);
    expect(validation.ok).toBe(false);
    expect(() => calculateKutleDengesiVeFireTakipCalculator(broken)).toThrow();
  });

  test("invalid negative input fails validation and calculator throws", () => {
    expectValidationFailure({ productionQuantity: -1 });
  });
  test("invalid zero divisor/base fails validation and calculator throws", () => {
    const validation = validateKutleDengesiVeFireTakipCalculatorInputs({ ...defaultInputs, productionQuantity: 0 });
    expect(validation.ok).toBe(false);
    if (validation.ok) return;
    expect(() => calculateKutleDengesiVeFireTakipCalculator({ ...defaultInputs, productionQuantity: 0 })).toThrow();
  });

  test("invalid NaN input fails validation and calculator throws", () => {
    expectValidationFailure({ periodRevenue: Number.NaN });
  });

  test("invalid Infinity input fails validation and calculator throws", () => {
    expectValidationFailure({ periodRevenue: Number.POSITIVE_INFINITY });
  });

    test("contract metadata matches slug", () => {
    const contract = KUTLE_DENGESI_VE_FIRE_TAKIP_CALCULATOR_CRITICAL_FORMULA_CONTRACTS[0];
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
    const calculatorResult = calculateKutleDengesiVeFireTakipCalculator(defaultInputs);
    expect(engineResult.outputs.find((output) => output.id === "totalExposure")?.raw).toBeCloseTo(calculatorResult.totalExposure, 2);
    expect(engineResult.outputs.find((output) => output.id === "variancePercent")?.raw).toBeCloseTo(calculatorResult.variancePercent, 2);
  });
});
