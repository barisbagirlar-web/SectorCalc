// Auto-generated from loan-affordability-calculator-schema.json
import * as z from 'zod';

export interface Loan_affordability_calculatorInput {
  monthlyIncome: number;
  monthlyExpenses: number;
  annualInterestRate: number;
  loanTermYears: number;
  loanAmount: number;
  dataConfidence?: number;
}

export const Loan_affordability_calculatorInputSchema = z.object({
  monthlyIncome: z.number().default(5000),
  monthlyExpenses: z.number().default(2000),
  annualInterestRate: z.number().default(5),
  loanTermYears: z.number().default(20),
  loanAmount: z.number().default(200000),
});

function asFormulaNumber(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Loan_affordability_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.annualInterestRate / 100 / 12; results["monthlyInterestRate"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["monthlyInterestRate"] = 0; }
  try { const v = input.loanTermYears * 12; results["numberOfPayments"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["numberOfPayments"] = 0; }
  try { const v = input.monthlyIncome - input.monthlyExpenses; results["netIncome"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["netIncome"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

export function calculateLoan_affordability_calculator(input: Loan_affordability_calculatorInput): Loan_affordability_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["netIncome"]);
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


export interface Loan_affordability_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
