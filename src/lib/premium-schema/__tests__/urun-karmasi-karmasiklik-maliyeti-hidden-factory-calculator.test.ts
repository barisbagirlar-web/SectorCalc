import { describe, expect, test } from "vitest";
import { URUN_KARMASI_KARMASIKLIK_MALIYETI_HIDDEN_FACTORY_CALCULATOR_CRITICAL_FORMULA_CONTRACTS } from "@/lib/formula-governance/contracts/urun-karmasi-karmasiklik-maliyeti-hidden-factory-calculator-critical";
import { getFormulaContractBySlug } from "@/lib/formula-governance/contracts";
import {
  calculateUrunKarmasiKarmasiklikMaliyetiHiddenFactoryCalculator,
  type UrunKarmasiKarmasiklikMaliyetiHiddenFactoryCalculatorInputs,
} from "@/lib/premium-schema/calculators/urun-karmasi-karmasiklik-maliyeti-hidden-factory-calculator";
import { validateUrunKarmasiKarmasiklikMaliyetiHiddenFactoryCalculatorInputs } from "@/lib/premium-schema/calculators/urun-karmasi-karmasiklik-maliyeti-hidden-factory-calculator-validation";
import { getPremiumCalculatorSchema } from "@/lib/premium-schema/schema-registry";
import {
  buildDefaultSchemaInputs,
  runPremiumSchemaEngine,
} from "@/lib/premium-schema/premium-schema-engine";

const SLUG = "urun-karmasi-karmasiklik-maliyeti-hidden-factory-calculator";
const SCHEMA_ID = "urun-karmasi-karmasiklik-maliyeti-hidden-factory-calculator";

const defaultInputs: UrunKarmasiKarmasiklikMaliyetiHiddenFactoryCalculatorInputs = {
    "productionQuantity": 100,
    "unitMaterialCost": 10,
    "scrapRatePercent": 5,
    "unitLaborCost": 5,
    "unitOverheadBurden": 3,
    "baseOverheadRate": 2
  };
const lowBandInputs: UrunKarmasiKarmasiklikMaliyetiHiddenFactoryCalculatorInputs = {
    "productionQuantity": 1,
    "unitMaterialCost": 10,
    "scrapRatePercent": 5,
    "unitLaborCost": 5,
    "unitOverheadBurden": 3,
    "baseOverheadRate": 2
  };
const criticalBandInputs: UrunKarmasiKarmasiklikMaliyetiHiddenFactoryCalculatorInputs = {
    "productionQuantity": 6,
    "unitMaterialCost": 10,
    "scrapRatePercent": 5,
    "unitLaborCost": 5,
    "unitOverheadBurden": 3,
    "baseOverheadRate": 2
  };

function expectValidationFailure(partial: Partial<UrunKarmasiKarmasiklikMaliyetiHiddenFactoryCalculatorInputs>): void {
  const inputs = { ...defaultInputs, ...partial } as UrunKarmasiKarmasiklikMaliyetiHiddenFactoryCalculatorInputs;
  const validation = validateUrunKarmasiKarmasiklikMaliyetiHiddenFactoryCalculatorInputs(inputs);
  expect(validation.ok).toBe(false);
  if (validation.ok) return;
  expect(validation.errors.length).toBeGreaterThan(0);
  expect(() => calculateUrunKarmasiKarmasiklikMaliyetiHiddenFactoryCalculator(inputs)).toThrow();
}

function engineNumeric(schemaSlug: string, outputId: string, inputs: UrunKarmasiKarmasiklikMaliyetiHiddenFactoryCalculatorInputs): number {
  const schema = getPremiumCalculatorSchema(schemaSlug);
  if (!schema) throw new Error("schema missing");
  const engineResult = runPremiumSchemaEngine(schema, inputs);
  const raw = engineResult.outputs.find((output) => output.id === outputId)?.raw;
  if (typeof raw !== "number") throw new Error(`missing output ${outputId}`);
  return raw;
}

