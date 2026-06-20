// Auto-generated from a-b-test-significance-calculator-schema.json
import * as z from 'zod';

export interface A_b_test_significance_calculatorInput {
  controlVisitors: number;
  controlConversions: number;
  variantVisitors: number;
  variantConversions: number;
  confidenceLevel: number;
  dataConfidence?: number;
}

export const A_b_test_significance_calculatorInputSchema = z.object({
  controlVisitors: z.number().default(1000),
  controlConversions: z.number().default(100),
  variantVisitors: z.number().default(1000),
  variantConversions: z.number().default(120),
  confidenceLevel: z.number().default(95),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: A_b_test_significance_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.controlConversions / input.controlVisitors; results["p1"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["p1"] = Number.NaN; }
  try { const v = input.variantConversions / input.variantVisitors; results["p2"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["p2"] = Number.NaN; }
  try { const v = (input.controlConversions + input.variantConversions) / (input.controlVisitors + input.variantVisitors); results["pPool"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["pPool"] = Number.NaN; }
  try { const v = 1 - input.confidenceLevel / 100; results["alpha"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["alpha"] = Number.NaN; }
  return results;
}


export function calculateA_b_test_significance_calculator(input: A_b_test_significance_calculatorInput): A_b_test_significance_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["alpha"]);
  const breakdown = {
    
  };
  const hiddenLossDrivers: string[] = [];
  const suggestedActions: string[] = ["Review inputs and verify results against site standards."];
  const dataConfidenceAdjusted =
    typeof input.dataConfidence === "number"
      ? totalWasteCost * (input.dataConfidence / 100)
      : totalWasteCost;
  return {
    totalWasteCost,
    breakdown,
    hiddenLossDrivers,
    suggestedActions,
    dataConfidenceAdjusted,
    premiumRequired: false,
    premiumFeatures: [],
  };
}


export interface A_b_test_significance_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
