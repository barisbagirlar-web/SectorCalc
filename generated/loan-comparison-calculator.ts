// @ts-nocheck
// Auto-generated from loan-comparison-calculator-schema.json
import * as z from 'zod';

export interface Loan_comparison_calculatorInput {
  loan1Amount: number;
  loan1Rate: number;
  loan1Term: number;
  loan2Amount: number;
  loan2Rate: number;
  loan2Term: number;
}

export const Loan_comparison_calculatorInputSchema = z.object({
  loan1Amount: z.number().default(10000),
  loan1Rate: z.number().default(5),
  loan1Term: z.number().default(5),
  loan2Amount: z.number().default(12000),
  loan2Rate: z.number().default(4.5),
  loan2Term: z.number().default(5),
});

function asFormulaNumber(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Loan_comparison_calculatorInput): Record<string, number | string> {
  const results: Record<string, number | string> = {};
  try { const v = input.loan1Amount * (input.loan1Rate/100/12) * (1 + input.loan1Rate/100/12) ** (input.loan1Term * 12) / ((1 + input.loan1Rate/100/12) ** (input.loan1Term * 12) - 1); results["monthlyPayment1"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["monthlyPayment1"] = 0; }
  try { const v = input.loan2Amount * (input.loan2Rate/100/12) * (1 + input.loan2Rate/100/12) ** (input.loan2Term * 12) / ((1 + input.loan2Rate/100/12) ** (input.loan2Term * 12) - 1); results["monthlyPayment2"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["monthlyPayment2"] = 0; }
  try { const v = (asFormulaNumber(results["monthlyPayment1"])) * input.loan1Term * 12; results["totalPayment1"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["totalPayment1"] = 0; }
  try { const v = (asFormulaNumber(results["monthlyPayment2"])) * input.loan2Term * 12; results["totalPayment2"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["totalPayment2"] = 0; }
  try { const v = (asFormulaNumber(results["totalPayment1"])) - input.loan1Amount; results["totalInterest1"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["totalInterest1"] = 0; }
  try { const v = (asFormulaNumber(results["totalPayment2"])) - input.loan2Amount; results["totalInterest2"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["totalInterest2"] = 0; }
  try { const v = (asFormulaNumber(results["totalPayment1"])) - (asFormulaNumber(results["totalPayment2"])); results["totalCostDifference"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["totalCostDifference"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

export function calculateLoan_comparison_calculator(input: Loan_comparison_calculatorInput): Loan_comparison_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["totalCostDifference"]);
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


export interface Loan_comparison_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
