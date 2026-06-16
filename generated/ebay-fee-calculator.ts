// Auto-generated from ebay-fee-calculator-schema.json
import * as z from 'zod';

export interface Ebay_fee_calculatorInput {
  salePrice: number;
  shippingCost: number;
  finalValueFeeRate: number;
  fixedFinalValueFee: number;
  insertionFee: number;
  listingUpgradeFee: number;
}

export const Ebay_fee_calculatorInputSchema = z.object({
  salePrice: z.number().default(0),
  shippingCost: z.number().default(0),
  finalValueFeeRate: z.number().default(10),
  fixedFinalValueFee: z.number().default(0.3),
  insertionFee: z.number().default(0.35),
  listingUpgradeFee: z.number().default(0),
});

function evaluateAllFormulas(input: Ebay_fee_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.salePrice + input.shippingCost; results["totalSaleAmount"] = Number.isFinite(v) ? v : 0; } catch { results["totalSaleAmount"] = 0; }
  try { const v = (results["totalSaleAmount"] ?? 0) * (input.finalValueFeeRate / 100) + input.fixedFinalValueFee; results["finalValueFee"] = Number.isFinite(v) ? v : 0; } catch { results["finalValueFee"] = 0; }
  try { const v = (results["finalValueFee"] ?? 0) + input.insertionFee + input.listingUpgradeFee; results["totalEbayFees"] = Number.isFinite(v) ? v : 0; } catch { results["totalEbayFees"] = 0; }
  try { const v = (results["totalSaleAmount"] ?? 0) - (results["totalEbayFees"] ?? 0); results["netPayout"] = Number.isFinite(v) ? v : 0; } catch { results["netPayout"] = 0; }
  return results;
}


export function calculateEbay_fee_calculator(input: Ebay_fee_calculatorInput): Ebay_fee_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["netPayout"] ?? 0;
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


export interface Ebay_fee_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
