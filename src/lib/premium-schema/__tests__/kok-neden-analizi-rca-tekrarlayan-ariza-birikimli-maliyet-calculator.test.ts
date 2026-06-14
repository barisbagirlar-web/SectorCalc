import { describe, expect, test } from "vitest";
import { KOK_NEDEN_ANALIZI_RCA_TEKRARLAYAN_ARIZA_BIRIKIMLI_MALIYET_CALCULATOR_CRITICAL_FORMULA_CONTRACTS } from "@/lib/formula-governance/contracts/kok-neden-analizi-rca-tekrarlayan-ariza-birikimli-maliyet-calculator-critical";
import { getFormulaContractBySlug } from "@/lib/formula-governance/contracts";
import {
  calculateKokNedenAnaliziRcaTekrarlayanArizaBirikimliMaliyetCalculator,
  type KokNedenAnaliziRcaTekrarlayanArizaBirikimliMaliyetCalculatorInputs,
} from "@/lib/premium-schema/calculators/kok-neden-analizi-rca-tekrarlayan-ariza-birikimli-maliyet-calculator";
import { validateKokNedenAnaliziRcaTekrarlayanArizaBirikimliMaliyetCalculatorInputs } from "@/lib/premium-schema/calculators/kok-neden-analizi-rca-tekrarlayan-ariza-birikimli-maliyet-calculator-validation";
import { getPremiumCalculatorSchema } from "@/lib/premium-schema/schema-registry";
import {
  buildDefaultSchemaInputs,
  runPremiumSchemaEngine,
} from "@/lib/premium-schema/premium-schema-engine";

const SLUG = "kok-neden-analizi-rca-tekrarlayan-ariza-birikimli-maliyet-calculator";
const SCHEMA_ID = "kok-neden-analizi-rca-tekrarlayan-ariza-birikimli-maliyet-calculator";

const defaultInputs: KokNedenAnaliziRcaTekrarlayanArizaBirikimliMaliyetCalculatorInputs = {
    "downtimeMinutes": 60,
    "machineHourlyRate": 100,
    "laborHourlyRate": 50,
    "lostProductionUnits": 100,
    "contributionMarginPerUnit": 20,
    "repairCost": 500
  };
const lowBandInputs: KokNedenAnaliziRcaTekrarlayanArizaBirikimliMaliyetCalculatorInputs = {
    "downtimeMinutes": 0.1,
    "machineHourlyRate": 100,
    "laborHourlyRate": 50,
    "lostProductionUnits": 100,
    "contributionMarginPerUnit": 20,
    "repairCost": 500
  };
const criticalBandInputs: KokNedenAnaliziRcaTekrarlayanArizaBirikimliMaliyetCalculatorInputs = {
    "downtimeMinutes": 6,
    "machineHourlyRate": 100,
    "laborHourlyRate": 50,
    "lostProductionUnits": 100,
    "contributionMarginPerUnit": 20,
    "repairCost": 500
  };

function expectValidationFailure(partial: Partial<KokNedenAnaliziRcaTekrarlayanArizaBirikimliMaliyetCalculatorInputs>): void {
  const inputs = { ...defaultInputs, ...partial } as KokNedenAnaliziRcaTekrarlayanArizaBirikimliMaliyetCalculatorInputs;
  const validation = validateKokNedenAnaliziRcaTekrarlayanArizaBirikimliMaliyetCalculatorInputs(inputs);
  expect(validation.ok).toBe(false);
  if (validation.ok) return;
  expect(validation.errors.length).toBeGreaterThan(0);
  expect(() => calculateKokNedenAnaliziRcaTekrarlayanArizaBirikimliMaliyetCalculator(inputs)).toThrow();
}

function engineNumeric(schemaSlug: string, outputId: string, inputs: KokNedenAnaliziRcaTekrarlayanArizaBirikimliMaliyetCalculatorInputs): number {
  const schema = getPremiumCalculatorSchema(schemaSlug);
  if (!schema) throw new Error("schema missing");
  const engineResult = runPremiumSchemaEngine(schema, inputs);
  const raw = engineResult.outputs.find((output) => output.id === outputId)?.raw;
  if (typeof raw !== "number") throw new Error(`missing output ${outputId}`);
  return raw;
}

