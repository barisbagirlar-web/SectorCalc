// Auto-generated from dropshipping-profit-calculator-schema.json
import * as z from 'zod';

export interface Dropshipping_profit_calculatorInput {
  sellingPrice: number;
  costPrice: number;
  shippingCost: number;
  orderVolume: number;
  fixedCosts: number;
  feePercentage: number;
}

export const Dropshipping_profit_calculatorInputSchema = z.object({
  sellingPrice: z.number().default(50),
  costPrice: z.number().default(30),
  shippingCost: z.number().default(5),
  orderVolume: z.number().default(100),
  fixedCosts: z.number().default(200),
  feePercentage: z.number().default(3),
});

function evaluateAllFormulas(input: Dropshipping_profit_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.sellingPrice * input.orderVolume; results["revenue"] = Number.isFinite(v) ? v : 0; } catch { results["revenue"] = 0; }
  try { const v = (input.costPrice + input.shippingCost) * input.orderVolume; results["totalCOGS"] = Number.isFinite(v) ? v : 0; } catch { results["totalCOGS"] = 0; }
  try { const v = input.sellingPrice * (input.feePercentage / 100) * input.orderVolume; results["totalFees"] = Number.isFinite(v) ? v : 0; } catch { results["totalFees"] = 0; }
  try { const v = (results["revenue"] ?? 0) - (results["totalCOGS"] ?? 0); results["grossProfit"] = Number.isFinite(v) ? v : 0; } catch { results["grossProfit"] = 0; }
  try { const v = (results["grossProfit"] ?? 0) - (results["totalFees"] ?? 0) - input.fixedCosts; results["netProfit"] = Number.isFinite(v) ? v : 0; } catch { results["netProfit"] = 0; }
  try { const v = ((results["netProfit"] ?? 0) / (results["revenue"] ?? 0)) * 100; results["netProfitMargin"] = Number.isFinite(v) ? v : 0; } catch { results["netProfitMargin"] = 0; }
  return results;
}


export function calculateDropshipping_profit_calculator(input: Dropshipping_profit_calculatorInput): Dropshipping_profit_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["netProfit"] ?? 0;
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


export interface Dropshipping_profit_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
