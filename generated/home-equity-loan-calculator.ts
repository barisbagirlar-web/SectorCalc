// Auto-generated from home-equity-loan-calculator-schema.json
import * as z from 'zod';

export interface Home_equity_loan_calculatorInput {
  homeValue: number;
  remainingMortgage: number;
  desiredLoanAmount: number;
  interestRate: number;
  loanTerm: number;
  maxLTV: number;
}

export const Home_equity_loan_calculatorInputSchema = z.object({
  homeValue: z.number().default(300000),
  remainingMortgage: z.number().default(150000),
  desiredLoanAmount: z.number().default(50000),
  interestRate: z.number().default(6.5),
  loanTerm: z.number().default(10),
  maxLTV: z.number().default(80),
});

function evaluateAllFormulas(input: Home_equity_loan_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = Math.max(0, input.homeValue * input.maxLTV / 100 - input.remainingMortgage); results["maxLoan"] = Number.isFinite(v) ? v : 0; } catch { results["maxLoan"] = 0; }
  try { const v = Math.min(input.desiredLoanAmount, (results["maxLoan"] ?? 0)); results["actualLoan"] = Number.isFinite(v) ? v : 0; } catch { results["actualLoan"] = 0; }
  try { const v = input.interestRate / 100 / 12; results["monthlyRate"] = Number.isFinite(v) ? v : 0; } catch { results["monthlyRate"] = 0; }
  try { const v = input.loanTerm * 12; results["numPayments"] = Number.isFinite(v) ? v : 0; } catch { results["numPayments"] = 0; }
  try { const v = (results["actualLoan"] ?? 0) * (results["monthlyRate"] ?? 0) * Math.pow(1 + (results["monthlyRate"] ?? 0), (results["numPayments"] ?? 0)) / (Math.pow(1 + (results["monthlyRate"] ?? 0), (results["numPayments"] ?? 0)) - 1); results["monthlyPayment"] = Number.isFinite(v) ? v : 0; } catch { results["monthlyPayment"] = 0; }
  try { const v = (results["monthlyPayment"] ?? 0) * (results["numPayments"] ?? 0); results["totalPayment"] = Number.isFinite(v) ? v : 0; } catch { results["totalPayment"] = 0; }
  try { const v = (results["totalPayment"] ?? 0) - (results["actualLoan"] ?? 0); results["totalInterest"] = Number.isFinite(v) ? v : 0; } catch { results["totalInterest"] = 0; }
  return results;
}


export function calculateHome_equity_loan_calculator(input: Home_equity_loan_calculatorInput): Home_equity_loan_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["monthlyPayment"] ?? 0;
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


export interface Home_equity_loan_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
