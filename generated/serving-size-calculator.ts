// Auto-generated from serving-size-calculator-schema.json
import * as z from 'zod';

export interface Serving_size_calculatorInput {
  totalWeight: number;
  numberOfServings: number;
  desiredServings: number;
  batchCost: number;
  dataConfidence?: number;
}

export const Serving_size_calculatorInputSchema = z.object({
  totalWeight: z.number().default(1000),
  numberOfServings: z.number().default(10),
  desiredServings: z.number().default(20),
  batchCost: z.number().default(50),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Serving_size_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.totalWeight / input.numberOfServings; results["servingWeight"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["servingWeight"] = Number.NaN; }
  try { const v = (input.totalWeight / input.numberOfServings) * input.desiredServings; results["scaledWeight"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["scaledWeight"] = Number.NaN; }
  try { const v = input.batchCost / input.numberOfServings; results["costPerServing"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["costPerServing"] = Number.NaN; }
  return results;
}


export function calculateServing_size_calculator(input: Serving_size_calculatorInput): Serving_size_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["servingWeight"]);
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


export interface Serving_size_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
