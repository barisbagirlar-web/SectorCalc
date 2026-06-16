// Auto-generated from linear-regression-calculator-schema.json
import * as z from 'zod';

export interface Linear_regression_calculatorInput {
  n: number;
  sumX: number;
  sumY: number;
  sumX2: number;
  sumXY: number;
  sumY2: number;
}

export const Linear_regression_calculatorInputSchema = z.object({
  n: z.number().default(0),
  sumX: z.number().default(0),
  sumY: z.number().default(0),
  sumX2: z.number().default(0),
  sumXY: z.number().default(0),
  sumY2: z.number().default(0),
});

function evaluateAllFormulas(input: Linear_regression_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = (input.n * input.sumXY - input.sumX * input.sumY) / (input.n * input.sumX2 - input.sumX ** 2); results["slope"] = Number.isFinite(v) ? v : 0; } catch { results["slope"] = 0; }
  try { const v = (input.sumY - (results["slope"] ?? 0) * input.sumX) / input.n; results["intercept"] = Number.isFinite(v) ? v : 0; } catch { results["intercept"] = 0; }
  try { const v = ((input.n * input.sumXY - input.sumX * input.sumY) / Math.sqrt((input.n * input.sumX2 - input.sumX ** 2) * (input.n * input.sumY2 - input.sumY ** 2))) ** 2; results["rSquared"] = Number.isFinite(v) ? v : 0; } catch { results["rSquared"] = 0; }
  return results;
}


export function calculateLinear_regression_calculator(input: Linear_regression_calculatorInput): Linear_regression_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["slope"] ?? 0;
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


export interface Linear_regression_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
