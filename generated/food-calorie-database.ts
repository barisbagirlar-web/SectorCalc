// Auto-generated from food-calorie-database-schema.json
import * as z from 'zod';

export interface Food_calorie_databaseInput {
  protein_g: number;
  carbs_g: number;
  fat_g: number;
  fiber_g: number;
  alcohol_g: number;
  serving_size_g: number;
}

export const Food_calorie_databaseInputSchema = z.object({
  protein_g: z.number().default(0),
  carbs_g: z.number().default(0),
  fat_g: z.number().default(0),
  fiber_g: z.number().default(0),
  alcohol_g: z.number().default(0),
  serving_size_g: z.number().default(100),
});

function evaluateAllFormulas(input: Food_calorie_databaseInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.protein_g * 4; results["caloriesFromProtein"] = Number.isFinite(v) ? v : 0; } catch { results["caloriesFromProtein"] = 0; }
  try { const v = input.carbs_g * 4; results["caloriesFromCarbs"] = Number.isFinite(v) ? v : 0; } catch { results["caloriesFromCarbs"] = 0; }
  try { const v = input.fat_g * 9; results["caloriesFromFat"] = Number.isFinite(v) ? v : 0; } catch { results["caloriesFromFat"] = 0; }
  try { const v = input.fiber_g * 2; results["caloriesFromFiber"] = Number.isFinite(v) ? v : 0; } catch { results["caloriesFromFiber"] = 0; }
  try { const v = input.alcohol_g * 7; results["caloriesFromAlcohol"] = Number.isFinite(v) ? v : 0; } catch { results["caloriesFromAlcohol"] = 0; }
  try { const v = (results["caloriesFromProtein"] ?? 0) + (results["caloriesFromCarbs"] ?? 0) + (results["caloriesFromFat"] ?? 0) + (results["caloriesFromFiber"] ?? 0) + (results["caloriesFromAlcohol"] ?? 0); results["totalCalories"] = Number.isFinite(v) ? v : 0; } catch { results["totalCalories"] = 0; }
  try { const v = (results["totalCalories"] ?? 0) * 100 / input.serving_size_g; results["caloriesPer100g"] = Number.isFinite(v) ? v : 0; } catch { results["caloriesPer100g"] = 0; }
  return results;
}


export function calculateFood_calorie_database(input: Food_calorie_databaseInput): Food_calorie_databaseOutput {
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


export interface Food_calorie_databaseOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
