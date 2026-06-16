// Auto-generated from proportion-test-schema.json
import * as z from 'zod';

export interface Proportion_testInput {
  sample_size: number;
  successes: number;
  hypothesized_proportion: number;
  significance_level: number;
}

export const Proportion_testInputSchema = z.object({
  sample_size: z.number().default(30),
  successes: z.number().default(15),
  hypothesized_proportion: z.number().default(0.5),
  significance_level: z.number().default(0.05),
});

function evaluateAllFormulas(input: Proportion_testInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = (input.successes / input.sample_size - input.hypothesized_proportion) / Math.sqrt(input.hypothesized_proportion * (1 - input.hypothesized_proportion) / input.sample_size); results["z_statistic"] = Number.isFinite(v) ? v : 0; } catch { results["z_statistic"] = 0; }
  try { const v = 2 * (1 - (1 / (1 + Math.exp(-1.59791 * Math.abs((results["z_statistic"] ?? 0)))))); results["p_value"] = Number.isFinite(v) ? v : 0; } catch { results["p_value"] = 0; }
  try { const v = (results["p_value"] ?? 0) < input.significance_level; results["reject"] = Number.isFinite(v) ? v : 0; } catch { results["reject"] = 0; }
  return results;
}


export function calculateProportion_test(input: Proportion_testInput): Proportion_testOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["p_value"] ?? 0;
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


export interface Proportion_testOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
