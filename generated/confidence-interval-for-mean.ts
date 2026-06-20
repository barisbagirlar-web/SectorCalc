// Auto-generated from confidence-interval-for-mean-schema.json
import * as z from 'zod';

export interface Confidence_interval_for_meanInput {
  sampleMean: number;
  sampleStdDev: number;
  sampleSize: number;
  confidenceLevel: number;
  dataConfidence?: number;
}

export const Confidence_interval_for_meanInputSchema = z.object({
  sampleMean: z.number().default(0),
  sampleStdDev: z.number().default(1),
  sampleSize: z.number().default(30),
  confidenceLevel: z.number().default(0.95),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Confidence_interval_for_meanInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.sampleMean * input.sampleStdDev * input.sampleSize * input.confidenceLevel; results["normalized_product"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["normalized_product"] = Number.NaN; }
  try { const v = input.sampleMean * input.sampleStdDev * input.sampleSize * input.confidenceLevel; results["result"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["result"] = Number.NaN; }
  return results;
}


export function calculateConfidence_interval_for_mean(input: Confidence_interval_for_meanInput): Confidence_interval_for_meanOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["result"]);
  const breakdown = {
    
  };
  const hiddenLossDrivers: string[] = ["Model uses normalized input chain — validate units","Assumption-heavy without site benchmark"];
  const suggestedActions: string[] = ["Cross-check with historical actuals","Run sensitivity on top 2 inputs"];
  const dataConfidenceAdjusted =
    typeof input.dataConfidence === "number"
      ? totalWasteCost * (input.dataConfidence / 100)
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
