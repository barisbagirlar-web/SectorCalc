// Auto-generated from kitten-weight-predictor-calculator-schema.json
import * as z from 'zod';

export interface Kitten_weight_predictor_calculatorInput {
  ageInWeeks: number;
  currentWeight: number;
  birthWeight: number;
  breedSizeFactor: number;
  sexFactor: number;
  dailyCalories: number;
}

export const Kitten_weight_predictor_calculatorInputSchema = z.object({
  ageInWeeks: z.number().default(12),
  currentWeight: z.number().default(1000),
  birthWeight: z.number().default(100),
  breedSizeFactor: z.number().default(1),
  sexFactor: z.number().default(1),
  dailyCalories: z.number().default(250),
});

function evaluateAllFormulas(input: Kitten_weight_predictor_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = (() => { return (input.currentWeight - input.birthWeight) / input.ageInWeeks; })(); results["growthRate"] = Number.isFinite(v) ? v : 0; } catch { results["growthRate"] = 0; }
  try { const v = (() => { return input.currentWeight * (52 / input.ageInWeeks); })(); results["basePrediction"] = Number.isFinite(v) ? v : 0; } catch { results["basePrediction"] = 0; }
  try { const v = (() => { return basePrediction * input.breedSizeFactor * input.sexFactor * (input.dailyCalories / 250); })(); results["adjustedPrediction"] = Number.isFinite(v) ? v : 0; } catch { results["adjustedPrediction"] = 0; }
  try { const v = (() => { return adjustedPrediction * (20 / 52); })(); results["weightAt20Weeks"] = Number.isFinite(v) ? v : 0; } catch { results["weightAt20Weeks"] = 0; }
  return results;
}


export function calculateKitten_weight_predictor_calculator(input: Kitten_weight_predictor_calculatorInput): Kitten_weight_predictor_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["adjustedPrediction"] ?? 0;
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


export interface Kitten_weight_predictor_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
