// Auto-generated from amazon-fba-calculator-schema.json
import * as z from 'zod';

export interface Amazon_fba_calculatorInput {
  productCost: number;
  sellingPrice: number;
  referralFeePercentage: number;
  fbaFulfillmentFee: number;
  shippingToAmazon: number;
  advertisingCost: number;
  storageCost: number;
}

export const Amazon_fba_calculatorInputSchema = z.object({
  productCost: z.number().default(0),
  sellingPrice: z.number().default(0),
  referralFeePercentage: z.number().default(15),
  fbaFulfillmentFee: z.number().default(0),
  shippingToAmazon: z.number().default(0),
  advertisingCost: z.number().default(0),
  storageCost: z.number().default(0),
});

function evaluateAllFormulas(input: Amazon_fba_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = (input.sellingPrice * input.referralFeePercentage) / 100; results["referralFeeAmount"] = Number.isFinite(v) ? v : 0; } catch { results["referralFeeAmount"] = 0; }
  try { const v = input.productCost + ((input.sellingPrice * input.referralFeePercentage) / 100) + input.fbaFulfillmentFee + input.shippingToAmazon + input.advertisingCost + input.storageCost; results["totalCost"] = Number.isFinite(v) ? v : 0; } catch { results["totalCost"] = 0; }
  try { const v = input.sellingPrice - (input.productCost + ((input.sellingPrice * input.referralFeePercentage) / 100) + input.fbaFulfillmentFee + input.shippingToAmazon + input.advertisingCost + input.storageCost); results["netProfit"] = Number.isFinite(v) ? v : 0; } catch { results["netProfit"] = 0; }
  try { const v = ((input.sellingPrice - (input.productCost + ((input.sellingPrice * input.referralFeePercentage) / 100) + input.fbaFulfillmentFee + input.shippingToAmazon + input.advertisingCost + input.storageCost)) / input.sellingPrice) * 100; results["profitMargin"] = Number.isFinite(v) ? v : 0; } catch { results["profitMargin"] = 0; }
  return results;
}


export function calculateAmazon_fba_calculator(input: Amazon_fba_calculatorInput): Amazon_fba_calculatorOutput {
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


export interface Amazon_fba_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
