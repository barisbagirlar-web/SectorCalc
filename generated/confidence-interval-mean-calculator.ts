// Auto-generated from confidence-interval-mean-calculator-schema.json
import * as z from 'zod';

export interface Confidence_interval_mean_calculatorInput {
  sampleMean: number;
  standardDeviation: number;
  sampleSize: number;
  criticalValue: number;
}

export const Confidence_interval_mean_calculatorInputSchema = z.object({
  sampleMean: z.number().default(0),
  standardDeviation: z.number().default(1),
  sampleSize: z.number().default(30),
  criticalValue: z.number().default(1.96),
});

function evaluateAllFormulas(input: Confidence_interval_mean_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.standardDeviation * input.criticalValue / Math.sqrt(input.sampleSize); results["marginOfError"] = Number.isFinite(v) ? v : 0; } catch { results["marginOfError"] = 0; }
  try { const v = input.sampleMean - (input.standardDeviation * input.criticalValue / Math.sqrt(input.sampleSize)); results["lowerBound"] = Number.isFinite(v) ? v : 0; } catch { results["lowerBound"] = 0; }
  try { const v = input.sampleMean + (input.standardDeviation * input.criticalValue / Math.sqrt(input.sampleSize)); results["upperBound"] = Number.isFinite(v) ? v : 0; } catch { results["upperBound"] = 0; }
  try { const v = (results["lowerBound"] ?? 0) + ' - ' + (results["upperBound"] ?? 0); results["intervalString"] = Number.isFinite(v) ? v : 0; } catch { results["intervalString"] = 0; }
  return results;
}


export function calculateConfidence_interval_mean_calculator(input: Confidence_interval_mean_calculatorInput): Confidence_interval_mean_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["intervalString"] ?? 0;
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


export interface Confidence_interval_mean_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
