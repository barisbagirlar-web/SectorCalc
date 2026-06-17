// Auto-generated from meal-prep-calculator-schema.json
import * as z from 'zod';

export interface Meal_prep_calculatorInput {
  desiredServings: number;
  recipeServings: number;
  recipeCost: number;
  wastePercentage: number;
  packagingCostPerServing: number;
  fixedCost: number;
}

export const Meal_prep_calculatorInputSchema = z.object({
  desiredServings: z.number().default(1),
  recipeServings: z.number().default(4),
  recipeCost: z.number().default(12.5),
  wastePercentage: z.number().default(5),
  packagingCostPerServing: z.number().default(0.3),
  fixedCost: z.number().default(0),
});

function evaluateAllFormulas(input: Meal_prep_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.recipeServings * (1 - input.wastePercentage / 100); results["effectiveServingsPerBatch"] = Number.isFinite(v) ? v : 0; } catch { results["effectiveServingsPerBatch"] = 0; }
  try { const v = Math.ceil(input.desiredServings / (results["effectiveServingsPerBatch"] ?? 0)); results["numberOfBatches"] = Number.isFinite(v) ? v : 0; } catch { results["numberOfBatches"] = 0; }
  try { const v = (results["numberOfBatches"] ?? 0) * input.recipeCost; results["totalIngredientCost"] = Number.isFinite(v) ? v : 0; } catch { results["totalIngredientCost"] = 0; }
  try { const v = input.desiredServings * input.packagingCostPerServing; results["totalPackagingCost"] = Number.isFinite(v) ? v : 0; } catch { results["totalPackagingCost"] = 0; }
  try { const v = (results["totalIngredientCost"] ?? 0) + (results["totalPackagingCost"] ?? 0); results["totalVariableCost"] = Number.isFinite(v) ? v : 0; } catch { results["totalVariableCost"] = 0; }
  try { const v = (results["totalVariableCost"] ?? 0) + input.fixedCost; results["totalCost"] = Number.isFinite(v) ? v : 0; } catch { results["totalCost"] = 0; }
  try { const v = (results["totalCost"] ?? 0) / input.desiredServings; results["costPerServing"] = Number.isFinite(v) ? v : 0; } catch { results["costPerServing"] = 0; }
  try { const v = (results["numberOfBatches"] ?? 0) * input.recipeServings - input.desiredServings; results["wastedServings"] = Number.isFinite(v) ? v : 0; } catch { results["wastedServings"] = 0; }
  return results;
}


export function calculateMeal_prep_calculator(input: Meal_prep_calculatorInput): Meal_prep_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["totalCost"] ?? 0;
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


export interface Meal_prep_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