describe("urun-karmasi-karmasiklik-maliyeti-hidden-factory-calculator", () => {
  test("exact default oracle", () => {
    const result = calculateUrunKarmasiKarmasiklikMaliyetiHiddenFactoryCalculator(defaultInputs);
    expect(result.totalExposure).toBeCloseTo(engineNumeric(SCHEMA_ID, "totalExposure", defaultInputs), 2);
    expect(result.variancePercent).toBeCloseTo(engineNumeric(SCHEMA_ID, "variancePercent", defaultInputs), 2);
    expect(["low", "warning", "critical"]).toContain(result.summaryLevel);
    expect(result.primaryDriver).toBe("totalExposure");
  });

  test("formula pipeline parity", () => {
    const result = calculateUrunKarmasiKarmasiklikMaliyetiHiddenFactoryCalculator(defaultInputs);
    expect(result.totalExposure).toBeCloseTo(
      engineNumeric(SCHEMA_ID, "totalExposure", defaultInputs),
      2,
    );
  });

  test("low threshold band", () => {
    const result = calculateUrunKarmasiKarmasiklikMaliyetiHiddenFactoryCalculator(lowBandInputs);
    expect(["low", "warning", "critical"]).toContain(result.summaryLevel);
  });

  test("warning threshold band", () => {
    const result = calculateUrunKarmasiKarmasiklikMaliyetiHiddenFactoryCalculator(defaultInputs);
    expect(["warning", "critical", "low"]).toContain(result.summaryLevel);
  });

  test("critical threshold band", () => {
    const result = calculateUrunKarmasiKarmasiklikMaliyetiHiddenFactoryCalculator(criticalBandInputs);
    expect(["low", "warning", "critical"]).toContain(result.summaryLevel);
  });

  test("invalid missing input fails validation and calculator throws", () => {
    const broken = { ...defaultInputs, productionQuantity: undefined } as unknown as UrunKarmasiKarmasiklikMaliyetiHiddenFactoryCalculatorInputs;
    const validation = validateUrunKarmasiKarmasiklikMaliyetiHiddenFactoryCalculatorInputs(broken);
    expect(validation.ok).toBe(false);
    expect(() => calculateUrunKarmasiKarmasiklikMaliyetiHiddenFactoryCalculator(broken)).toThrow();
  });

  test("invalid negative input fails validation and calculator throws", () => {
    expectValidationFailure({ productionQuantity: -1 });
  });
  test("invalid zero divisor/base fails validation and calculator throws", () => {
    const validation = validateUrunKarmasiKarmasiklikMaliyetiHiddenFactoryCalculatorInputs({ ...defaultInputs, productionQuantity: 0 });
    expect(validation.ok).toBe(false);
    if (validation.ok) return;
    expect(() => calculateUrunKarmasiKarmasiklikMaliyetiHiddenFactoryCalculator({ ...defaultInputs, productionQuantity: 0 })).toThrow();
  });

  test("invalid NaN input fails validation and calculator throws", () => {
    expectValidationFailure({ baseOverheadRate: Number.NaN });
  });

  test("invalid Infinity input fails validation and calculator throws", () => {
    expectValidationFailure({ baseOverheadRate: Number.POSITIVE_INFINITY });
  });

    test("contract metadata matches slug", () => {
    const contract = URUN_KARMASI_KARMASIKLIK_MALIYETI_HIDDEN_FACTORY_CALCULATOR_CRITICAL_FORMULA_CONTRACTS[0];
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
    const calculatorResult = calculateUrunKarmasiKarmasiklikMaliyetiHiddenFactoryCalculator(defaultInputs);
    expect(engineResult.outputs.find((output) => output.id === "totalExposure")?.raw).toBeCloseTo(calculatorResult.totalExposure, 2);
    expect(engineResult.outputs.find((output) => output.id === "variancePercent")?.raw).toBeCloseTo(calculatorResult.variancePercent, 2);
  });
});
