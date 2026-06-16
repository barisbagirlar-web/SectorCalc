// Auto-generated from lose-it-app-calculator-schema.json
import * as z from 'zod';

export interface Lose_it_app_calculatorInput {
  currentWeight: number;
  targetWeight: number;
  height: number;
  age: number;
  gender: number;
  activityLevel: number;
  dailyCalorieIntake: number;
  targetDays: number;
}

export const Lose_it_app_calculatorInputSchema = z.object({
  currentWeight: z.number().default(80),
  targetWeight: z.number().default(70),
  height: z.number().default(170),
  age: z.number().default(30),
  gender: z.number().default(1),
  activityLevel: z.number().default(1.55),
  dailyCalorieIntake: z.number().default(2000),
  targetDays: z.number().default(90),
});

function evaluateAllFormulas(input: Lose_it_app_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = 10 * input.currentWeight + 6.25 * input.height - 5 * input.age + (input.gender === 1 ? 5 : -161); results["bmr"] = Number.isFinite(v) ? v : 0; } catch { results["bmr"] = 0; }
  try { const v = (results["bmr"] ?? 0) * input.activityLevel; results["tdee"] = Number.isFinite(v) ? v : 0; } catch { results["tdee"] = 0; }
  try { const v = (results["tdee"] ?? 0) - input.dailyCalorieIntake; results["dailyDeficit"] = Number.isFinite(v) ? v : 0; } catch { results["dailyDeficit"] = 0; }
  try { const v = ((results["dailyDeficit"] ?? 0) / 7700) * input.targetDays; results["projectedWeightLoss"] = Number.isFinite(v) ? v : 0; } catch { results["projectedWeightLoss"] = 0; }
  try { const v = input.currentWeight - (results["projectedWeightLoss"] ?? 0); results["projectedWeight"] = Number.isFinite(v) ? v : 0; } catch { results["projectedWeight"] = 0; }
  return results;
}


export function calculateLose_it_app_calculator(input: Lose_it_app_calculatorInput): Lose_it_app_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["projectedWeight"] ?? 0;
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
