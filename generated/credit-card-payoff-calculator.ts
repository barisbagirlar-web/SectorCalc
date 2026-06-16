// Auto-generated from credit-card-payoff-calculator-schema.json
import * as z from 'zod';

export interface Credit_card_payoff_calculatorInput {
  balance: number;
  annualInterestRate: number;
  monthlyPayment: number;
}

export const Credit_card_payoff_calculatorInputSchema = z.object({
  balance: z.number().default(1000),
  annualInterestRate: z.number().default(18),
  monthlyPayment: z.number().default(50),
});

function evaluateAllFormulas(input: Credit_card_payoff_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = Math.log(input.monthlyPayment / (input.monthlyPayment - input.balance * (input.annualInterestRate/100/12))) / Math.log(1 + (input.annualInterestRate/100/12)); results["monthsToPayoff"] = Number.isFinite(v) ? v : 0; } catch { results["monthsToPayoff"] = 0; }
  try { const v = input.monthlyPayment * (results["monthsToPayoff"] ?? 0); results["totalAmountPaid"] = Number.isFinite(v) ? v : 0; } catch { results["totalAmountPaid"] = 0; }
  try { const v = (results["totalAmountPaid"] ?? 0) - input.balance; results["totalInterestPaid"] = Number.isFinite(v) ? v : 0; } catch { results["totalInterestPaid"] = 0; }
  return results;
}


export function calculateCredit_card_payoff_calculator(input: Credit_card_payoff_calculatorInput): Credit_card_payoff_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["monthsToPayoff"] ?? 0;
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


export interface Credit_card_payoff_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
