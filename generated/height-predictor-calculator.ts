// Auto-generated from height-predictor-calculator-schema.json
import * as z from 'zod';

export interface Height_predictor_calculatorInput {
  motherHeight: number;
  fatherHeight: number;
  gender: number;
  currentHeight: number;
}

export const Height_predictor_calculatorInputSchema = z.object({
  motherHeight: z.number().default(165),
  fatherHeight: z.number().default(175),
  gender: z.number().default(0),
  currentHeight: z.number().default(100),
});

function evaluateAllFormulas(input: Height_predictor_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.gender * (input.motherHeight + 13 + input.fatherHeight) / 2 + (1 - input.gender) * (input.fatherHeight - 13 + input.motherHeight) / 2; results["midParentalHeight"] = Number.isFinite(v) ? v : 0; } catch { results["midParentalHeight"] = 0; }
  try { const v = ((results["midParentalHeight"] ?? 0) + input.currentHeight) / 2; results["predictedHeight"] = Number.isFinite(v) ? v : 0; } catch { results["predictedHeight"] = 0; }
  return results;
}


export function calculateHeight_predictor_calculator(input: Height_predictor_calculatorInput): Height_predictor_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["predictedHeight"] ?? 0;
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


export interface Height_predictor_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
