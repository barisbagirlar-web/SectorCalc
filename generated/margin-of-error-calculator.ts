// Auto-generated from margin-of-error-calculator-schema.json
import * as z from 'zod';

export interface Margin_of_error_calculatorInput {
  sample_size: number;
  confidence_level: number;
  z_score: number;
  sample_proportion: number;
}

export const Margin_of_error_calculatorInputSchema = z.object({
  sample_size: z.number().default(100),
  confidence_level: z.number().default(95),
  z_score: z.number().default(1.96),
  sample_proportion: z.number().default(0.5),
});

function evaluateAllFormulas(input: Margin_of_error_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = Math.sqrt((input.sample_proportion * (1 - input.sample_proportion)) / input.sample_size); results["standard_error"] = Number.isFinite(v) ? v : 0; } catch { results["standard_error"] = 0; }
  try { const v = input.z_score * (results["standard_error"] ?? 0); results["margin_of_error"] = Number.isFinite(v) ? v : 0; } catch { results["margin_of_error"] = 0; }
  try { const v = (results["margin_of_error"] ?? 0) * 100; results["margin_of_error_percent"] = Number.isFinite(v) ? v : 0; } catch { results["margin_of_error_percent"] = 0; }
  return results;
}


export function calculateMargin_of_error_calculator(input: Margin_of_error_calculatorInput): Margin_of_error_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["margin_of_error_percent"] ?? 0;
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


export interface Margin_of_error_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
