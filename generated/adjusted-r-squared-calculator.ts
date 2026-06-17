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

function evaluateAllFormulas(input: Adjusted_r_squared_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = (1 - input.rSquared) * (input.sampleSize - 1); results["numerator"] = Number.isFinite(v) ? v : 0; } catch { results["numerator"] = 0; }
  try { const v = input.sampleSize - input.predictors - 1; results["denominator"] = Number.isFinite(v) ? v : 0; } catch { results["denominator"] = 0; }
  try { const v = (results["denominator"] ?? 0) > 0 ? 1 - ((results["numerator"] ?? 0) / (results["denominator"] ?? 0)) : NaN; results["adjustedRSquared"] = Number.isFinite(v) ? v : 0; } catch { results["adjustedRSquared"] = 0; }
  try { const v = Number.isFinite((results["adjustedRSquared"] ?? 0)) ? Math.round((results["adjustedRSquared"] ?? 0) * Math.pow(10, input.decimalPlaces)) / Math.pow(10, input.decimalPlaces) : NaN; results["adjustedRSquaredFormatted"] = Number.isFinite(v) ? v : 0; } catch { results["adjustedRSquaredFormatted"] = 0; }
  try { const v = input.rSquared; results["rSquared"] = Number.isFinite(v) ? v : 0; } catch { results["rSquared"] = 0; }
  try { const v = input.sampleSize; results["sampleSize"] = Number.isFinite(v) ? v : 0; } catch { results["sampleSize"] = 0; }
  try { const v = input.predictors; results["predictors"] = Number.isFinite(v) ? v : 0; } catch { results["predictors"] = 0; }
  return results;
}


export function calculateAdjusted_r_squared_calculator(input: Adjusted_r_squared_calculatorInput): Adjusted_r_squared_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["adjustedRSquaredFormatted"] ?? 0;
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


export interface Adjusted_r_squared_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
