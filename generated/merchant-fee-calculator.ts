// Auto-generated from merchant-fee-calculator-schema.json
import * as z from 'zod';

export interface Merchant_fee_calculatorInput {
  transactionAmount: number;
  feePercentage: number;
  fixedFee: number;
  taxRate: number;
  dataConfidence?: number;
}

export const Merchant_fee_calculatorInputSchema = z.object({
  transactionAmount: z.number().default(100),
  feePercentage: z.number().default(2.9),
  fixedFee: z.number().default(0.3),
  taxRate: z.number().default(20),
});

function asFormulaNumber(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Merchant_fee_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.transactionAmount * (input.feePercentage / 100) + input.fixedFee; results["grossFee"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["grossFee"] = 0; }
  try { const v = (asFormulaNumber(results["grossFee"])) * (input.taxRate / 100); results["taxAmount"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["taxAmount"] = 0; }
  try { const v = (asFormulaNumber(results["grossFee"])) + (asFormulaNumber(results["taxAmount"])); results["totalFee"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["totalFee"] = 0; }
  try { const v = input.transactionAmount + (asFormulaNumber(results["totalFee"])); results["totalTransactionCost"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["totalTransactionCost"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

export function calculateMerchant_fee_calculator(input: Merchant_fee_calculatorInput): Merchant_fee_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["totalFee"]);
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


export interface Merchant_fee_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
