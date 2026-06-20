// Auto-generated from loan-comparison-calculator-schema.json
import * as z from 'zod';

export interface Loan_comparison_calculatorInput {
  loan1Amount: number;
  loan1Rate: number;
  loan1Term: number;
  loan2Amount: number;
  loan2Rate: number;
  loan2Term: number;
  dataConfidence?: number;
}

export const Loan_comparison_calculatorInputSchema = z.object({
  loan1Amount: z.number().default(10000),
  loan1Rate: z.number().default(5),
  loan1Term: z.number().default(5),
  loan2Amount: z.number().default(12000),
  loan2Rate: z.number().default(4.5),
  loan2Term: z.number().default(5),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Loan_comparison_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.loan1Amount * (input.loan1Rate/100/12) * (1 + input.loan1Rate/100/12) ** (input.loan1Term * 12) / ((1 + input.loan1Rate/100/12) ** (input.loan1Term * 12) - 1); results["monthlyPayment1"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["monthlyPayment1"] = Number.NaN; }
  try { const v = input.loan2Amount * (input.loan2Rate/100/12) * (1 + input.loan2Rate/100/12) ** (input.loan2Term * 12) / ((1 + input.loan2Rate/100/12) ** (input.loan2Term * 12) - 1); results["monthlyPayment2"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["monthlyPayment2"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["monthlyPayment1"])) * input.loan1Term * 12; results["totalPayment1"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["totalPayment1"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["monthlyPayment2"])) * input.loan2Term * 12; results["totalPayment2"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["totalPayment2"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["totalPayment1"])) - input.loan1Amount; results["totalInterest1"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["totalInterest1"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["totalPayment2"])) - input.loan2Amount; results["totalInterest2"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["totalInterest2"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["totalPayment1"])) - (toNumericFormulaValue(results["totalPayment2"])); results["totalCostDifference"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["totalCostDifference"] = Number.NaN; }
  return results;
}


export function calculateLoan_comparison_calculator(input: Loan_comparison_calculatorInput): Loan_comparison_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["totalCostDifference"]);
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


export interface Loan_comparison_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
