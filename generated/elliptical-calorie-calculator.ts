// Auto-generated from elliptical-calorie-calculator-schema.json
import * as z from 'zod';

export interface Elliptical_calorie_calculatorInput {
  weight: number;
  duration: number;
  met: number;
  correctionFactor: number;
}

export const Elliptical_calorie_calculatorInputSchema = z.object({
  weight: z.number().default(70),
  duration: z.number().default(30),
  met: z.number().default(5),
  correctionFactor: z.number().default(1),
});

function evaluateAllFormulas(input: Elliptical_calorie_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.weight * input.met * (input.duration / 60) * input.correctionFactor; results["totalCalories"] = Number.isFinite(v) ? v : 0; } catch { results["totalCalories"] = 0; }
  try { const v = input.weight * input.met * input.correctionFactor / 60; results["caloriesPerMinute"] = Number.isFinite(v) ? v : 0; } catch { results["caloriesPerMinute"] = 0; }
  try { const v = input.met; results["metUsed"] = Number.isFinite(v) ? v : 0; } catch { results["metUsed"] = 0; }
  return results;
}


export function calculateElliptical_calorie_calculator(input: Elliptical_calorie_calculatorInput): Elliptical_calorie_calculatorOutput {
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


export interface Elliptical_calorie_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
