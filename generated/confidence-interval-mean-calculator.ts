// Auto-generated from confidence-interval-mean-calculator-schema.json
import * as z from 'zod';

export interface Confidence_interval_mean_calculatorInput {
  sampleMean: number;
  standardDeviation: number;
  sampleSize: number;
  criticalValue: number;
  dataConfidence?: number;
}

export const Confidence_interval_mean_calculatorInputSchema = z.object({
  sampleMean: z.number().default(0),
  standardDeviation: z.number().default(1),
  sampleSize: z.number().default(30),
  criticalValue: z.number().default(1.96),
});

function asFormulaNumber(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Confidence_interval_mean_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.sampleMean * input.standardDeviation * input.sampleSize * input.criticalValue; results["normalized_product"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["normalized_product"] = 0; }
  try { const v = input.sampleMean * input.standardDeviation * input.sampleSize * input.criticalValue; results["result"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["result"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

export function calculateConfidence_interval_mean_calculator(input: Confidence_interval_mean_calculatorInput): Confidence_interval_mean_calculatorOutput {
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


export interface Confidence_interval_mean_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
