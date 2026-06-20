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
  dataConfidence?: number;
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

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Shopify_profit_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.averageOrderValue * input.monthlyOrders; results["totalRevenue"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["totalRevenue"] = Number.NaN; }
  try { const v = input.costOfGoodsPerOrder * input.monthlyOrders; results["totalCOGS"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["totalCOGS"] = Number.NaN; }
  try { const v = input.shippingCostPerOrder * input.monthlyOrders; results["totalShipping"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["totalShipping"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["totalRevenue"])) * (input.transactionFeeRate / 100); results["totalTransactionFees"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["totalTransactionFees"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["totalRevenue"])) - (toNumericFormulaValue(results["totalCOGS"])); results["grossProfit"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["grossProfit"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["totalShipping"])) + (toNumericFormulaValue(results["totalTransactionFees"])) + input.monthlyMarketing + input.monthlyFixedCosts; results["operatingExpenses"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["operatingExpenses"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["grossProfit"])) - (toNumericFormulaValue(results["operatingExpenses"])); results["netProfit"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["netProfit"] = Number.NaN; }
  try { const v = ((toNumericFormulaValue(results["netProfit"])) / (toNumericFormulaValue(results["totalRevenue"]))) * 100; results["profitMargin"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["profitMargin"] = Number.NaN; }
  return results;
}


export function calculateShopify_profit_calculator(input: Shopify_profit_calculatorInput): Shopify_profit_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["totalRevenue"]);
  const breakdown = {
    
  };
  const hiddenLossDrivers: string[] = [];
  const suggestedActions: string[] = ["Review inputs and verify results against site standards."];
  const dataConfidenceAdjusted =
    typeof input.dataConfidence === "number"
      ? totalWasteCost * (input.dataConfidence / 100)
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
