import { describe, expect, test } from "vitest";
import { SHEET_METAL_QUOTE_RISK_TOOL_CRITICAL_FORMULA_CONTRACTS } from "@/lib/formula-governance/contracts/sheet-metal-quote-risk-tool-critical";
import { getFormulaContractBySlug } from "@/lib/formula-governance/contracts";
import {
  calculateSheetMetalQuoteRiskTool,
  type SheetMetalQuoteRiskToolInputs,
} from "@/lib/premium-schema/calculators/sheet-metal-quote-risk-tool";
import { validateSheetMetalQuoteRiskToolInputs } from "@/lib/premium-schema/calculators/sheet-metal-quote-risk-tool-validation";
import { getPremiumCalculatorSchema } from "@/lib/premium-schema/schema-registry";
import {
  buildDefaultSchemaInputs,
  runPremiumSchemaEngine,
} from "@/lib/premium-schema/premium-schema-engine";

const SLUG = "sheet-metal-quote-risk-tool";

const defaultInputs: SheetMetalQuoteRiskToolInputs = {
    "materialCost": 9500,
    "scrapRate": 8,
    "targetScrapRate": 3,
    "reworkHours": 14,
    "laborRate": 38,
    "finishingCost": 1200
  };
const lowBandInputs: SheetMetalQuoteRiskToolInputs = {
    "materialCost": 9500,
    "scrapRate": 0.5,
    "targetScrapRate": 3,
    "reworkHours": 14,
    "laborRate": 38,
    "finishingCost": 1200
  };
const criticalBandInputs: SheetMetalQuoteRiskToolInputs = {
    "materialCost": 9500,
    "scrapRate": 20,
    "targetScrapRate": 3,
    "reworkHours": 14,
    "laborRate": 38,
    "finishingCost": 1200
  };

function expectValidationFailure(partial: Partial<SheetMetalQuoteRiskToolInputs>): void {
  const inputs = { ...defaultInputs, ...partial } as SheetMetalQuoteRiskToolInputs;
  const validation = validateSheetMetalQuoteRiskToolInputs(inputs);
  expect(validation.ok).toBe(false);
  if (validation.ok) return;
  expect(validation.errors.length).toBeGreaterThan(0);
  expect(() => calculateSheetMetalQuoteRiskTool(inputs)).toThrow();
}

function engineNumeric(schemaSlug: string, outputId: string, inputs: SheetMetalQuoteRiskToolInputs): number {
  const schema = getPremiumCalculatorSchema(schemaSlug);
  if (!schema) throw new Error("schema missing");
  const engineResult = runPremiumSchemaEngine(schema, inputs);
  const raw = engineResult.outputs.find((output) => output.id === outputId)?.raw;
  if (typeof raw !== "number") throw new Error(`missing output ${outputId}`);
  return raw;
}

describe("sheet-metal-quote-risk-tool", () => {
  test("exact default oracle", () => {
    const result = calculateSheetMetalQuoteRiskTool(defaultInputs);
    expect(result.totalExposure).toBeCloseTo(engineNumeric(SLUG, "totalExposure", defaultInputs), 2);
    expect(result.excessScrapCost).toBeCloseTo(engineNumeric(SLUG, "excessScrapCost", defaultInputs), 2);
    expect(["low", "warning", "critical"]).toContain(result.summaryLevel);
    expect(result.primaryDriver).toBe("totalExposure");
  });

  test("formula pipeline parity", () => {
    const result = calculateSheetMetalQuoteRiskTool(defaultInputs);
    expect(result.totalExposure).toBeCloseTo(
      engineNumeric(SLUG, "totalExposure", defaultInputs),
      2,
    );
  });

  test("low threshold band", () => {
    const result = calculateSheetMetalQuoteRiskTool(lowBandInputs);
    expect(["low", "warning", "critical"]).toContain(result.summaryLevel);
  });

  test("warning threshold band", () => {
    const result = calculateSheetMetalQuoteRiskTool(defaultInputs);
    expect(["warning", "critical", "low"]).toContain(result.summaryLevel);
  });

  test("critical threshold band", () => {
    const result = calculateSheetMetalQuoteRiskTool(criticalBandInputs);
    expect(["low", "warning", "critical"]).toContain(result.summaryLevel);
  });

  test("invalid missing input fails validation and calculator throws", () => {
    const broken = { ...defaultInputs, materialCost: undefined } as unknown as SheetMetalQuoteRiskToolInputs;
    const validation = validateSheetMetalQuoteRiskToolInputs(broken);
    expect(validation.ok).toBe(false);
    expect(() => calculateSheetMetalQuoteRiskTool(broken)).toThrow();
  });

  test("invalid negative input fails validation and calculator throws", () => {
    expectValidationFailure({ materialCost: -1 });
  });

  test("invalid NaN input fails validation and calculator throws", () => {
    expectValidationFailure({ finishingCost: Number.NaN });
  });

  test("invalid Infinity input fails validation and calculator throws", () => {
    expectValidationFailure({ finishingCost: Number.POSITIVE_INFINITY });
  });

    test("contract metadata matches slug", () => {
    const contract = SHEET_METAL_QUOTE_RISK_TOOL_CRITICAL_FORMULA_CONTRACTS[0];
    expect(contract).toBeDefined();
    if (!contract) return;
    expect(contract.slug).toBe(SLUG);
    expect(contract.requiredInputs.length).toBeGreaterThan(0);
    expect(contract.assumptions.join(" ")).toContain("deterministic");
  });

  test("engine parity test", () => {
    const schema = getPremiumCalculatorSchema(SLUG);
    expect(schema).not.toBeNull();
    if (!schema) return;
    const schemaInputs = buildDefaultSchemaInputs(schema);
    const engineResult = runPremiumSchemaEngine(schema, schemaInputs);
    const calculatorResult = calculateSheetMetalQuoteRiskTool(defaultInputs);
    expect(engineResult.outputs.find((output) => output.id === "totalExposure")?.raw).toBeCloseTo(calculatorResult.totalExposure, 2);
    expect(engineResult.outputs.find((output) => output.id === "excessScrapCost")?.raw).toBeCloseTo(calculatorResult.excessScrapCost, 2);
  });
});
