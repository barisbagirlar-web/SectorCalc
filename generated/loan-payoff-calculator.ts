// Auto-generated from loan-payoff-calculator-schema.json
import * as z from 'zod';

export interface Loan_payoff_calculatorInput {
  loanAmount: number;
  annualInterestRate: number;
  monthlyPayment: number;
  extraMonthlyPayment: number;
}

export const Loan_payoff_calculatorInputSchema = z.object({
  loanAmount: z.number().default(100000),
  annualInterestRate: z.number().default(5.5),
  monthlyPayment: z.number().default(1000),
  extraMonthlyPayment: z.number().default(0),
});

function evaluateAllFormulas(input: Loan_payoff_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.annualInterestRate / 100 / 12; results["monthlyRate"] = Number.isFinite(v) ? v : 0; } catch { results["monthlyRate"] = 0; }
  try { const v = input.monthlyPayment + input.extraMonthlyPayment; results["totalMonthly"] = Number.isFinite(v) ? v : 0; } catch { results["totalMonthly"] = 0; }
  try { const v = Math.log((results["totalMonthly"] ?? 0) / ((results["totalMonthly"] ?? 0) - input.loanAmount * (results["monthlyRate"] ?? 0))) / Math.log(1 + (results["monthlyRate"] ?? 0)); results["unroundedMonths"] = Number.isFinite(v) ? v : 0; } catch { results["unroundedMonths"] = 0; }
  try { const v = Math.ceil((results["unroundedMonths"] ?? 0)); results["monthsToPayoff"] = Number.isFinite(v) ? v : 0; } catch { results["monthsToPayoff"] = 0; }
  try { const v = (results["monthsToPayoff"] ?? 0) * (results["totalMonthly"] ?? 0); results["totalPaid"] = Number.isFinite(v) ? v : 0; } catch { results["totalPaid"] = 0; }
  try { const v = (results["totalPaid"] ?? 0) - input.loanAmount; results["totalInterest"] = Number.isFinite(v) ? v : 0; } catch { results["totalInterest"] = 0; }
  return results;
}


export function calculateLoan_payoff_calculator(input: Loan_payoff_calculatorInput): Loan_payoff_calculatorOutput {
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


export interface Loan_payoff_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
