// @ts-nocheck
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

function asFormulaNumber(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Meal_prep_calculatorInput): Record<string, number | string> {
  const results: Record<string, number | string> = {};
  try { const v = input.recipeServings * (1 - input.wastePercentage / 100); results["effectiveServingsPerBatch"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["effectiveServingsPerBatch"] = 0; }
  try { const v = input.desiredServings * input.packagingCostPerServing; results["totalPackagingCost"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["totalPackagingCost"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

export function calculateMeal_prep_calculator(input: Meal_prep_calculatorInput): Meal_prep_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["totalPackagingCost"]);
  const breakdown = {
    
  };
  const hiddenLossDrivers: string[] = [];
  const suggestedActions: string[] = ["Review inputs and verify results against site standards."];
  const dataConfidenceAdjusted =
    typeof (input as unknown as Record<string, unknown>).dataConfidence === "number"
      ? totalWasteCost * (((input as unknown as Record<string, unknown>).dataConfidence as number) / 100)
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
