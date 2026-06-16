// Auto-generated from weighted-mean-calculator-schema.json
import * as z from 'zod';

export interface Weighted_mean_calculatorInput {
  value1: number;
  weight1: number;
  value2: number;
  weight2: number;
  value3: number;
  weight3: number;
  value4: number;
  weight4: number;
}

export const Weighted_mean_calculatorInputSchema = z.object({
  value1: z.number().default(0),
  weight1: z.number().default(1),
  value2: z.number().default(0),
  weight2: z.number().default(1),
  value3: z.number().default(0),
  weight3: z.number().default(1),
  value4: z.number().default(0),
  weight4: z.number().default(1),
});

function evaluateAllFormulas(input: Weighted_mean_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = (input.value1*input.weight1 + input.value2*input.weight2 + input.value3*input.weight3 + input.value4*input.weight4) / (input.weight1+input.weight2+input.weight3+input.weight4); results["weightedMean"] = Number.isFinite(v) ? v : 0; } catch { results["weightedMean"] = 0; }
  try { const v = input.value1*input.weight1 + input.value2*input.weight2 + input.value3*input.weight3 + input.value4*input.weight4; results["sumWeightedValues"] = Number.isFinite(v) ? v : 0; } catch { results["sumWeightedValues"] = 0; }
  try { const v = input.weight1+input.weight2+input.weight3+input.weight4; results["sumWeights"] = Number.isFinite(v) ? v : 0; } catch { results["sumWeights"] = 0; }
  return results;
}


export function calculateWeighted_mean_calculator(input: Weighted_mean_calculatorInput): Weighted_mean_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["weightedMean"] ?? 0;
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


export interface Weighted_mean_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
