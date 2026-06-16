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

function evaluateAllFormulas(input: Debt_to_income_ratio_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.mortgageMonth + input.creditCardMonth + input.autoLoanMonth + input.studentLoanMonth + input.otherDebtMonth; results["totalDebt"] = Number.isFinite(v) ? v : 0; } catch { results["totalDebt"] = 0; }
  try { const v = ((results["totalDebt"] ?? 0) / input.grossMonthlyIncome) * 100; results["debtToIncomeRatio"] = Number.isFinite(v) ? v : 0; } catch { results["debtToIncomeRatio"] = 0; }
  return results;
}


export function calculateDebt_to_income_ratio_calculator(input: Debt_to_income_ratio_calculatorInput): Debt_to_income_ratio_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["debtToIncomeRatio"] ?? 0;
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


export interface Debt_to_income_ratio_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
