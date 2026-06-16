// Auto-generated from two-way-anova-calculator-schema.json
import * as z from 'zod';

export interface Two_way_anova_calculatorInput {
  SSA: number;
  SSB: number;
  SSAB: number;
  SSE: number;
  dfA: number;
  dfB: number;
  dfAB: number;
  dfE: number;
}

export const Two_way_anova_calculatorInputSchema = z.object({
  SSA: z.number().default(0),
  SSB: z.number().default(0),
  SSAB: z.number().default(0),
  SSE: z.number().default(0),
  dfA: z.number().default(1),
  dfB: z.number().default(1),
  dfAB: z.number().default(1),
  dfE: z.number().default(1),
});

function evaluateAllFormulas(input: Two_way_anova_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.SSA / input.dfA; results["MSA"] = Number.isFinite(v) ? v : 0; } catch { results["MSA"] = 0; }
  try { const v = input.SSB / input.dfB; results["MSB"] = Number.isFinite(v) ? v : 0; } catch { results["MSB"] = 0; }
  try { const v = input.SSAB / input.dfAB; results["MSAB"] = Number.isFinite(v) ? v : 0; } catch { results["MSAB"] = 0; }
  try { const v = input.SSE / input.dfE; results["MSE"] = Number.isFinite(v) ? v : 0; } catch { results["MSE"] = 0; }
  try { const v = (results["MSA"] ?? 0) / (results["MSE"] ?? 0); results["FA"] = Number.isFinite(v) ? v : 0; } catch { results["FA"] = 0; }
  try { const v = (results["MSB"] ?? 0) / (results["MSE"] ?? 0); results["FB"] = Number.isFinite(v) ? v : 0; } catch { results["FB"] = 0; }
  try { const v = (results["MSAB"] ?? 0) / (results["MSE"] ?? 0); results["FAB"] = Number.isFinite(v) ? v : 0; } catch { results["FAB"] = 0; }
  return results;
}


export function calculateTwo_way_anova_calculator(input: Two_way_anova_calculatorInput): Two_way_anova_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["FAB"] ?? 0;
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


export interface Two_way_anova_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
