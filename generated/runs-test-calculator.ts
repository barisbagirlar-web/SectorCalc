// Auto-generated from runs-test-calculator-schema.json
import * as z from 'zod';

export interface Runs_test_calculatorInput {
  countA: number;
  countB: number;
  runs: number;
  alpha: number;
}

export const Runs_test_calculatorInputSchema = z.object({
  countA: z.number(),
  countB: z.number(),
  runs: z.number(),
  alpha: z.number().default(0.05),
});

function evaluateAllFormulas(input: Runs_test_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = (2 * input.countA * input.countB) / (input.countA + input.countB) + 1; results["expectedRuns"] = Number.isFinite(v) ? v : 0; } catch { results["expectedRuns"] = 0; }
  try { const v = 2 * input.countA * input.countB * (2 * input.countA * input.countB - input.countA - input.countB) / (Math.pow(input.countA + input.countB, 2) * (input.countA + input.countB - 1)); results["varianceRuns"] = Number.isFinite(v) ? v : 0; } catch { results["varianceRuns"] = 0; }
  try { const v = Math.sqrt((results["varianceRuns"] ?? 0)); results["stdDevRuns"] = Number.isFinite(v) ? v : 0; } catch { results["stdDevRuns"] = 0; }
  try { const v = (input.runs - (results["expectedRuns"] ?? 0)) / (results["stdDevRuns"] ?? 0); results["zScore"] = Number.isFinite(v) ? v : 0; } catch { results["zScore"] = 0; }
  try { const v = Math.abs((results["zScore"] ?? 0)); results["zAbs"] = Number.isFinite(v) ? v : 0; } catch { results["zAbs"] = 0; }
  try { const v = 0.3989423 * Math.exp(-(results["zAbs"] ?? 0) * (results["zAbs"] ?? 0) / 2); results["phi"] = Number.isFinite(v) ? v : 0; } catch { results["phi"] = 0; }
  try { const v = 1 / (1 + 0.2316419 * (results["zAbs"] ?? 0)); results["t"] = Number.isFinite(v) ? v : 0; } catch { results["t"] = 0; }
  try { const v = (results["t"] ?? 0) * (0.319381530 + (results["t"] ?? 0) * (-0.356563782 + (results["t"] ?? 0) * (1.781477937 + (results["t"] ?? 0) * (-1.821255978 + (results["t"] ?? 0) * 1.330274429)))); results["poly"] = Number.isFinite(v) ? v : 0; } catch { results["poly"] = 0; }
  try { const v = 1 - (results["phi"] ?? 0) * (results["poly"] ?? 0); results["cdf"] = Number.isFinite(v) ? v : 0; } catch { results["cdf"] = 0; }
  try { const v = 2 * ((results["zScore"] ?? 0) > 0 ? (1 - (results["cdf"] ?? 0)) : (results["cdf"] ?? 0)); results["pValue"] = Number.isFinite(v) ? v : 0; } catch { results["pValue"] = 0; }
  try { const v = (results["pValue"] ?? 0) < input.alpha ? 'Reject H0: Data is not random' : 'Do not reject H0: Data may be random'; results["conclusion"] = Number.isFinite(v) ? v : 0; } catch { results["conclusion"] = 0; }
  return results;
}


export function calculateRuns_test_calculator(input: Runs_test_calculatorInput): Runs_test_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["pValue"] ?? 0;
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


export interface Runs_test_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
