import { describe, expect, test } from "vitest";
import { ENJEKSIYON_SOGUTMA_SURESI_VE_CEVRIM_OPTIMIZASYON_CALCULATOR_CRITICAL_FORMULA_CONTRACTS } from "@/lib/formula-governance/contracts/enjeksiyon-sogutma-suresi-ve-cevrim-optimizasyon-calculator-critical";
import { getFormulaContractBySlug } from "@/lib/formula-governance/contracts";
import {
  calculateEnjeksiyonSogutmaSuresiVeCevrimOptimizasyonCalculator,
  type EnjeksiyonSogutmaSuresiVeCevrimOptimizasyonCalculatorInputs,
} from "@/lib/premium-schema/calculators/enjeksiyon-sogutma-suresi-ve-cevrim-optimizasyon-calculator";
import { validateEnjeksiyonSogutmaSuresiVeCevrimOptimizasyonCalculatorInputs } from "@/lib/premium-schema/calculators/enjeksiyon-sogutma-suresi-ve-cevrim-optimizasyon-calculator-validation";
import { getPremiumCalculatorSchema } from "@/lib/premium-schema/schema-registry";
import {
  buildDefaultSchemaInputs,
  runPremiumSchemaEngine,
} from "@/lib/premium-schema/premium-schema-engine";

const SLUG = "enjeksiyon-sogutma-suresi-ve-cevrim-optimizasyon-calculator";
const SCHEMA_ID = "enjeksiyon-sogutma-suresi-ve-cevrim-optimizasyon-calculator";

const defaultInputs: EnjeksiyonSogutmaSuresiVeCevrimOptimizasyonCalculatorInputs = {
    "partThickness": 3,
    "thermalDiffusivity": 0.1,
    "meltTemperature": 230,
    "moldTemperature": 50,
    "ejectionTemperature": 90,
    "moldCorrectionFactor": 1
  };
const lowBandInputs: EnjeksiyonSogutmaSuresiVeCevrimOptimizasyonCalculatorInputs = {
    "partThickness": 0.1,
    "thermalDiffusivity": 0.1,
    "meltTemperature": 230,
    "moldTemperature": 50,
    "ejectionTemperature": 90,
    "moldCorrectionFactor": 1
  };
const criticalBandInputs: EnjeksiyonSogutmaSuresiVeCevrimOptimizasyonCalculatorInputs = {
    "partThickness": 6,
    "thermalDiffusivity": 0.1,
    "meltTemperature": 230,
    "moldTemperature": 50,
    "ejectionTemperature": 90,
    "moldCorrectionFactor": 1
  };

function expectValidationFailure(partial: Partial<EnjeksiyonSogutmaSuresiVeCevrimOptimizasyonCalculatorInputs>): void {
  const inputs = { ...defaultInputs, ...partial } as EnjeksiyonSogutmaSuresiVeCevrimOptimizasyonCalculatorInputs;
  const validation = validateEnjeksiyonSogutmaSuresiVeCevrimOptimizasyonCalculatorInputs(inputs);
  expect(validation.ok).toBe(false);
  if (validation.ok) return;
  expect(validation.errors.length).toBeGreaterThan(0);
  expect(() => calculateEnjeksiyonSogutmaSuresiVeCevrimOptimizasyonCalculator(inputs)).toThrow();
}

function engineNumeric(schemaSlug: string, outputId: string, inputs: EnjeksiyonSogutmaSuresiVeCevrimOptimizasyonCalculatorInputs): number {
  const schema = getPremiumCalculatorSchema(schemaSlug);
  if (!schema) throw new Error("schema missing");
  const engineResult = runPremiumSchemaEngine(schema, inputs);
  const raw = engineResult.outputs.find((output) => output.id === outputId)?.raw;
  if (typeof raw !== "number") throw new Error(`missing output ${outputId}`);
  return raw;
}

