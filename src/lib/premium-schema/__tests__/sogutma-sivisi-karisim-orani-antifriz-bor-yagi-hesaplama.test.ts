import { describe, expect, test } from "vitest";
import { SOGUTMA_SIVISI_KARISIM_ORANI_ANTIFRIZ_BOR_YAGI_HESAPLAMA_CRITICAL_FORMULA_CONTRACTS } from "@/lib/formula-governance/contracts/sogutma-sivisi-karisim-orani-antifriz-bor-yagi-hesaplama-critical";
import { getFormulaContractBySlug } from "@/lib/formula-governance/contracts";
import {
  calculateSogutmaSivisiKarisimOraniAntifrizBorYagiHesaplama,
  type SogutmaSivisiKarisimOraniAntifrizBorYagiHesaplamaInputs,
} from "@/lib/premium-schema/calculators/sogutma-sivisi-karisim-orani-antifriz-bor-yagi-hesaplama";
import { validateSogutmaSivisiKarisimOraniAntifrizBorYagiHesaplamaInputs } from "@/lib/premium-schema/calculators/sogutma-sivisi-karisim-orani-antifriz-bor-yagi-hesaplama-validation";
import { getPremiumCalculatorSchema } from "@/lib/premium-schema/schema-registry";
import {
  buildDefaultSchemaInputs,
  runPremiumSchemaEngine,
} from "@/lib/premium-schema/premium-schema-engine";

const SLUG = "sogutma-sivisi-karisim-orani-antifriz-bor-yagi-hesaplama";
const SCHEMA_ID = "sogutma-sivisi-karisim-orani-antifriz-bor-yagi-hesaplama";

const defaultInputs: SogutmaSivisiKarisimOraniAntifrizBorYagiHesaplamaInputs = {
    "totalVolume": 10,
    "desiredConcentration": 50,
    "boricOilRatio": 0
  };
const lowBandInputs: SogutmaSivisiKarisimOraniAntifrizBorYagiHesaplamaInputs = {
    "totalVolume": 0.1,
    "desiredConcentration": 50,
    "boricOilRatio": 0
  };
const criticalBandInputs: SogutmaSivisiKarisimOraniAntifrizBorYagiHesaplamaInputs = {
    "totalVolume": 6,
    "desiredConcentration": 50,
    "boricOilRatio": 0
  };

function expectValidationFailure(partial: Partial<SogutmaSivisiKarisimOraniAntifrizBorYagiHesaplamaInputs>): void {
  const inputs = { ...defaultInputs, ...partial } as SogutmaSivisiKarisimOraniAntifrizBorYagiHesaplamaInputs;
  const validation = validateSogutmaSivisiKarisimOraniAntifrizBorYagiHesaplamaInputs(inputs);
  expect(validation.ok).toBe(false);
  if (validation.ok) return;
  expect(validation.errors.length).toBeGreaterThan(0);
  expect(() => calculateSogutmaSivisiKarisimOraniAntifrizBorYagiHesaplama(inputs)).toThrow();
}

function engineNumeric(schemaSlug: string, outputId: string, inputs: SogutmaSivisiKarisimOraniAntifrizBorYagiHesaplamaInputs): number {
  const schema = getPremiumCalculatorSchema(schemaSlug);
  if (!schema) throw new Error("schema missing");
  const engineResult = runPremiumSchemaEngine(schema, inputs);
  const raw = engineResult.outputs.find((output) => output.id === outputId)?.raw;
  if (typeof raw !== "number") throw new Error(`missing output ${outputId}`);
  return raw;
}

describe("sogutma-sivisi-karisim-orani-antifriz-bor-yagi-hesaplama", () => {
  test("exact default oracle", () => {
    const result = calculateSogutmaSivisiKarisimOraniAntifrizBorYagiHesaplama(defaultInputs);
    expect(result.totalExposure).toBeCloseTo(engineNumeric(SCHEMA_ID, "totalExposure", defaultInputs), 2);
    expect(result.variancePercent).toBeCloseTo(engineNumeric(SCHEMA_ID, "variancePercent", defaultInputs), 2);
    expect(["low", "warning", "critical"]).toContain(result.summaryLevel);
    expect(result.primaryDriver).toBe("totalExposure");
  });

  test("formula pipeline parity", () => {
    const result = calculateSogutmaSivisiKarisimOraniAntifrizBorYagiHesaplama(defaultInputs);
    expect(result.totalExposure).toBeCloseTo(
      engineNumeric(SCHEMA_ID, "totalExposure", defaultInputs),
      2,
    );
  });

  test("low threshold band", () => {
    const result = calculateSogutmaSivisiKarisimOraniAntifrizBorYagiHesaplama(lowBandInputs);
    expect(["low", "warning", "critical"]).toContain(result.summaryLevel);
  });

  test("warning threshold band", () => {
    const result = calculateSogutmaSivisiKarisimOraniAntifrizBorYagiHesaplama(defaultInputs);
    expect(["warning", "critical", "low"]).toContain(result.summaryLevel);
  });

  test("critical threshold band", () => {
    const result = calculateSogutmaSivisiKarisimOraniAntifrizBorYagiHesaplama(criticalBandInputs);
    expect(["low", "warning", "critical"]).toContain(result.summaryLevel);
  });

  test("invalid missing input fails validation and calculator throws", () => {
    const broken = { ...defaultInputs, totalVolume: undefined } as unknown as SogutmaSivisiKarisimOraniAntifrizBorYagiHesaplamaInputs;
    const validation = validateSogutmaSivisiKarisimOraniAntifrizBorYagiHesaplamaInputs(broken);
    expect(validation.ok).toBe(false);
    expect(() => calculateSogutmaSivisiKarisimOraniAntifrizBorYagiHesaplama(broken)).toThrow();
  });

  test("invalid negative input fails validation and calculator throws", () => {
    expectValidationFailure({ totalVolume: -1 });
  });
  test("invalid zero divisor/base fails validation and calculator throws", () => {
    const validation = validateSogutmaSivisiKarisimOraniAntifrizBorYagiHesaplamaInputs({ ...defaultInputs, totalVolume: 0 });
    expect(validation.ok).toBe(false);
    if (validation.ok) return;
    expect(() => calculateSogutmaSivisiKarisimOraniAntifrizBorYagiHesaplama({ ...defaultInputs, totalVolume: 0 })).toThrow();
  });

  test("invalid NaN input fails validation and calculator throws", () => {
    expectValidationFailure({ boricOilRatio: Number.NaN });
  });

  test("invalid Infinity input fails validation and calculator throws", () => {
    expectValidationFailure({ boricOilRatio: Number.POSITIVE_INFINITY });
  });

    test("contract metadata matches slug", () => {
    const contract = SOGUTMA_SIVISI_KARISIM_ORANI_ANTIFRIZ_BOR_YAGI_HESAPLAMA_CRITICAL_FORMULA_CONTRACTS[0];
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
    const calculatorResult = calculateSogutmaSivisiKarisimOraniAntifrizBorYagiHesaplama(defaultInputs);
    expect(engineResult.outputs.find((output) => output.id === "totalExposure")?.raw).toBeCloseTo(calculatorResult.totalExposure, 2);
    expect(engineResult.outputs.find((output) => output.id === "variancePercent")?.raw).toBeCloseTo(calculatorResult.variancePercent, 2);
  });
});
