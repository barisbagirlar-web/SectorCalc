// Auto-generated from linear-progression-calculator-schema.json
import * as z from 'zod';

export interface Linear_progression_calculatorInput {
  firstTerm: number;
  commonDifference: number;
  numberOfTerms: number;
  termPosition: number;
  decimals: number;
}

export const Linear_progression_calculatorInputSchema = z.object({
  firstTerm: z.number().default(0),
  commonDifference: z.number().default(0),
  numberOfTerms: z.number().default(1),
  termPosition: z.number().default(1),
  decimals: z.number().default(2),
});

function evaluateAllFormulas(input: Linear_progression_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = Math.round((input.firstTerm + (input.numberOfTerms - 1) * input.commonDifference) * Math.pow(10, input.decimals)) / Math.pow(10, input.decimals); results["nthTerm"] = Number.isFinite(v) ? v : 0; } catch { results["nthTerm"] = 0; }
  try { const v = Math.round(((input.numberOfTerms / 2) * (2 * input.firstTerm + (input.numberOfTerms - 1) * input.commonDifference)) * Math.pow(10, input.decimals)) / Math.pow(10, input.decimals); results["sumOfTerms"] = Number.isFinite(v) ? v : 0; } catch { results["sumOfTerms"] = 0; }
  try { const v = Math.round((input.firstTerm + (input.termPosition - 1) * input.commonDifference) * Math.pow(10, input.decimals)) / Math.pow(10, input.decimals); results["kthTerm"] = Number.isFinite(v) ? v : 0; } catch { results["kthTerm"] = 0; }
  return results;
}


export function calculateLinear_progression_calculator(input: Linear_progression_calculatorInput): Linear_progression_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["nthTerm"] ?? 0;
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


export interface Linear_progression_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
