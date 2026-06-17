// Auto-generated from meal-plan-calculator-schema.json
import * as z from 'zod';

export interface Meal_plan_calculatorInput {
  mealsPerDay: number;
  ingredientCostPerMeal: number;
  laborCostPerHour: number;
  prepTimePerMeal: number;
  overheadPercent: number;
  wastePercent: number;
}

export const Meal_plan_calculatorInputSchema = z.object({
  mealsPerDay: z.number().default(100),
  ingredientCostPerMeal: z.number().default(3.5),
  laborCostPerHour: z.number().default(20),
  prepTimePerMeal: z.number().default(10),
  overheadPercent: z.number().default(15),
  wastePercent: z.number().default(5),
});

function evaluateAllFormulas(input: Meal_plan_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.laborCostPerHour * (input.prepTimePerMeal / 60); results["laborCostPerMeal"] = Number.isFinite(v) ? v : 0; } catch { results["laborCostPerMeal"] = 0; }
  try { const v = input.ingredientCostPerMeal * input.mealsPerDay; results["totalIngredientCostNoWaste"] = Number.isFinite(v) ? v : 0; } catch { results["totalIngredientCostNoWaste"] = 0; }
  try { const v = (results["totalIngredientCostNoWaste"] ?? 0) * (input.wastePercent / 100); results["wasteCost"] = Number.isFinite(v) ? v : 0; } catch { results["wasteCost"] = 0; }
  try { const v = (results["totalIngredientCostNoWaste"] ?? 0) + (results["wasteCost"] ?? 0); results["totalIngredientCostWithWaste"] = Number.isFinite(v) ? v : 0; } catch { results["totalIngredientCostWithWaste"] = 0; }
  try { const v = (results["laborCostPerMeal"] ?? 0) * input.mealsPerDay; results["totalLaborCost"] = Number.isFinite(v) ? v : 0; } catch { results["totalLaborCost"] = 0; }
  try { const v = (results["totalIngredientCostWithWaste"] ?? 0) + (results["totalLaborCost"] ?? 0); results["directCost"] = Number.isFinite(v) ? v : 0; } catch { results["directCost"] = 0; }
  try { const v = (results["directCost"] ?? 0) * (input.overheadPercent / 100); results["overheadCost"] = Number.isFinite(v) ? v : 0; } catch { results["overheadCost"] = 0; }
  try { const v = (results["directCost"] ?? 0) + (results["overheadCost"] ?? 0); results["totalCost"] = Number.isFinite(v) ? v : 0; } catch { results["totalCost"] = 0; }
  return results;
}


export function calculateMeal_plan_calculator(input: Meal_plan_calculatorInput): Meal_plan_calculatorOutput {
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


export interface Meal_plan_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
