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

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Recipe_scaler_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.desiredServings / input.originalServings; results["scaleFactor"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["scaleFactor"] = Number.NaN; }
  try { const v = input.ingredient1Amount * (toNumericFormulaValue(results["scaleFactor"])); results["scaledIngredient1"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["scaledIngredient1"] = Number.NaN; }
  try { const v = input.ingredient2Amount * (toNumericFormulaValue(results["scaleFactor"])); results["scaledIngredient2"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["scaledIngredient2"] = Number.NaN; }
  try { const v = input.ingredient3Amount * (toNumericFormulaValue(results["scaleFactor"])); results["scaledIngredient3"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["scaledIngredient3"] = Number.NaN; }
  try { const v = input.ingredient4Amount * (toNumericFormulaValue(results["scaleFactor"])); results["scaledIngredient4"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["scaledIngredient4"] = Number.NaN; }
  try { const v = input.ingredient5Amount * (toNumericFormulaValue(results["scaleFactor"])); results["scaledIngredient5"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["scaledIngredient5"] = Number.NaN; }
  try { const v = input.ingredient6Amount * (toNumericFormulaValue(results["scaleFactor"])); results["scaledIngredient6"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["scaledIngredient6"] = Number.NaN; }
  return results;
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
