// Auto-generated from anderson-darling-test-schema.json
import * as z from 'zod';

export interface Anderson_darling_testInput {
  sampleSize: number;
  sortedData: number;
  mean: number;
  stdDev: number;
}

export const Anderson_darling_testInputSchema = z.object({
  sampleSize: z.number().default(10),
  sortedData: z.number(),
  mean: z.number().default(5.5),
  stdDev: z.number().default(2.872),
});

function evaluateAllFormulas(input: Anderson_darling_testInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = (() => { let data = input.sortedData.split(',').map(Number); let n = input.sampleSize; let mean = input.mean; let std = input.stdDev; let z = data.map(x => (x - input.mean) / std); return z; })(); results["computeZ"] = Number.isFinite(v) ? v : 0; } catch { results["computeZ"] = 0; }
  try { const v = (() => { let z = (results["computeZ"]); return z.map(zi => 0.5 * (1 + erf(zi / Math.sqrt(2)))); })(); results["computeCDF"] = Number.isFinite(v) ? v : 0; } catch { results["computeCDF"] = 0; }
  try { const v = (() => { let cdf = (results["computeCDF"]); let n = input.sampleSize; let sum = 0; for (let i = 0; i < n; i++) { let term = (2 * (i + 1) - 1) * (Math.log(cdf[i]) + Math.log(1 - cdf[n - 1 - i])); sum += term; } let ad = -n - (1 / n) * sum; return ad; })(); results["computeAD"] = Number.isFinite(v) ? v : 0; } catch { results["computeAD"] = 0; }
  try { const v = (() => { let ad = (results["computeAD"]); let n = input.sampleSize; let adj = ad * (1 + 0.75 / n + 2.25 / (n * n)); return adj; })(); results["computeAdjustedAD"] = Number.isFinite(v) ? v : 0; } catch { results["computeAdjustedAD"] = 0; }
  return results;
}


export function calculateAnderson_darling_test(input: Anderson_darling_testInput): Anderson_darling_testOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["Adjusted"] ?? 0;
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


export interface Anderson_darling_testOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
