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

function evaluateAllFormulas(input: Student_loan_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.annualInterestRate / 100 / 12; results["monthlyRate"] = Number.isFinite(v) ? v : 0; } catch { results["monthlyRate"] = 0; }
  try { const v = input.loanAmount * (1 + (results["monthlyRate"] ?? 0)) ** input.defermentMonths; results["effectivePrincipal"] = Number.isFinite(v) ? v : 0; } catch { results["effectivePrincipal"] = 0; }
  try { const v = input.loanTermYears * 12; results["n"] = Number.isFinite(v) ? v : 0; } catch { results["n"] = 0; }
  try { const v = (results["effectivePrincipal"] ?? 0) * (results["monthlyRate"] ?? 0) * (1 + (results["monthlyRate"] ?? 0)) ** (results["n"] ?? 0) / ((1 + (results["monthlyRate"] ?? 0)) ** (results["n"] ?? 0) - 1); results["monthlyPayment"] = Number.isFinite(v) ? v : 0; } catch { results["monthlyPayment"] = 0; }
  try { const v = (results["monthlyPayment"] ?? 0) * (results["n"] ?? 0); results["totalPayment"] = Number.isFinite(v) ? v : 0; } catch { results["totalPayment"] = 0; }
  try { const v = (results["totalPayment"] ?? 0) - (results["effectivePrincipal"] ?? 0); results["totalInterest"] = Number.isFinite(v) ? v : 0; } catch { results["totalInterest"] = 0; }
  return results;
}


export function calculateStudent_loan_calculator(input: Student_loan_calculatorInput): Student_loan_calculatorOutput {
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


export interface Student_loan_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
