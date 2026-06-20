// Auto-generated from one-rep-max-calculator-schema.json
import * as z from 'zod';

export interface One_rep_max_calculatorInput {
  weight: number;
  reps: number;
  auto_input_3: number;
  dataConfidence?: number;
}

export const One_rep_max_calculatorInputSchema = z.object({
  weight: z.number().default(100),
  reps: z.number().default(10),
  auto_input_3: z.number().default(1),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: One_rep_max_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.weight * (1 + input.reps / 30); results["oneRepMax"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["oneRepMax"] = Number.NaN; }
  try { const v = input.weight; results["weight"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["weight"] = Number.NaN; }
  try { const v = input.reps; results["reps"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["reps"] = Number.NaN; }
  try { const v = 1 + input.reps / 30; results["multiplier"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["multiplier"] = Number.NaN; }
  return results;
}


export function calculateOne_rep_max_calculator(input: One_rep_max_calculatorInput): One_rep_max_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["oneRepMax"]);
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


export interface One_rep_max_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
