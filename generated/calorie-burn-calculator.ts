// Auto-generated from calorie-burn-calculator-schema.json
import * as z from 'zod';

export interface Calorie_burn_calculatorInput {
  weight: number;
  duration: number;
  met: number;
}

export const Calorie_burn_calculatorInputSchema = z.object({
  weight: z.number().default(70),
  duration: z.number().default(30),
  met: z.number().default(8),
});

function evaluateAllFormulas(input: Calorie_burn_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.met * input.weight * (input.duration / 60); results["caloriesBurned"] = Number.isFinite(v) ? v : 0; } catch { results["caloriesBurned"] = 0; }
  try { const v = input.met * input.duration; results["metMinutes"] = Number.isFinite(v) ? v : 0; } catch { results["metMinutes"] = 0; }
  try { const v = input.duration / 60; results["durationHours"] = Number.isFinite(v) ? v : 0; } catch { results["durationHours"] = 0; }
  return results;
}


export function calculateCalorie_burn_calculator(input: Calorie_burn_calculatorInput): Calorie_burn_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["caloriesBurned"] ?? 0;
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


export interface Calorie_burn_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
