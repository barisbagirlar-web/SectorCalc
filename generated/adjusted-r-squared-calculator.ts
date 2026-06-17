// @ts-nocheck
// Auto-generated from adjusted-r-squared-calculator-schema.json
import * as z from 'zod';

export interface Adjusted_r_squared_calculatorInput {
  rSquared: number;
  sampleSize: number;
  predictors: number;
  decimalPlaces: number;
}

export const Adjusted_r_squared_calculatorInputSchema = z.object({
  rSquared: z.number().default(0.9),
  sampleSize: z.number().default(50),
  predictors: z.number().default(3),
  decimalPlaces: z.number().default(4),
});

function asFormulaNumber(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Adjusted_r_squared_calculatorInput): Record<string, number | string> {
  const results: Record<string, number | string> = {};
  try { const v = (1 - input.rSquared) * (input.sampleSize - 1); results["numerator"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["numerator"] = 0; }
  try { const v = input.sampleSize - input.predictors - 1; results["denominator"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["denominator"] = 0; }
  try { const v = (asFormulaNumber(results["denominator"])) > 0 ? 1 - ((asFormulaNumber(results["numerator"])) / (asFormulaNumber(results["denominator"]))) : NaN; results["adjustedRSquared"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["adjustedRSquared"] = 0; }
  try { const v = input.rSquared; results["rSquared"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["rSquared"] = 0; }
  try { const v = input.sampleSize; results["sampleSize"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["sampleSize"] = 0; }
  try { const v = input.predictors; results["predictors"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["predictors"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

export function calculateAdjusted_r_squared_calculator(input: Adjusted_r_squared_calculatorInput): Adjusted_r_squared_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["predictors"]);
  const breakdown = {
    
  };
  const hiddenLossDrivers: string[] = [];
  const suggestedActions: string[] = ["Review inputs and verify results against site standards."];
  const dataConfidenceAdjusted =
    typeof (input as unknown as Record<string, unknown>).dataConfidence === "number"
      ? totalWasteCost * (((input as unknown as Record<string, unknown>).dataConfidence as number) / 100)
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
