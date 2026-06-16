// Auto-generated from z-score-to-percentile-calculator-schema.json
import * as z from 'zod';

export interface Z_score_to_percentile_calculatorInput {
  zScore: number;
  mean: number;
  stdDev: number;
  rawScore: number;
  rawScoreProvided: number;
  tail: number;
}

export const Z_score_to_percentile_calculatorInputSchema = z.object({
  zScore: z.number().default(0),
  mean: z.number().default(0),
  stdDev: z.number().default(1),
  rawScore: z.number().default(0),
  rawScoreProvided: z.number().default(0),
  tail: z.number().default(0),
});

function evaluateAllFormulas(input: Z_score_to_percentile_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.rawScoreProvided === 1 ? (input.rawScore - input.mean) / input.stdDev : input.zScore; results["zComputed"] = Number.isFinite(v) ? v : 0; } catch { results["zComputed"] = 0; }
  try { const v = Math.abs((results["zComputed"] ?? 0)) / Math.sqrt(2); results["absZ"] = Number.isFinite(v) ? v : 0; } catch { results["absZ"] = 0; }
  try { const v = 1 / (1 + 0.3275911 * (results["absZ"] ?? 0)); results["t"] = Number.isFinite(v) ? v : 0; } catch { results["t"] = 0; }
  try { const v = 1 - (((((1.061405429 * (results["t"] ?? 0) - 1.453152027) * (results["t"] ?? 0) + 1.421413741) * (results["t"] ?? 0) - 0.284496736) * (results["t"] ?? 0) + 0.254829592) * (results["t"] ?? 0) * Math.exp(-(results["absZ"] ?? 0) * (results["absZ"] ?? 0))); results["y"] = Number.isFinite(v) ? v : 0; } catch { results["y"] = 0; }
  try { const v = 0.5 * (1 + ((results["zComputed"] ?? 0) < 0 ? -1 : 1) * (results["y"] ?? 0)); results["cdf"] = Number.isFinite(v) ? v : 0; } catch { results["cdf"] = 0; }
  try { const v = input.tail === 1 ? (1 - (results["cdf"] ?? 0)) : (results["cdf"] ?? 0); results["percentile"] = Number.isFinite(v) ? v : 0; } catch { results["percentile"] = 0; }
  return results;
}


export function calculateZ_score_to_percentile_calculator(input: Z_score_to_percentile_calculatorInput): Z_score_to_percentile_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["percentile"] ?? 0;
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


export interface Z_score_to_percentile_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
