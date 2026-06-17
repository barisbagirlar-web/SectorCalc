// Auto-generated from delayed-onset-muscle-soreness-calculator-schema.json
import * as z from 'zod';

export interface Delayed_onset_muscle_soreness_calculatorInput {
  age: number;
  fitnessLevel: number;
  exerciseIntensity: number;
  exerciseDuration: number;
  recoveryHours: number;
}

export const Delayed_onset_muscle_soreness_calculatorInputSchema = z.object({
  age: z.number().default(25),
  fitnessLevel: z.number().default(5),
  exerciseIntensity: z.number().default(5),
  exerciseDuration: z.number().default(60),
  recoveryHours: z.number().default(24),
});

function evaluateAllFormulas(input: Delayed_onset_muscle_soreness_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = Math.pow(input.exerciseIntensity, 2) * input.exerciseDuration; results["trainingLoad"] = Number.isFinite(v) ? v : 0; } catch { results["trainingLoad"] = 0; }
  try { const v = input.fitnessLevel * Math.max(1, input.recoveryHours); results["recoveryFactor"] = Number.isFinite(v) ? v : 0; } catch { results["recoveryFactor"] = 0; }
  try { const v = 1/(1+0.01*Math.pow(input.age-25, 2)); results["ageCorrection"] = Number.isFinite(v) ? v : 0; } catch { results["ageCorrection"] = 0; }
  try { const v = Math.min(100, ((results["trainingLoad"] ?? 0) / (results["recoveryFactor"] ?? 0)) * (results["ageCorrection"] ?? 0) * 100); results["DOMSSeverity"] = Number.isFinite(v) ? v : 0; } catch { results["DOMSSeverity"] = 0; }
  results["Training_Load"] = 0;
  results["Recovery_Factor"] = 0;
  results["Age_Correction_Factor"] = 0;
  results["result"] = 0;
  return results;
}


export function calculateDelayed_onset_muscle_soreness_calculator(input: Delayed_onset_muscle_soreness_calculatorInput): Delayed_onset_muscle_soreness_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["result"] ?? 0;
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


export interface Delayed_onset_muscle_soreness_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
