// Auto-generated from pet-food-calculator-schema.json
import * as z from 'zod';

export interface Pet_food_calculatorInput {
  weight: number;
  activityFactor: number;
  caloricDensity: number;
  mealsPerDay: number;
}

export const Pet_food_calculatorInputSchema = z.object({
  weight: z.number().default(10),
  activityFactor: z.number().default(1.5),
  caloricDensity: z.number().default(3500),
  mealsPerDay: z.number().default(2),
});

function evaluateAllFormulas(input: Pet_food_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = 70 * Math.pow(input.weight, 0.75) * input.activityFactor; results["dailyCalories"] = Number.isFinite(v) ? v : 0; } catch { results["dailyCalories"] = 0; }
  try { const v = 1000 * 70 * Math.pow(input.weight, 0.75) * input.activityFactor / input.caloricDensity; results["dailyFoodGrams"] = Number.isFinite(v) ? v : 0; } catch { results["dailyFoodGrams"] = 0; }
  try { const v = 1000 * 70 * Math.pow(input.weight, 0.75) * input.activityFactor / input.caloricDensity / input.mealsPerDay; results["foodPerMealGrams"] = Number.isFinite(v) ? v : 0; } catch { results["foodPerMealGrams"] = 0; }
  return results;
}


export function calculatePet_food_calculator(input: Pet_food_calculatorInput): Pet_food_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["dailyFoodGrams"] ?? 0;
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


export interface Pet_food_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
