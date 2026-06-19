// Auto-generated from training-volume-calculator-schema.json
import * as z from 'zod';

export interface Training_volume_calculatorInput {
  sets: number;
  reps: number;
  weight: number;
  intensityFactor: number;
  dataConfidence?: number;
}

export const Training_volume_calculatorInputSchema = z.object({
  sets: z.number().default(3),
  reps: z.number().default(10),
  weight: z.number().default(50),
  intensityFactor: z.number().default(1),
});

function asFormulaNumber(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Training_volume_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.sets * input.reps; results["totalReps"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["totalReps"] = 0; }
  try { const v = input.sets * input.reps * input.weight; results["totalWeightLifted"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["totalWeightLifted"] = 0; }
  try { const v = input.sets * input.reps * input.weight * input.intensityFactor; results["trainingVolume"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["trainingVolume"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

export function calculateTraining_volume_calculator(input: Training_volume_calculatorInput): Training_volume_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["trainingVolume"]);
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


export interface Training_volume_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
