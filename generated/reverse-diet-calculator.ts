// Auto-generated from reverse-diet-calculator-schema.json
import * as z from 'zod';

export interface Reverse_diet_calculatorInput {
  currentCalories: number;
  currentWeight: number;
  goalWeight: number;
  height: number;
  age: number;
  gender: number;
  activityFactor: number;
  reverseDuration: number;
}

export const Reverse_diet_calculatorInputSchema = z.object({
  currentCalories: z.number().default(1500),
  currentWeight: z.number().default(70),
  goalWeight: z.number().default(65),
  height: z.number().default(170),
  age: z.number().default(30),
  gender: z.number().default(1),
  activityFactor: z.number().default(1.55),
  reverseDuration: z.number().default(12),
});

function evaluateAllFormulas(input: Reverse_diet_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = (input.gender * (10 * input.goalWeight + 6.25 * input.height - 5 * input.age + 5) + (1 - input.gender) * (10 * input.goalWeight + 6.25 * input.height - 5 * input.age - 161)) * input.activityFactor - input.currentCalories; results["totalIncreaseNeeded"] = Number.isFinite(v) ? v : 0; } catch { results["totalIncreaseNeeded"] = 0; }
  try { const v = Math.min(((input.gender * (10 * input.goalWeight + 6.25 * input.height - 5 * input.age + 5) + (1 - input.gender) * (10 * input.goalWeight + 6.25 * input.height - 5 * input.age - 161)) * input.activityFactor - input.currentCalories) / input.reverseDuration, 100); results["recommendedWeeklyIncrease"] = Number.isFinite(v) ? v : 0; } catch { results["recommendedWeeklyIncrease"] = 0; }
  try { const v = input.currentCalories + Math.min(((input.gender * (10 * input.goalWeight + 6.25 * input.height - 5 * input.age + 5) + (1 - input.gender) * (10 * input.goalWeight + 6.25 * input.height - 5 * input.age - 161)) * input.activityFactor - input.currentCalories) / input.reverseDuration, 100) * input.reverseDuration; results["targetFinalCalories"] = Number.isFinite(v) ? v : 0; } catch { results["targetFinalCalories"] = 0; }
  return results;
}


export function calculateReverse_diet_calculator(input: Reverse_diet_calculatorInput): Reverse_diet_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["recommendedWeeklyIncrease"] ?? 0;
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


export interface Reverse_diet_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
