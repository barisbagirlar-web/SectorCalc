// Auto-generated from one-way-anova-calculator-schema.json
import * as z from 'zod';

export interface One_way_anova_calculatorInput {
  ssb: number;
  ssw: number;
  dfb: number;
  dfw: number;
  alpha: number;
}

export const One_way_anova_calculatorInputSchema = z.object({
  ssb: z.number().default(0),
  ssw: z.number().default(0),
  dfb: z.number().default(1),
  dfw: z.number().default(10),
  alpha: z.number().default(0.05),
});

function evaluateAllFormulas(input: One_way_anova_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.ssb / input.dfb; results["msb"] = Number.isFinite(v) ? v : 0; } catch { results["msb"] = 0; }
  try { const v = input.ssw / input.dfw; results["msw"] = Number.isFinite(v) ? v : 0; } catch { results["msw"] = 0; }
  try { const v = (results["msb"] ?? 0) / (results["msw"] ?? 0); results["fStat"] = Number.isFinite(v) ? v : 0; } catch { results["fStat"] = 0; }
  try { const v = input.ssb / (input.ssb + input.ssw); results["etaSq"] = Number.isFinite(v) ? v : 0; } catch { results["etaSq"] = 0; }
  return results;
}


export function calculateOne_way_anova_calculator(input: One_way_anova_calculatorInput): One_way_anova_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["fStat"] ?? 0;
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


export interface One_way_anova_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
