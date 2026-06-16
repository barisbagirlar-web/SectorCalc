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

function evaluateAllFormulas(input: Credit_card_minimum_payment_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = (input.annualInterestRate / 100 / 12) * input.outstandingBalance; results["monthlyInterest"] = Number.isFinite(v) ? v : 0; } catch { results["monthlyInterest"] = 0; }
  try { const v = input.outstandingBalance + (results["monthlyInterest"] ?? 0); results["totalBalance"] = Number.isFinite(v) ? v : 0; } catch { results["totalBalance"] = 0; }
  try { const v = Math.max((input.minPaymentPercent / 100) * (results["totalBalance"] ?? 0), input.fixedMinAmount); results["baseMin"] = Number.isFinite(v) ? v : 0; } catch { results["baseMin"] = 0; }
  try { const v = (results["baseMin"] ?? 0) + input.pastDueAmount + input.overLimitAmount; results["minPayment"] = Number.isFinite(v) ? v : 0; } catch { results["minPayment"] = 0; }
  return results;
}


export function calculateCredit_card_minimum_payment_calculator(input: Credit_card_minimum_payment_calculatorInput): Credit_card_minimum_payment_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["minPayment"] ?? 0;
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


export interface Credit_card_minimum_payment_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
