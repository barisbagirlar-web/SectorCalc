// Auto-generated from polynomial-regression-schema.json
import * as z from 'zod';

export interface Polynomial_regressionInput {
  n: number;
  sumX: number;
  sumY: number;
  sumXY: number;
  sumX2: number;
}

export const Polynomial_regressionInputSchema = z.object({
  n: z.number().default(10),
  sumX: z.number().default(55),
  sumY: z.number().default(100),
  sumXY: z.number().default(600),
  sumX2: z.number().default(385),
});

function evaluateAllFormulas(input: Polynomial_regressionInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = (input.n * input.sumXY - input.sumX * input.sumY) / (input.n * input.sumX2 - input.sumX * input.sumX); results["b"] = Number.isFinite(v) ? v : 0; } catch { results["b"] = 0; }
  try { const v = (input.sumY - (results["b"] ?? 0) * input.sumX) / input.n; results["a"] = Number.isFinite(v) ? v : 0; } catch { results["a"] = 0; }
  return results;
}


export function calculatePolynomial_regression(input: Polynomial_regressionInput): Polynomial_regressionOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["Regresyon"] ?? 0;
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


export interface Polynomial_regressionOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
