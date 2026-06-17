// @ts-nocheck
// Auto-generated from debt-to-income-ratio-calculator-schema.json
import * as z from 'zod';

export interface Debt_to_income_ratio_calculatorInput {
  mortgageMonth: number;
  creditCardMonth: number;
  autoLoanMonth: number;
  studentLoanMonth: number;
  otherDebtMonth: number;
  grossMonthlyIncome: number;
}

export const Debt_to_income_ratio_calculatorInputSchema = z.object({
  mortgageMonth: z.number().default(0),
  creditCardMonth: z.number().default(0),
  autoLoanMonth: z.number().default(0),
  studentLoanMonth: z.number().default(0),
  otherDebtMonth: z.number().default(0),
  grossMonthlyIncome: z.number().default(1),
});

function asFormulaNumber(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Debt_to_income_ratio_calculatorInput): Record<string, number | string> {
  const results: Record<string, number | string> = {};
  try { const v = input.mortgageMonth + input.creditCardMonth + input.autoLoanMonth + input.studentLoanMonth + input.otherDebtMonth; results["totalDebt"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["totalDebt"] = 0; }
  try { const v = ((asFormulaNumber(results["totalDebt"])) / input.grossMonthlyIncome) * 100; results["debtToIncomeRatio"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["debtToIncomeRatio"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

export function calculateDebt_to_income_ratio_calculator(input: Debt_to_income_ratio_calculatorInput): Debt_to_income_ratio_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["debtToIncomeRatio"]);
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


export interface Debt_to_income_ratio_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
