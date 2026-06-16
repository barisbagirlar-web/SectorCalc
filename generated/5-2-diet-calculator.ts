// Auto-generated from 5-2-diet-calculator-schema.json
import * as z from 'zod';

export interface _5_2_diet_calculatorInput {
  age: number;
  weight: number;
  height: number;
  gender: number;
  activityLevel: number;
  fastingPercent: number;
}

export const _5_2_diet_calculatorInputSchema = z.object({
  age: z.number().default(30),
  weight: z.number().default(70),
  height: z.number().default(170),
  gender: z.number().default(1),
  activityLevel: z.number().default(1.55),
  fastingPercent: z.number().default(25),
});

function evaluateAllFormulas(input: _5_2_diet_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = (input.gender === 1) ? (10 * input.weight + 6.25 * input.height - 5 * input.age + 5) : (10 * input.weight + 6.25 * input.height - 5 * input.age - 161); results["BMR"] = Number.isFinite(v) ? v : 0; } catch { results["BMR"] = 0; }
  try { const v = (results["BMR"] ?? 0) * input.activityLevel; results["TDEE"] = Number.isFinite(v) ? v : 0; } catch { results["TDEE"] = 0; }
  try { const v = (results["TDEE"] ?? 0) * (input.fastingPercent / 100); results["fastingDayCalories"] = Number.isFinite(v) ? v : 0; } catch { results["fastingDayCalories"] = 0; }
  try { const v = (results["TDEE"] ?? 0); results["normalDayCalories"] = Number.isFinite(v) ? v : 0; } catch { results["normalDayCalories"] = 0; }
  return results;
}


export function calculate_5_2_diet_calculator(input: _5_2_diet_calculatorInput): _5_2_diet_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["fastingDayCalories"] ?? 0;
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


export interface _5_2_diet_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
