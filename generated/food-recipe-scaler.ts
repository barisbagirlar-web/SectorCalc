// Auto-generated from food-recipe-scaler-schema.json
import * as z from 'zod';

export interface Food_recipe_scalerInput {
  originalServings: number;
  desiredServings: number;
  ingredient1Amount: number;
  ingredient2Amount: number;
  ingredient3Amount: number;
}

export const Food_recipe_scalerInputSchema = z.object({
  originalServings: z.number().default(4),
  desiredServings: z.number().default(8),
  ingredient1Amount: z.number().default(200),
  ingredient2Amount: z.number().default(100),
  ingredient3Amount: z.number().default(50),
});

function evaluateAllFormulas(input: Food_recipe_scalerInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.desiredServings / input.originalServings; results["scalingFactor"] = Number.isFinite(v) ? v : 0; } catch { results["scalingFactor"] = 0; }
  try { const v = input.ingredient1Amount * (results["scalingFactor"] ?? 0); results["scaled1"] = Number.isFinite(v) ? v : 0; } catch { results["scaled1"] = 0; }
  try { const v = input.ingredient2Amount * (results["scalingFactor"] ?? 0); results["scaled2"] = Number.isFinite(v) ? v : 0; } catch { results["scaled2"] = 0; }
  try { const v = input.ingredient3Amount * (results["scalingFactor"] ?? 0); results["scaled3"] = Number.isFinite(v) ? v : 0; } catch { results["scaled3"] = 0; }
  return results;
}


export function calculateFood_recipe_scaler(input: Food_recipe_scalerInput): Food_recipe_scalerOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["scalingFactor"] ?? 0;
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


export interface Food_recipe_scalerOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
