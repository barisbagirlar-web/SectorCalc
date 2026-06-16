// Auto-generated from noom-calorie-calculator-schema.json
import * as z from 'zod';

export interface Noom_calorie_calculatorInput {
  weight: number;
  height: number;
  age: number;
  sex: number;
  activityFactor: number;
  deficitPercent: number;
}

export const Noom_calorie_calculatorInputSchema = z.object({
  weight: z.number().default(70),
  height: z.number().default(170),
  age: z.number().default(30),
  sex: z.number().default(1),
  activityFactor: z.number().default(1.55),
  deficitPercent: z.number().default(15),
});

function evaluateAllFormulas(input: Noom_calorie_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.sex ? (10 * input.weight + 6.25 * input.height - 5 * input.age + 5) : (10 * input.weight + 6.25 * input.height - 5 * input.age - 161); results["bmr"] = Number.isFinite(v) ? v : 0; } catch { results["bmr"] = 0; }
  try { const v = (results["bmr"] ?? 0) * input.activityFactor; results["tdee"] = Number.isFinite(v) ? v : 0; } catch { results["tdee"] = 0; }
  try { const v = (results["tdee"] ?? 0) * (input.deficitPercent / 100); results["deficit"] = Number.isFinite(v) ? v : 0; } catch { results["deficit"] = 0; }
  try { const v = (results["tdee"] ?? 0) - (results["deficit"] ?? 0); results["dailyCalorieBudget"] = Number.isFinite(v) ? v : 0; } catch { results["dailyCalorieBudget"] = 0; }
  return results;
}


export function calculateNoom_calorie_calculator(input: Noom_calorie_calculatorInput): Noom_calorie_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["dailyCalorieBudget"] ?? 0;
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


export interface Noom_calorie_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
