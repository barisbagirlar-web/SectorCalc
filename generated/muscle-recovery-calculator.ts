// Auto-generated from muscle-recovery-calculator-schema.json
import * as z from 'zod';

export interface Muscle_recovery_calculatorInput {
  age: number;
  bodyWeight: number;
  workoutDuration: number;
  intensity: number;
  restTime: number;
}

export const Muscle_recovery_calculatorInputSchema = z.object({
  age: z.number().default(30),
  bodyWeight: z.number().default(70),
  workoutDuration: z.number().default(60),
  intensity: z.number().default(5),
  restTime: z.number().default(8),
});

function evaluateAllFormulas(input: Muscle_recovery_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = (input.restTime / (input.workoutDuration * input.intensity)) * (1 - input.age * 0.01) * (input.bodyWeight / 70) * 100; results["recoveryScore"] = Number.isFinite(v) ? v : 0; } catch { results["recoveryScore"] = 0; }
  try { const v = input.workoutDuration * input.intensity / 10; results["muscleStrain"] = Number.isFinite(v) ? v : 0; } catch { results["muscleStrain"] = 0; }
  try { const v = (input.workoutDuration * input.intensity / 10) * (input.age / 30); results["fatigueLevel"] = Number.isFinite(v) ? v : 0; } catch { results["fatigueLevel"] = 0; }
  return results;
}


export function calculateMuscle_recovery_calculator(input: Muscle_recovery_calculatorInput): Muscle_recovery_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["recoveryScore"] ?? 0;
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


export interface Muscle_recovery_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
