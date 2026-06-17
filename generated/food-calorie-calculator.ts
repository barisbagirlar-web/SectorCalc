// Auto-generated from food-calorie-calculator-schema.json
import * as z from 'zod';

export interface Food_calorie_calculatorInput {
  carb: number;
  prot: number;
  fat: number;
  fiber: number;
  alc: number;
  servings: number;
}

export const Food_calorie_calculatorInputSchema = z.object({
  carb: z.number().default(0),
  prot: z.number().default(0),
  fat: z.number().default(0),
  fiber: z.number().default(0),
  alc: z.number().default(0),
  servings: z.number().default(1),
});

function evaluateAllFormulas(input: Food_calorie_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = ((4*input.carb)+(4*input.prot)+(9*input.fat)+(2*input.fiber)+(7*input.alc))*input.servings; results["totalCalories"] = Number.isFinite(v) ? v : 0; } catch { results["totalCalories"] = 0; }
  try { const v = 4*input.carb*input.servings; results["caloriesFromCarbs"] = Number.isFinite(v) ? v : 0; } catch { results["caloriesFromCarbs"] = 0; }
  try { const v = 4*input.prot*input.servings; results["caloriesFromProtein"] = Number.isFinite(v) ? v : 0; } catch { results["caloriesFromProtein"] = 0; }
  try { const v = 9*input.fat*input.servings; results["caloriesFromFat"] = Number.isFinite(v) ? v : 0; } catch { results["caloriesFromFat"] = 0; }
  try { const v = 2*input.fiber*input.servings; results["caloriesFromFiber"] = Number.isFinite(v) ? v : 0; } catch { results["caloriesFromFiber"] = 0; }
  try { const v = 7*input.alc*input.servings; results["caloriesFromAlcohol"] = Number.isFinite(v) ? v : 0; } catch { results["caloriesFromAlcohol"] = 0; }
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
