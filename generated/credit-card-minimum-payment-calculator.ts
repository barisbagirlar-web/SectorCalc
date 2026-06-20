// Auto-generated from credit-card-minimum-payment-calculator-schema.json
import * as z from 'zod';

export interface Credit_card_minimum_payment_calculatorInput {
  outstandingBalance: number;
  annualInterestRate: number;
  minPaymentPercent: number;
  fixedMinAmount: number;
  pastDueAmount: number;
  overLimitAmount: number;
  dataConfidence?: number;
}

export const Credit_card_minimum_payment_calculatorInputSchema = z.object({
  outstandingBalance: z.number().default(1000),
  annualInterestRate: z.number().default(18),
  minPaymentPercent: z.number().default(2),
  fixedMinAmount: z.number().default(25),
  pastDueAmount: z.number().default(0),
  overLimitAmount: z.number().default(0),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Credit_card_minimum_payment_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = (input.outstandingBalance) * (input.annualInterestRate) * (input.minPaymentPercent) * (input.fixedMinAmount) * (input.pastDueAmount) * (input.overLimitAmount); results["monthlyInterest"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["monthlyInterest"] = Number.NaN; }
  try { const v = (input.outstandingBalance) * (input.annualInterestRate) * (input.minPaymentPercent); results["totalBalance"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["totalBalance"] = Number.NaN; }
  return results;
}


export function calculateCredit_card_minimum_payment_calculator(input: Credit_card_minimum_payment_calculatorInput): Credit_card_minimum_payment_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["totalBalance"]);
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


export interface Credit_card_minimum_payment_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
