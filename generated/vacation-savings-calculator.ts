// @ts-nocheck
// Auto-generated from vacation-savings-calculator-schema.json
import * as z from 'zod';

export interface Vacation_savings_calculatorInput {
  targetAmount: number;
  currentSavings: number;
  monthlyContribution: number;
  annualInterestRate: number;
  monthsUntilVacation: number;
}

export const Vacation_savings_calculatorInputSchema = z.object({
  targetAmount: z.number().default(5000),
  currentSavings: z.number().default(1000),
  monthlyContribution: z.number().default(500),
  annualInterestRate: z.number().default(2),
  monthsUntilVacation: z.number().default(12),
});

function asFormulaNumber(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Vacation_savings_calculatorInput): Record<string, number | string> {
  const results: Record<string, number | string> = {};
  try { const v = input.currentSavings * (1 + (input.annualInterestRate/100/12 + 1e-10)) ** input.monthsUntilVacation + input.monthlyContribution * (((1 + (input.annualInterestRate/100/12 + 1e-10)) ** input.monthsUntilVacation - 1) / (input.annualInterestRate/100/12 + 1e-10)); results["totalSavings"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["totalSavings"] = 0; }
  try { const v = input.monthlyContribution * input.monthsUntilVacation; results["totalContributions"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["totalContributions"] = 0; }
  try { const v = (asFormulaNumber(results["totalSavings"])) - input.currentSavings - (asFormulaNumber(results["totalContributions"])); results["interestEarned"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["interestEarned"] = 0; }
  try { const v = (asFormulaNumber(results["totalSavings"])) - input.targetAmount; results["surplusShortfall"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["surplusShortfall"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

export function calculateVacation_savings_calculator(input: Vacation_savings_calculatorInput): Vacation_savings_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["surplusShortfall"]);
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


export interface Vacation_savings_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
