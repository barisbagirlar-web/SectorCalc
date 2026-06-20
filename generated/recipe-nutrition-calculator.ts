// Auto-generated from recipe-nutrition-calculator-schema.json
import * as z from 'zod';

export interface Recipe_nutrition_calculatorInput {
  totalProtein: number;
  totalCarbs: number;
  totalFat: number;
  totalWeight: number;
  numberOfServings: number;
  dataConfidence?: number;
}

export const Recipe_nutrition_calculatorInputSchema = z.object({
  totalProtein: z.number().default(0),
  totalCarbs: z.number().default(0),
  totalFat: z.number().default(0),
  totalWeight: z.number().default(0),
  numberOfServings: z.number().default(4),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Recipe_nutrition_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.totalProtein * 4 + input.totalCarbs * 4 + input.totalFat * 9; results["totalCalories"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["totalCalories"] = Number.NaN; }
  try { const v = input.totalWeight / input.numberOfServings; results["perServingWeight"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["perServingWeight"] = Number.NaN; }
  try { const v = input.totalProtein / input.numberOfServings; results["perServingProtein"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["perServingProtein"] = Number.NaN; }
  try { const v = input.totalCarbs / input.numberOfServings; results["perServingCarbs"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["perServingCarbs"] = Number.NaN; }
  try { const v = input.totalFat / input.numberOfServings; results["perServingFat"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["perServingFat"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["totalCalories"])) / input.numberOfServings; results["perServingCalories"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["perServingCalories"] = Number.NaN; }
  return results;
}


export function calculateRecipe_nutrition_calculator(input: Recipe_nutrition_calculatorInput): Recipe_nutrition_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["perServingCalories"]);
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


export interface Recipe_nutrition_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
