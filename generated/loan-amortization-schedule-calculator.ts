// Auto-generated from loan-amortization-schedule-calculator-schema.json
import * as z from 'zod';

export interface Loan_amortization_schedule_calculatorInput {
  loanAmount: number;
  annualInterestRate: number;
  loanTermYears: number;
  paymentsPerYear: number;
}

export const Loan_amortization_schedule_calculatorInputSchema = z.object({
  loanAmount: z.number().default(100000),
  annualInterestRate: z.number().default(5),
  loanTermYears: z.number().default(30),
  paymentsPerYear: z.number().default(12),
});

function evaluateAllFormulas(input: Loan_amortization_schedule_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = (input.annualInterestRate / 100) / input.paymentsPerYear; results["periodicInterestRate"] = Number.isFinite(v) ? v : 0; } catch { results["periodicInterestRate"] = 0; }
  try { const v = input.loanTermYears * input.paymentsPerYear; results["totalPayments"] = Number.isFinite(v) ? v : 0; } catch { results["totalPayments"] = 0; }
  try { const v = ((results["periodicInterestRate"] ?? 0) * input.loanAmount) / (1 - Math.pow(1 + (results["periodicInterestRate"] ?? 0), -(results["totalPayments"] ?? 0))); results["monthlyPayment"] = Number.isFinite(v) ? v : 0; } catch { results["monthlyPayment"] = 0; }
  try { const v = (results["monthlyPayment"] ?? 0) * (results["totalPayments"] ?? 0); results["totalCost"] = Number.isFinite(v) ? v : 0; } catch { results["totalCost"] = 0; }
  try { const v = (results["totalCost"] ?? 0) - input.loanAmount; results["totalInterest"] = Number.isFinite(v) ? v : 0; } catch { results["totalInterest"] = 0; }
  return results;
}


export function calculateLoan_amortization_schedule_calculator(input: Loan_amortization_schedule_calculatorInput): Loan_amortization_schedule_calculatorOutput {
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


export interface Loan_amortization_schedule_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
