// Auto-generated from pilates-calorie-calculator-schema.json
import * as z from 'zod';

export interface Pilates_calorie_calculatorInput {
  weight: number;
  warmupDuration: number;
  mainDuration: number;
  cooldownDuration: number;
  difficultyFactor: number;
}

export const Pilates_calorie_calculatorInputSchema = z.object({
  weight: z.number().default(70),
  warmupDuration: z.number().default(5),
  mainDuration: z.number().default(30),
  cooldownDuration: z.number().default(5),
  difficultyFactor: z.number().default(1),
});

function evaluateAllFormulas(input: Pilates_calorie_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.weight * (2.5 * input.warmupDuration / 60 + 3.5 * input.mainDuration / 60 + 2.0 * input.cooldownDuration / 60) * input.difficultyFactor; results["caloriesBurned"] = Number.isFinite(v) ? v : 0; } catch { results["caloriesBurned"] = 0; }
  try { const v = (results["caloriesBurned"] ?? 0) / (input.warmupDuration + input.mainDuration + input.cooldownDuration); results["caloriesPerMinute"] = Number.isFinite(v) ? v : 0; } catch { results["caloriesPerMinute"] = 0; }
  try { const v = input.warmupDuration + input.mainDuration + input.cooldownDuration; results["totalDuration"] = Number.isFinite(v) ? v : 0; } catch { results["totalDuration"] = 0; }
  return results;
}


export function calculatePilates_calorie_calculator(input: Pilates_calorie_calculatorInput): Pilates_calorie_calculatorOutput {
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


export interface Pilates_calorie_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
