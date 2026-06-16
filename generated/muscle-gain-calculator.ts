// Auto-generated from muscle-gain-calculator-schema.json
import * as z from 'zod';

export interface Muscle_gain_calculatorInput {
  weight: number;
  height: number;
  age: number;
  gender: number;
  activityLevel: number;
  calorieSurplus: number;
  proteinIntake: number;
}

export const Muscle_gain_calculatorInputSchema = z.object({
  weight: z.number().default(70),
  height: z.number().default(175),
  age: z.number().default(25),
  gender: z.number().default(1),
  activityLevel: z.number().default(1.55),
  calorieSurplus: z.number().default(300),
  proteinIntake: z.number().default(160),
});

function evaluateAllFormulas(input: Muscle_gain_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.gender * (10*input.weight + 6.25*input.height - 5*input.age + 5) + (1-input.gender) * (10*input.weight + 6.25*input.height - 5*input.age - 161); results["bmr"] = Number.isFinite(v) ? v : 0; } catch { results["bmr"] = 0; }
  try { const v = (results["bmr"] ?? 0) * input.activityLevel; results["tdee"] = Number.isFinite(v) ? v : 0; } catch { results["tdee"] = 0; }
  try { const v = Math.min(input.proteinIntake / (2.2 * input.weight), 1); results["proteinEfficiency"] = Number.isFinite(v) ? v : 0; } catch { results["proteinEfficiency"] = 0; }
  try { const v = 0.5; results["maxMuscleGain"] = Number.isFinite(v) ? v : 0; } catch { results["maxMuscleGain"] = 0; }
  try { const v = Math.min((input.calorieSurplus * 30 / 7700) * (results["proteinEfficiency"] ?? 0), (results["maxMuscleGain"] ?? 0)); results["muscleGainMonthly"] = Number.isFinite(v) ? v : 0; } catch { results["muscleGainMonthly"] = 0; }
  return results;
}


export function calculateMuscle_gain_calculator(input: Muscle_gain_calculatorInput): Muscle_gain_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["muscleGainMonthly"] ?? 0;
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


export interface Muscle_gain_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
