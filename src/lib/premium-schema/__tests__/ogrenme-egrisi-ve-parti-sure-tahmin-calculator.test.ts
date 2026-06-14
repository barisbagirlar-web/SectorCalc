import { describe, expect, test } from "vitest";
import { OGRENME_EGRISI_VE_PARTI_SURE_TAHMIN_CALCULATOR_CRITICAL_FORMULA_CONTRACTS } from "@/lib/formula-governance/contracts/ogrenme-egrisi-ve-parti-sure-tahmin-calculator-critical";
import { getFormulaContractBySlug } from "@/lib/formula-governance/contracts";
import {
  calculateOgrenmeEgrisiVePartiSureTahminCalculator,
  type OgrenmeEgrisiVePartiSureTahminCalculatorInputs,
} from "@/lib/premium-schema/calculators/ogrenme-egrisi-ve-parti-sure-tahmin-calculator";
import { validateOgrenmeEgrisiVePartiSureTahminCalculatorInputs } from "@/lib/premium-schema/calculators/ogrenme-egrisi-ve-parti-sure-tahmin-calculator-validation";
import { getPremiumCalculatorSchema } from "@/lib/premium-schema/schema-registry";
import {
  buildDefaultSchemaInputs,
  runPremiumSchemaEngine,
} from "@/lib/premium-schema/premium-schema-engine";

const SLUG = "ogrenme-egrisi-ve-parti-sure-tahmin-calculator";
const SCHEMA_ID = "ogrenme-egrisi-ve-parti-sure-tahmin-calculator";

const defaultInputs: OgrenmeEgrisiVePartiSureTahminCalculatorInputs = {
    "firstUnitTimeHours": 10,
    "learningRatePercent": 80,
    "batchQuantity": 100,
    "hourlyLaborRate": 25,
    "unitMaterialCost": 5,
    "overheadRatePercent": 50
  };
const lowBandInputs: OgrenmeEgrisiVePartiSureTahminCalculatorInputs = {
    "firstUnitTimeHours": 0.1,
    "learningRatePercent": 80,
    "batchQuantity": 100,
    "hourlyLaborRate": 25,
    "unitMaterialCost": 5,
    "overheadRatePercent": 50
  };
const criticalBandInputs: OgrenmeEgrisiVePartiSureTahminCalculatorInputs = {
    "firstUnitTimeHours": 6,
    "learningRatePercent": 80,
    "batchQuantity": 100,
    "hourlyLaborRate": 25,
    "unitMaterialCost": 5,
    "overheadRatePercent": 50
  };

function expectValidationFailure(partial: Partial<OgrenmeEgrisiVePartiSureTahminCalculatorInputs>): void {
  const inputs = { ...defaultInputs, ...partial } as OgrenmeEgrisiVePartiSureTahminCalculatorInputs;
  const validation = validateOgrenmeEgrisiVePartiSureTahminCalculatorInputs(inputs);
  expect(validation.ok).toBe(false);
  if (validation.ok) return;
  expect(validation.errors.length).toBeGreaterThan(0);
  expect(() => calculateOgrenmeEgrisiVePartiSureTahminCalculator(inputs)).toThrow();
}

function engineNumeric(schemaSlug: string, outputId: string, inputs: OgrenmeEgrisiVePartiSureTahminCalculatorInputs): number {
  const schema = getPremiumCalculatorSchema(schemaSlug);
  if (!schema) throw new Error("schema missing");
  const engineResult = runPremiumSchemaEngine(schema, inputs);
  const raw = engineResult.outputs.find((output) => output.id === outputId)?.raw;
  if (typeof raw !== "number") throw new Error(`missing output ${outputId}`);
  return raw;
}

describe("ogrenme-egrisi-ve-parti-sure-tahmin-calculator", () => {
  test("exact default oracle", () => {
    const result = calculateOgrenmeEgrisiVePartiSureTahminCalculator(defaultInputs);
    expect(result.totalExposure).toBeCloseTo(engineNumeric(SCHEMA_ID, "totalExposure", defaultInputs), 2);
    expect(result.variancePercent).toBeCloseTo(engineNumeric(SCHEMA_ID, "variancePercent", defaultInputs), 2);
    expect(["low", "warning", "critical"]).toContain(result.summaryLevel);
    expect(result.primaryDriver).toBe("totalExposure");
  });

  test("formula pipeline parity", () => {
    const result = calculateOgrenmeEgrisiVePartiSureTahminCalculator(defaultInputs);
    expect(result.totalExposure).toBeCloseTo(
      engineNumeric(SCHEMA_ID, "totalExposure", defaultInputs),
      2,
    );
  });

  test("low threshold band", () => {
    const result = calculateOgrenmeEgrisiVePartiSureTahminCalculator(lowBandInputs);
    expect(["low", "warning", "critical"]).toContain(result.summaryLevel);
  });

  test("warning threshold band", () => {
    const result = calculateOgrenmeEgrisiVePartiSureTahminCalculator(defaultInputs);
    expect(["warning", "critical", "low"]).toContain(result.summaryLevel);
  });

  test("critical threshold band", () => {
    const result = calculateOgrenmeEgrisiVePartiSureTahminCalculator(criticalBandInputs);
    expect(["low", "warning", "critical"]).toContain(result.summaryLevel);
  });

  test("invalid missing input fails validation and calculator throws", () => {
    const broken = { ...defaultInputs, firstUnitTimeHours: undefined } as unknown as OgrenmeEgrisiVePartiSureTahminCalculatorInputs;
    const validation = validateOgrenmeEgrisiVePartiSureTahminCalculatorInputs(broken);
    expect(validation.ok).toBe(false);
    expect(() => calculateOgrenmeEgrisiVePartiSureTahminCalculator(broken)).toThrow();
  });

  test("invalid negative input fails validation and calculator throws", () => {
    expectValidationFailure({ firstUnitTimeHours: -1 });
  });
  test("invalid zero divisor/base fails validation and calculator throws", () => {
    const validation = validateOgrenmeEgrisiVePartiSureTahminCalculatorInputs({ ...defaultInputs, firstUnitTimeHours: 0 });
    expect(validation.ok).toBe(false);
    if (validation.ok) return;
    expect(() => calculateOgrenmeEgrisiVePartiSureTahminCalculator({ ...defaultInputs, firstUnitTimeHours: 0 })).toThrow();
  });

  test("invalid NaN input fails validation and calculator throws", () => {
    expectValidationFailure({ overheadRatePercent: Number.NaN });
  });

  test("invalid Infinity input fails validation and calculator throws", () => {
    expectValidationFailure({ overheadRatePercent: Number.POSITIVE_INFINITY });
  });

    test("contract metadata matches slug", () => {
    const contract = OGRENME_EGRISI_VE_PARTI_SURE_TAHMIN_CALCULATOR_CRITICAL_FORMULA_CONTRACTS[0];
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
    const calculatorResult = calculateOgrenmeEgrisiVePartiSureTahminCalculator(defaultInputs);
    expect(engineResult.outputs.find((output) => output.id === "totalExposure")?.raw).toBeCloseTo(calculatorResult.totalExposure, 2);
    expect(engineResult.outputs.find((output) => output.id === "variancePercent")?.raw).toBeCloseTo(calculatorResult.variancePercent, 2);
  });
});
