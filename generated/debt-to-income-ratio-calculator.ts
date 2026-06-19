// Auto-generated from debt-to-income-ratio-calculator-schema.json
import * as z from 'zod';

export interface Debt_to_income_ratio_calculatorInput {
  mortgageMonth: number;
  creditCardMonth: number;
  autoLoanMonth: number;
  studentLoanMonth: number;
  otherDebtMonth: number;
  grossMonthlyIncome: number;
  dataConfidence?: number;
}

export const Debt_to_income_ratio_calculatorInputSchema = z.object({
  mortgageMonth: z.number().default(0),
  creditCardMonth: z.number().default(0),
  autoLoanMonth: z.number().default(0),
  studentLoanMonth: z.number().default(0),
  otherDebtMonth: z.number().default(0),
  grossMonthlyIncome: z.number().default(1),
});

function asFormulaNumber(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Debt_to_income_ratio_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.mortgageMonth + input.creditCardMonth + input.autoLoanMonth + input.studentLoanMonth + input.otherDebtMonth; results["totalDebt"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["totalDebt"] = 0; }
  try { const v = ((asFormulaNumber(results["totalDebt"])) / input.grossMonthlyIncome) * 100; results["debtToIncomeRatio"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["debtToIncomeRatio"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

export function calculateDebt_to_income_ratio_calculator(input: Debt_to_income_ratio_calculatorInput): Debt_to_income_ratio_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["debtToIncomeRatio"]);
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


export interface Debt_to_income_ratio_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
