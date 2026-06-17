// @ts-nocheck
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

function asFormulaNumber(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Shopify_profit_calculatorInput): Record<string, number | string> {
  const results: Record<string, number | string> = {};
  try { const v = input.averageOrderValue * input.monthlyOrders; results["totalRevenue"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["totalRevenue"] = 0; }
  try { const v = input.costOfGoodsPerOrder * input.monthlyOrders; results["totalCOGS"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["totalCOGS"] = 0; }
  try { const v = input.shippingCostPerOrder * input.monthlyOrders; results["totalShipping"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["totalShipping"] = 0; }
  try { const v = (asFormulaNumber(results["totalRevenue"])) * (input.transactionFeeRate / 100); results["totalTransactionFees"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["totalTransactionFees"] = 0; }
  try { const v = (asFormulaNumber(results["totalRevenue"])) - (asFormulaNumber(results["totalCOGS"])); results["grossProfit"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["grossProfit"] = 0; }
  try { const v = (asFormulaNumber(results["totalShipping"])) + (asFormulaNumber(results["totalTransactionFees"])) + input.monthlyMarketing + input.monthlyFixedCosts; results["operatingExpenses"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["operatingExpenses"] = 0; }
  try { const v = (asFormulaNumber(results["grossProfit"])) - (asFormulaNumber(results["operatingExpenses"])); results["netProfit"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["netProfit"] = 0; }
  try { const v = ((asFormulaNumber(results["netProfit"])) / (asFormulaNumber(results["totalRevenue"]))) * 100; results["profitMargin"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["profitMargin"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

export function calculateShopify_profit_calculator(input: Shopify_profit_calculatorInput): Shopify_profit_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["totalRevenue"]);
  const breakdown = {
    
  };
  const hiddenLossDrivers: string[] = [];
  const suggestedActions: string[] = ["Review inputs and verify results against site standards."];
  const dataConfidenceAdjusted =
    typeof (input as unknown as Record<string, unknown>).dataConfidence === "number"
      ? totalWasteCost * (((input as unknown as Record<string, unknown>).dataConfidence as number) / 100)
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
