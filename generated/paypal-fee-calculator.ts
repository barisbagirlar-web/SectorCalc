// Auto-generated from paypal-fee-calculator-schema.json
import * as z from 'zod';

export interface Paypal_fee_calculatorInput {
  transactionAmount: number;
  feePercentage: number;
  fixedFee: number;
  isInternational: number;
  internationalFeePercentage: number;
}

export const Paypal_fee_calculatorInputSchema = z.object({
  transactionAmount: z.number().default(100),
  feePercentage: z.number().default(2.9),
  fixedFee: z.number().default(0.3),
  isInternational: z.number().default(0),
  internationalFeePercentage: z.number().default(1.5),
});

function evaluateAllFormulas(input: Paypal_fee_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = (input.transactionAmount * input.feePercentage / 100 + input.fixedFee) + (input.isInternational === 1 ? input.transactionAmount * input.internationalFeePercentage / 100 : 0); results["totalFee"] = Number.isFinite(v) ? v : 0; } catch { results["totalFee"] = 0; }
  try { const v = input.transactionAmount - ((input.transactionAmount * input.feePercentage / 100 + input.fixedFee) + (input.isInternational === 1 ? input.transactionAmount * input.internationalFeePercentage / 100 : 0)); results["netAmount"] = Number.isFinite(v) ? v : 0; } catch { results["netAmount"] = 0; }
  try { const v = input.transactionAmount * input.feePercentage / 100; results["percentageFee"] = Number.isFinite(v) ? v : 0; } catch { results["percentageFee"] = 0; }
  try { const v = input.fixedFee; results["fixedFeeAmount"] = Number.isFinite(v) ? v : 0; } catch { results["fixedFeeAmount"] = 0; }
  try { const v = input.isInternational === 1 ? input.transactionAmount * input.internationalFeePercentage / 100 : 0; results["internationalFeeAmount"] = Number.isFinite(v) ? v : 0; } catch { results["internationalFeeAmount"] = 0; }
  return results;
}


export function calculatePaypal_fee_calculator(input: Paypal_fee_calculatorInput): Paypal_fee_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["netAmount"] ?? 0;
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


export interface Paypal_fee_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
