// Auto-generated from weight-training-calorie-calculator-schema.json
import * as z from 'zod';

export interface Weight_training_calorie_calculatorInput {
  weight: number;
  duration: number;
  intensity: number;
  restPeriod: number;
}

export const Weight_training_calorie_calculatorInputSchema = z.object({
  weight: z.number().default(70),
  duration: z.number().default(30),
  intensity: z.number().default(5),
  restPeriod: z.number().default(2),
});

function evaluateAllFormulas(input: Weight_training_calorie_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = ((input.weight * (input.intensity * 0.6 + 2) * 3.5) / 200) * input.duration; results["Total Calories Burned"] = Number.isFinite(v) ? v : 0; } catch { results["Total Calories Burned"] = 0; }
  try { const v = ((input.weight * (input.intensity * 0.6 + 2) * 3.5) / 200); results["Calories per Minute"] = Number.isFinite(v) ? v : 0; } catch { results["Calories per Minute"] = 0; }
  try { const v = (input.intensity * 0.6 + 2) * input.duration; results["MET-minutes"] = Number.isFinite(v) ? v : 0; } catch { results["MET-minutes"] = 0; }
  return results;
}


export function calculateWeight_training_calorie_calculator(input: Weight_training_calorie_calculatorInput): Weight_training_calorie_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["Total"] ?? 0;
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


export interface Weight_training_calorie_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
