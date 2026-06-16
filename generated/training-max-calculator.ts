// Auto-generated from training-max-calculator-schema.json
import * as z from 'zod';

export interface Training_max_calculatorInput {
  weight: number;
  reps: number;
  trainingMaxPercentage: number;
  coefficientA: number;
  coefficientB: number;
}

export const Training_max_calculatorInputSchema = z.object({
  weight: z.number().default(100),
  reps: z.number().default(5),
  trainingMaxPercentage: z.number().default(90),
  coefficientA: z.number().default(1.0278),
  coefficientB: z.number().default(0.0278),
});

function evaluateAllFormulas(input: Training_max_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.weight / (input.coefficientA - input.coefficientB * input.reps); results["oneRepMax"] = Number.isFinite(v) ? v : 0; } catch { results["oneRepMax"] = 0; }
  try { const v = ((results["oneRepMax"] ?? 0) * input.trainingMaxPercentage) / 100; results["trainingMax"] = Number.isFinite(v) ? v : 0; } catch { results["trainingMax"] = 0; }
  return results;
}


export function calculateTraining_max_calculator(input: Training_max_calculatorInput): Training_max_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["trainingMax"] ?? 0;
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


export interface Training_max_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
