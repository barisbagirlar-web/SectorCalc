// Auto-generated from food-recipe-scaler-schema.json
import * as z from 'zod';

export interface Food_recipe_scalerInput {
  originalServings: number;
  desiredServings: number;
  ingredient1Amount: number;
  ingredient2Amount: number;
  ingredient3Amount: number;
  dataConfidence?: number;
}

export const Food_recipe_scalerInputSchema = z.object({
  originalServings: z.number().default(4),
  desiredServings: z.number().default(8),
  ingredient1Amount: z.number().default(200),
  ingredient2Amount: z.number().default(100),
  ingredient3Amount: z.number().default(50),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Food_recipe_scalerInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.desiredServings / input.originalServings; results["scalingFactor"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["scalingFactor"] = Number.NaN; }
  try { const v = input.ingredient1Amount * (toNumericFormulaValue(results["scalingFactor"])); results["scaled1"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["scaled1"] = Number.NaN; }
  try { const v = input.ingredient2Amount * (toNumericFormulaValue(results["scalingFactor"])); results["scaled2"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["scaled2"] = Number.NaN; }
  try { const v = input.ingredient3Amount * (toNumericFormulaValue(results["scalingFactor"])); results["scaled3"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["scaled3"] = Number.NaN; }
  return results;
}


export function calculateFood_recipe_scaler(input: Food_recipe_scalerInput): Food_recipe_scalerOutput {
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


export interface Food_recipe_scalerOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
