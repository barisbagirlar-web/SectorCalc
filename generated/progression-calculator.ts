// Auto-generated from progression-calculator-schema.json
import * as z from 'zod';

export interface Progression_calculatorInput {
  firstTerm: number;
  commonDifference: number;
  commonRatio: number;
  numberOfTerms: number;
  progressionType: number;
}

export const Progression_calculatorInputSchema = z.object({
  firstTerm: z.number().default(1),
  commonDifference: z.number().default(0),
  commonRatio: z.number().default(1),
  numberOfTerms: z.number().default(5),
  progressionType: z.number().default(1),
});

function evaluateAllFormulas(input: Progression_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.progressionType === 1 ? input.firstTerm + (input.numberOfTerms - 1) * input.commonDifference : input.firstTerm * (input.commonRatio ** (input.numberOfTerms - 1)); results["nthTerm"] = Number.isFinite(v) ? v : 0; } catch { results["nthTerm"] = 0; }
  try { const v = input.progressionType === 1 ? (input.numberOfTerms/2) * (2*input.firstTerm + (input.numberOfTerms-1)*input.commonDifference) : (input.commonRatio === 1 ? input.firstTerm * input.numberOfTerms : input.firstTerm * (1 - input.commonRatio ** input.numberOfTerms) / (1 - input.commonRatio)); results["sum"] = Number.isFinite(v) ? v : 0; } catch { results["sum"] = 0; }
  return results;
}


export function calculateProgression_calculator(input: Progression_calculatorInput): Progression_calculatorOutput {
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


export interface Progression_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