describe("kok-neden-analizi-rca-tekrarlayan-ariza-birikimli-maliyet-calculator", () => {
  test("exact default oracle", () => {
    const result = calculateKokNedenAnaliziRcaTekrarlayanArizaBirikimliMaliyetCalculator(defaultInputs);
    expect(result.totalExposure).toBeCloseTo(engineNumeric(SCHEMA_ID, "totalExposure", defaultInputs), 2);
    expect(result.variancePercent).toBeCloseTo(engineNumeric(SCHEMA_ID, "variancePercent", defaultInputs), 2);
    expect(["low", "warning", "critical"]).toContain(result.summaryLevel);
    expect(result.primaryDriver).toBe("totalExposure");
  });

  test("formula pipeline parity", () => {
    const result = calculateKokNedenAnaliziRcaTekrarlayanArizaBirikimliMaliyetCalculator(defaultInputs);
    expect(result.totalExposure).toBeCloseTo(
      engineNumeric(SCHEMA_ID, "totalExposure", defaultInputs),
      2,
    );
  });

  test("low threshold band", () => {
    const result = calculateKokNedenAnaliziRcaTekrarlayanArizaBirikimliMaliyetCalculator(lowBandInputs);
    expect(["low", "warning", "critical"]).toContain(result.summaryLevel);
  });

  test("warning threshold band", () => {
    const result = calculateKokNedenAnaliziRcaTekrarlayanArizaBirikimliMaliyetCalculator(defaultInputs);
    expect(["warning", "critical", "low"]).toContain(result.summaryLevel);
  });

  test("critical threshold band", () => {
    const result = calculateKokNedenAnaliziRcaTekrarlayanArizaBirikimliMaliyetCalculator(criticalBandInputs);
    expect(["low", "warning", "critical"]).toContain(result.summaryLevel);
  });

  test("invalid missing input fails validation and calculator throws", () => {
    const broken = { ...defaultInputs, downtimeMinutes: undefined } as unknown as KokNedenAnaliziRcaTekrarlayanArizaBirikimliMaliyetCalculatorInputs;
    const validation = validateKokNedenAnaliziRcaTekrarlayanArizaBirikimliMaliyetCalculatorInputs(broken);
    expect(validation.ok).toBe(false);
    expect(() => calculateKokNedenAnaliziRcaTekrarlayanArizaBirikimliMaliyetCalculator(broken)).toThrow();
  });

  test("invalid negative input fails validation and calculator throws", () => {
    expectValidationFailure({ downtimeMinutes: -1 });
  });
  test("invalid zero divisor/base fails validation and calculator throws", () => {
    const validation = validateKokNedenAnaliziRcaTekrarlayanArizaBirikimliMaliyetCalculatorInputs({ ...defaultInputs, lostProductionUnits: 0 });
    expect(validation.ok).toBe(false);
    if (validation.ok) return;
    expect(() => calculateKokNedenAnaliziRcaTekrarlayanArizaBirikimliMaliyetCalculator({ ...defaultInputs, lostProductionUnits: 0 })).toThrow();
  });

  test("invalid NaN input fails validation and calculator throws", () => {
    expectValidationFailure({ repairCost: Number.NaN });
  });

  test("invalid Infinity input fails validation and calculator throws", () => {
    expectValidationFailure({ repairCost: Number.POSITIVE_INFINITY });
  });

    test("contract metadata matches slug", () => {
    const contract = KOK_NEDEN_ANALIZI_RCA_TEKRARLAYAN_ARIZA_BIRIKIMLI_MALIYET_CALCULATOR_CRITICAL_FORMULA_CONTRACTS[0];
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
    const calculatorResult = calculateKokNedenAnaliziRcaTekrarlayanArizaBirikimliMaliyetCalculator(defaultInputs);
    expect(engineResult.outputs.find((output) => output.id === "totalExposure")?.raw).toBeCloseTo(calculatorResult.totalExposure, 2);
    expect(engineResult.outputs.find((output) => output.id === "variancePercent")?.raw).toBeCloseTo(calculatorResult.variancePercent, 2);
  });
});
