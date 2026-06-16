// Auto-generated from permutation-generator-calculator-schema.json
import * as z from 'zod';

export interface Permutation_generator_calculatorInput {
  n: number;
  r: number;
  orderMatters: number;
  repetitionAllowed: number;
}

export const Permutation_generator_calculatorInputSchema = z.object({
  n: z.number().default(5),
  r: z.number().default(3),
  orderMatters: z.number().default(1),
  repetitionAllowed: z.number().default(0),
});

function evaluateAllFormulas(input: Permutation_generator_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = (() => { function factorial(num) { if (num <= 1) return 1; return num * factorial(num - 1); } })(); results["factorial"] = Number.isFinite(v) ? v : 0; } catch { results["factorial"] = 0; }
  try { const v = (results["factorial"] ?? 0)(input.n); results["factorialN"] = Number.isFinite(v) ? v : 0; } catch { results["factorialN"] = 0; }
  try { const v = (results["factorial"] ?? 0)(input.r); results["factorialR"] = Number.isFinite(v) ? v : 0; } catch { results["factorialR"] = 0; }
  try { const v = (results["factorial"] ?? 0)(input.n - input.r); results["factorialNminusR"] = Number.isFinite(v) ? v : 0; } catch { results["factorialNminusR"] = 0; }
  try { const v = input.orderMatters == 1 && input.repetitionAllowed == 0 ? (results["factorialN"] ?? 0) / (results["factorialNminusR"] ?? 0) : (input.orderMatters == 0 && input.repetitionAllowed == 0 ? (results["factorialN"] ?? 0) / ((results["factorialR"] ?? 0) * (results["factorialNminusR"] ?? 0)) : (input.orderMatters == 1 && input.repetitionAllowed == 1 ? Math.pow(input.n, input.r) : (results["factorial"] ?? 0)(input.n + input.r - 1) / ((results["factorial"] ?? 0)(input.r) * (results["factorial"] ?? 0)(input.n - 1)))); results["totalArrangements"] = Number.isFinite(v) ? v : 0; } catch { results["totalArrangements"] = 0; }
  try { const v = (results["factorialN"] ?? 0); results["factorial_of_n"] = Number.isFinite(v) ? v : 0; } catch { results["factorial_of_n"] = 0; }
  try { const v = (results["factorialR"] ?? 0); results["factorial_of_r"] = Number.isFinite(v) ? v : 0; } catch { results["factorial_of_r"] = 0; }
  try { const v = (results["factorialNminusR"] ?? 0); results["factorial_of_n_minus_r"] = Number.isFinite(v) ? v : 0; } catch { results["factorial_of_n_minus_r"] = 0; }
  try { const v = input.orderMatters == 1 && input.repetitionAllowed == 0 ? 1 : (input.orderMatters == 0 && input.repetitionAllowed == 0 ? 2 : (input.orderMatters == 1 && input.repetitionAllowed == 1 ? 3 : 4)); results["method"] = Number.isFinite(v) ? v : 0; } catch { results["method"] = 0; }
  return results;
}


export function calculatePermutation_generator_calculator(input: Permutation_generator_calculatorInput): Permutation_generator_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["totalArrangements"] ?? 0;
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


export interface Permutation_generator_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
