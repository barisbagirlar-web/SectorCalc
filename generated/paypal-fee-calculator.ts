// Auto-generated from paypal-fee-calculator-schema.json
import * as z from 'zod';

export interface Paypal_fee_calculatorInput {
  transactionAmount: number;
  feePercentage: number;
  fixedFee: number;
  isInternational: number;
  internationalFeePercentage: number;
  dataConfidence?: number;
}

export const Paypal_fee_calculatorInputSchema = z.object({
  transactionAmount: z.number().default(100),
  feePercentage: z.number().default(2.9),
  fixedFee: z.number().default(0.3),
  isInternational: z.number().default(0),
  internationalFeePercentage: z.number().default(1.5),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Paypal_fee_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = (input.transactionAmount * input.feePercentage / 100 + input.fixedFee) + (input.isInternational === 1 ? input.transactionAmount * input.internationalFeePercentage / 100 : 0); results["totalFee"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["totalFee"] = Number.NaN; }
  try { const v = input.transactionAmount - ((input.transactionAmount * input.feePercentage / 100 + input.fixedFee) + (input.isInternational === 1 ? input.transactionAmount * input.internationalFeePercentage / 100 : 0)); results["netAmount"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["netAmount"] = Number.NaN; }
  try { const v = input.transactionAmount * input.feePercentage / 100; results["percentageFee"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["percentageFee"] = Number.NaN; }
  try { const v = input.fixedFee; results["fixedFeeAmount"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["fixedFeeAmount"] = Number.NaN; }
  try { const v = input.isInternational === 1 ? input.transactionAmount * input.internationalFeePercentage / 100 : 0; results["internationalFeeAmount"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["internationalFeeAmount"] = Number.NaN; }
  return results;
}


export function calculatePaypal_fee_calculator(input: Paypal_fee_calculatorInput): Paypal_fee_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["netAmount"]);
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


export interface Paypal_fee_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
