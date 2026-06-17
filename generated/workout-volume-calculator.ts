// Auto-generated from workout-volume-calculator-schema.json
import * as z from 'zod';

export interface Workout_volume_calculatorInput {
  length: number;
  width: number;
  height: number;
  fill_factor: number;
}

export const Workout_volume_calculatorInputSchema = z.object({
  length: z.number().default(10),
  width: z.number().default(5),
  height: z.number().default(3),
  fill_factor: z.number().default(50),
});

function evaluateAllFormulas(input: Workout_volume_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.length * input.width * input.height; results["total_volume"] = Number.isFinite(v) ? v : 0; } catch { results["total_volume"] = 0; }
  try { const v = (results["total_volume"] ?? 0) * (input.fill_factor / 100); results["usable_volume"] = Number.isFinite(v) ? v : 0; } catch { results["usable_volume"] = 0; }
  try { const v = (results["total_volume"] ?? 0) - (results["usable_volume"] ?? 0); results["unused_volume"] = Number.isFinite(v) ? v : 0; } catch { results["unused_volume"] = 0; }
  return results;
}


export function calculateWorkout_volume_calculator(input: Workout_volume_calculatorInput): Workout_volume_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["usable_volume"] ?? 0;
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


export interface Workout_volume_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
