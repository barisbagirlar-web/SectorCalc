// @ts-nocheck
// Auto-generated from student-loan-calculator-schema.json
import * as z from 'zod';

export interface Student_loan_calculatorInput {
  loanAmount: number;
  annualInterestRate: number;
  loanTermYears: number;
  defermentMonths: number;
}

export const Student_loan_calculatorInputSchema = z.object({
  loanAmount: z.number().default(20000),
  annualInterestRate: z.number().default(4.5),
  loanTermYears: z.number().default(10),
  defermentMonths: z.number().default(6),
});

function asFormulaNumber(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Student_loan_calculatorInput): Record<string, number | string> {
  const results: Record<string, number | string> = {};
  try { const v = input.annualInterestRate / 100 / 12; results["monthlyRate"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["monthlyRate"] = 0; }
  try { const v = input.loanAmount * (1 + (asFormulaNumber(results["monthlyRate"]))) ** input.defermentMonths; results["effectivePrincipal"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["effectivePrincipal"] = 0; }
  try { const v = input.loanTermYears * 12; results["n"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["n"] = 0; }
  try { const v = (asFormulaNumber(results["effectivePrincipal"])) * (asFormulaNumber(results["monthlyRate"])) * (1 + (asFormulaNumber(results["monthlyRate"]))) ** (asFormulaNumber(results["n"])) / ((1 + (asFormulaNumber(results["monthlyRate"]))) ** (asFormulaNumber(results["n"])) - 1); results["monthlyPayment"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["monthlyPayment"] = 0; }
  try { const v = (asFormulaNumber(results["monthlyPayment"])) * (asFormulaNumber(results["n"])); results["totalPayment"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["totalPayment"] = 0; }
  try { const v = (asFormulaNumber(results["totalPayment"])) - (asFormulaNumber(results["effectivePrincipal"])); results["totalInterest"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["totalInterest"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

export function calculateStudent_loan_calculator(input: Student_loan_calculatorInput): Student_loan_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["monthlyPayment"]);
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


export interface Student_loan_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
