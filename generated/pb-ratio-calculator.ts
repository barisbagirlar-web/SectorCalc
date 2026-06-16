// Auto-generated from pb-ratio-calculator-schema.json
import * as z from 'zod';

export interface Pb_ratio_calculatorInput {
  marketPricePerShare: number;
  totalEquity: number;
  sharesOutstanding: number;
  industryPB: number;
}

export const Pb_ratio_calculatorInputSchema = z.object({
  marketPricePerShare: z.number().default(50),
  totalEquity: z.number().default(1000000),
  sharesOutstanding: z.number().default(10000),
  industryPB: z.number().default(3),
});

function evaluateAllFormulas(input: Pb_ratio_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.totalEquity / input.sharesOutstanding; results["bookValuePerShare"] = Number.isFinite(v) ? v : 0; } catch { results["bookValuePerShare"] = 0; }
  try { const v = input.marketPricePerShare / (results["bookValuePerShare"] ?? 0); results["pbRatio"] = Number.isFinite(v) ? v : 0; } catch { results["pbRatio"] = 0; }
  try { const v = (results["pbRatio"] ?? 0) - input.industryPB; results["pbVsIndustry"] = Number.isFinite(v) ? v : 0; } catch { results["pbVsIndustry"] = 0; }
  return results;
}


export function calculatePb_ratio_calculator(input: Pb_ratio_calculatorInput): Pb_ratio_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["pbRatio"] ?? 0;
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


export interface Pb_ratio_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
