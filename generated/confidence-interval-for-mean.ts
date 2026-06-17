// Auto-generated from confidence-interval-for-mean-schema.json
import * as z from 'zod';

export interface Confidence_interval_for_meanInput {
  sampleMean: number;
  sampleStdDev: number;
  sampleSize: number;
  confidenceLevel: number;
}

export const Confidence_interval_for_meanInputSchema = z.object({
  sampleMean: z.number().default(0),
  sampleStdDev: z.number().default(1),
  sampleSize: z.number().default(30),
  confidenceLevel: z.number().default(0.95),
});

function evaluateAllFormulas(input: Confidence_interval_for_meanInput): Record<string, number> {
  const results: Record<string, number> = {};
  results["zScore"] = 0;
  try { const v = (results["zScore"] ?? 0) * input.sampleStdDev / Math.sqrt(input.sampleSize); results["marginOfError"] = Number.isFinite(v) ? v : 0; } catch { results["marginOfError"] = 0; }
  try { const v = input.sampleMean - (results["marginOfError"] ?? 0); results["lowerBound"] = Number.isFinite(v) ? v : 0; } catch { results["lowerBound"] = 0; }
  try { const v = input.sampleMean + (results["marginOfError"] ?? 0); results["upperBound"] = Number.isFinite(v) ? v : 0; } catch { results["upperBound"] = 0; }
  return results;
}


export function calculateConfidence_interval_for_mean(input: Confidence_interval_for_meanInput): Confidence_interval_for_meanOutput {
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


export interface Confidence_interval_for_meanOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
