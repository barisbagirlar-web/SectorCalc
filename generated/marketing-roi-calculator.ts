// Auto-generated from marketing-roi-calculator-schema.json
import * as z from 'zod';

export interface Marketing_roi_calculatorInput {
  marketingCost: number;
  numberOfLeads: number;
  conversionRate: number;
  averageSaleRevenue: number;
}

export const Marketing_roi_calculatorInputSchema = z.object({
  marketingCost: z.number().default(10000),
  numberOfLeads: z.number().default(500),
  conversionRate: z.number().default(5),
  averageSaleRevenue: z.number().default(200),
});

function evaluateAllFormulas(input: Marketing_roi_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.numberOfLeads * (input.conversionRate / 100) * input.averageSaleRevenue; results["revenue"] = Number.isFinite(v) ? v : 0; } catch { results["revenue"] = 0; }
  try { const v = input.numberOfLeads * (input.conversionRate / 100) * input.averageSaleRevenue - input.marketingCost; results["netProfit"] = Number.isFinite(v) ? v : 0; } catch { results["netProfit"] = 0; }
  try { const v = ((input.numberOfLeads * (input.conversionRate / 100) * input.averageSaleRevenue - input.marketingCost) / input.marketingCost) * 100; results["roi"] = Number.isFinite(v) ? v : 0; } catch { results["roi"] = 0; }
  return results;
}


export function calculateMarketing_roi_calculator(input: Marketing_roi_calculatorInput): Marketing_roi_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["roi"] ?? 0;
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


export interface Marketing_roi_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
