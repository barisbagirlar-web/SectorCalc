// Auto-generated from linear-regression-calculator-schema.json
import * as z from 'zod';

export interface Linear_regression_calculatorInput {
  n: number;
  sumX: number;
  sumY: number;
  sumX2: number;
  sumXY: number;
  sumY2: number;
  dataConfidence?: number;
}

export const Linear_regression_calculatorInputSchema = z.object({
  n: z.number().default(0),
  sumX: z.number().default(0),
  sumY: z.number().default(0),
  sumX2: z.number().default(0),
  sumXY: z.number().default(0),
  sumY2: z.number().default(0),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Linear_regression_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = (input.n * input.sumXY - input.sumX * input.sumY) / (input.n * input.sumX2 - input.sumX ** 2); results["slope"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["slope"] = Number.NaN; }
  try { const v = (input.sumY - (toNumericFormulaValue(results["slope"])) * input.sumX) / input.n; results["intercept"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["intercept"] = Number.NaN; }
  return results;
}


export function calculateLinear_regression_calculator(input: Linear_regression_calculatorInput): Linear_regression_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["slope"]);
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


export interface Linear_regression_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
