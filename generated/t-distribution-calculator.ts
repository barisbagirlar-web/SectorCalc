// Auto-generated from t-distribution-calculator-schema.json
import * as z from 'zod';

export interface T_distribution_calculatorInput {
  t_value: number;
  degrees_of_freedom: number;
  tails: number;
}

export const T_distribution_calculatorInputSchema = z.object({
  t_value: z.number().default(1.5),
  degrees_of_freedom: z.number().default(10),
  tails: z.number().default(2),
});

function evaluateAllFormulas(input: T_distribution_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = (function(t, df) { var x = df / (df + t*t); var a = df / 2; var b = 0.5; var betaInc = betainc(x, a, b); return 1 - 0.5 * betaInc; })(t, df); results["cdf"] = Number.isFinite(v) ? v : 0; } catch { results["cdf"] = 0; }
  try { const v = (function(t, df, tails) { var p = 1 - cdf(Math.abs(t), df); return tails === 2 ? 2 * p : p; })(t, df, input.tails); results["p_value"] = Number.isFinite(v) ? v : 0; } catch { results["p_value"] = 0; }
  results["critical_value"] = 0;
  try { const v = (results["p_value"] ?? 0); results["_p_value_"] = Number.isFinite(v) ? v : 0; } catch { results["_p_value_"] = 0; }
  try { const v = (results["critical_value"] ?? 0); results["_critical_value_"] = Number.isFinite(v) ? v : 0; } catch { results["_critical_value_"] = 0; }
  return results;
}


export function calculateT_distribution_calculator(input: T_distribution_calculatorInput): T_distribution_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["cdf"] ?? 0;
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


export interface T_distribution_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
