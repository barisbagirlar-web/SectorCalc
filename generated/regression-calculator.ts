// Auto-generated from regression-calculator-schema.json
import * as z from 'zod';

export interface Regression_calculatorInput {
  n: number;
  sumX: number;
  sumY: number;
  sumXY: number;
  sumX2: number;
}

export const Regression_calculatorInputSchema = z.object({
  n: z.number().default(0),
  sumX: z.number().default(0),
  sumY: z.number().default(0),
  sumXY: z.number().default(0),
  sumX2: z.number().default(0),
});

function evaluateAllFormulas(input: Regression_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = (input.n * input.sumXY - input.sumX * input.sumY) / (input.n * input.sumX2 - input.sumX ** 2); results["slope"] = Number.isFinite(v) ? v : 0; } catch { results["slope"] = 0; }
  try { const v = (input.sumY - (results["slope"] ?? 0) * input.sumX) / input.n; results["intercept"] = Number.isFinite(v) ? v : 0; } catch { results["intercept"] = 0; }
  try { const v = 'y = ' + (results["intercept"] ?? 0).toFixed(2) + ' + ' + (results["slope"] ?? 0).toFixed(2) + ' * x'; results["equation"] = Number.isFinite(v) ? v : 0; } catch { results["equation"] = 0; }
  return results;
}


export function calculateRegression_calculator(input: Regression_calculatorInput): Regression_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["equation"] ?? 0;
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


export interface Regression_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
