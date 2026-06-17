// Auto-generated from recipe-cost-calculator-schema.json
import * as z from 'zod';

export interface Recipe_cost_calculatorInput {
  ingredientCostPerUnit: number;
  ingredientQuantity: number;
  numberOfPortions: number;
  laborCostPerHour: number;
  laborHours: number;
  overheadPercent: number;
}

export const Recipe_cost_calculatorInputSchema = z.object({
  ingredientCostPerUnit: z.number().default(5),
  ingredientQuantity: z.number().default(0.5),
  numberOfPortions: z.number().default(4),
  laborCostPerHour: z.number().default(15),
  laborHours: z.number().default(1),
  overheadPercent: z.number().default(10),
});

function evaluateAllFormulas(input: Recipe_cost_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.ingredientCostPerUnit * input.ingredientQuantity; results["totalIngredientCost"] = Number.isFinite(v) ? v : 0; } catch { results["totalIngredientCost"] = 0; }
  try { const v = input.laborCostPerHour * input.laborHours; results["laborCost"] = Number.isFinite(v) ? v : 0; } catch { results["laborCost"] = 0; }
  try { const v = (results["totalIngredientCost"] ?? 0) * (input.overheadPercent / 100); results["overheadCost"] = Number.isFinite(v) ? v : 0; } catch { results["overheadCost"] = 0; }
  try { const v = (results["totalIngredientCost"] ?? 0) + (results["laborCost"] ?? 0) + (results["overheadCost"] ?? 0); results["totalRecipeCost"] = Number.isFinite(v) ? v : 0; } catch { results["totalRecipeCost"] = 0; }
  try { const v = (results["totalRecipeCost"] ?? 0) / input.numberOfPortions; results["costPerPortion"] = Number.isFinite(v) ? v : 0; } catch { results["costPerPortion"] = 0; }
  return results;
}


export function calculateRecipe_cost_calculator(input: Recipe_cost_calculatorInput): Recipe_cost_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["totalRecipeCost"] ?? 0;
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


export interface Recipe_cost_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
