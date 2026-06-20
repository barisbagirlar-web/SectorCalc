// Auto-generated from ebay-fee-calculator-schema.json
import * as z from 'zod';

export interface Ebay_fee_calculatorInput {
  salePrice: number;
  shippingCost: number;
  finalValueFeeRate: number;
  fixedFinalValueFee: number;
  insertionFee: number;
  listingUpgradeFee: number;
  dataConfidence?: number;
}

export const Ebay_fee_calculatorInputSchema = z.object({
  salePrice: z.number().default(0),
  shippingCost: z.number().default(0),
  finalValueFeeRate: z.number().default(10),
  fixedFinalValueFee: z.number().default(0.3),
  insertionFee: z.number().default(0.35),
  listingUpgradeFee: z.number().default(0),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Ebay_fee_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.salePrice + input.shippingCost; results["totalSaleAmount"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["totalSaleAmount"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["totalSaleAmount"])) * (input.finalValueFeeRate / 100) + input.fixedFinalValueFee; results["finalValueFee"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["finalValueFee"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["finalValueFee"])) + input.insertionFee + input.listingUpgradeFee; results["totalEbayFees"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["totalEbayFees"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["totalSaleAmount"])) - (toNumericFormulaValue(results["totalEbayFees"])); results["netPayout"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["netPayout"] = Number.NaN; }
  return results;
}


export function calculateEbay_fee_calculator(input: Ebay_fee_calculatorInput): Ebay_fee_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["netPayout"]);
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


export interface Ebay_fee_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
