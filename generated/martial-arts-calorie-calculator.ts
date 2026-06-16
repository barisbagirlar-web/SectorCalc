// Auto-generated from martial-arts-calorie-calculator-schema.json
import * as z from 'zod';

export interface Martial_arts_calorie_calculatorInput {
  weight: number;
  duration: number;
  met: number;
  adjustmentFactor: number;
}

export const Martial_arts_calorie_calculatorInputSchema = z.object({
  weight: z.number().default(70),
  duration: z.number().default(60),
  met: z.number().default(10),
  adjustmentFactor: z.number().default(1),
});

function evaluateAllFormulas(input: Martial_arts_calorie_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = (input.met * input.weight * input.duration / 60) * input.adjustmentFactor; results["totalCalories"] = Number.isFinite(v) ? v : 0; } catch { results["totalCalories"] = 0; }
  try { const v = input.met * input.weight / 60; results["caloriesPerMinute"] = Number.isFinite(v) ? v : 0; } catch { results["caloriesPerMinute"] = 0; }
  try { const v = input.met * input.weight; results["caloriesPerHour"] = Number.isFinite(v) ? v : 0; } catch { results["caloriesPerHour"] = 0; }
  return results;
}


export function calculateMartial_arts_calorie_calculator(input: Martial_arts_calorie_calculatorInput): Martial_arts_calorie_calculatorOutput {
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


export interface Martial_arts_calorie_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
