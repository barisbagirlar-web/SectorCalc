// Auto-generated from loan-affordability-calculator-schema.json
import * as z from 'zod';

export interface Loan_affordability_calculatorInput {
  monthlyIncome: number;
  monthlyExpenses: number;
  annualInterestRate: number;
  loanTermYears: number;
  loanAmount: number;
}

export const Loan_affordability_calculatorInputSchema = z.object({
  monthlyIncome: z.number().default(5000),
  monthlyExpenses: z.number().default(2000),
  annualInterestRate: z.number().default(5),
  loanTermYears: z.number().default(20),
  loanAmount: z.number().default(200000),
});

function evaluateAllFormulas(input: Loan_affordability_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.annualInterestRate / 100 / 12; results["monthlyInterestRate"] = Number.isFinite(v) ? v : 0; } catch { results["monthlyInterestRate"] = 0; }
  try { const v = input.loanTermYears * 12; results["numberOfPayments"] = Number.isFinite(v) ? v : 0; } catch { results["numberOfPayments"] = 0; }
  try { const v = input.loanAmount * ((results["monthlyInterestRate"] ?? 0) * Math.pow(1 + (results["monthlyInterestRate"] ?? 0), (results["numberOfPayments"] ?? 0))) / (Math.pow(1 + (results["monthlyInterestRate"] ?? 0), (results["numberOfPayments"] ?? 0)) - 1); results["monthlyPayment"] = Number.isFinite(v) ? v : 0; } catch { results["monthlyPayment"] = 0; }
  try { const v = input.monthlyIncome - input.monthlyExpenses; results["netIncome"] = Number.isFinite(v) ? v : 0; } catch { results["netIncome"] = 0; }
  try { const v = (results["netIncome"] ?? 0) * (1 - Math.pow(1 + (results["monthlyInterestRate"] ?? 0), -(results["numberOfPayments"] ?? 0))) / (results["monthlyInterestRate"] ?? 0); results["maxAffordableLoan"] = Number.isFinite(v) ? v : 0; } catch { results["maxAffordableLoan"] = 0; }
  try { const v = input.loanAmount / (results["maxAffordableLoan"] ?? 0); results["affordabilityRatio"] = Number.isFinite(v) ? v : 0; } catch { results["affordabilityRatio"] = 0; }
  return results;
}


export function calculateLoan_affordability_calculator(input: Loan_affordability_calculatorInput): Loan_affordability_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["affordabilityRatio"] ?? 0;
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


export interface Loan_affordability_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
