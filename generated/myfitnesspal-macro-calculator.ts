// Auto-generated from myfitnesspal-macro-calculator-schema.json
import * as z from 'zod';

export interface Myfitnesspal_macro_calculatorInput {
  weight: number;
  height: number;
  age: number;
  gender: number;
  activityLevel: number;
  goalFactor: number;
}

export const Myfitnesspal_macro_calculatorInputSchema = z.object({
  weight: z.number().default(70),
  height: z.number().default(170),
  age: z.number().default(30),
  gender: z.number().default(0),
  activityLevel: z.number().default(1.55),
  goalFactor: z.number().default(0.8),
});

function evaluateAllFormulas(input: Myfitnesspal_macro_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.gender === 0 ? (10 * input.weight + 6.25 * input.height - 5 * input.age - 161) : (10 * input.weight + 6.25 * input.height - 5 * input.age + 5); results["BMR"] = Number.isFinite(v) ? v : 0; } catch { results["BMR"] = 0; }
  try { const v = (results["BMR"] ?? 0) * input.activityLevel; results["TDEE"] = Number.isFinite(v) ? v : 0; } catch { results["TDEE"] = 0; }
  try { const v = (results["TDEE"] ?? 0) * input.goalFactor; results["dailyCalories"] = Number.isFinite(v) ? v : 0; } catch { results["dailyCalories"] = 0; }
  try { const v = ((results["dailyCalories"] ?? 0) * 0.30) / 4; results["protein"] = Number.isFinite(v) ? v : 0; } catch { results["protein"] = 0; }
  try { const v = ((results["dailyCalories"] ?? 0) * 0.45) / 4; results["carbs"] = Number.isFinite(v) ? v : 0; } catch { results["carbs"] = 0; }
  try { const v = ((results["dailyCalories"] ?? 0) * 0.25) / 9; results["fat"] = Number.isFinite(v) ? v : 0; } catch { results["fat"] = 0; }
  return results;
}


export function calculateMyfitnesspal_macro_calculator(input: Myfitnesspal_macro_calculatorInput): Myfitnesspal_macro_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["dailyCalories"] ?? 0;
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


export interface Myfitnesspal_macro_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
