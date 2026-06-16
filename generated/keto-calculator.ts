// Auto-generated from keto-calculator-schema.json
import * as z from 'zod';

export interface Keto_calculatorInput {
  weight: number;
  height: number;
  age: number;
  gender: number;
  activityLevel: number;
  goalMultiplier: number;
}

export const Keto_calculatorInputSchema = z.object({
  weight: z.number().default(70),
  height: z.number().default(170),
  age: z.number().default(30),
  gender: z.number().default(0),
  activityLevel: z.number().default(1.2),
  goalMultiplier: z.number().default(1),
});

function evaluateAllFormulas(input: Keto_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = (10 * input.weight) + (6.25 * input.height) - (5 * input.age) + (input.gender == 0 ? 5 : -161); results["bmr"] = Number.isFinite(v) ? v : 0; } catch { results["bmr"] = 0; }
  try { const v = (results["bmr"] ?? 0) * input.activityLevel; results["tdee"] = Number.isFinite(v) ? v : 0; } catch { results["tdee"] = 0; }
  try { const v = (results["tdee"] ?? 0) * input.goalMultiplier; results["totalCalories"] = Number.isFinite(v) ? v : 0; } catch { results["totalCalories"] = 0; }
  try { const v = ((results["totalCalories"] ?? 0) * 0.7) / 9; results["fatGrams"] = Number.isFinite(v) ? v : 0; } catch { results["fatGrams"] = 0; }
  try { const v = ((results["totalCalories"] ?? 0) * 0.25) / 4; results["proteinGrams"] = Number.isFinite(v) ? v : 0; } catch { results["proteinGrams"] = 0; }
  try { const v = ((results["totalCalories"] ?? 0) * 0.05) / 4; results["netCarbs"] = Number.isFinite(v) ? v : 0; } catch { results["netCarbs"] = 0; }
  return results;
}


export function calculateKeto_calculator(input: Keto_calculatorInput): Keto_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["totalCalories"] ?? 0;
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


export interface Keto_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
