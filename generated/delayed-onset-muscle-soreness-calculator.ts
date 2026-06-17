// @ts-nocheck
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

function asFormulaNumber(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Delayed_onset_muscle_soreness_calculatorInput): Record<string, number | string> {
  const results: Record<string, number | string> = {};
  try { const v = input.age + input.fitnessLevel + input.exerciseIntensity; results["result"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["result"] = 0; }
  try { const v = input.age + input.fitnessLevel + input.exerciseIntensity; results["result_copy"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["result_copy"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

export function calculateDelayed_onset_muscle_soreness_calculator(input: Delayed_onset_muscle_soreness_calculatorInput): Delayed_onset_muscle_soreness_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["result"]);
  const breakdown = {
    
  };
  const hiddenLossDrivers: string[] = [];
  const suggestedActions: string[] = ["Review inputs and verify results against site standards."];
  const dataConfidenceAdjusted =
    typeof (input as unknown as Record<string, unknown>).dataConfidence === "number"
      ? totalWasteCost * (((input as unknown as Record<string, unknown>).dataConfidence as number) / 100)
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
