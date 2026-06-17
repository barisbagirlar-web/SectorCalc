// Auto-generated from confidence-interval-calculator-schema.json
import * as z from 'zod';

export interface Confidence_interval_calculatorInput {
  sample_mean: number;
  standard_deviation: number;
  sample_size: number;
  critical_value: number;
}

export const Confidence_interval_calculatorInputSchema = z.object({
  sample_mean: z.number().default(0),
  standard_deviation: z.number().default(1),
  sample_size: z.number().default(30),
  critical_value: z.number().default(1.96),
});

function evaluateAllFormulas(input: Confidence_interval_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.critical_value * input.standard_deviation / Math.sqrt(input.sample_size); results["margin_of_error"] = Number.isFinite(v) ? v : 0; } catch { results["margin_of_error"] = 0; }
  try { const v = input.sample_mean - (results["margin_of_error"] ?? 0); results["lower_bound"] = Number.isFinite(v) ? v : 0; } catch { results["lower_bound"] = 0; }
  try { const v = input.sample_mean + (results["margin_of_error"] ?? 0); results["upper_bound"] = Number.isFinite(v) ? v : 0; } catch { results["upper_bound"] = 0; }
  try { const v = (results["margin_of_error"] ?? 0); results["_margin_of_error_"] = Number.isFinite(v) ? v : 0; } catch { results["_margin_of_error_"] = 0; }
  try { const v = (results["lower_bound"] ?? 0); results["_lower_bound_"] = Number.isFinite(v) ? v : 0; } catch { results["_lower_bound_"] = 0; }
  try { const v = (results["upper_bound"] ?? 0); results["_upper_bound_"] = Number.isFinite(v) ? v : 0; } catch { results["_upper_bound_"] = 0; }
  results["result"] = 0;
  return results;
}


export function calculateConfidence_interval_calculator(input: Confidence_interval_calculatorInput): Confidence_interval_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["result"] ?? 0;
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


export interface Confidence_interval_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
