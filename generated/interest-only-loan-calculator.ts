// @ts-nocheck
// Auto-generated from interest-only-loan-calculator-schema.json
import * as z from 'zod';

export interface Interest_only_loan_calculatorInput {
  principal: number;
  annualInterestRate: number;
  loanTermYears: number;
  paymentsPerYear: number;
}

export const Interest_only_loan_calculatorInputSchema = z.object({
  principal: z.number().default(100000),
  annualInterestRate: z.number().default(5),
  loanTermYears: z.number().default(30),
  paymentsPerYear: z.number().default(12),
});

function asFormulaNumber(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Interest_only_loan_calculatorInput): Record<string, number | string> {
  const results: Record<string, number | string> = {};
  try { const v = input.principal * (input.annualInterestRate / 100) / input.paymentsPerYear; results["periodicInterestPayment"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["periodicInterestPayment"] = 0; }
  try { const v = (asFormulaNumber(results["periodicInterestPayment"])) * input.loanTermYears * input.paymentsPerYear; results["totalInterest"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["totalInterest"] = 0; }
  try { const v = (asFormulaNumber(results["totalInterest"])); results["totalPayment"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["totalPayment"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

export function calculateInterest_only_loan_calculator(input: Interest_only_loan_calculatorInput): Interest_only_loan_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["periodicInterestPayment"]);
  const breakdown = {
    
  };
  const hiddenLossDrivers: string[] = [];
  const suggestedActions: string[] = ["Review inputs and verify results against site standards."];
  const dataConfidenceAdjusted =
    typeof (input as unknown as Record<string, unknown>).dataConfidence === "number"
      ? totalWasteCost * (((input as unknown as Record<string, unknown>).dataConfidence as number) / 100)
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


export interface Interest_only_loan_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
