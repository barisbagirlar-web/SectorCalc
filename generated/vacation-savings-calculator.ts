// Auto-generated from vacation-savings-calculator-schema.json
import * as z from 'zod';

export interface Vacation_savings_calculatorInput {
  targetAmount: number;
  currentSavings: number;
  monthlyContribution: number;
  annualInterestRate: number;
  monthsUntilVacation: number;
  dataConfidence?: number;
}

export const Vacation_savings_calculatorInputSchema = z.object({
  targetAmount: z.number().default(5000),
  currentSavings: z.number().default(1000),
  monthlyContribution: z.number().default(500),
  annualInterestRate: z.number().default(2),
  monthsUntilVacation: z.number().default(12),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Vacation_savings_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.currentSavings * (1 + (input.annualInterestRate/100/12 + 1e-10)) ** input.monthsUntilVacation + input.monthlyContribution * (((1 + (input.annualInterestRate/100/12 + 1e-10)) ** input.monthsUntilVacation - 1) / (input.annualInterestRate/100/12 + 1e-10)); results["totalSavings"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["totalSavings"] = Number.NaN; }
  try { const v = input.monthlyContribution * input.monthsUntilVacation; results["totalContributions"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["totalContributions"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["totalSavings"])) - input.currentSavings - (toNumericFormulaValue(results["totalContributions"])); results["interestEarned"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["interestEarned"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["totalSavings"])) - input.targetAmount; results["surplusShortfall"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["surplusShortfall"] = Number.NaN; }
  return results;
}


export function calculateVacation_savings_calculator(input: Vacation_savings_calculatorInput): Vacation_savings_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["surplusShortfall"]);
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


export interface Vacation_savings_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
