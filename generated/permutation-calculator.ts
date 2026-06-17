// Auto-generated from permutation-calculator-schema.json
import * as z from 'zod';

export interface Permutation_calculatorInput {
  n: number;
  r: number;
  auto_input_3: number;
}

export const Permutation_calculatorInputSchema = z.object({
  n: z.number().default(5),
  r: z.number().default(3),
  auto_input_3: z.number().default(1),
});

function evaluateAllFormulas(input: Permutation_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = (() => { n >= r ? (function factorial(x) { return x <= 1 ? 1 : x * factorial(x - 1); })(n) / (function factorial(x) { return x <= 1 ? 1 : x * factorial(x - 1); })(n - r) : 0 })(); results["permutations"] = Number.isFinite(v) ? v : 0; } catch { results["permutations"] = 0; }
  try { const v = Math.pow(input.n, input.r); results["permutationsWithRepetition"] = Number.isFinite(v) ? v : 0; } catch { results["permutationsWithRepetition"] = 0; }
  try { const v = (() => { n >= 1 ? (function factorial(x) { return x <= 1 ? 1 : x * factorial(x - 1); })(n - 1) : 0 })(); results["circularPermutations"] = Number.isFinite(v) ? v : 0; } catch { results["circularPermutations"] = 0; }
  return results;
}


export function calculatePermutation_calculator(input: Permutation_calculatorInput): Permutation_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["permutations"] ?? 0;
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


export interface Permutation_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
