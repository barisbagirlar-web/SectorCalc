// Auto-generated from home-equity-loan-calculator-schema.json
import * as z from 'zod';

export interface Home_equity_loan_calculatorInput {
  homeValue: number;
  remainingMortgage: number;
  desiredLoanAmount: number;
  interestRate: number;
  loanTerm: number;
  maxLTV: number;
  dataConfidence?: number;
}

export const Home_equity_loan_calculatorInputSchema = z.object({
  homeValue: z.number().default(300000),
  remainingMortgage: z.number().default(150000),
  desiredLoanAmount: z.number().default(50000),
  interestRate: z.number().default(6.5),
  loanTerm: z.number().default(10),
  maxLTV: z.number().default(80),
});

function asFormulaNumber(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Home_equity_loan_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = (input.homeValue) / (input.remainingMortgage + input.desiredLoanAmount + input.interestRate + input.loanTerm + input.maxLTV) * 100; results["monthlyRate"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["monthlyRate"] = 0; }
  try { const v = (input.homeValue) * (input.remainingMortgage) * (input.desiredLoanAmount); results["numPayments"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["numPayments"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

export function calculateHome_equity_loan_calculator(input: Home_equity_loan_calculatorInput): Home_equity_loan_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = Math.max(0, toNumericFormulaValue(values["numPayments"]));
  const breakdown = {
    
  };
  const hiddenLossDrivers: string[] = [];
  const suggestedActions: string[] = ["Review inputs and verify results against site standards."];
  const dataConfidenceAdjusted =
    typeof input.dataConfidence === "number"
      ? Math.max(0, totalWasteCost * (input.dataConfidence / 100))
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
