// Auto-generated from eisenhower-matrix-calculator-schema.json
import * as z from 'zod';

export interface Eisenhower_matrix_calculatorInput {
  urgency: number;
  importance: number;
  weightUrgency: number;
  weightImportance: number;
}

export const Eisenhower_matrix_calculatorInputSchema = z.object({
  urgency: z.number().default(5),
  importance: z.number().default(5),
  weightUrgency: z.number().default(0.5),
  weightImportance: z.number().default(0.5),
});

function evaluateAllFormulas(input: Eisenhower_matrix_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.urgency * input.weightUrgency; results["urgencyComponent"] = Number.isFinite(v) ? v : 0; } catch { results["urgencyComponent"] = 0; }
  try { const v = input.importance * input.weightImportance; results["importanceComponent"] = Number.isFinite(v) ? v : 0; } catch { results["importanceComponent"] = 0; }
  try { const v = (results["urgencyComponent"] ?? 0) + (results["importanceComponent"] ?? 0); results["totalScore"] = Number.isFinite(v) ? v : 0; } catch { results["totalScore"] = 0; }
  return results;
}


export function calculateEisenhower_matrix_calculator(input: Eisenhower_matrix_calculatorInput): Eisenhower_matrix_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["totalScore"] ?? 0;
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


export interface Eisenhower_matrix_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
