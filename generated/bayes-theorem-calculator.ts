// Auto-generated from bayes-theorem-calculator-schema.json
import * as z from 'zod';

export interface Bayes_theorem_calculatorInput {
  prior: number;
  sensitivity: number;
  specificity: number;
  testResult: number;
}

export const Bayes_theorem_calculatorInputSchema = z.object({
  prior: z.number().default(0.01),
  sensitivity: z.number().default(0.95),
  specificity: z.number().default(0.98),
  testResult: z.number().default(1),
});

function evaluateAllFormulas(input: Bayes_theorem_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = 1 - input.specificity; results["falsePositiveRate"] = Number.isFinite(v) ? v : 0; } catch { results["falsePositiveRate"] = 0; }
  try { const v = 1 - input.sensitivity; results["falseNegativeRate"] = Number.isFinite(v) ? v : 0; } catch { results["falseNegativeRate"] = 0; }
  try { const v = input.testResult == 1 ? input.sensitivity * input.prior : (results["falseNegativeRate"] ?? 0) * input.prior; results["numerator"] = Number.isFinite(v) ? v : 0; } catch { results["numerator"] = 0; }
  try { const v = input.testResult == 1 ? (input.sensitivity * input.prior + (results["falsePositiveRate"] ?? 0) * (1 - input.prior)) : ((results["falseNegativeRate"] ?? 0) * input.prior + input.specificity * (1 - input.prior)); results["denominator"] = Number.isFinite(v) ? v : 0; } catch { results["denominator"] = 0; }
  try { const v = input.testResult == 1 ? (input.sensitivity * input.prior) / (input.sensitivity * input.prior + (results["falsePositiveRate"] ?? 0) * (1 - input.prior)) : ((results["falseNegativeRate"] ?? 0) * input.prior) / ((results["falseNegativeRate"] ?? 0) * input.prior + input.specificity * (1 - input.prior)); results["posterior"] = Number.isFinite(v) ? v : 0; } catch { results["posterior"] = 0; }
  return results;
}


export function calculateBayes_theorem_calculator(input: Bayes_theorem_calculatorInput): Bayes_theorem_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["posterior"] ?? 0;
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


export interface Bayes_theorem_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
