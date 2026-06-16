// Auto-generated from ps-ratio-calculator-schema.json
import * as z from 'zod';

export interface Ps_ratio_calculatorInput {
  marketCap: number;
  totalSales: number;
  pricePerShare: number;
  salesPerShare: number;
}

export const Ps_ratio_calculatorInputSchema = z.object({
  marketCap: z.number().default(0),
  totalSales: z.number().default(0),
  pricePerShare: z.number().default(0),
  salesPerShare: z.number().default(0),
});

function evaluateAllFormulas(input: Ps_ratio_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.marketCap / input.totalSales; results["primary"] = Number.isFinite(v) ? v : 0; } catch { results["primary"] = 0; }
  try { const v = input.pricePerShare / input.salesPerShare; results["psPerShare"] = Number.isFinite(v) ? v : 0; } catch { results["psPerShare"] = 0; }
  return results;
}


export function calculatePs_ratio_calculator(input: Ps_ratio_calculatorInput): Ps_ratio_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["P"] ?? 0;
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


export interface Ps_ratio_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
