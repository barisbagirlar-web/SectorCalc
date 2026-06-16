// Auto-generated from swimming-calorie-calculator-schema.json
import * as z from 'zod';

export interface Swimming_calorie_calculatorInput {
  weight: number;
  durationMinutes: number;
  metValue: number;
  calorieBurnRate: number;
}

export const Swimming_calorie_calculatorInputSchema = z.object({
  weight: z.number().default(70),
  durationMinutes: z.number().default(30),
  metValue: z.number().default(8),
  calorieBurnRate: z.number().default(1),
});

function evaluateAllFormulas(input: Swimming_calorie_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.metValue * input.weight * (input.durationMinutes / 60) * input.calorieBurnRate; results["totalCalories"] = Number.isFinite(v) ? v : 0; } catch { results["totalCalories"] = 0; }
  try { const v = (results["totalCalories"] ?? 0) / input.durationMinutes; results["caloriesPerMinute"] = Number.isFinite(v) ? v : 0; } catch { results["caloriesPerMinute"] = 0; }
  try { const v = (results["caloriesPerMinute"] ?? 0) * 60; results["caloriesPerHour"] = Number.isFinite(v) ? v : 0; } catch { results["caloriesPerHour"] = 0; }
  return results;
}


export function calculateSwimming_calorie_calculator(input: Swimming_calorie_calculatorInput): Swimming_calorie_calculatorOutput {
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


export interface Swimming_calorie_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
