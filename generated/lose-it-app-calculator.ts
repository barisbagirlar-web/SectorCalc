// Auto-generated from lose-it-app-calculator-schema.json
import * as z from 'zod';

export interface Lose_it_app_calculatorInput {
  age: number;
  height: number;
  weight: number;
  gender: number;
  activityLevel: number;
  weightGoal: number;
}

export const Lose_it_app_calculatorInputSchema = z.object({
  age: z.number().default(30),
  height: z.number().default(170),
  weight: z.number().default(70),
  gender: z.number().default(0),
  activityLevel: z.number().default(1.2),
  weightGoal: z.number().default(-0.5),
});

function evaluateAllFormulas(input: Lose_it_app_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = 10 * input.weight + 6.25 * input.height - 5 * input.age + (input.gender === 0 ? 5 : -161); results["bmr"] = Number.isFinite(v) ? v : 0; } catch { results["bmr"] = 0; }
  try { const v = (results["bmr"] ?? 0) * input.activityLevel; results["tdee"] = Number.isFinite(v) ? v : 0; } catch { results["tdee"] = 0; }
  try { const v = (input.weightGoal * 7700) / 7; results["dailyAdjustment"] = Number.isFinite(v) ? v : 0; } catch { results["dailyAdjustment"] = 0; }
  try { const v = (results["tdee"] ?? 0) + (results["dailyAdjustment"] ?? 0); results["calorieBudget"] = Number.isFinite(v) ? v : 0; } catch { results["calorieBudget"] = 0; }
  return results;
}


export function calculateLose_it_app_calculator(input: Lose_it_app_calculatorInput): Lose_it_app_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["calorieBudget"] ?? 0;
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


export interface Lose_it_app_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
