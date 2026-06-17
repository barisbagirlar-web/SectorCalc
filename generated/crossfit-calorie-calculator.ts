// Auto-generated from crossfit-calorie-calculator-schema.json
import * as z from 'zod';

export interface Crossfit_calorie_calculatorInput {
  weight: number;
  duration: number;
  metValue: number;
  genderFactor: number;
}

export const Crossfit_calorie_calculatorInputSchema = z.object({
  weight: z.number().default(70),
  duration: z.number().default(30),
  metValue: z.number().default(8),
  genderFactor: z.number().default(1),
});

function evaluateAllFormulas(input: Crossfit_calorie_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.genderFactor * input.metValue * input.weight * (input.duration / 60); results["totalCalories"] = Number.isFinite(v) ? v : 0; } catch { results["totalCalories"] = 0; }
  try { const v = input.genderFactor * input.metValue * input.weight / 60; results["caloriesPerMinute"] = Number.isFinite(v) ? v : 0; } catch { results["caloriesPerMinute"] = 0; }
  try { const v = input.genderFactor * input.metValue * input.weight; results["caloriesPerHour"] = Number.isFinite(v) ? v : 0; } catch { results["caloriesPerHour"] = 0; }
  return results;
}


export function calculateCrossfit_calorie_calculator(input: Crossfit_calorie_calculatorInput): Crossfit_calorie_calculatorOutput {
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


export interface Crossfit_calorie_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
