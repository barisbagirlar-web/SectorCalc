// Auto-generated from adjusted-r-squared-calculator-schema.json
import * as z from 'zod';

export interface Adjusted_r_squared_calculatorInput {
  rSquared: number;
  sampleSize: number;
  predictors: number;
  decimalPlaces: number;
  dataConfidence?: number;
}

export const Adjusted_r_squared_calculatorInputSchema = z.object({
  rSquared: z.number().default(0.9),
  sampleSize: z.number().default(50),
  predictors: z.number().default(3),
  decimalPlaces: z.number().default(4),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Adjusted_r_squared_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = (1 - input.rSquared) * (input.sampleSize - 1); results["numerator"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["numerator"] = Number.NaN; }
  try { const v = input.sampleSize - input.predictors - 1; results["denominator"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["denominator"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["denominator"])) > 0 ? 1 - ((toNumericFormulaValue(results["numerator"])) / (toNumericFormulaValue(results["denominator"]))) : NaN; results["adjustedRSquared"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["adjustedRSquared"] = Number.NaN; }
  try { const v = input.rSquared; results["rSquared"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["rSquared"] = Number.NaN; }
  try { const v = input.sampleSize; results["sampleSize"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["sampleSize"] = Number.NaN; }
  try { const v = input.predictors; results["predictors"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["predictors"] = Number.NaN; }
  return results;
}


export function calculateAdjusted_r_squared_calculator(input: Adjusted_r_squared_calculatorInput): Adjusted_r_squared_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["predictors"]);
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


export interface Adjusted_r_squared_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
