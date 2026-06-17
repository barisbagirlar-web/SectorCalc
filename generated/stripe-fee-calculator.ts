// @ts-nocheck
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

function asFormulaNumber(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Stripe_fee_calculatorInput): Record<string, number | string> {
  const results: Record<string, number | string> = {};
  try { const v = input.transactionAmount * (input.percentageFee / 100); results["processingFee"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["processingFee"] = 0; }
  try { const v = input.transactionAmount * (input.extraPercentage / 100); results["extraFee"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["extraFee"] = 0; }
  try { const v = input.transactionAmount * (input.percentageFee / 100) + input.fixedFee + input.transactionAmount * (input.extraPercentage / 100); results["totalFee"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["totalFee"] = 0; }
  try { const v = input.transactionAmount - (input.transactionAmount * (input.percentageFee / 100) + input.fixedFee + input.transactionAmount * (input.extraPercentage / 100)); results["netAmount"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["netAmount"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

export function calculateStripe_fee_calculator(input: Stripe_fee_calculatorInput): Stripe_fee_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["totalFee"]);
  const breakdown = {
    
  };
  const hiddenLossDrivers: string[] = [];
  const suggestedActions: string[] = ["Review inputs and verify results against site standards."];
  const dataConfidenceAdjusted =
    typeof (input as unknown as Record<string, unknown>).dataConfidence === "number"
      ? totalWasteCost * (((input as unknown as Record<string, unknown>).dataConfidence as number) / 100)
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
