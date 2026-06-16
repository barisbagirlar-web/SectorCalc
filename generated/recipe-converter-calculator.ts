// Auto-generated from recipe-converter-calculator-schema.json
import * as z from 'zod';

export interface Recipe_converter_calculatorInput {
  originalServings: number;
  newServings: number;
  ingredientOneAmount: number;
  ingredientTwoAmount: number;
  ingredientThreeAmount: number;
  ingredientFourAmount: number;
}

export const Recipe_converter_calculatorInputSchema = z.object({
  originalServings: z.number().default(4),
  newServings: z.number().default(8),
  ingredientOneAmount: z.number().default(200),
  ingredientTwoAmount: z.number().default(100),
  ingredientThreeAmount: z.number().default(50),
  ingredientFourAmount: z.number().default(25),
});

function evaluateAllFormulas(input: Recipe_converter_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.newServings / input.originalServings; results["scalingFactor"] = Number.isFinite(v) ? v : 0; } catch { results["scalingFactor"] = 0; }
  try { const v = input.ingredientOneAmount * (input.newServings / input.originalServings); results["newIngredientOneAmount"] = Number.isFinite(v) ? v : 0; } catch { results["newIngredientOneAmount"] = 0; }
  try { const v = input.ingredientTwoAmount * (input.newServings / input.originalServings); results["newIngredientTwoAmount"] = Number.isFinite(v) ? v : 0; } catch { results["newIngredientTwoAmount"] = 0; }
  try { const v = input.ingredientThreeAmount * (input.newServings / input.originalServings); results["newIngredientThreeAmount"] = Number.isFinite(v) ? v : 0; } catch { results["newIngredientThreeAmount"] = 0; }
  try { const v = input.ingredientFourAmount * (input.newServings / input.originalServings); results["newIngredientFourAmount"] = Number.isFinite(v) ? v : 0; } catch { results["newIngredientFourAmount"] = 0; }
  return results;
}


export function calculateRecipe_converter_calculator(input: Recipe_converter_calculatorInput): Recipe_converter_calculatorOutput {
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


export interface Recipe_converter_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
