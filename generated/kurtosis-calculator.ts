// Auto-generated from kurtosis-calculator-schema.json
import * as z from 'zod';

export interface Kurtosis_calculatorInput {
  n: number;
  sumSquared: number;
  sumFourth: number;
  decimalPlaces: number;
}

export const Kurtosis_calculatorInputSchema = z.object({
  n: z.number().default(10),
  sumSquared: z.number().default(10),
  sumFourth: z.number().default(30),
  decimalPlaces: z.number().default(4),
});

function evaluateAllFormulas(input: Kurtosis_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = parseFloat(((input.sumFourth / input.n) / Math.pow(input.sumSquared / input.n, 2)).toFixed(input.decimalPlaces)); results["kurtosis"] = Number.isFinite(v) ? v : 0; } catch { results["kurtosis"] = 0; }
  try { const v = parseFloat((((input.sumFourth / input.n) / Math.pow(input.sumSquared / input.n, 2)) - 3).toFixed(input.decimalPlaces)); results["excessKurtosis"] = Number.isFinite(v) ? v : 0; } catch { results["excessKurtosis"] = 0; }
  return results;
}


export function calculateKurtosis_calculator(input: Kurtosis_calculatorInput): Kurtosis_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["excessKurtosis"] ?? 0;
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


export interface Kurtosis_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
