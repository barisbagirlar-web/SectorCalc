// Auto-generated from low-pass-filter-calculator-schema.json
import * as z from 'zod';

export interface Low_pass_filter_calculatorInput {
  r: number;
  r_tol: number;
  c: number;
  c_tol: number;
  fin: number;
}

export const Low_pass_filter_calculatorInputSchema = z.object({
  r: z.number().default(1000),
  r_tol: z.number().default(5),
  c: z.number().default(0.000001),
  c_tol: z.number().default(10),
  fin: z.number().default(100),
});

function evaluateAllFormulas(input: Low_pass_filter_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = 1 / (2 * Math.PI * input.r * input.c); results["fc"] = Number.isFinite(v) ? v : 0; } catch { results["fc"] = 0; }
  try { const v = input.r * input.c; results["tau"] = Number.isFinite(v) ? v : 0; } catch { results["tau"] = 0; }
  try { const v = -10 * (Math.log(1 + (2 * Math.PI * input.r * input.c * input.fin) ** 2) / Math.log(10)); results["attenuation"] = Number.isFinite(v) ? v : 0; } catch { results["attenuation"] = 0; }
  try { const v = 1 / (2 * Math.PI * input.r * (1 + input.r_tol/100) * input.c * (1 + input.c_tol/100)); results["fc_min"] = Number.isFinite(v) ? v : 0; } catch { results["fc_min"] = 0; }
  try { const v = 1 / (2 * Math.PI * input.r * (1 - input.r_tol/100) * input.c * (1 - input.c_tol/100)); results["fc_max"] = Number.isFinite(v) ? v : 0; } catch { results["fc_max"] = 0; }
  return results;
}


export function calculateLow_pass_filter_calculator(input: Low_pass_filter_calculatorInput): Low_pass_filter_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["fc"] ?? 0;
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


export interface Low_pass_filter_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
