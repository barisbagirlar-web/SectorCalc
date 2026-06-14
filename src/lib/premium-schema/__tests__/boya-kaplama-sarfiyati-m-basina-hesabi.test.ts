import { describe, expect, test } from "vitest";
import { BOYA_KAPLAMA_SARFIYATI_M_BASINA_HESABI_CRITICAL_FORMULA_CONTRACTS } from "@/lib/formula-governance/contracts/boya-kaplama-sarfiyati-m-basina-hesabi-critical";
import { getFormulaContractBySlug } from "@/lib/formula-governance/contracts";
import {
  calculateBoyaKaplamaSarfiyatiMBasinaHesabi,
  type BoyaKaplamaSarfiyatiMBasinaHesabiInputs,
} from "@/lib/premium-schema/calculators/boya-kaplama-sarfiyati-m-basina-hesabi";
import { validateBoyaKaplamaSarfiyatiMBasinaHesabiInputs } from "@/lib/premium-schema/calculators/boya-kaplama-sarfiyati-m-basina-hesabi-validation";
import { getPremiumCalculatorSchema } from "@/lib/premium-schema/schema-registry";
import {
  buildDefaultSchemaInputs,
  runPremiumSchemaEngine,
} from "@/lib/premium-schema/premium-schema-engine";

const SLUG = "boya-kaplama-sarfiyati-m-basina-hesabi";
const SCHEMA_ID = "boya-kaplama-sarfiyati-m-basina-hesabi";

const defaultInputs: BoyaKaplamaSarfiyatiMBasinaHesabiInputs = {
    "jobArea": 100,
    "dryFilmThickness": 100,
    "volumeSolidsPercent": 60,
    "applicationLossFactor": 1.2,
    "unitPaintCost": 20,
    "laborHours": 8
  };
const lowBandInputs: BoyaKaplamaSarfiyatiMBasinaHesabiInputs = {
    "jobArea": 0.1,
    "dryFilmThickness": 100,
    "volumeSolidsPercent": 60,
    "applicationLossFactor": 1.2,
    "unitPaintCost": 20,
    "laborHours": 8
  };
const criticalBandInputs: BoyaKaplamaSarfiyatiMBasinaHesabiInputs = {
    "jobArea": 6,
    "dryFilmThickness": 100,
    "volumeSolidsPercent": 60,
    "applicationLossFactor": 1.2,
    "unitPaintCost": 20,
    "laborHours": 8
  };

function expectValidationFailure(partial: Partial<BoyaKaplamaSarfiyatiMBasinaHesabiInputs>): void {
  const inputs = { ...defaultInputs, ...partial } as BoyaKaplamaSarfiyatiMBasinaHesabiInputs;
  const validation = validateBoyaKaplamaSarfiyatiMBasinaHesabiInputs(inputs);
  expect(validation.ok).toBe(false);
  if (validation.ok) return;
  expect(validation.errors.length).toBeGreaterThan(0);
  expect(() => calculateBoyaKaplamaSarfiyatiMBasinaHesabi(inputs)).toThrow();
}

function engineNumeric(schemaSlug: string, outputId: string, inputs: BoyaKaplamaSarfiyatiMBasinaHesabiInputs): number {
  const schema = getPremiumCalculatorSchema(schemaSlug);
  if (!schema) throw new Error("schema missing");
  const engineResult = runPremiumSchemaEngine(schema, inputs);
  const raw = engineResult.outputs.find((output) => output.id === outputId)?.raw;
  if (typeof raw !== "number") throw new Error(`missing output ${outputId}`);
  return raw;
}

describe("boya-kaplama-sarfiyati-m-basina-hesabi", () => {
  test("exact default oracle", () => {
    const result = calculateBoyaKaplamaSarfiyatiMBasinaHesabi(defaultInputs);
    expect(result.totalExposure).toBeCloseTo(engineNumeric(SCHEMA_ID, "totalExposure", defaultInputs), 2);
    expect(result.variancePercent).toBeCloseTo(engineNumeric(SCHEMA_ID, "variancePercent", defaultInputs), 2);
    expect(["low", "warning", "critical"]).toContain(result.summaryLevel);
    expect(result.primaryDriver).toBe("totalExposure");
  });

  test("formula pipeline parity", () => {
    const result = calculateBoyaKaplamaSarfiyatiMBasinaHesabi(defaultInputs);
    expect(result.totalExposure).toBeCloseTo(
      engineNumeric(SCHEMA_ID, "totalExposure", defaultInputs),
      2,
    );
  });

  test("low threshold band", () => {
    const result = calculateBoyaKaplamaSarfiyatiMBasinaHesabi(lowBandInputs);
    expect(["low", "warning", "critical"]).toContain(result.summaryLevel);
  });

  test("warning threshold band", () => {
    const result = calculateBoyaKaplamaSarfiyatiMBasinaHesabi(defaultInputs);
    expect(["warning", "critical", "low"]).toContain(result.summaryLevel);
  });

  test("critical threshold band", () => {
    const result = calculateBoyaKaplamaSarfiyatiMBasinaHesabi(criticalBandInputs);
    expect(["low", "warning", "critical"]).toContain(result.summaryLevel);
  });

  test("invalid missing input fails validation and calculator throws", () => {
    const broken = { ...defaultInputs, jobArea: undefined } as unknown as BoyaKaplamaSarfiyatiMBasinaHesabiInputs;
    const validation = validateBoyaKaplamaSarfiyatiMBasinaHesabiInputs(broken);
    expect(validation.ok).toBe(false);
    expect(() => calculateBoyaKaplamaSarfiyatiMBasinaHesabi(broken)).toThrow();
  });

  test("invalid negative input fails validation and calculator throws", () => {
    expectValidationFailure({ jobArea: -1 });
  });
  test("invalid zero divisor/base fails validation and calculator throws", () => {
    const validation = validateBoyaKaplamaSarfiyatiMBasinaHesabiInputs({ ...defaultInputs, jobArea: 0 });
    expect(validation.ok).toBe(false);
    if (validation.ok) return;
    expect(() => calculateBoyaKaplamaSarfiyatiMBasinaHesabi({ ...defaultInputs, jobArea: 0 })).toThrow();
  });

  test("invalid NaN input fails validation and calculator throws", () => {
    expectValidationFailure({ laborHours: Number.NaN });
  });

  test("invalid Infinity input fails validation and calculator throws", () => {
    expectValidationFailure({ laborHours: Number.POSITIVE_INFINITY });
  });

    test("contract metadata matches slug", () => {
    const contract = BOYA_KAPLAMA_SARFIYATI_M_BASINA_HESABI_CRITICAL_FORMULA_CONTRACTS[0];
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
    const calculatorResult = calculateBoyaKaplamaSarfiyatiMBasinaHesabi(defaultInputs);
    expect(engineResult.outputs.find((output) => output.id === "totalExposure")?.raw).toBeCloseTo(calculatorResult.totalExposure, 2);
    expect(engineResult.outputs.find((output) => output.id === "variancePercent")?.raw).toBeCloseTo(calculatorResult.variancePercent, 2);
  });
});
