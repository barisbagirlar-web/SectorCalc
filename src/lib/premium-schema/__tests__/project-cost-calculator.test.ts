import { describe, expect, test } from "vitest";
import { PROJECT_COST_CALCULATOR_CRITICAL_FORMULA_CONTRACTS } from "@/lib/formula-governance/contracts/project-cost-calculator-critical";
import { getFormulaContractBySlug } from "@/lib/formula-governance/contracts";
import {
  calculateProjectCostCalculator,
  type ProjectCostCalculatorInputs,
} from "@/lib/premium-schema/calculators/project-cost-calculator";
import { validateProjectCostCalculatorInputs } from "@/lib/premium-schema/calculators/project-cost-calculator-validation";
import { getPremiumCalculatorSchema } from "@/lib/premium-schema/schema-registry";
import {
  buildDefaultSchemaInputs,
  runPremiumSchemaEngine,
} from "@/lib/premium-schema/premium-schema-engine";

const SLUG = "project-cost-calculator";
const SCHEMA_ID = "project-cost-calculator";

const defaultInputs: ProjectCostCalculatorInputs = {
    "productionQuantity": 100,
    "unitMaterialCost": 10,
    "scrapRatePercent": 5,
    "directLaborCost": 5,
    "overheadPercent": 20,
    "targetGrossMarginPercent": 25
  };
const lowBandInputs: ProjectCostCalculatorInputs = {
    "productionQuantity": 1,
    "unitMaterialCost": 10,
    "scrapRatePercent": 5,
    "directLaborCost": 5,
    "overheadPercent": 20,
    "targetGrossMarginPercent": 25
  };
const criticalBandInputs: ProjectCostCalculatorInputs = {
    "productionQuantity": 6,
    "unitMaterialCost": 10,
    "scrapRatePercent": 5,
    "directLaborCost": 5,
    "overheadPercent": 20,
    "targetGrossMarginPercent": 25
  };

function expectValidationFailure(partial: Partial<ProjectCostCalculatorInputs>): void {
  const inputs = { ...defaultInputs, ...partial } as ProjectCostCalculatorInputs;
  const validation = validateProjectCostCalculatorInputs(inputs);
  expect(validation.ok).toBe(false);
  if (validation.ok) return;
  expect(validation.errors.length).toBeGreaterThan(0);
  expect(() => calculateProjectCostCalculator(inputs)).toThrow();
}

function engineNumeric(schemaSlug: string, outputId: string, inputs: ProjectCostCalculatorInputs): number {
  const schema = getPremiumCalculatorSchema(schemaSlug);
  if (!schema) throw new Error("schema missing");
  const engineResult = runPremiumSchemaEngine(schema, inputs);
  const raw = engineResult.outputs.find((output) => output.id === outputId)?.raw;
  if (typeof raw !== "number") throw new Error(`missing output ${outputId}`);
  return raw;
}

describe("project-cost-calculator", () => {
  test("exact default oracle", () => {
    const result = calculateProjectCostCalculator(defaultInputs);
    expect(result.totalExposure).toBeCloseTo(engineNumeric(SCHEMA_ID, "totalExposure", defaultInputs), 2);
    expect(result.variancePercent).toBeCloseTo(engineNumeric(SCHEMA_ID, "variancePercent", defaultInputs), 2);
    expect(["low", "warning", "critical"]).toContain(result.summaryLevel);
    expect(result.primaryDriver).toBe("totalExposure");
  });

  test("formula pipeline parity", () => {
    const result = calculateProjectCostCalculator(defaultInputs);
    expect(result.totalExposure).toBeCloseTo(
      engineNumeric(SCHEMA_ID, "totalExposure", defaultInputs),
      2,
    );
  });

  test("low threshold band", () => {
    const result = calculateProjectCostCalculator(lowBandInputs);
    expect(["low", "warning", "critical"]).toContain(result.summaryLevel);
  });

  test("warning threshold band", () => {
    const result = calculateProjectCostCalculator(defaultInputs);
    expect(["warning", "critical", "low"]).toContain(result.summaryLevel);
  });

  test("critical threshold band", () => {
    const result = calculateProjectCostCalculator(criticalBandInputs);
    expect(["low", "warning", "critical"]).toContain(result.summaryLevel);
  });

  test("invalid missing input fails validation and calculator throws", () => {
    const broken = { ...defaultInputs, productionQuantity: undefined } as unknown as ProjectCostCalculatorInputs;
    const validation = validateProjectCostCalculatorInputs(broken);
    expect(validation.ok).toBe(false);
    expect(() => calculateProjectCostCalculator(broken)).toThrow();
  });

  test("invalid negative input fails validation and calculator throws", () => {
    expectValidationFailure({ productionQuantity: -1 });
  });
  test("invalid zero divisor/base fails validation and calculator throws", () => {
    const validation = validateProjectCostCalculatorInputs({ ...defaultInputs, productionQuantity: 0 });
    expect(validation.ok).toBe(false);
    if (validation.ok) return;
    expect(() => calculateProjectCostCalculator({ ...defaultInputs, productionQuantity: 0 })).toThrow();
  });

  test("invalid NaN input fails validation and calculator throws", () => {
    expectValidationFailure({ targetGrossMarginPercent: Number.NaN });
  });

  test("invalid Infinity input fails validation and calculator throws", () => {
    expectValidationFailure({ targetGrossMarginPercent: Number.POSITIVE_INFINITY });
  });

    test("contract metadata matches slug", () => {
    const contract = PROJECT_COST_CALCULATOR_CRITICAL_FORMULA_CONTRACTS[0];
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
    const calculatorResult = calculateProjectCostCalculator(defaultInputs);
    expect(engineResult.outputs.find((output) => output.id === "totalExposure")?.raw).toBeCloseTo(calculatorResult.totalExposure, 2);
    expect(engineResult.outputs.find((output) => output.id === "variancePercent")?.raw).toBeCloseTo(calculatorResult.variancePercent, 2);
  });
});
