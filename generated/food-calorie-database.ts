// Auto-generated from food-calorie-database-schema.json
import * as z from 'zod';

export interface Food_calorie_databaseInput {
  protein_g: number;
  carbs_g: number;
  fat_g: number;
  fiber_g: number;
  alcohol_g: number;
  serving_size_g: number;
  dataConfidence?: number;
}

export const Food_calorie_databaseInputSchema = z.object({
  protein_g: z.number().default(0),
  carbs_g: z.number().default(0),
  fat_g: z.number().default(0),
  fiber_g: z.number().default(0),
  alcohol_g: z.number().default(0),
  serving_size_g: z.number().default(100),
});

function asFormulaNumber(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Food_calorie_databaseInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.protein_g * 4; results["caloriesFromProtein"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["caloriesFromProtein"] = 0; }
  try { const v = input.carbs_g * 4; results["caloriesFromCarbs"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["caloriesFromCarbs"] = 0; }
  try { const v = input.fat_g * 9; results["caloriesFromFat"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["caloriesFromFat"] = 0; }
  try { const v = input.fiber_g * 2; results["caloriesFromFiber"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["caloriesFromFiber"] = 0; }
  try { const v = input.alcohol_g * 7; results["caloriesFromAlcohol"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["caloriesFromAlcohol"] = 0; }
  try { const v = (asFormulaNumber(results["caloriesFromProtein"])) + (asFormulaNumber(results["caloriesFromCarbs"])) + (asFormulaNumber(results["caloriesFromFat"])) + (asFormulaNumber(results["caloriesFromFiber"])) + (asFormulaNumber(results["caloriesFromAlcohol"])); results["totalCalories"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["totalCalories"] = 0; }
  try { const v = (asFormulaNumber(results["totalCalories"])) * 100 / input.serving_size_g; results["caloriesPer100g"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["caloriesPer100g"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

export function calculateFood_calorie_database(input: Food_calorie_databaseInput): Food_calorie_databaseOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["totalCalories"]);
  const breakdown = {
    
  };
  const hiddenLossDrivers: string[] = [];
  const suggestedActions: string[] = ["Review inputs and verify results against site standards."];
  const dataConfidenceAdjusted =
    typeof input.dataConfidence === "number"
      ? totalWasteCost * (input.dataConfidence / 100)
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
