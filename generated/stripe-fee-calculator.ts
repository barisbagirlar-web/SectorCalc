// Auto-generated from stripe-fee-calculator-schema.json
import * as z from 'zod';

export interface Stripe_fee_calculatorInput {
  transactionAmount: number;
  percentageFee: number;
  fixedFee: number;
  extraPercentage: number;
}

export const Stripe_fee_calculatorInputSchema = z.object({
  transactionAmount: z.number().default(100),
  percentageFee: z.number().default(2.9),
  fixedFee: z.number().default(0.3),
  extraPercentage: z.number().default(0),
});

function evaluateAllFormulas(input: Stripe_fee_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.transactionAmount * (input.percentageFee / 100); results["processingFee"] = Number.isFinite(v) ? v : 0; } catch { results["processingFee"] = 0; }
  try { const v = input.transactionAmount * (input.extraPercentage / 100); results["extraFee"] = Number.isFinite(v) ? v : 0; } catch { results["extraFee"] = 0; }
  try { const v = input.transactionAmount * (input.percentageFee / 100) + input.fixedFee + input.transactionAmount * (input.extraPercentage / 100); results["totalFee"] = Number.isFinite(v) ? v : 0; } catch { results["totalFee"] = 0; }
  try { const v = input.transactionAmount - (input.transactionAmount * (input.percentageFee / 100) + input.fixedFee + input.transactionAmount * (input.extraPercentage / 100)); results["netAmount"] = Number.isFinite(v) ? v : 0; } catch { results["netAmount"] = 0; }
  return results;
}


export function calculateStripe_fee_calculator(input: Stripe_fee_calculatorInput): Stripe_fee_calculatorOutput {
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


export interface Stripe_fee_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
