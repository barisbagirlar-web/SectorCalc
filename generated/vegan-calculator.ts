// Auto-generated from vegan-calculator-schema.json
import * as z from 'zod';

export interface Vegan_calculatorInput {
  meal_count: number;
  days_per_week: number;
  protein_grams_per_meal: number;
  calories_per_meal: number;
  co2_per_kg_food: number;
  water_per_kg_food: number;
  food_weight_per_meal: number;
}

export const Vegan_calculatorInputSchema = z.object({
  meal_count: z.number().default(3),
  days_per_week: z.number().default(7),
  protein_grams_per_meal: z.number().default(20),
  calories_per_meal: z.number().default(600),
  co2_per_kg_food: z.number().default(2.5),
  water_per_kg_food: z.number().default(500),
  food_weight_per_meal: z.number().default(0.4),
});

function evaluateAllFormulas(input: Vegan_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.meal_count * input.days_per_week * input.protein_grams_per_meal; results["weekly_protein"] = Number.isFinite(v) ? v : 0; } catch { results["weekly_protein"] = 0; }
  try { const v = input.meal_count * input.days_per_week * input.calories_per_meal; results["weekly_calories"] = Number.isFinite(v) ? v : 0; } catch { results["weekly_calories"] = 0; }
  try { const v = input.meal_count * input.days_per_week * input.food_weight_per_meal; results["weekly_food_weight"] = Number.isFinite(v) ? v : 0; } catch { results["weekly_food_weight"] = 0; }
  try { const v = (results["weekly_food_weight"] ?? 0) * input.co2_per_kg_food; results["weekly_co2"] = Number.isFinite(v) ? v : 0; } catch { results["weekly_co2"] = 0; }
  try { const v = (results["weekly_food_weight"] ?? 0) * input.water_per_kg_food; results["weekly_water"] = Number.isFinite(v) ? v : 0; } catch { results["weekly_water"] = 0; }
  try { const v = input.meal_count * input.protein_grams_per_meal; results["daily_protein"] = Number.isFinite(v) ? v : 0; } catch { results["daily_protein"] = 0; }
  try { const v = input.meal_count * input.calories_per_meal; results["daily_calories"] = Number.isFinite(v) ? v : 0; } catch { results["daily_calories"] = 0; }
  return results;
}


export function calculateVegan_calculator(input: Vegan_calculatorInput): Vegan_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["weekly_co2"] ?? 0;
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


export interface Vegan_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
