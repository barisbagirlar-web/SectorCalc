// Auto-generated from loan-payoff-calculator-schema.json
import * as z from 'zod';

export interface Loan_payoff_calculatorInput {
  loanAmount: number;
  annualInterestRate: number;
  monthlyPayment: number;
  extraMonthlyPayment: number;
  dataConfidence?: number;
}

export const Loan_payoff_calculatorInputSchema = z.object({
  loanAmount: z.number().default(100000),
  annualInterestRate: z.number().default(5.5),
  monthlyPayment: z.number().default(1000),
  extraMonthlyPayment: z.number().default(0),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Loan_payoff_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.annualInterestRate / 100 / 12; results["monthlyRate"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["monthlyRate"] = Number.NaN; }
  try { const v = input.monthlyPayment + input.extraMonthlyPayment; results["totalMonthly"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["totalMonthly"] = Number.NaN; }
  return results;
}


export function calculateLoan_payoff_calculator(input: Loan_payoff_calculatorInput): Loan_payoff_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["totalMonthly"]);
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


export interface Loan_payoff_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
