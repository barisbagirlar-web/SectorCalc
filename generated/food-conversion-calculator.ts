// Auto-generated from food-conversion-calculator-schema.json
import * as z from 'zod';

export interface Food_conversion_calculatorInput {
  volumeMl: number;
  densityGml: number;
  numberOfServings: number;
  caloriesPerGram: number;
  cupFactor: number;
}

export const Food_conversion_calculatorInputSchema = z.object({
  volumeMl: z.number().default(250),
  densityGml: z.number().default(1),
  numberOfServings: z.number().default(1),
  caloriesPerGram: z.number().default(0.04),
  cupFactor: z.number().default(236.588),
});

function evaluateAllFormulas(input: Food_conversion_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.volumeMl * input.densityGml; results["totalWeightGrams"] = Number.isFinite(v) ? v : 0; } catch { results["totalWeightGrams"] = 0; }
  try { const v = (results["totalWeightGrams"] ?? 0) / input.numberOfServings; results["weightPerServingGrams"] = Number.isFinite(v) ? v : 0; } catch { results["weightPerServingGrams"] = 0; }
  try { const v = (results["totalWeightGrams"] ?? 0) * input.caloriesPerGram; results["totalCalories"] = Number.isFinite(v) ? v : 0; } catch { results["totalCalories"] = 0; }
  try { const v = (results["totalCalories"] ?? 0) / input.numberOfServings; results["caloriesPerServing"] = Number.isFinite(v) ? v : 0; } catch { results["caloriesPerServing"] = 0; }
  try { const v = input.volumeMl / input.cupFactor; results["totalCups"] = Number.isFinite(v) ? v : 0; } catch { results["totalCups"] = 0; }
  return results;
}


export function calculateFood_conversion_calculator(input: Food_conversion_calculatorInput): Food_conversion_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["totalWeightGrams"] ?? 0;
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


export interface Food_conversion_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
