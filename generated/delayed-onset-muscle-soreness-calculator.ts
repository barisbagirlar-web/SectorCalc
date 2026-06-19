// Auto-generated from delayed-onset-muscle-soreness-calculator-schema.json
import * as z from 'zod';

export interface Delayed_onset_muscle_soreness_calculatorInput {
  age: number;
  fitnessLevel: number;
  exerciseIntensity: number;
  exerciseDuration: number;
  recoveryHours: number;
  dataConfidence?: number;
}

export const Delayed_onset_muscle_soreness_calculatorInputSchema = z.object({
  age: z.number().default(25),
  fitnessLevel: z.number().default(5),
  exerciseIntensity: z.number().default(5),
  exerciseDuration: z.number().default(60),
  recoveryHours: z.number().default(24),
});

function asFormulaNumber(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Delayed_onset_muscle_soreness_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.age * input.fitnessLevel * input.exerciseIntensity * input.exerciseDuration; results["normalized_product"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["normalized_product"] = 0; }
  try { const v = input.age * input.fitnessLevel * input.exerciseIntensity * input.exerciseDuration * (input.recoveryHours); results["result"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["result"] = 0; }
  try { const v = input.recoveryHours; results["adjustment_factor"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["adjustment_factor"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

export function calculateDelayed_onset_muscle_soreness_calculator(input: Delayed_onset_muscle_soreness_calculatorInput): Delayed_onset_muscle_soreness_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["result"]);
  const breakdown = {
    
  };
  const hiddenLossDrivers: string[] = ["Model uses normalized input chain — validate units","Assumption-heavy without site benchmark"];
  const suggestedActions: string[] = ["Cross-check with historical actuals","Run sensitivity on top 2 inputs"];
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


export interface Delayed_onset_muscle_soreness_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
