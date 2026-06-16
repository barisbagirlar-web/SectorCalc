// Auto-generated from adult-height-predictor-calculator-schema.json
import * as z from 'zod';

export interface Adult_height_predictor_calculatorInput {
  childGender: number;
  fatherHeightCm: number;
  motherHeightCm: number;
  childHeightCm: number;
  childAgeYrs: number;
}

export const Adult_height_predictor_calculatorInputSchema = z.object({
  childGender: z.number().default(0),
  fatherHeightCm: z.number().default(175),
  motherHeightCm: z.number().default(165),
  childHeightCm: z.number().default(120),
  childAgeYrs: z.number().default(8),
});

function evaluateAllFormulas(input: Adult_height_predictor_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.childGender === 0 ? (input.fatherHeightCm + input.motherHeightCm + 13) / 2 : (input.fatherHeightCm - 13 + input.motherHeightCm) / 2; results["predictedHeight"] = Number.isFinite(v) ? v : 0; } catch { results["predictedHeight"] = 0; }
  return results;
}


export function calculateAdult_height_predictor_calculator(input: Adult_height_predictor_calculatorInput): Adult_height_predictor_calculatorOutput {
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


export interface Adult_height_predictor_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
