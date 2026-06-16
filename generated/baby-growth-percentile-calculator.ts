// Auto-generated from baby-growth-percentile-calculator-schema.json
import * as z from 'zod';

export interface Baby_growth_percentile_calculatorInput {
  measurement: number;
  L: number;
  M: number;
  S: number;
  measurementType: number;
}

export const Baby_growth_percentile_calculatorInputSchema = z.object({
  measurement: z.number().default(5),
  L: z.number().default(1),
  M: z.number().default(7),
  S: z.number().default(0.1),
  measurementType: z.number().default(1),
});

function evaluateAllFormulas(input: Baby_growth_percentile_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.measurement !== 0 ? (Math.abs(input.L) < 1e-10 ? Math.log(input.measurement / input.M) / input.S : (Math.pow(input.measurement / input.M, input.L) - 1) / (input.L * input.S)) : null; results["zscore"] = Number.isFinite(v) ? v : 0; } catch { results["zscore"] = 0; }
  try { const v = (() => { zscore !== null ? (() => { const a1=0.254829592; const a2=-0.284496736; const a3=1.421413741; const a4=-1.453152027; const a5=1.061405429; const p=0.3275911; const sign = zscore < 0 ? -1 : 1; const x = Math.abs(zscore)/Math.sqrt(2); const t = 1.0/(1.0 + p*x); const y = 1.0 - (((((a5*t + a4)*t) + a3)*t + a2)*t + a1)*t*Math.exp(-x*x); return 0.5 * (1.0 + sign * y) * 100; })() : null })(); results["percentile"] = Number.isFinite(v) ? v : 0; } catch { results["percentile"] = 0; }
  return results;
}


export function calculateBaby_growth_percentile_calculator(input: Baby_growth_percentile_calculatorInput): Baby_growth_percentile_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["percentile"] ?? 0;
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


export interface Baby_growth_percentile_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
