// Auto-generated from loan-amortization-schedule-calculator-schema.json
import * as z from 'zod';

export interface Loan_amortization_schedule_calculatorInput {
  loanAmount: number;
  annualInterestRate: number;
  loanTermYears: number;
  paymentsPerYear: number;
  dataConfidence?: number;
}

export const Loan_amortization_schedule_calculatorInputSchema = z.object({
  loanAmount: z.number().default(100000),
  annualInterestRate: z.number().default(5),
  loanTermYears: z.number().default(30),
  paymentsPerYear: z.number().default(12),
});

function asFormulaNumber(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Loan_amortization_schedule_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = (input.annualInterestRate / 100) / input.paymentsPerYear; results["periodicInterestRate"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["periodicInterestRate"] = 0; }
  try { const v = input.loanTermYears * input.paymentsPerYear; results["totalPayments"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["totalPayments"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

export function calculateLoan_amortization_schedule_calculator(input: Loan_amortization_schedule_calculatorInput): Loan_amortization_schedule_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["totalPayments"]);
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


export interface Loan_amortization_schedule_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
