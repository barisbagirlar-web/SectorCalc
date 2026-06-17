// Auto-generated from keto-macro-calculator-schema.json
import * as z from 'zod';

export interface Keto_macro_calculatorInput {
  weight: number;
  height: number;
  age: number;
  gender: number;
  activityFactor: number;
  calorieAdjustment: number;
}

export const Keto_macro_calculatorInputSchema = z.object({
  weight: z.number().default(70),
  height: z.number().default(170),
  age: z.number().default(30),
  gender: z.number().default(1),
  activityFactor: z.number().default(1.55),
  calorieAdjustment: z.number().default(0),
});

function evaluateAllFormulas(input: Keto_macro_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = 10*input.weight + 6.25*input.height - 5*input.age + (input.gender === 0 ? -161 : 5); results["bmr"] = Number.isFinite(v) ? v : 0; } catch { results["bmr"] = 0; }
  try { const v = (results["bmr"] ?? 0) * input.activityFactor; results["tdee"] = Number.isFinite(v) ? v : 0; } catch { results["tdee"] = 0; }
  try { const v = (results["tdee"] ?? 0) + input.calorieAdjustment; results["adjustedCalories"] = Number.isFinite(v) ? v : 0; } catch { results["adjustedCalories"] = 0; }
  try { const v = (results["adjustedCalories"] ?? 0) * 0.7 / 9; results["fat"] = Number.isFinite(v) ? v : 0; } catch { results["fat"] = 0; }
  try { const v = (results["adjustedCalories"] ?? 0) * 0.25 / 4; results["protein"] = Number.isFinite(v) ? v : 0; } catch { results["protein"] = 0; }
  try { const v = (results["adjustedCalories"] ?? 0) * 0.05 / 4; results["carbs"] = Number.isFinite(v) ? v : 0; } catch { results["carbs"] = 0; }
  return results;
}


export function calculateKeto_macro_calculator(input: Keto_macro_calculatorInput): Keto_macro_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["adjustedCalories"] ?? 0;
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


export interface Keto_macro_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
