// Auto-generated from food-calorie-calculator-schema.json
import * as z from 'zod';

export interface Food_calorie_calculatorInput {
  fat: number;
  carbs: number;
  protein: number;
  alcohol: number;
  servings: number;
}

export const Food_calorie_calculatorInputSchema = z.object({
  fat: z.number().default(0),
  carbs: z.number().default(0),
  protein: z.number().default(0),
  alcohol: z.number().default(0),
  servings: z.number().default(1),
});

function evaluateAllFormulas(input: Food_calorie_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = (9 * input.fat + 4 * input.carbs + 4 * input.protein + 7 * input.alcohol) * input.servings; results["totalCalories"] = Number.isFinite(v) ? v : 0; } catch { results["totalCalories"] = 0; }
  try { const v = 9 * input.fat * input.servings; results["fatCalories"] = Number.isFinite(v) ? v : 0; } catch { results["fatCalories"] = 0; }
  try { const v = 4 * input.carbs * input.servings; results["carbsCalories"] = Number.isFinite(v) ? v : 0; } catch { results["carbsCalories"] = 0; }
  try { const v = 4 * input.protein * input.servings; results["proteinCalories"] = Number.isFinite(v) ? v : 0; } catch { results["proteinCalories"] = 0; }
  try { const v = 7 * input.alcohol * input.servings; results["alcoholCalories"] = Number.isFinite(v) ? v : 0; } catch { results["alcoholCalories"] = 0; }
  return results;
}


export function calculateFood_calorie_calculator(input: Food_calorie_calculatorInput): Food_calorie_calculatorOutput {
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


export interface Food_calorie_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
