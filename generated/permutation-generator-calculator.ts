// Auto-generated from permutation-generator-calculator-schema.json
import * as z from 'zod';

export interface Permutation_generator_calculatorInput {
  n: number;
  r: number;
  orderMatters: number;
  repetitionAllowed: number;
  dataConfidence?: number;
}

export const Permutation_generator_calculatorInputSchema = z.object({
  n: z.number().default(5),
  r: z.number().default(3),
  orderMatters: z.number().default(1),
  repetitionAllowed: z.number().default(0),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Permutation_generator_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.orderMatters == 1 && input.repetitionAllowed == 0 ? 1 : (input.orderMatters == 0 && input.repetitionAllowed == 0 ? 2 : (input.orderMatters == 1 && input.repetitionAllowed == 1 ? 3 : 4)); results["method"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["method"] = Number.NaN; }
  try { const v = input.orderMatters == 1 && input.repetitionAllowed == 0 ? 1 : (input.orderMatters == 0 && input.repetitionAllowed == 0 ? 2 : (input.orderMatters == 1 && input.repetitionAllowed == 1 ? 3 : 4)); results["method_aux"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["method_aux"] = Number.NaN; }
  return results;
}


export function calculatePermutation_generator_calculator(input: Permutation_generator_calculatorInput): Permutation_generator_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["method_aux"]);
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


export interface Permutation_generator_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
