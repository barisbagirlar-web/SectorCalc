// Auto-generated from shopify-profit-calculator-schema.json
import * as z from 'zod';

export interface Shopify_profit_calculatorInput {
  averageOrderValue: number;
  costOfGoodsPerOrder: number;
  monthlyOrders: number;
  shippingCostPerOrder: number;
  transactionFeeRate: number;
  monthlyMarketing: number;
  monthlyFixedCosts: number;
}

export const Shopify_profit_calculatorInputSchema = z.object({
  averageOrderValue: z.number().default(50),
  costOfGoodsPerOrder: z.number().default(20),
  monthlyOrders: z.number().default(200),
  shippingCostPerOrder: z.number().default(5),
  transactionFeeRate: z.number().default(2.9),
  monthlyMarketing: z.number().default(500),
  monthlyFixedCosts: z.number().default(300),
});

function evaluateAllFormulas(input: Shopify_profit_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.averageOrderValue * input.monthlyOrders; results["totalRevenue"] = Number.isFinite(v) ? v : 0; } catch { results["totalRevenue"] = 0; }
  try { const v = input.costOfGoodsPerOrder * input.monthlyOrders; results["totalCOGS"] = Number.isFinite(v) ? v : 0; } catch { results["totalCOGS"] = 0; }
  try { const v = input.shippingCostPerOrder * input.monthlyOrders; results["totalShipping"] = Number.isFinite(v) ? v : 0; } catch { results["totalShipping"] = 0; }
  try { const v = (results["totalRevenue"] ?? 0) * (input.transactionFeeRate / 100); results["totalTransactionFees"] = Number.isFinite(v) ? v : 0; } catch { results["totalTransactionFees"] = 0; }
  try { const v = (results["totalRevenue"] ?? 0) - (results["totalCOGS"] ?? 0); results["grossProfit"] = Number.isFinite(v) ? v : 0; } catch { results["grossProfit"] = 0; }
  try { const v = (results["totalShipping"] ?? 0) + (results["totalTransactionFees"] ?? 0) + input.monthlyMarketing + input.monthlyFixedCosts; results["operatingExpenses"] = Number.isFinite(v) ? v : 0; } catch { results["operatingExpenses"] = 0; }
  try { const v = (results["grossProfit"] ?? 0) - (results["operatingExpenses"] ?? 0); results["netProfit"] = Number.isFinite(v) ? v : 0; } catch { results["netProfit"] = 0; }
  try { const v = ((results["netProfit"] ?? 0) / (results["totalRevenue"] ?? 0)) * 100; results["profitMargin"] = Number.isFinite(v) ? v : 0; } catch { results["profitMargin"] = 0; }
  return results;
}


export function calculateShopify_profit_calculator(input: Shopify_profit_calculatorInput): Shopify_profit_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["totalRevenue"] ?? 0;
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


export interface Shopify_profit_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
