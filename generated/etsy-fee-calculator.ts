// Auto-generated from etsy-fee-calculator-schema.json
import * as z from 'zod';

export interface Etsy_fee_calculatorInput {
  itemPrice: number;
  shippingPrice: number;
  quantity: number;
  itemCost: number;
  dataConfidence?: number;
}

export const Etsy_fee_calculatorInputSchema = z.object({
  itemPrice: z.number().default(20),
  shippingPrice: z.number().default(5),
  quantity: z.number().default(1),
  itemCost: z.number().default(10),
});

function asFormulaNumber(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Etsy_fee_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.quantity * 0.20; results["listingFees"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["listingFees"] = 0; }
  try { const v = (input.itemPrice + input.shippingPrice) * input.quantity * 0.065; results["transactionFees"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["transactionFees"] = 0; }
  try { const v = ((input.itemPrice + input.shippingPrice) * input.quantity * 0.03) + 0.25; results["paymentProcessingFees"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["paymentProcessingFees"] = 0; }
  try { const v = (asFormulaNumber(results["listingFees"])) + (asFormulaNumber(results["transactionFees"])) + (asFormulaNumber(results["paymentProcessingFees"])); results["totalFees"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["totalFees"] = 0; }
  try { const v = (input.itemPrice * input.quantity) - (asFormulaNumber(results["totalFees"])) - (input.itemCost * input.quantity); results["netProfit"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["netProfit"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

export function calculateEtsy_fee_calculator(input: Etsy_fee_calculatorInput): Etsy_fee_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = Math.max(0, toNumericFormulaValue(values["totalFees"]));
  const breakdown = {
    
  };
  const hiddenLossDrivers: string[] = [];
  const suggestedActions: string[] = ["Review inputs and verify results against site standards."];
  const dataConfidenceAdjusted =
    typeof input.dataConfidence === "number"
      ? Math.max(0, totalWasteCost * (input.dataConfidence / 100))
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
