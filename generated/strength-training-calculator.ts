// Auto-generated from strength-training-calculator-schema.json
import * as z from 'zod';

export interface Strength_training_calculatorInput {
  weightLifted: number;
  repetitions: number;
  bodyWeight: number;
  sets: number;
  restPeriod: number;
  fatigueFactor: number;
}

export const Strength_training_calculatorInputSchema = z.object({
  weightLifted: z.number().default(100),
  repetitions: z.number().default(10),
  bodyWeight: z.number().default(75),
  sets: z.number().default(3),
  restPeriod: z.number().default(60),
  fatigueFactor: z.number().default(5),
});

function evaluateAllFormulas(input: Strength_training_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.weightLifted * (1 + input.repetitions / 30); results["primary"] = Number.isFinite(v) ? v : 0; } catch { results["primary"] = 0; }
  try { const v = input.weightLifted; results["breakdown"] = Number.isFinite(v) ? v : 0; } catch { results["breakdown"] = 0; }
  results["Relative_Strength__kg_per_kg_BW_"] = 0;
  results["Volume_Load__kg_reps_"] = 0;
  results["Effective_Training_Load__kg_"] = 0;
  results["result"] = 0;
  return results;
}


export function calculateStrength_training_calculator(input: Strength_training_calculatorInput): Strength_training_calculatorOutput {
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


export interface Strength_training_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
