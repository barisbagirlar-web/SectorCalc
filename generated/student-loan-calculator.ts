// Auto-generated from student-loan-calculator-schema.json
import * as z from 'zod';

export interface Student_loan_calculatorInput {
  loanAmount: number;
  annualInterestRate: number;
  loanTermYears: number;
  defermentMonths: number;
  dataConfidence?: number;
}

export const Student_loan_calculatorInputSchema = z.object({
  loanAmount: z.number().default(20000),
  annualInterestRate: z.number().default(4.5),
  loanTermYears: z.number().default(10),
  defermentMonths: z.number().default(6),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Student_loan_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.annualInterestRate / 100 / 12; results["monthlyRate"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["monthlyRate"] = Number.NaN; }
  try { const v = input.loanAmount * (1 + (toNumericFormulaValue(results["monthlyRate"]))) ** input.defermentMonths; results["effectivePrincipal"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["effectivePrincipal"] = Number.NaN; }
  try { const v = input.loanTermYears * 12; results["n"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["n"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["effectivePrincipal"])) * (toNumericFormulaValue(results["monthlyRate"])) * (1 + (toNumericFormulaValue(results["monthlyRate"]))) ** (toNumericFormulaValue(results["n"])) / ((1 + (toNumericFormulaValue(results["monthlyRate"]))) ** (toNumericFormulaValue(results["n"])) - 1); results["monthlyPayment"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["monthlyPayment"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["monthlyPayment"])) * (toNumericFormulaValue(results["n"])); results["totalPayment"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["totalPayment"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["totalPayment"])) - (toNumericFormulaValue(results["effectivePrincipal"])); results["totalInterest"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["totalInterest"] = Number.NaN; }
  return results;
}


export function calculateStudent_loan_calculator(input: Student_loan_calculatorInput): Student_loan_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["monthlyPayment"]);
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


export interface Student_loan_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
