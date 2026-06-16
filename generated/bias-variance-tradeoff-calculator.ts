// Auto-generated from bias-variance-tradeoff-calculator-schema.json
import * as z from 'zod';

export interface Bias_variance_tradeoff_calculatorInput {
  averagePrediction: number;
  trueValue: number;
  variance: number;
  irreducibleError: number;
}

export const Bias_variance_tradeoff_calculatorInputSchema = z.object({
  averagePrediction: z.number().default(0),
  trueValue: z.number().default(0),
  variance: z.number().default(1),
  irreducibleError: z.number().default(1),
});

function evaluateAllFormulas(input: Bias_variance_tradeoff_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = (input.averagePrediction - input.trueValue) ** 2 + input.variance + input.irreducibleError; results["totalExpectedError"] = Number.isFinite(v) ? v : 0; } catch { results["totalExpectedError"] = 0; }
  try { const v = (input.averagePrediction - input.trueValue) ** 2; results["squaredBias"] = Number.isFinite(v) ? v : 0; } catch { results["squaredBias"] = 0; }
  try { const v = input.variance; results["variance"] = Number.isFinite(v) ? v : 0; } catch { results["variance"] = 0; }
  try { const v = input.irreducibleError; results["irreducibleError"] = Number.isFinite(v) ? v : 0; } catch { results["irreducibleError"] = 0; }
  return results;
}


export function calculateBias_variance_tradeoff_calculator(input: Bias_variance_tradeoff_calculatorInput): Bias_variance_tradeoff_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["totalExpectedError"] ?? 0;
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


export interface Bias_variance_tradeoff_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
