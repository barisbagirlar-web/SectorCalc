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

function asFormulaNumber(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Food_recipe_scalerInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.desiredServings / input.originalServings; results["scalingFactor"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["scalingFactor"] = 0; }
  try { const v = input.ingredient1Amount * (asFormulaNumber(results["scalingFactor"])); results["scaled1"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["scaled1"] = 0; }
  try { const v = input.ingredient2Amount * (asFormulaNumber(results["scalingFactor"])); results["scaled2"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["scaled2"] = 0; }
  try { const v = input.ingredient3Amount * (asFormulaNumber(results["scalingFactor"])); results["scaled3"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["scaled3"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

export function calculateFood_recipe_scaler(input: Food_recipe_scalerInput): Food_recipe_scalerOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = Math.max(0, toNumericFormulaValue(values["scalingFactor"]));
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


export interface Food_recipe_scalerOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
