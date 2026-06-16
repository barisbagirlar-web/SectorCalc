// Auto-generated from kolmogorov-smirnov-calculator-schema.json
import * as z from 'zod';

export interface Kolmogorov_smirnov_calculatorInput {
  dStat: number;
  n1: number;
  n2: number;
  alpha: number;
}

export const Kolmogorov_smirnov_calculatorInputSchema = z.object({
  dStat: z.number().default(0.1),
  n1: z.number().default(30),
  n2: z.number().default(30),
  alpha: z.number().default(0.05),
});

function evaluateAllFormulas(input: Kolmogorov_smirnov_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = Math.sqrt(input.n1 * input.n2 / (input.n1 + input.n2)) * input.dStat; results["x"] = Number.isFinite(v) ? v : 0; } catch { results["x"] = 0; }
  try { const v = 2 * (Math.exp(-2 * (results["x"] ?? 0)**2) - Math.exp(-8 * (results["x"] ?? 0)**2) + Math.exp(-18 * (results["x"] ?? 0)**2) - Math.exp(-32 * (results["x"] ?? 0)**2)); results["pValue"] = Number.isFinite(v) ? v : 0; } catch { results["pValue"] = 0; }
  try { const v = Math.sqrt(-0.5 * Math.log(input.alpha / 2)); results["c"] = Number.isFinite(v) ? v : 0; } catch { results["c"] = 0; }
  try { const v = (results["c"] ?? 0) * Math.sqrt((input.n1 + input.n2) / (input.n1 * input.n2)); results["criticalD"] = Number.isFinite(v) ? v : 0; } catch { results["criticalD"] = 0; }
  try { const v = input.dStat > (results["criticalD"] ?? 0) ? 1 : 0; results["decision"] = Number.isFinite(v) ? v : 0; } catch { results["decision"] = 0; }
  return results;
}


export function calculateKolmogorov_smirnov_calculator(input: Kolmogorov_smirnov_calculatorInput): Kolmogorov_smirnov_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["pValue"] ?? 0;
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


export interface Kolmogorov_smirnov_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
