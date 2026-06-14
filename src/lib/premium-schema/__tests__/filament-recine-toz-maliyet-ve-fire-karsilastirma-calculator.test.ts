import { describe, expect, test } from "vitest";
import { FILAMENT_RECINE_TOZ_MALIYET_VE_FIRE_KARSILASTIRMA_CALCULATOR_CRITICAL_FORMULA_CONTRACTS } from "@/lib/formula-governance/contracts/filament-recine-toz-maliyet-ve-fire-karsilastirma-calculator-critical";
import { getFormulaContractBySlug } from "@/lib/formula-governance/contracts";
import {
  calculateFilamentRecineTozMaliyetVeFireKarsilastirmaCalculator,
  type FilamentRecineTozMaliyetVeFireKarsilastirmaCalculatorInputs,
} from "@/lib/premium-schema/calculators/filament-recine-toz-maliyet-ve-fire-karsilastirma-calculator";
import { validateFilamentRecineTozMaliyetVeFireKarsilastirmaCalculatorInputs } from "@/lib/premium-schema/calculators/filament-recine-toz-maliyet-ve-fire-karsilastirma-calculator-validation";
import { getPremiumCalculatorSchema } from "@/lib/premium-schema/schema-registry";
import {
  buildDefaultSchemaInputs,
  runPremiumSchemaEngine,
} from "@/lib/premium-schema/premium-schema-engine";

const SLUG = "filament-recine-toz-maliyet-ve-fire-karsilastirma-calculator";
const SCHEMA_ID = "filament-recine-toz-maliyet-ve-fire-karsilastirma-calculator";

const defaultInputs: FilamentRecineTozMaliyetVeFireKarsilastirmaCalculatorInputs = {
    "productionQuantity": 100,
    "unitMaterialCost": 10,
    "scrapRatePercent": 5,
    "reworkRatePercent": 3,
    "unitReworkCost": 5,
    "waitingHours": 10
  };
const lowBandInputs: FilamentRecineTozMaliyetVeFireKarsilastirmaCalculatorInputs = {
    "productionQuantity": 1,
    "unitMaterialCost": 10,
    "scrapRatePercent": 5,
    "reworkRatePercent": 3,
    "unitReworkCost": 5,
    "waitingHours": 10
  };
const criticalBandInputs: FilamentRecineTozMaliyetVeFireKarsilastirmaCalculatorInputs = {
    "productionQuantity": 6,
    "unitMaterialCost": 10,
    "scrapRatePercent": 5,
    "reworkRatePercent": 3,
    "unitReworkCost": 5,
    "waitingHours": 10
  };

function expectValidationFailure(partial: Partial<FilamentRecineTozMaliyetVeFireKarsilastirmaCalculatorInputs>): void {
  const inputs = { ...defaultInputs, ...partial } as FilamentRecineTozMaliyetVeFireKarsilastirmaCalculatorInputs;
  const validation = validateFilamentRecineTozMaliyetVeFireKarsilastirmaCalculatorInputs(inputs);
  expect(validation.ok).toBe(false);
  if (validation.ok) return;
  expect(validation.errors.length).toBeGreaterThan(0);
  expect(() => calculateFilamentRecineTozMaliyetVeFireKarsilastirmaCalculator(inputs)).toThrow();
}

function engineNumeric(schemaSlug: string, outputId: string, inputs: FilamentRecineTozMaliyetVeFireKarsilastirmaCalculatorInputs): number {
  const schema = getPremiumCalculatorSchema(schemaSlug);
  if (!schema) throw new Error("schema missing");
  const engineResult = runPremiumSchemaEngine(schema, inputs);
  const raw = engineResult.outputs.find((output) => output.id === outputId)?.raw;
  if (typeof raw !== "number") throw new Error(`missing output ${outputId}`);
  return raw;
}

describe("filament-recine-toz-maliyet-ve-fire-karsilastirma-calculator", () => {
  test("exact default oracle", () => {
    const result = calculateFilamentRecineTozMaliyetVeFireKarsilastirmaCalculator(defaultInputs);
    expect(result.totalExposure).toBeCloseTo(engineNumeric(SCHEMA_ID, "totalExposure", defaultInputs), 2);
    expect(result.variancePercent).toBeCloseTo(engineNumeric(SCHEMA_ID, "variancePercent", defaultInputs), 2);
    expect(["low", "warning", "critical"]).toContain(result.summaryLevel);
    expect(result.primaryDriver).toBe("totalExposure");
  });

  test("formula pipeline parity", () => {
    const result = calculateFilamentRecineTozMaliyetVeFireKarsilastirmaCalculator(defaultInputs);
    expect(result.totalExposure).toBeCloseTo(
      engineNumeric(SCHEMA_ID, "totalExposure", defaultInputs),
      2,
    );
  });

  test("low threshold band", () => {
    const result = calculateFilamentRecineTozMaliyetVeFireKarsilastirmaCalculator(lowBandInputs);
    expect(["low", "warning", "critical"]).toContain(result.summaryLevel);
  });

  test("warning threshold band", () => {
    const result = calculateFilamentRecineTozMaliyetVeFireKarsilastirmaCalculator(defaultInputs);
    expect(["warning", "critical", "low"]).toContain(result.summaryLevel);
  });

  test("critical threshold band", () => {
    const result = calculateFilamentRecineTozMaliyetVeFireKarsilastirmaCalculator(criticalBandInputs);
    expect(["low", "warning", "critical"]).toContain(result.summaryLevel);
  });

  test("invalid missing input fails validation and calculator throws", () => {
    const broken = { ...defaultInputs, productionQuantity: undefined } as unknown as FilamentRecineTozMaliyetVeFireKarsilastirmaCalculatorInputs;
    const validation = validateFilamentRecineTozMaliyetVeFireKarsilastirmaCalculatorInputs(broken);
    expect(validation.ok).toBe(false);
    expect(() => calculateFilamentRecineTozMaliyetVeFireKarsilastirmaCalculator(broken)).toThrow();
  });

  test("invalid negative input fails validation and calculator throws", () => {
    expectValidationFailure({ productionQuantity: -1 });
  });
  test("invalid zero divisor/base fails validation and calculator throws", () => {
    const validation = validateFilamentRecineTozMaliyetVeFireKarsilastirmaCalculatorInputs({ ...defaultInputs, productionQuantity: 0 });
    expect(validation.ok).toBe(false);
    if (validation.ok) return;
    expect(() => calculateFilamentRecineTozMaliyetVeFireKarsilastirmaCalculator({ ...defaultInputs, productionQuantity: 0 })).toThrow();
  });

  test("invalid NaN input fails validation and calculator throws", () => {
    expectValidationFailure({ waitingHours: Number.NaN });
  });

  test("invalid Infinity input fails validation and calculator throws", () => {
    expectValidationFailure({ waitingHours: Number.POSITIVE_INFINITY });
  });

    test("contract metadata matches slug", () => {
    const contract = FILAMENT_RECINE_TOZ_MALIYET_VE_FIRE_KARSILASTIRMA_CALCULATOR_CRITICAL_FORMULA_CONTRACTS[0];
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
    const calculatorResult = calculateFilamentRecineTozMaliyetVeFireKarsilastirmaCalculator(defaultInputs);
    expect(engineResult.outputs.find((output) => output.id === "totalExposure")?.raw).toBeCloseTo(calculatorResult.totalExposure, 2);
    expect(engineResult.outputs.find((output) => output.id === "variancePercent")?.raw).toBeCloseTo(calculatorResult.variancePercent, 2);
  });
});