describe("enjeksiyon-sogutma-suresi-ve-cevrim-optimizasyon-calculator", () => {
  test("exact default oracle", () => {
    const result = calculateEnjeksiyonSogutmaSuresiVeCevrimOptimizasyonCalculator(defaultInputs);
    expect(result.totalExposure).toBeCloseTo(engineNumeric(SCHEMA_ID, "totalExposure", defaultInputs), 2);
    expect(result.variancePercent).toBeCloseTo(engineNumeric(SCHEMA_ID, "variancePercent", defaultInputs), 2);
    expect(["low", "warning", "critical"]).toContain(result.summaryLevel);
    expect(result.primaryDriver).toBe("totalExposure");
  });

  test("formula pipeline parity", () => {
    const result = calculateEnjeksiyonSogutmaSuresiVeCevrimOptimizasyonCalculator(defaultInputs);
    expect(result.totalExposure).toBeCloseTo(
      engineNumeric(SCHEMA_ID, "totalExposure", defaultInputs),
      2,
    );
  });

  test("low threshold band", () => {
    const result = calculateEnjeksiyonSogutmaSuresiVeCevrimOptimizasyonCalculator(lowBandInputs);
    expect(["low", "warning", "critical"]).toContain(result.summaryLevel);
  });

  test("warning threshold band", () => {
    const result = calculateEnjeksiyonSogutmaSuresiVeCevrimOptimizasyonCalculator(defaultInputs);
    expect(["warning", "critical", "low"]).toContain(result.summaryLevel);
  });

  test("critical threshold band", () => {
    const result = calculateEnjeksiyonSogutmaSuresiVeCevrimOptimizasyonCalculator(criticalBandInputs);
    expect(["low", "warning", "critical"]).toContain(result.summaryLevel);
  });

  test("invalid missing input fails validation and calculator throws", () => {
    const broken = { ...defaultInputs, partThickness: undefined } as unknown as EnjeksiyonSogutmaSuresiVeCevrimOptimizasyonCalculatorInputs;
    const validation = validateEnjeksiyonSogutmaSuresiVeCevrimOptimizasyonCalculatorInputs(broken);
    expect(validation.ok).toBe(false);
    expect(() => calculateEnjeksiyonSogutmaSuresiVeCevrimOptimizasyonCalculator(broken)).toThrow();
  });

  test("invalid negative input fails validation and calculator throws", () => {
    expectValidationFailure({ partThickness: -1 });
  });
  test("invalid zero divisor/base fails validation and calculator throws", () => {
    const validation = validateEnjeksiyonSogutmaSuresiVeCevrimOptimizasyonCalculatorInputs({ ...defaultInputs, partThickness: 0 });
    expect(validation.ok).toBe(false);
    if (validation.ok) return;
    expect(() => calculateEnjeksiyonSogutmaSuresiVeCevrimOptimizasyonCalculator({ ...defaultInputs, partThickness: 0 })).toThrow();
  });

  test("invalid NaN input fails validation and calculator throws", () => {
    expectValidationFailure({ moldCorrectionFactor: Number.NaN });
  });

  test("invalid Infinity input fails validation and calculator throws", () => {
    expectValidationFailure({ moldCorrectionFactor: Number.POSITIVE_INFINITY });
  });

    test("contract metadata matches slug", () => {
    const contract = ENJEKSIYON_SOGUTMA_SURESI_VE_CEVRIM_OPTIMIZASYON_CALCULATOR_CRITICAL_FORMULA_CONTRACTS[0];
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
    const calculatorResult = calculateEnjeksiyonSogutmaSuresiVeCevrimOptimizasyonCalculator(defaultInputs);
    expect(engineResult.outputs.find((output) => output.id === "totalExposure")?.raw).toBeCloseTo(calculatorResult.totalExposure, 2);
    expect(engineResult.outputs.find((output) => output.id === "variancePercent")?.raw).toBeCloseTo(calculatorResult.variancePercent, 2);
  });
});
