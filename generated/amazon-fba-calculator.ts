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
  dataConfidence?: number;
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

function asFormulaNumber(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Amazon_fba_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = (input.sellingPrice * input.referralFeePercentage) / 100; results["referralFeeAmount"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["referralFeeAmount"] = 0; }
  try { const v = input.productCost + ((input.sellingPrice * input.referralFeePercentage) / 100) + input.fbaFulfillmentFee + input.shippingToAmazon + input.advertisingCost + input.storageCost; results["totalCost"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["totalCost"] = 0; }
  try { const v = input.sellingPrice - (input.productCost + ((input.sellingPrice * input.referralFeePercentage) / 100) + input.fbaFulfillmentFee + input.shippingToAmazon + input.advertisingCost + input.storageCost); results["netProfit"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["netProfit"] = 0; }
  try { const v = ((input.sellingPrice - (input.productCost + ((input.sellingPrice * input.referralFeePercentage) / 100) + input.fbaFulfillmentFee + input.shippingToAmazon + input.advertisingCost + input.storageCost)) / input.sellingPrice) * 100; results["profitMargin"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["profitMargin"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

export function calculateAmazon_fba_calculator(input: Amazon_fba_calculatorInput): Amazon_fba_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["netProfit"]);
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


export interface Amazon_fba_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
