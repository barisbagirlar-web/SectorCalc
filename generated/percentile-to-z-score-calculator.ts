// Auto-generated from percentile-to-z-score-calculator-schema.json
import * as z from 'zod';

export interface Percentile_to_z_score_calculatorInput {
  percentile: number;
  mean: number;
  stddev: number;
}

export const Percentile_to_z_score_calculatorInputSchema = z.object({
  percentile: z.number().default(95),
  mean: z.number().default(0),
  stddev: z.number().default(1),
});

function evaluateAllFormulas(input: Percentile_to_z_score_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = (() => { let p = input.percentile/100; let t = Math.sqrt(-2 * Math.log(p < 0.5 ? p : 1-p)); let c0=2.515517; let c1=0.802853; let c2=0.010328; let d1=1.432788; let d2=0.189269; let d3=0.001308; let z = t - (c0 + c1 * t + c2 * t * t) / (1 + d1 * t + d2 * t * t + d3 * t * t * t); return p < 0.5 ? -z : z; })(); results["zScore"] = Number.isFinite(v) ? v : 0; } catch { results["zScore"] = 0; }
  try { const v = (() => { return input.mean + zScore * input.stddev; })(); results["rawScore"] = Number.isFinite(v) ? v : 0; } catch { results["rawScore"] = 0; }
  return results;
}


export function calculatePercentile_to_z_score_calculator(input: Percentile_to_z_score_calculatorInput): Percentile_to_z_score_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["zScore"] ?? 0;
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


export interface Percentile_to_z_score_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
