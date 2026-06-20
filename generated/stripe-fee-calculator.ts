// Auto-generated from stripe-fee-calculator-schema.json
import * as z from 'zod';

export interface Stripe_fee_calculatorInput {
  transactionAmount: number;
  percentageFee: number;
  fixedFee: number;
  extraPercentage: number;
  dataConfidence?: number;
}

export const Stripe_fee_calculatorInputSchema = z.object({
  transactionAmount: z.number().default(100),
  percentageFee: z.number().default(2.9),
  fixedFee: z.number().default(0.3),
  extraPercentage: z.number().default(0),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Stripe_fee_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.transactionAmount * (input.percentageFee / 100); results["processingFee"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["processingFee"] = Number.NaN; }
  try { const v = input.transactionAmount * (input.extraPercentage / 100); results["extraFee"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["extraFee"] = Number.NaN; }
  try { const v = input.transactionAmount * (input.percentageFee / 100) + input.fixedFee + input.transactionAmount * (input.extraPercentage / 100); results["totalFee"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["totalFee"] = Number.NaN; }
  try { const v = input.transactionAmount - (input.transactionAmount * (input.percentageFee / 100) + input.fixedFee + input.transactionAmount * (input.extraPercentage / 100)); results["netAmount"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["netAmount"] = Number.NaN; }
  return results;
}


export function calculateStripe_fee_calculator(input: Stripe_fee_calculatorInput): Stripe_fee_calculatorOutput {
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


export interface Stripe_fee_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
