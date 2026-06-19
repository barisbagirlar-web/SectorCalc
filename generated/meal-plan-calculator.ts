// Auto-generated from meal-plan-calculator-schema.json
import * as z from 'zod';

export interface Meal_plan_calculatorInput {
  mealsPerDay: number;
  ingredientCostPerMeal: number;
  laborCostPerHour: number;
  prepTimePerMeal: number;
  overheadPercent: number;
  wastePercent: number;
  dataConfidence?: number;
}

export const Meal_plan_calculatorInputSchema = z.object({
  mealsPerDay: z.number().default(100),
  ingredientCostPerMeal: z.number().default(3.5),
  laborCostPerHour: z.number().default(20),
  prepTimePerMeal: z.number().default(10),
  overheadPercent: z.number().default(15),
  wastePercent: z.number().default(5),
});

function asFormulaNumber(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Meal_plan_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.laborCostPerHour * (input.prepTimePerMeal / 60); results["laborCostPerMeal"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["laborCostPerMeal"] = 0; }
  try { const v = input.ingredientCostPerMeal * input.mealsPerDay; results["totalIngredientCostNoWaste"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["totalIngredientCostNoWaste"] = 0; }
  try { const v = (asFormulaNumber(results["totalIngredientCostNoWaste"])) * (input.wastePercent / 100); results["wasteCost"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["wasteCost"] = 0; }
  try { const v = (asFormulaNumber(results["totalIngredientCostNoWaste"])) + (asFormulaNumber(results["wasteCost"])); results["totalIngredientCostWithWaste"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["totalIngredientCostWithWaste"] = 0; }
  try { const v = (asFormulaNumber(results["laborCostPerMeal"])) * input.mealsPerDay; results["totalLaborCost"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["totalLaborCost"] = 0; }
  try { const v = (asFormulaNumber(results["totalIngredientCostWithWaste"])) + (asFormulaNumber(results["totalLaborCost"])); results["directCost"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["directCost"] = 0; }
  try { const v = (asFormulaNumber(results["directCost"])) * (input.overheadPercent / 100); results["overheadCost"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["overheadCost"] = 0; }
  try { const v = (asFormulaNumber(results["directCost"])) + (asFormulaNumber(results["overheadCost"])); results["totalCost"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["totalCost"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

export function calculateMeal_plan_calculator(input: Meal_plan_calculatorInput): Meal_plan_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = Math.max(0, toNumericFormulaValue(values["totalCost"]));
  const breakdown = {
    
  };
  const hiddenLossDrivers: string[] = [];
  const suggestedActions: string[] = ["Review inputs and verify results against site standards."];
  const dataConfidenceAdjusted =
    typeof input.dataConfidence === "number"
      ? Math.max(0, totalWasteCost * (input.dataConfidence / 100))
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
