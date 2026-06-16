// Auto-generated from ecommerce-profit-calculator-schema.json
import * as z from 'zod';

export interface Ecommerce_profit_calculatorInput {
  sellingPrice: number;
  costPrice: number;
  quantity: number;
  shippingCostPerUnit: number;
  marketingSpend: number;
  taxRate: number;
}

export const Ecommerce_profit_calculatorInputSchema = z.object({
  sellingPrice: z.number().default(50),
  costPrice: z.number().default(30),
  quantity: z.number().default(100),
  shippingCostPerUnit: z.number().default(5),
  marketingSpend: z.number().default(200),
  taxRate: z.number().default(10),
});

function evaluateAllFormulas(input: Ecommerce_profit_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.sellingPrice * input.quantity; results["revenue"] = Number.isFinite(v) ? v : 0; } catch { results["revenue"] = 0; }
  try { const v = input.costPrice * input.quantity; results["cogs"] = Number.isFinite(v) ? v : 0; } catch { results["cogs"] = 0; }
  try { const v = (results["revenue"] ?? 0) - (results["cogs"] ?? 0); results["grossProfit"] = Number.isFinite(v) ? v : 0; } catch { results["grossProfit"] = 0; }
  try { const v = input.shippingCostPerUnit * input.quantity; results["shippingCost"] = Number.isFinite(v) ? v : 0; } catch { results["shippingCost"] = 0; }
  try { const v = input.marketingSpend; results["marketingSpend"] = Number.isFinite(v) ? v : 0; } catch { results["marketingSpend"] = 0; }
  try { const v = ((results["revenue"] ?? 0) - (results["cogs"] ?? 0) - (results["shippingCost"] ?? 0) - input.marketingSpend) * (input.taxRate / 100); results["taxAmount"] = Number.isFinite(v) ? v : 0; } catch { results["taxAmount"] = 0; }
  try { const v = (results["revenue"] ?? 0) - (results["cogs"] ?? 0) - (results["shippingCost"] ?? 0) - input.marketingSpend - (results["taxAmount"] ?? 0); results["netProfit"] = Number.isFinite(v) ? v : 0; } catch { results["netProfit"] = 0; }
  return results;
}


export function calculateEcommerce_profit_calculator(input: Ecommerce_profit_calculatorInput): Ecommerce_profit_calculatorOutput {
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


export interface Ecommerce_profit_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
