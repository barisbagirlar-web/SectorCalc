// Auto-generated from dog-calorie-calculator-schema.json
import * as z from 'zod';

export interface Dog_calorie_calculatorInput {
  weightKg: number;
  activityFactor: number;
  bodyConditionScore: number;
  desiredWeightChange: number;
}

export const Dog_calorie_calculatorInputSchema = z.object({
  weightKg: z.number().default(10),
  activityFactor: z.number().default(1.6),
  bodyConditionScore: z.number().default(5),
  desiredWeightChange: z.number().default(0),
});

function evaluateAllFormulas(input: Dog_calorie_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = 70 * Math.pow(input.weightKg, 0.75); results["rer"] = Number.isFinite(v) ? v : 0; } catch { results["rer"] = 0; }
  try { const v = (input.bodyConditionScore < 4) ? 1.2 : (input.bodyConditionScore > 6) ? 0.8 : 1.0; results["bcsFactor"] = Number.isFinite(v) ? v : 0; } catch { results["bcsFactor"] = 0; }
  try { const v = 1 + (input.desiredWeightChange * 0.1); results["weightChangeFactor"] = Number.isFinite(v) ? v : 0; } catch { results["weightChangeFactor"] = 0; }
  try { const v = 70 * Math.pow(input.weightKg, 0.75) * input.activityFactor; results["activityAdjusted"] = Number.isFinite(v) ? v : 0; } catch { results["activityAdjusted"] = 0; }
  try { const v = 70 * Math.pow(input.weightKg, 0.75) * input.activityFactor * ((input.bodyConditionScore < 4) ? 1.2 : (input.bodyConditionScore > 6) ? 0.8 : 1.0) * (1 + (input.desiredWeightChange * 0.1)); results["totalCalories"] = Number.isFinite(v) ? v : 0; } catch { results["totalCalories"] = 0; }
  return results;
}


export function calculateDog_calorie_calculator(input: Dog_calorie_calculatorInput): Dog_calorie_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["totalCalories"] ?? 0;
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


export interface Dog_calorie_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
