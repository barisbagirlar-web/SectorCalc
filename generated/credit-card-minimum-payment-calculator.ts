// @ts-nocheck
// Auto-generated from credit-card-minimum-payment-calculator-schema.json
import * as z from 'zod';

export interface Credit_card_minimum_payment_calculatorInput {
  outstandingBalance: number;
  annualInterestRate: number;
  minPaymentPercent: number;
  fixedMinAmount: number;
  pastDueAmount: number;
  overLimitAmount: number;
}

export const Credit_card_minimum_payment_calculatorInputSchema = z.object({
  outstandingBalance: z.number().default(1000),
  annualInterestRate: z.number().default(18),
  minPaymentPercent: z.number().default(2),
  fixedMinAmount: z.number().default(25),
  pastDueAmount: z.number().default(0),
  overLimitAmount: z.number().default(0),
});

function asFormulaNumber(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Credit_card_minimum_payment_calculatorInput): Record<string, number | string> {
  const results: Record<string, number | string> = {};
  try { const v = (input.annualInterestRate / 100 / 12) * input.outstandingBalance; results["monthlyInterest"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["monthlyInterest"] = 0; }
  try { const v = input.outstandingBalance + (asFormulaNumber(results["monthlyInterest"])); results["totalBalance"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["totalBalance"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

export function calculateCredit_card_minimum_payment_calculator(input: Credit_card_minimum_payment_calculatorInput): Credit_card_minimum_payment_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["totalBalance"]);
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


export interface Credit_card_minimum_payment_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
