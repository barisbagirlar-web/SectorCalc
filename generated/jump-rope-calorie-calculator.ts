// Auto-generated from jump-rope-calorie-calculator-schema.json
import * as z from 'zod';

export interface Jump_rope_calorie_calculatorInput {
  weight: number;
  duration: number;
  jumpsPerMinute: number;
  efficiencyFactor: number;
}

export const Jump_rope_calorie_calculatorInputSchema = z.object({
  weight: z.number().default(70),
  duration: z.number().default(30),
  jumpsPerMinute: z.number().default(120),
  efficiencyFactor: z.number().default(1),
});

function evaluateAllFormulas(input: Jump_rope_calorie_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.jumpsPerMinute / 13.636; results["met"] = Number.isFinite(v) ? v : 0; } catch { results["met"] = 0; }
  try { const v = (results["met"] ?? 0) * input.weight * 3.5 / 200 * input.efficiencyFactor; results["caloriesPerMinute"] = Number.isFinite(v) ? v : 0; } catch { results["caloriesPerMinute"] = 0; }
  try { const v = (results["caloriesPerMinute"] ?? 0) * input.duration; results["caloriesBurned"] = Number.isFinite(v) ? v : 0; } catch { results["caloriesBurned"] = 0; }
  return results;
}


export function calculateJump_rope_calorie_calculator(input: Jump_rope_calorie_calculatorInput): Jump_rope_calorie_calculatorOutput {
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


export interface Jump_rope_calorie_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
