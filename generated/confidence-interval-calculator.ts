// Auto-generated from confidence-interval-calculator-schema.json
import * as z from 'zod';

export interface Confidence_interval_calculatorInput {
  sample_mean: number;
  standard_deviation: number;
  sample_size: number;
  critical_value: number;
  dataConfidence?: number;
}

export const Confidence_interval_calculatorInputSchema = z.object({
  sample_mean: z.number().default(0),
  standard_deviation: z.number().default(1),
  sample_size: z.number().default(30),
  critical_value: z.number().default(1.96),
});

function asFormulaNumber(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Confidence_interval_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.sample_mean * input.standard_deviation * input.sample_size * input.critical_value; results["normalized_product"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["normalized_product"] = 0; }
  try { const v = input.sample_mean * input.standard_deviation * input.sample_size * input.critical_value; results["result"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["result"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

export function calculateConfidence_interval_calculator(input: Confidence_interval_calculatorInput): Confidence_interval_calculatorOutput {
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


export interface Confidence_interval_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
