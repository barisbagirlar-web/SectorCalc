// Auto-generated from recipe-nutrition-calculator-schema.json
import * as z from 'zod';

export interface Recipe_nutrition_calculatorInput {
  totalProtein: number;
  totalCarbs: number;
  totalFat: number;
  totalWeight: number;
  numberOfServings: number;
}

export const Recipe_nutrition_calculatorInputSchema = z.object({
  totalProtein: z.number().default(0),
  totalCarbs: z.number().default(0),
  totalFat: z.number().default(0),
  totalWeight: z.number().default(0),
  numberOfServings: z.number().default(4),
});

function evaluateAllFormulas(input: Recipe_nutrition_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.totalProtein * 4 + input.totalCarbs * 4 + input.totalFat * 9; results["totalCalories"] = Number.isFinite(v) ? v : 0; } catch { results["totalCalories"] = 0; }
  try { const v = input.totalWeight / input.numberOfServings; results["perServingWeight"] = Number.isFinite(v) ? v : 0; } catch { results["perServingWeight"] = 0; }
  try { const v = input.totalProtein / input.numberOfServings; results["perServingProtein"] = Number.isFinite(v) ? v : 0; } catch { results["perServingProtein"] = 0; }
  try { const v = input.totalCarbs / input.numberOfServings; results["perServingCarbs"] = Number.isFinite(v) ? v : 0; } catch { results["perServingCarbs"] = 0; }
  try { const v = input.totalFat / input.numberOfServings; results["perServingFat"] = Number.isFinite(v) ? v : 0; } catch { results["perServingFat"] = 0; }
  try { const v = (results["totalCalories"] ?? 0) / input.numberOfServings; results["perServingCalories"] = Number.isFinite(v) ? v : 0; } catch { results["perServingCalories"] = 0; }
  return results;
}


export function calculateRecipe_nutrition_calculator(input: Recipe_nutrition_calculatorInput): Recipe_nutrition_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["perServingCalories"] ?? 0;
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


export interface Recipe_nutrition_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
