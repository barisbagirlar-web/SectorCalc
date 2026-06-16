// Auto-generated from ltv-cac-ratio-calculator-schema.json
import * as z from 'zod';

export interface Ltv_cac_ratio_calculatorInput {
  arpu: number;
  grossMargin: number;
  churn: number;
  discount: number;
  totalCacSpend: number;
  newCustomers: number;
}

export const Ltv_cac_ratio_calculatorInputSchema = z.object({
  arpu: z.number().default(100),
  grossMargin: z.number().default(70),
  churn: z.number().default(5),
  discount: z.number().default(10),
  totalCacSpend: z.number().default(50000),
  newCustomers: z.number().default(100),
});

function evaluateAllFormulas(input: Ltv_cac_ratio_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = (input.arpu * (input.grossMargin / 100)) / ((input.churn / 100) + (Math.pow(1 + input.discount / 100, 1/12) - 1)); results["LTV"] = Number.isFinite(v) ? v : 0; } catch { results["LTV"] = 0; }
  try { const v = input.totalCacSpend / input.newCustomers; results["CAC"] = Number.isFinite(v) ? v : 0; } catch { results["CAC"] = 0; }
  try { const v = (results["LTV"] ?? 0) / (results["CAC"] ?? 0); results["LTV_CAC_Ratio"] = Number.isFinite(v) ? v : 0; } catch { results["LTV_CAC_Ratio"] = 0; }
  return results;
}


export function calculateLtv_cac_ratio_calculator(input: Ltv_cac_ratio_calculatorInput): Ltv_cac_ratio_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["LTV_CAC_Ratio"] ?? 0;
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


export interface Ltv_cac_ratio_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
