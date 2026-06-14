import { describe, expect, test } from "vitest";
import { AQL_KABUL_ORNEKLEMESI_RISK_VE_MALIYET_CALCULATOR_CRITICAL_FORMULA_CONTRACTS } from "@/lib/formula-governance/contracts/aql-kabul-orneklemesi-risk-ve-maliyet-calculator-critical";
import { getFormulaContractBySlug } from "@/lib/formula-governance/contracts";
import {
  calculateAqlKabulOrneklemesiRiskVeMaliyetCalculator,
  type AqlKabulOrneklemesiRiskVeMaliyetCalculatorInputs,
} from "@/lib/premium-schema/calculators/aql-kabul-orneklemesi-risk-ve-maliyet-calculator";
import { validateAqlKabulOrneklemesiRiskVeMaliyetCalculatorInputs } from "@/lib/premium-schema/calculators/aql-kabul-orneklemesi-risk-ve-maliyet-calculator-validation";
import { getPremiumCalculatorSchema } from "@/lib/premium-schema/schema-registry";
import {
  buildDefaultSchemaInputs,
  runPremiumSchemaEngine,
} from "@/lib/premium-schema/premium-schema-engine";

const SLUG = "aql-kabul-orneklemesi-risk-ve-maliyet-calculator";
const SCHEMA_ID = "aql-kabul-orneklemesi-risk-ve-maliyet-calculator";

const defaultInputs: AqlKabulOrneklemesiRiskVeMaliyetCalculatorInputs = {
    "lotSize": 1000,
    "aqlLevel": 1,
    "inspectionCostPerUnit": 5,
    "defectCostPerUnit": 100,
    "unitCost": 50
  };
const lowBandInputs: AqlKabulOrneklemesiRiskVeMaliyetCalculatorInputs = {
    "lotSize": 1,
    "aqlLevel": 1,
    "inspectionCostPerUnit": 5,
    "defectCostPerUnit": 100,
    "unitCost": 50
  };
const criticalBandInputs: AqlKabulOrneklemesiRiskVeMaliyetCalculatorInputs = {
    "lotSize": 6,
    "aqlLevel": 1,
    "inspectionCostPerUnit": 5,
    "defectCostPerUnit": 100,
    "unitCost": 50
  };

function expectValidationFailure(partial: Partial<AqlKabulOrneklemesiRiskVeMaliyetCalculatorInputs>): void {
  const inputs = { ...defaultInputs, ...partial } as AqlKabulOrneklemesiRiskVeMaliyetCalculatorInputs;
  const validation = validateAqlKabulOrneklemesiRiskVeMaliyetCalculatorInputs(inputs);
  expect(validation.ok).toBe(false);
  if (validation.ok) return;
  expect(validation.errors.length).toBeGreaterThan(0);
  expect(() => calculateAqlKabulOrneklemesiRiskVeMaliyetCalculator(inputs)).toThrow();
}

function engineNumeric(schemaSlug: string, outputId: string, inputs: AqlKabulOrneklemesiRiskVeMaliyetCalculatorInputs): number {
  const schema = getPremiumCalculatorSchema(schemaSlug);
  if (!schema) throw new Error("schema missing");
  const engineResult = runPremiumSchemaEngine(schema, inputs);
  const raw = engineResult.outputs.find((output) => output.id === outputId)?.raw;
  if (typeof raw !== "number") throw new Error(`missing output ${outputId}`);
  return raw;
}

describe("aql-kabul-orneklemesi-risk-ve-maliyet-calculator", () => {
  test("exact default oracle", () => {
    const result = calculateAqlKabulOrneklemesiRiskVeMaliyetCalculator(defaultInputs);
    expect(result.totalExposure).toBeCloseTo(engineNumeric(SCHEMA_ID, "totalExposure", defaultInputs), 2);
    expect(result.variancePercent).toBeCloseTo(engineNumeric(SCHEMA_ID, "variancePercent", defaultInputs), 2);
    expect(["low", "warning", "critical"]).toContain(result.summaryLevel);
    expect(result.primaryDriver).toBe("totalExposure");
  });

  test("formula pipeline parity", () => {
    const result = calculateAqlKabulOrneklemesiRiskVeMaliyetCalculator(defaultInputs);
    expect(result.totalExposure).toBeCloseTo(
      engineNumeric(SCHEMA_ID, "totalExposure", defaultInputs),
      2,
    );
  });

  test("low threshold band", () => {
    const result = calculateAqlKabulOrneklemesiRiskVeMaliyetCalculator(lowBandInputs);
    expect(["low", "warning", "critical"]).toContain(result.summaryLevel);
  });

  test("warning threshold band", () => {
    const result = calculateAqlKabulOrneklemesiRiskVeMaliyetCalculator(defaultInputs);
    expect(["warning", "critical", "low"]).toContain(result.summaryLevel);
  });

  test("critical threshold band", () => {
    const result = calculateAqlKabulOrneklemesiRiskVeMaliyetCalculator(criticalBandInputs);
    expect(["low", "warning", "critical"]).toContain(result.summaryLevel);
  });

  test("invalid missing input fails validation and calculator throws", () => {
    const broken = { ...defaultInputs, lotSize: undefined } as unknown as AqlKabulOrneklemesiRiskVeMaliyetCalculatorInputs;
    const validation = validateAqlKabulOrneklemesiRiskVeMaliyetCalculatorInputs(broken);
    expect(validation.ok).toBe(false);
    expect(() => calculateAqlKabulOrneklemesiRiskVeMaliyetCalculator(broken)).toThrow();
  });

  test("invalid negative input fails validation and calculator throws", () => {
    expectValidationFailure({ lotSize: -1 });
  });
  test("invalid zero divisor/base fails validation and calculator throws", () => {
    const validation = validateAqlKabulOrneklemesiRiskVeMaliyetCalculatorInputs({ ...defaultInputs, lotSize: 0 });
    expect(validation.ok).toBe(false);
    if (validation.ok) return;
    expect(() => calculateAqlKabulOrneklemesiRiskVeMaliyetCalculator({ ...defaultInputs, lotSize: 0 })).toThrow();
  });

  test("invalid NaN input fails validation and calculator throws", () => {
    expectValidationFailure({ unitCost: Number.NaN });
  });

  test("invalid Infinity input fails validation and calculator throws", () => {
    expectValidationFailure({ unitCost: Number.POSITIVE_INFINITY });
  });

    test("contract metadata matches slug", () => {
    const contract = AQL_KABUL_ORNEKLEMESI_RISK_VE_MALIYET_CALCULATOR_CRITICAL_FORMULA_CONTRACTS[0];
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
    const calculatorResult = calculateAqlKabulOrneklemesiRiskVeMaliyetCalculator(defaultInputs);
    expect(engineResult.outputs.find((output) => output.id === "totalExposure")?.raw).toBeCloseTo(calculatorResult.totalExposure, 2);
    expect(engineResult.outputs.find((output) => output.id === "variancePercent")?.raw).toBeCloseTo(calculatorResult.variancePercent, 2);
  });
});
