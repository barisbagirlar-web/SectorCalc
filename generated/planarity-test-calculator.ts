// Auto-generated from planarity-test-calculator-schema.json
import * as z from 'zod';

export interface Planarity_test_calculatorInput {
  vertices: number;
  edges: number;
  isBipartite: number;
  dataConfidence?: number;
}

export const Planarity_test_calculatorInputSchema = z.object({
  vertices: z.number().default(5),
  edges: z.number().default(8),
  isBipartite: z.number().default(0),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Planarity_test_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.vertices < 3 ? 1 : (input.isBipartite ? (input.edges <= 2*input.vertices - 4 ? 1 : 0) : (input.edges <= 3*input.vertices - 6 ? 1 : 0)); results["planarityScore"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["planarityScore"] = Number.NaN; }
  try { const v = input.vertices < 3 ? 1 : (input.isBipartite ? (input.edges <= 2*input.vertices - 4 ? 1 : 0) : (input.edges <= 3*input.vertices - 6 ? 1 : 0)); results["planarityScore_aux"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["planarityScore_aux"] = Number.NaN; }
  return results;
}


export function calculatePlanarity_test_calculator(input: Planarity_test_calculatorInput): Planarity_test_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["planarityScore"]);
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


export interface Planarity_test_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
