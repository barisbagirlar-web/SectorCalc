// Auto-generated from strength-training-calculator-schema.json
import * as z from 'zod';

export interface Strength_training_calculatorInput {
  weight: number;
  reps: number;
  sets: number;
  bodyWeight: number;
}

export const Strength_training_calculatorInputSchema = z.object({
  weight: z.number().default(80),
  reps: z.number().default(8),
  sets: z.number().default(3),
  bodyWeight: z.number().default(70),
});

function evaluateAllFormulas(input: Strength_training_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.weight * (1 + input.reps / 30); results["oneRepMax"] = Number.isFinite(v) ? v : 0; } catch { results["oneRepMax"] = 0; }
  try { const v = input.weight * input.reps * input.sets; results["totalVolume"] = Number.isFinite(v) ? v : 0; } catch { results["totalVolume"] = 0; }
  try { const v = input.weight * (1 + input.reps / 30) / input.bodyWeight; results["relativeStrength"] = Number.isFinite(v) ? v : 0; } catch { results["relativeStrength"] = 0; }
  return results;
}


export function calculateStrength_training_calculator(input: Strength_training_calculatorInput): Strength_training_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["oneRepMax"] ?? 0;
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


export interface Strength_training_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
