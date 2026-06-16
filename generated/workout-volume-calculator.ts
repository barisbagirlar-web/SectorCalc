// Auto-generated from workout-volume-calculator-schema.json
import * as z from 'zod';

export interface Workout_volume_calculatorInput {
  exercises: number;
  sets: number;
  reps: number;
  weight: number;
}

export const Workout_volume_calculatorInputSchema = z.object({
  exercises: z.number().default(5),
  sets: z.number().default(3),
  reps: z.number().default(10),
  weight: z.number().default(50),
});

function evaluateAllFormulas(input: Workout_volume_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.exercises * input.sets * input.reps * input.weight; results["totalVolume"] = Number.isFinite(v) ? v : 0; } catch { results["totalVolume"] = 0; }
  try { const v = input.sets * input.reps * input.weight; results["averageVolumePerExercise"] = Number.isFinite(v) ? v : 0; } catch { results["averageVolumePerExercise"] = 0; }
  return results;
}


export function calculateWorkout_volume_calculator(input: Workout_volume_calculatorInput): Workout_volume_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["totalVolume"] ?? 0;
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
