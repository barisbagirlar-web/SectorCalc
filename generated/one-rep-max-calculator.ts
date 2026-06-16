// Auto-generated from one-rep-max-calculator-schema.json
import * as z from 'zod';

export interface One_rep_max_calculatorInput {
  weight: number;
  reps: number;
}

export const One_rep_max_calculatorInputSchema = z.object({
  weight: z.number().default(100),
  reps: z.number().default(5),
});

function evaluateAllFormulas(input: One_rep_max_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.weight * (1 + input.reps / 30); results["epley"] = Number.isFinite(v) ? v : 0; } catch { results["epley"] = 0; }
  try { const v = input.weight * (36 / (37 - input.reps)); results["brzycki"] = Number.isFinite(v) ? v : 0; } catch { results["brzycki"] = 0; }
  try { const v = input.weight * input.reps ** 0.1; results["lombardi"] = Number.isFinite(v) ? v : 0; } catch { results["lombardi"] = 0; }
  return results;
}


export function calculateOne_rep_max_calculator(input: One_rep_max_calculatorInput): One_rep_max_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["epley"] ?? 0;
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


export interface One_rep_max_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
