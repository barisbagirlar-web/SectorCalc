// Auto-generated from polynomial-regression-schema.json
import * as z from 'zod';

export interface Polynomial_regressionInput {
  n: number;
  sumX: number;
  sumY: number;
  sumXY: number;
  sumX2: number;
  dataConfidence?: number;
}

export const Polynomial_regressionInputSchema = z.object({
  n: z.number().default(10),
  sumX: z.number().default(55),
  sumY: z.number().default(100),
  sumXY: z.number().default(600),
  sumX2: z.number().default(385),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Polynomial_regressionInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = (input.n * input.sumXY - input.sumX * input.sumY) / (input.n * input.sumX2 - input.sumX * input.sumX); results["b"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["b"] = Number.NaN; }
  try { const v = (input.sumY - (toNumericFormulaValue(results["b"])) * input.sumX) / input.n; results["a"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["a"] = Number.NaN; }
  return results;
}


export function calculatePolynomial_regression(input: Polynomial_regressionInput): Polynomial_regressionOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["a"]);
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


export interface Polynomial_regressionOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
