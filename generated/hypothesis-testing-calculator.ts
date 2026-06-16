// Auto-generated from hypothesis-testing-calculator-schema.json
import * as z from 'zod';

export interface Hypothesis_testing_calculatorInput {
  sampleMean: number;
  nullMean: number;
  stdDev: number;
  sampleSize: number;
  alpha: number;
  tails: number;
}

export const Hypothesis_testing_calculatorInputSchema = z.object({
  sampleMean: z.number().default(0),
  nullMean: z.number().default(0),
  stdDev: z.number().default(1),
  sampleSize: z.number().default(30),
  alpha: z.number().default(0.05),
  tails: z.number().default(2),
});

function evaluateAllFormulas(input: Hypothesis_testing_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = (input.sampleMean - input.nullMean) / (input.stdDev / Math.sqrt(input.sampleSize)); results["zScore"] = Number.isFinite(v) ? v : 0; } catch { results["zScore"] = 0; }
  try { const v = (function() { const z = (sampleMean - nullMean) / (stdDev / Math.sqrt(sampleSize)); const cdf = (x) => { const a1 = 0.254829592; const a2 = -0.284496736; const a3 = 1.421413741; const a4 = -1.453152027; const a5 = 1.061405429; const p = 0.3275911; const sign = (x >= 0) ? 1 : -1; x = Math.abs(x) / Math.sqrt(2); const t = 1.0 / (1.0 + p * x); const y = 1.0 - (((((a5 * t + a4) * t) + a3) * t + a2) * t + a1) * t * Math.exp(-x * x); return 0.5 * (1.0 + sign * y); }; if (tails === 2) { return 2 * (1 - cdf(Math.abs(z))); } else { return 1 - cdf(z); } })(); results["pValue"] = Number.isFinite(v) ? v : 0; } catch { results["pValue"] = 0; }
  return results;
}


export function calculateHypothesis_testing_calculator(input: Hypothesis_testing_calculatorInput): Hypothesis_testing_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["(pValue < alpha) ? 'Reject H₀' : 'Fail to reject H₀'"] ?? 0;
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


export interface Hypothesis_testing_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
