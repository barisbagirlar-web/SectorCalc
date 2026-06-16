// Auto-generated from poisson-probability-comparison-calculator-schema.json
import * as z from 'zod';

export interface Poisson_probability_comparison_calculatorInput {
  lambdaA: number;
  kA: number;
  lambdaB: number;
  kB: number;
}

export const Poisson_probability_comparison_calculatorInputSchema = z.object({
  lambdaA: z.number().default(2),
  kA: z.number().default(2),
  lambdaB: z.number().default(3),
  kB: z.number().default(2),
});

function evaluateAllFormulas(input: Poisson_probability_comparison_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = (() => { Math.exp(-lambdaA) * (lambdaA**kA) / ( (function fact(n){ return n <= 1 ? 1 : n * fact(n-1); })(kA) ) })(); results["probA"] = Number.isFinite(v) ? v : 0; } catch { results["probA"] = 0; }
  try { const v = (() => { Math.exp(-lambdaB) * (lambdaB**kB) / ( (function fact(n){ return n <= 1 ? 1 : n * fact(n-1); })(kB) ) })(); results["probB"] = Number.isFinite(v) ? v : 0; } catch { results["probB"] = 0; }
  try { const v = (results["probA"] ?? 0) / (results["probB"] ?? 0); results["ratio"] = Number.isFinite(v) ? v : 0; } catch { results["ratio"] = 0; }
  try { const v = input.lambdaA; results["meanA"] = Number.isFinite(v) ? v : 0; } catch { results["meanA"] = 0; }
  try { const v = input.lambdaA; results["varA"] = Number.isFinite(v) ? v : 0; } catch { results["varA"] = 0; }
  try { const v = input.lambdaB; results["meanB"] = Number.isFinite(v) ? v : 0; } catch { results["meanB"] = 0; }
  try { const v = input.lambdaB; results["varB"] = Number.isFinite(v) ? v : 0; } catch { results["varB"] = 0; }
  return results;
}


export function calculatePoisson_probability_comparison_calculator(input: Poisson_probability_comparison_calculatorInput): Poisson_probability_comparison_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["probA"] ?? 0;
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


export interface Poisson_probability_comparison_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
