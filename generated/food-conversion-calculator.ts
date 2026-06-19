// Auto-generated from food-conversion-calculator-schema.json
import * as z from 'zod';

export interface Food_conversion_calculatorInput {
  volumeMl: number;
  densityGml: number;
  numberOfServings: number;
  caloriesPerGram: number;
  cupFactor: number;
  dataConfidence?: number;
}

export const Food_conversion_calculatorInputSchema = z.object({
  volumeMl: z.number().default(250),
  densityGml: z.number().default(1),
  numberOfServings: z.number().default(1),
  caloriesPerGram: z.number().default(0.04),
  cupFactor: z.number().default(236.588),
});

function asFormulaNumber(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Food_conversion_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.volumeMl * input.densityGml; results["totalWeightGrams"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["totalWeightGrams"] = 0; }
  try { const v = (asFormulaNumber(results["totalWeightGrams"])) / input.numberOfServings; results["weightPerServingGrams"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["weightPerServingGrams"] = 0; }
  try { const v = (asFormulaNumber(results["totalWeightGrams"])) * input.caloriesPerGram; results["totalCalories"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["totalCalories"] = 0; }
  try { const v = (asFormulaNumber(results["totalCalories"])) / input.numberOfServings; results["caloriesPerServing"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["caloriesPerServing"] = 0; }
  try { const v = input.volumeMl / input.cupFactor; results["totalCups"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["totalCups"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

export function calculateFood_conversion_calculator(input: Food_conversion_calculatorInput): Food_conversion_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = Math.max(0, toNumericFormulaValue(values["totalWeightGrams"]));
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


export interface Food_conversion_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
