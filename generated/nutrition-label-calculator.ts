// Auto-generated from nutrition-label-calculator-schema.json
import * as z from 'zod';

export interface Nutrition_label_calculatorInput {
  servingSize: number;
  calories: number;
  totalFat: number;
  sodium: number;
  totalCarbs: number;
  protein: number;
}

export const Nutrition_label_calculatorInputSchema = z.object({
  servingSize: z.number().default(100),
  calories: z.number().default(250),
  totalFat: z.number().default(12),
  sodium: z.number().default(500),
  totalCarbs: z.number().default(30),
  protein: z.number().default(5),
});

function evaluateAllFormulas(input: Nutrition_label_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = (input.calories / input.servingSize) * 100; results["caloriesPer100g"] = Number.isFinite(v) ? v : 0; } catch { results["caloriesPer100g"] = 0; }
  try { const v = (input.totalFat / input.servingSize) * 100; results["totalFatPer100g"] = Number.isFinite(v) ? v : 0; } catch { results["totalFatPer100g"] = 0; }
  try { const v = (input.sodium / input.servingSize) * 100; results["sodiumPer100g"] = Number.isFinite(v) ? v : 0; } catch { results["sodiumPer100g"] = 0; }
  try { const v = (input.totalCarbs / input.servingSize) * 100; results["totalCarbsPer100g"] = Number.isFinite(v) ? v : 0; } catch { results["totalCarbsPer100g"] = 0; }
  try { const v = (input.protein / input.servingSize) * 100; results["proteinPer100g"] = Number.isFinite(v) ? v : 0; } catch { results["proteinPer100g"] = 0; }
  return results;
}


export function calculateNutrition_label_calculator(input: Nutrition_label_calculatorInput): Nutrition_label_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["caloriesPer100g"] ?? 0;
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


export interface Nutrition_label_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
