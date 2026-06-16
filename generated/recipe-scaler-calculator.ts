// Auto-generated from recipe-scaler-calculator-schema.json
import * as z from 'zod';

export interface Recipe_scaler_calculatorInput {
  originalServings: number;
  desiredServings: number;
  ingredient1Amount: number;
  ingredient2Amount: number;
  ingredient3Amount: number;
  ingredient4Amount: number;
  ingredient5Amount: number;
  ingredient6Amount: number;
}

export const Recipe_scaler_calculatorInputSchema = z.object({
  originalServings: z.number().default(4),
  desiredServings: z.number().default(8),
  ingredient1Amount: z.number().default(200),
  ingredient2Amount: z.number().default(150),
  ingredient3Amount: z.number().default(100),
  ingredient4Amount: z.number().default(50),
  ingredient5Amount: z.number().default(25),
  ingredient6Amount: z.number().default(10),
});

function evaluateAllFormulas(input: Recipe_scaler_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.desiredServings / input.originalServings; results["scaleFactor"] = Number.isFinite(v) ? v : 0; } catch { results["scaleFactor"] = 0; }
  try { const v = input.ingredient1Amount * (results["scaleFactor"] ?? 0); results["scaledIngredient1"] = Number.isFinite(v) ? v : 0; } catch { results["scaledIngredient1"] = 0; }
  try { const v = input.ingredient2Amount * (results["scaleFactor"] ?? 0); results["scaledIngredient2"] = Number.isFinite(v) ? v : 0; } catch { results["scaledIngredient2"] = 0; }
  try { const v = input.ingredient3Amount * (results["scaleFactor"] ?? 0); results["scaledIngredient3"] = Number.isFinite(v) ? v : 0; } catch { results["scaledIngredient3"] = 0; }
  try { const v = input.ingredient4Amount * (results["scaleFactor"] ?? 0); results["scaledIngredient4"] = Number.isFinite(v) ? v : 0; } catch { results["scaledIngredient4"] = 0; }
  try { const v = input.ingredient5Amount * (results["scaleFactor"] ?? 0); results["scaledIngredient5"] = Number.isFinite(v) ? v : 0; } catch { results["scaledIngredient5"] = 0; }
  try { const v = input.ingredient6Amount * (results["scaleFactor"] ?? 0); results["scaledIngredient6"] = Number.isFinite(v) ? v : 0; } catch { results["scaledIngredient6"] = 0; }
  return results;
}


export function calculateRecipe_scaler_calculator(input: Recipe_scaler_calculatorInput): Recipe_scaler_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["scaleFactor"] ?? 0;
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


export interface Recipe_scaler_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
