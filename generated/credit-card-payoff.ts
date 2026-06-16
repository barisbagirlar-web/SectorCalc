// Auto-generated from credit-card-payoff-schema.json
import * as z from 'zod';

export interface Credit_card_payoffInput {
  balance: number;
  annualRate: number;
  monthlyPayment: number;
}

export const Credit_card_payoffInputSchema = z.object({
  balance: z.number().default(1000),
  annualRate: z.number().default(18),
  monthlyPayment: z.number().default(50),
});

function evaluateAllFormulas(input: Credit_card_payoffInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = Math.ceil(-Math.log(1 - input.balance * (input.annualRate/100/12) / input.monthlyPayment) / Math.log(1 + input.annualRate/100/12)); results["monthsToPayoff"] = Number.isFinite(v) ? v : 0; } catch { results["monthsToPayoff"] = 0; }
  try { const v = Math.ceil(-Math.log(1 - input.balance * (input.annualRate/100/12) / input.monthlyPayment) / Math.log(1 + input.annualRate/100/12)) * input.monthlyPayment - input.balance; results["totalInterest"] = Number.isFinite(v) ? v : 0; } catch { results["totalInterest"] = 0; }
  try { const v = Math.ceil(-Math.log(1 - input.balance * (input.annualRate/100/12) / input.monthlyPayment) / Math.log(1 + input.annualRate/100/12)) * input.monthlyPayment; results["totalPaid"] = Number.isFinite(v) ? v : 0; } catch { results["totalPaid"] = 0; }
  return results;
}


export function calculateCredit_card_payoff(input: Credit_card_payoffInput): Credit_card_payoffOutput {
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


export interface Credit_card_payoffOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
