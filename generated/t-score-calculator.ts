// Auto-generated from t-score-calculator-schema.json
import * as z from 'zod';

export interface T_score_calculatorInput {
  sampleMean: number;
  populationMean: number;
  sampleStdDev: number;
  sampleSize: number;
}

export const T_score_calculatorInputSchema = z.object({
  sampleMean: z.number().default(0),
  populationMean: z.number().default(0),
  sampleStdDev: z.number().default(1),
  sampleSize: z.number().default(30),
});

function evaluateAllFormulas(input: T_score_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.sampleStdDev / Math.sqrt(input.sampleSize); results["standardError"] = Number.isFinite(v) ? v : 0; } catch { results["standardError"] = 0; }
  try { const v = input.sampleSize - 1; results["degreesOfFreedom"] = Number.isFinite(v) ? v : 0; } catch { results["degreesOfFreedom"] = 0; }
  try { const v = ((input.sampleMean - input.populationMean) / (input.sampleStdDev / Math.sqrt(input.sampleSize))); results["tScore"] = Number.isFinite(v) ? v : 0; } catch { results["tScore"] = 0; }
  return results;
}


export function calculateT_score_calculator(input: T_score_calculatorInput): T_score_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["tScore"] ?? 0;
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


export interface T_score_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
