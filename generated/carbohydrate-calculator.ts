// Auto-generated from carbohydrate-calculator-schema.json
import * as z from 'zod';

export interface Carbohydrate_calculatorInput {
  weight: number;
  height: number;
  age: number;
  gender: number;
  activityLevel: number;
  carbPercentage: number;
}

export const Carbohydrate_calculatorInputSchema = z.object({
  weight: z.number().default(70),
  height: z.number().default(170),
  age: z.number().default(30),
  gender: z.number().default(1),
  activityLevel: z.number().default(1.55),
  carbPercentage: z.number().default(50),
});

function evaluateAllFormulas(input: Carbohydrate_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.gender * (10*input.weight + 6.25*input.height - 5*input.age + 5) + (1 - input.gender) * (10*input.weight + 6.25*input.height - 5*input.age - 161); results["bmr"] = Number.isFinite(v) ? v : 0; } catch { results["bmr"] = 0; }
  try { const v = (results["bmr"] ?? 0) * input.activityLevel; results["tdee"] = Number.isFinite(v) ? v : 0; } catch { results["tdee"] = 0; }
  try { const v = (results["tdee"] ?? 0) * input.carbPercentage / 100; results["carbCalories"] = Number.isFinite(v) ? v : 0; } catch { results["carbCalories"] = 0; }
  try { const v = (results["carbCalories"] ?? 0) / 4; results["dailyCarbs"] = Number.isFinite(v) ? v : 0; } catch { results["dailyCarbs"] = 0; }
  return results;
}


export function calculateCarbohydrate_calculator(input: Carbohydrate_calculatorInput): Carbohydrate_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["dailyCarbs"] ?? 0;
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


export interface Carbohydrate_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
