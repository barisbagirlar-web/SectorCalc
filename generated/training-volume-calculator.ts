// Auto-generated from training-volume-calculator-schema.json
import * as z from 'zod';

export interface Training_volume_calculatorInput {
  sets: number;
  reps: number;
  weight: number;
  intensityFactor: number;
}

export const Training_volume_calculatorInputSchema = z.object({
  sets: z.number().default(3),
  reps: z.number().default(10),
  weight: z.number().default(50),
  intensityFactor: z.number().default(1),
});

function evaluateAllFormulas(input: Training_volume_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.sets * input.reps; results["totalReps"] = Number.isFinite(v) ? v : 0; } catch { results["totalReps"] = 0; }
  try { const v = input.sets * input.reps * input.weight; results["totalWeightLifted"] = Number.isFinite(v) ? v : 0; } catch { results["totalWeightLifted"] = 0; }
  try { const v = input.sets * input.reps * input.weight * input.intensityFactor; results["trainingVolume"] = Number.isFinite(v) ? v : 0; } catch { results["trainingVolume"] = 0; }
  return results;
}


export function calculateTraining_volume_calculator(input: Training_volume_calculatorInput): Training_volume_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["trainingVolume"] ?? 0;
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


export interface Training_volume_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
