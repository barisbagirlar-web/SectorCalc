// Auto-generated from cholesky-decomposition-calculator-schema.json
import * as z from 'zod';

export interface Cholesky_decomposition_calculatorInput {
  a11: number;
  a12: number;
  a13: number;
  a22: number;
  a23: number;
  a33: number;
  dataConfidence?: number;
}

export const Cholesky_decomposition_calculatorInputSchema = z.object({
  a11: z.number().default(4),
  a12: z.number().default(2),
  a13: z.number().default(2),
  a22: z.number().default(4),
  a23: z.number().default(2),
  a33: z.number().default(4),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Cholesky_decomposition_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.a11 * input.a12 * input.a13 * input.a22; results["normalized_product"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["normalized_product"] = Number.NaN; }
  try { const v = input.a11 * input.a12 * input.a13 * input.a22 * (input.a23 * input.a33); results["result"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["result"] = Number.NaN; }
  try { const v = input.a23 * input.a33; results["adjustment_factor"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["adjustment_factor"] = Number.NaN; }
  return results;
}


export function calculateCholesky_decomposition_calculator(input: Cholesky_decomposition_calculatorInput): Cholesky_decomposition_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["result"]);
  const breakdown = {
    
  };
  const hiddenLossDrivers: string[] = ["Model uses normalized input chain — validate units","Assumption-heavy without site benchmark"];
  const suggestedActions: string[] = ["Cross-check with historical actuals","Run sensitivity on top 2 inputs"];
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


export interface Cholesky_decomposition_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
