// Auto-generated from etsy-fee-calculator-schema.json
import * as z from 'zod';

export interface Etsy_fee_calculatorInput {
  itemPrice: number;
  shippingPrice: number;
  quantity: number;
  itemCost: number;
}

export const Etsy_fee_calculatorInputSchema = z.object({
  itemPrice: z.number().default(20),
  shippingPrice: z.number().default(5),
  quantity: z.number().default(1),
  itemCost: z.number().default(10),
});

function evaluateAllFormulas(input: Etsy_fee_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.quantity * 0.20; results["listingFees"] = Number.isFinite(v) ? v : 0; } catch { results["listingFees"] = 0; }
  try { const v = (input.itemPrice + input.shippingPrice) * input.quantity * 0.065; results["transactionFees"] = Number.isFinite(v) ? v : 0; } catch { results["transactionFees"] = 0; }
  try { const v = ((input.itemPrice + input.shippingPrice) * input.quantity * 0.03) + 0.25; results["paymentProcessingFees"] = Number.isFinite(v) ? v : 0; } catch { results["paymentProcessingFees"] = 0; }
  try { const v = (results["listingFees"] ?? 0) + (results["transactionFees"] ?? 0) + (results["paymentProcessingFees"] ?? 0); results["totalFees"] = Number.isFinite(v) ? v : 0; } catch { results["totalFees"] = 0; }
  try { const v = (input.itemPrice * input.quantity) - (results["totalFees"] ?? 0) - (input.itemCost * input.quantity); results["netProfit"] = Number.isFinite(v) ? v : 0; } catch { results["netProfit"] = 0; }
  return results;
}


export function calculateEtsy_fee_calculator(input: Etsy_fee_calculatorInput): Etsy_fee_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["totalFees"] ?? 0;
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


export interface Etsy_fee_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
