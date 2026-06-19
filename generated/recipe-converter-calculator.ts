// Auto-generated from recipe-converter-calculator-schema.json
import * as z from 'zod';

export interface Recipe_converter_calculatorInput {
  originalServings: number;
  newServings: number;
  ingredientOneAmount: number;
  ingredientTwoAmount: number;
  ingredientThreeAmount: number;
  ingredientFourAmount: number;
  dataConfidence?: number;
}

export const Recipe_converter_calculatorInputSchema = z.object({
  originalServings: z.number().default(4),
  newServings: z.number().default(8),
  ingredientOneAmount: z.number().default(200),
  ingredientTwoAmount: z.number().default(100),
  ingredientThreeAmount: z.number().default(50),
  ingredientFourAmount: z.number().default(25),
});

function asFormulaNumber(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Recipe_converter_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.newServings / input.originalServings; results["scalingFactor"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["scalingFactor"] = 0; }
  try { const v = input.ingredientOneAmount * (input.newServings / input.originalServings); results["newIngredientOneAmount"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["newIngredientOneAmount"] = 0; }
  try { const v = input.ingredientTwoAmount * (input.newServings / input.originalServings); results["newIngredientTwoAmount"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["newIngredientTwoAmount"] = 0; }
  try { const v = input.ingredientThreeAmount * (input.newServings / input.originalServings); results["newIngredientThreeAmount"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["newIngredientThreeAmount"] = 0; }
  try { const v = input.ingredientFourAmount * (input.newServings / input.originalServings); results["newIngredientFourAmount"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["newIngredientFourAmount"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

export function calculateRecipe_converter_calculator(input: Recipe_converter_calculatorInput): Recipe_converter_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["scalingFactor"]);
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


export interface Recipe_converter_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
