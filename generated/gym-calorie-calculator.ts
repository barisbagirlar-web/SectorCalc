// Auto-generated from gym-calorie-calculator-schema.json
import * as z from 'zod';

export interface Gym_calorie_calculatorInput {
  weight: number;
  duration: number;
  met: number;
  age: number;
  gender: number;
  height: number;
}

export const Gym_calorie_calculatorInputSchema = z.object({
  weight: z.number().default(70),
  duration: z.number().default(30),
  met: z.number().default(5),
  age: z.number().default(30),
  gender: z.number().default(1),
  height: z.number().default(175),
});

function evaluateAllFormulas(input: Gym_calorie_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = 10 * input.weight + 6.25 * input.height - 5 * input.age + (input.gender === 1 ? 5 : -161); results["bmr"] = Number.isFinite(v) ? v : 0; } catch { results["bmr"] = 0; }
  try { const v = input.met * 3.5 * input.weight / 200 * input.duration; results["caloriesBurned"] = Number.isFinite(v) ? v : 0; } catch { results["caloriesBurned"] = 0; }
  try { const v = (results["caloriesBurned"] ?? 0) + (results["bmr"] ?? 0) / 1440 * input.duration; results["totalCalories"] = Number.isFinite(v) ? v : 0; } catch { results["totalCalories"] = 0; }
  return results;
}


export function calculateGym_calorie_calculator(input: Gym_calorie_calculatorInput): Gym_calorie_calculatorOutput {
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


export interface Gym_calorie_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
