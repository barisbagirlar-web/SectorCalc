// Auto-generated from serving-size-calculator-schema.json
import * as z from 'zod';

export interface Serving_size_calculatorInput {
  totalWeight: number;
  numberOfServings: number;
  desiredServings: number;
  batchCost: number;
}

export const Serving_size_calculatorInputSchema = z.object({
  totalWeight: z.number().default(1000),
  numberOfServings: z.number().default(10),
  desiredServings: z.number().default(20),
  batchCost: z.number().default(50),
});

function evaluateAllFormulas(input: Serving_size_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.totalWeight / input.numberOfServings; results["servingWeight"] = Number.isFinite(v) ? v : 0; } catch { results["servingWeight"] = 0; }
  try { const v = (input.totalWeight / input.numberOfServings) * input.desiredServings; results["scaledWeight"] = Number.isFinite(v) ? v : 0; } catch { results["scaledWeight"] = 0; }
  try { const v = input.batchCost / input.numberOfServings; results["costPerServing"] = Number.isFinite(v) ? v : 0; } catch { results["costPerServing"] = 0; }
  return results;
}


export function calculateServing_size_calculator(input: Serving_size_calculatorInput): Serving_size_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["servingWeight"] ?? 0;
  const breakdown = {
    
  };
  const hiddenLossDrivers: string[] = [];
  const suggestedActions: string[] = [];
  const dataConfidenceAdjusted =
    typeof (input as Record<string, unknown>).dataConfidence === "number"
      ? totalWasteCost * (((input as Record<string, unknown>).dataConfidence as number) / 100)
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
