// Auto-generated from wilcoxon-signed-rank-z-calculator-schema.json
import * as z from 'zod';

export interface Wilcoxon_signed_rank_z_calculatorInput {
  n: number;
  T: number;
  continuity: number;
  decimalPlaces: number;
}

export const Wilcoxon_signed_rank_z_calculatorInputSchema = z.object({
  n: z.number().default(10),
  T: z.number().default(25),
  continuity: z.number().default(0),
  decimalPlaces: z.number().default(4),
});

function evaluateAllFormulas(input: Wilcoxon_signed_rank_z_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.n * (input.n + 1) / 4; results["expectedValue"] = Number.isFinite(v) ? v : 0; } catch { results["expectedValue"] = 0; }
  try { const v = Math.sqrt(input.n * (input.n + 1) * (2 * input.n + 1) / 24); results["standardDeviation"] = Number.isFinite(v) ? v : 0; } catch { results["standardDeviation"] = 0; }
  try { const v = input.continuity ? (input.T - 0.5 - (results["expectedValue"] ?? 0)) / (results["standardDeviation"] ?? 0) : (input.T - (results["expectedValue"] ?? 0)) / (results["standardDeviation"] ?? 0); results["zScore"] = Number.isFinite(v) ? v : 0; } catch { results["zScore"] = 0; }
  try { const v = Math.round((results["zScore"] ?? 0) * Math.pow(10, input.decimalPlaces)) / Math.pow(10, input.decimalPlaces); results["roundedZScore"] = Number.isFinite(v) ? v : 0; } catch { results["roundedZScore"] = 0; }
  return results;
}


export function calculateWilcoxon_signed_rank_z_calculator(input: Wilcoxon_signed_rank_z_calculatorInput): Wilcoxon_signed_rank_z_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["roundedZScore"] ?? 0;
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


export interface Wilcoxon_signed_rank_z_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
