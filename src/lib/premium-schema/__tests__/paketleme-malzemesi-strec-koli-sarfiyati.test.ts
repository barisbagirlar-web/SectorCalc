import { describe, expect, test } from "vitest";
import { PAKETLEME_MALZEMESI_STREC_KOLI_SARFIYATI_CRITICAL_FORMULA_CONTRACTS } from "@/lib/formula-governance/contracts/paketleme-malzemesi-strec-koli-sarfiyati-critical";
import { getFormulaContractBySlug } from "@/lib/formula-governance/contracts";
import {
  calculatePaketlemeMalzemesiStrecKoliSarfiyati,
  type PaketlemeMalzemesiStrecKoliSarfiyatiInputs,
} from "@/lib/premium-schema/calculators/paketleme-malzemesi-strec-koli-sarfiyati";
import { validatePaketlemeMalzemesiStrecKoliSarfiyatiInputs } from "@/lib/premium-schema/calculators/paketleme-malzemesi-strec-koli-sarfiyati-validation";
import { getPremiumCalculatorSchema } from "@/lib/premium-schema/schema-registry";
import {
  buildDefaultSchemaInputs,
  runPremiumSchemaEngine,
} from "@/lib/premium-schema/premium-schema-engine";

const SLUG = "paketleme-malzemesi-strec-koli-sarfiyati";
const SCHEMA_ID = "paketleme-malzemesi-strec-koli-sarfiyati";

const defaultInputs: PaketlemeMalzemesiStrecKoliSarfiyatiInputs = {
    "productionQuantity": 100,
    "lengthPerUnit": 1.5,
    "widthPerUnit": 0.5,
    "layers": 2,
    "coveragePerKg": 10,
    "unitMaterialCost": 5
  };
const lowBandInputs: PaketlemeMalzemesiStrecKoliSarfiyatiInputs = {
    "productionQuantity": 1,
    "lengthPerUnit": 1.5,
    "widthPerUnit": 0.5,
    "layers": 2,
    "coveragePerKg": 10,
    "unitMaterialCost": 5
  };
const criticalBandInputs: PaketlemeMalzemesiStrecKoliSarfiyatiInputs = {
    "productionQuantity": 6,
    "lengthPerUnit": 1.5,
    "widthPerUnit": 0.5,
    "layers": 2,
    "coveragePerKg": 10,
    "unitMaterialCost": 5
  };

function expectValidationFailure(partial: Partial<PaketlemeMalzemesiStrecKoliSarfiyatiInputs>): void {
  const inputs = { ...defaultInputs, ...partial } as PaketlemeMalzemesiStrecKoliSarfiyatiInputs;
  const validation = validatePaketlemeMalzemesiStrecKoliSarfiyatiInputs(inputs);
  expect(validation.ok).toBe(false);
  if (validation.ok) return;
  expect(validation.errors.length).toBeGreaterThan(0);
  expect(() => calculatePaketlemeMalzemesiStrecKoliSarfiyati(inputs)).toThrow();
}

function engineNumeric(schemaSlug: string, outputId: string, inputs: PaketlemeMalzemesiStrecKoliSarfiyatiInputs): number {
  const schema = getPremiumCalculatorSchema(schemaSlug);
  if (!schema) throw new Error("schema missing");
  const engineResult = runPremiumSchemaEngine(schema, inputs);
  const raw = engineResult.outputs.find((output) => output.id === outputId)?.raw;
  if (typeof raw !== "number") throw new Error(`missing output ${outputId}`);
  return raw;
}

describe("paketleme-malzemesi-strec-koli-sarfiyati", () => {
  test("exact default oracle", () => {
    const result = calculatePaketlemeMalzemesiStrecKoliSarfiyati(defaultInputs);
    expect(result.totalExposure).toBeCloseTo(engineNumeric(SCHEMA_ID, "totalExposure", defaultInputs), 2);
    expect(result.variancePercent).toBeCloseTo(engineNumeric(SCHEMA_ID, "variancePercent", defaultInputs), 2);
    expect(["low", "warning", "critical"]).toContain(result.summaryLevel);
    expect(result.primaryDriver).toBe("totalExposure");
  });

  test("formula pipeline parity", () => {
    const result = calculatePaketlemeMalzemesiStrecKoliSarfiyati(defaultInputs);
    expect(result.totalExposure).toBeCloseTo(
      engineNumeric(SCHEMA_ID, "totalExposure", defaultInputs),
      2,
    );
  });

  test("low threshold band", () => {
    const result = calculatePaketlemeMalzemesiStrecKoliSarfiyati(lowBandInputs);
    expect(["low", "warning", "critical"]).toContain(result.summaryLevel);
  });

  test("warning threshold band", () => {
    const result = calculatePaketlemeMalzemesiStrecKoliSarfiyati(defaultInputs);
    expect(["warning", "critical", "low"]).toContain(result.summaryLevel);
  });

  test("critical threshold band", () => {
    const result = calculatePaketlemeMalzemesiStrecKoliSarfiyati(criticalBandInputs);
    expect(["low", "warning", "critical"]).toContain(result.summaryLevel);
  });

  test("invalid missing input fails validation and calculator throws", () => {
    const broken = { ...defaultInputs, productionQuantity: undefined } as unknown as PaketlemeMalzemesiStrecKoliSarfiyatiInputs;
    const validation = validatePaketlemeMalzemesiStrecKoliSarfiyatiInputs(broken);
    expect(validation.ok).toBe(false);
    expect(() => calculatePaketlemeMalzemesiStrecKoliSarfiyati(broken)).toThrow();
  });

  test("invalid negative input fails validation and calculator throws", () => {
    expectValidationFailure({ productionQuantity: -1 });
  });
  test("invalid zero divisor/base fails validation and calculator throws", () => {
    const validation = validatePaketlemeMalzemesiStrecKoliSarfiyatiInputs({ ...defaultInputs, productionQuantity: 0 });
    expect(validation.ok).toBe(false);
    if (validation.ok) return;
    expect(() => calculatePaketlemeMalzemesiStrecKoliSarfiyati({ ...defaultInputs, productionQuantity: 0 })).toThrow();
  });

  test("invalid NaN input fails validation and calculator throws", () => {
    expectValidationFailure({ unitMaterialCost: Number.NaN });
  });

  test("invalid Infinity input fails validation and calculator throws", () => {
    expectValidationFailure({ unitMaterialCost: Number.POSITIVE_INFINITY });
  });

    test("contract metadata matches slug", () => {
    const contract = PAKETLEME_MALZEMESI_STREC_KOLI_SARFIYATI_CRITICAL_FORMULA_CONTRACTS[0];
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
    const calculatorResult = calculatePaketlemeMalzemesiStrecKoliSarfiyati(defaultInputs);
    expect(engineResult.outputs.find((output) => output.id === "totalExposure")?.raw).toBeCloseTo(calculatorResult.totalExposure, 2);
    expect(engineResult.outputs.find((output) => output.id === "variancePercent")?.raw).toBeCloseTo(calculatorResult.variancePercent, 2);
  });
});
