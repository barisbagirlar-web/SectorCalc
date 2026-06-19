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
  dataConfidence?: number;
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

function asFormulaNumber(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Recipe_scaler_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.desiredServings / input.originalServings; results["scaleFactor"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["scaleFactor"] = 0; }
  try { const v = input.ingredient1Amount * (asFormulaNumber(results["scaleFactor"])); results["scaledIngredient1"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["scaledIngredient1"] = 0; }
  try { const v = input.ingredient2Amount * (asFormulaNumber(results["scaleFactor"])); results["scaledIngredient2"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["scaledIngredient2"] = 0; }
  try { const v = input.ingredient3Amount * (asFormulaNumber(results["scaleFactor"])); results["scaledIngredient3"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["scaledIngredient3"] = 0; }
  try { const v = input.ingredient4Amount * (asFormulaNumber(results["scaleFactor"])); results["scaledIngredient4"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["scaledIngredient4"] = 0; }
  try { const v = input.ingredient5Amount * (asFormulaNumber(results["scaleFactor"])); results["scaledIngredient5"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["scaledIngredient5"] = 0; }
  try { const v = input.ingredient6Amount * (asFormulaNumber(results["scaleFactor"])); results["scaledIngredient6"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["scaledIngredient6"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

export function calculateRecipe_scaler_calculator(input: Recipe_scaler_calculatorInput): Recipe_scaler_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["scaleFactor"]);
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


export interface Recipe_scaler_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
