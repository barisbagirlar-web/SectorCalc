// Auto-generated from muscle-recovery-calculator-schema.json
import * as z from 'zod';

export interface Muscle_recovery_calculatorInput {
  age: number;
  bodyWeight: number;
  workoutDuration: number;
  intensity: number;
  restTime: number;
  dataConfidence?: number;
}

export const Muscle_recovery_calculatorInputSchema = z.object({
  age: z.number().default(30),
  bodyWeight: z.number().default(70),
  workoutDuration: z.number().default(60),
  intensity: z.number().default(5),
  restTime: z.number().default(8),
});

function asFormulaNumber(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Muscle_recovery_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = (input.restTime / (input.workoutDuration * input.intensity)) * (1 - input.age * 0.01) * (input.bodyWeight / 70) * 100; results["recoveryScore"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["recoveryScore"] = 0; }
  try { const v = input.workoutDuration * input.intensity / 10; results["muscleStrain"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["muscleStrain"] = 0; }
  try { const v = (input.workoutDuration * input.intensity / 10) * (input.age / 30); results["fatigueLevel"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["fatigueLevel"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

export function calculateMuscle_recovery_calculator(input: Muscle_recovery_calculatorInput): Muscle_recovery_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["recoveryScore"]);
  const breakdown = {
    
  };
  const hiddenLossDrivers: string[] = [];
  const suggestedActions: string[] = ["Review inputs and verify results against site standards."];
  const dataConfidenceAdjusted =
    typeof input.dataConfidence === "number"
      ? totalWasteCost * (input.dataConfidence / 100)
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
