// Auto-generated from cross-validation-calculator-schema.json
import * as z from 'zod';

export interface Cross_validation_calculatorInput {
  k: number;
  mean_score: number;
  std_score: number;
  sample_size: number;
}

export const Cross_validation_calculatorInputSchema = z.object({
  k: z.number().default(5),
  mean_score: z.number().default(0.85),
  std_score: z.number().default(0.05),
  sample_size: z.number().default(1000),
});

function evaluateAllFormulas(input: Cross_validation_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.std_score / Math.sqrt(input.k); results["standard_error"] = Number.isFinite(v) ? v : 0; } catch { results["standard_error"] = 0; }
  try { const v = 1.96 * (results["standard_error"] ?? 0); results["margin_of_error_95"] = Number.isFinite(v) ? v : 0; } catch { results["margin_of_error_95"] = 0; }
  try { const v = input.mean_score - (results["margin_of_error_95"] ?? 0); results["lower_ci_95"] = Number.isFinite(v) ? v : 0; } catch { results["lower_ci_95"] = 0; }
  try { const v = input.mean_score + (results["margin_of_error_95"] ?? 0); results["upper_ci_95"] = Number.isFinite(v) ? v : 0; } catch { results["upper_ci_95"] = 0; }
  return results;
}


export function calculateCross_validation_calculator(input: Cross_validation_calculatorInput): Cross_validation_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["standard_error"] ?? 0;
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


export interface Cross_validation_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
