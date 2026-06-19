// Auto-generated from meal-prep-calculator-schema.json
import * as z from 'zod';

export interface Meal_prep_calculatorInput {
  desiredServings: number;
  recipeServings: number;
  recipeCost: number;
  wastePercentage: number;
  packagingCostPerServing: number;
  fixedCost: number;
  dataConfidence?: number;
}

export const Meal_prep_calculatorInputSchema = z.object({
  desiredServings: z.number().default(1),
  recipeServings: z.number().default(4),
  recipeCost: z.number().default(12.5),
  wastePercentage: z.number().default(5),
  packagingCostPerServing: z.number().default(0.3),
  fixedCost: z.number().default(0),
});

function asFormulaNumber(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Meal_prep_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.recipeServings * (1 - input.wastePercentage / 100); results["effectiveServingsPerBatch"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["effectiveServingsPerBatch"] = 0; }
  try { const v = input.desiredServings * input.packagingCostPerServing; results["totalPackagingCost"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["totalPackagingCost"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

export function calculateMeal_prep_calculator(input: Meal_prep_calculatorInput): Meal_prep_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["totalPackagingCost"]);
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


export interface Meal_prep_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
