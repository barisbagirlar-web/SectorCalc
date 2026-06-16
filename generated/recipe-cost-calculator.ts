// Auto-generated from recipe-cost-calculator-schema.json
import * as z from 'zod';

export interface Recipe_cost_calculatorInput {
  ingredientCost: number;
  laborHours: number;
  laborRate: number;
  overheadPercentage: number;
  packagingCost: number;
  servings: number;
}

export const Recipe_cost_calculatorInputSchema = z.object({
  ingredientCost: z.number().default(0),
  laborHours: z.number().default(0),
  laborRate: z.number().default(50),
  overheadPercentage: z.number().default(20),
  packagingCost: z.number().default(0),
  servings: z.number().default(1),
});

function evaluateAllFormulas(input: Recipe_cost_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.ingredientCost; results["totalIngredientCost"] = Number.isFinite(v) ? v : 0; } catch { results["totalIngredientCost"] = 0; }
  try { const v = input.laborHours * input.laborRate; results["totalLaborCost"] = Number.isFinite(v) ? v : 0; } catch { results["totalLaborCost"] = 0; }
  try { const v = ((results["totalIngredientCost"] ?? 0) + (results["totalLaborCost"] ?? 0)) * (input.overheadPercentage / 100); results["totalOverhead"] = Number.isFinite(v) ? v : 0; } catch { results["totalOverhead"] = 0; }
  try { const v = (results["totalIngredientCost"] ?? 0) + (results["totalLaborCost"] ?? 0) + (results["totalOverhead"] ?? 0) + input.packagingCost; results["totalCost"] = Number.isFinite(v) ? v : 0; } catch { results["totalCost"] = 0; }
  try { const v = (results["totalCost"] ?? 0) / input.servings; results["costPerServing"] = Number.isFinite(v) ? v : 0; } catch { results["costPerServing"] = 0; }
  return results;
}


export function calculateRecipe_cost_calculator(input: Recipe_cost_calculatorInput): Recipe_cost_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["costPerServing"] ?? 0;
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
