// Auto-generated from recipe-nutrition-calculator-schema.json
import * as z from 'zod';

export interface Recipe_nutrition_calculatorInput {
  servings: number;
  flour_g: number;
  sugar_g: number;
  butter_g: number;
  eggs: number;
  milk_ml: number;
  chocolate_g: number;
  oil_ml: number;
}

export const Recipe_nutrition_calculatorInputSchema = z.object({
  servings: z.number().default(4),
  flour_g: z.number().default(250),
  sugar_g: z.number().default(200),
  butter_g: z.number().default(100),
  eggs: z.number().default(2),
  milk_ml: z.number().default(120),
  chocolate_g: z.number().default(50),
  oil_ml: z.number().default(30),
});

function evaluateAllFormulas(input: Recipe_nutrition_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = (input.flour_g * 3.64 + input.sugar_g * 3.87 + input.butter_g * 7.17 + input.eggs * 78 + input.milk_ml * 0.42 + input.chocolate_g * 5.46 + input.oil_ml * 8.84) / input.servings; results["caloriesPerServing"] = Number.isFinite(v) ? v : 0; } catch { results["caloriesPerServing"] = 0; }
  try { const v = (input.butter_g * 0.81 + input.oil_ml * 0.92 + input.milk_ml * 0.0325 + input.eggs * 5 + input.chocolate_g * 0.42) / input.servings; results["fatPerServing"] = Number.isFinite(v) ? v : 0; } catch { results["fatPerServing"] = 0; }
  try { const v = (input.flour_g * 0.76 + input.sugar_g * 1 + input.milk_ml * 0.048 + input.chocolate_g * 0.45) / input.servings; results["carbsPerServing"] = Number.isFinite(v) ? v : 0; } catch { results["carbsPerServing"] = 0; }
  try { const v = (input.flour_g * 0.1 + input.eggs * 6.3 + input.milk_ml * 0.032 + input.chocolate_g * 0.08) / input.servings; results["proteinPerServing"] = Number.isFinite(v) ? v : 0; } catch { results["proteinPerServing"] = 0; }
  return results;
}


export function calculateRecipe_nutrition_calculator(input: Recipe_nutrition_calculatorInput): Recipe_nutrition_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["caloriesPerServing"] ?? 0;
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
