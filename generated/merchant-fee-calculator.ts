// Auto-generated from merchant-fee-calculator-schema.json
import * as z from 'zod';

export interface Merchant_fee_calculatorInput {
  transactionAmount: number;
  feePercentage: number;
  fixedFee: number;
  taxRate: number;
}

export const Merchant_fee_calculatorInputSchema = z.object({
  transactionAmount: z.number().default(100),
  feePercentage: z.number().default(2.9),
  fixedFee: z.number().default(0.3),
  taxRate: z.number().default(20),
});

function evaluateAllFormulas(input: Merchant_fee_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.transactionAmount * (input.feePercentage / 100) + input.fixedFee; results["grossFee"] = Number.isFinite(v) ? v : 0; } catch { results["grossFee"] = 0; }
  try { const v = (results["grossFee"] ?? 0) * (input.taxRate / 100); results["taxAmount"] = Number.isFinite(v) ? v : 0; } catch { results["taxAmount"] = 0; }
  try { const v = (results["grossFee"] ?? 0) + (results["taxAmount"] ?? 0); results["totalFee"] = Number.isFinite(v) ? v : 0; } catch { results["totalFee"] = 0; }
  try { const v = input.transactionAmount + (results["totalFee"] ?? 0); results["totalTransactionCost"] = Number.isFinite(v) ? v : 0; } catch { results["totalTransactionCost"] = 0; }
  return results;
}


export function calculateMerchant_fee_calculator(input: Merchant_fee_calculatorInput): Merchant_fee_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["totalFee"] ?? 0;
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


export interface Merchant_fee_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
