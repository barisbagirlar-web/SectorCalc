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

function evaluateAllFormulas(input: Vacation_savings_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.currentSavings * (1 + (input.annualInterestRate/100/12 + 1e-10)) ** input.monthsUntilVacation + input.monthlyContribution * (((1 + (input.annualInterestRate/100/12 + 1e-10)) ** input.monthsUntilVacation - 1) / (input.annualInterestRate/100/12 + 1e-10)); results["totalSavings"] = Number.isFinite(v) ? v : 0; } catch { results["totalSavings"] = 0; }
  try { const v = input.monthlyContribution * input.monthsUntilVacation; results["totalContributions"] = Number.isFinite(v) ? v : 0; } catch { results["totalContributions"] = 0; }
  try { const v = (results["totalSavings"] ?? 0) - input.currentSavings - (results["totalContributions"] ?? 0); results["interestEarned"] = Number.isFinite(v) ? v : 0; } catch { results["interestEarned"] = 0; }
  try { const v = (results["totalSavings"] ?? 0) - input.targetAmount; results["surplusShortfall"] = Number.isFinite(v) ? v : 0; } catch { results["surplusShortfall"] = 0; }
  return results;
}


export function calculateVacation_savings_calculator(input: Vacation_savings_calculatorInput): Vacation_savings_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["surplusShortfall"] ?? 0;
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


export interface Vacation_savings_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
