// Auto-generated from mr-money-mustache-calculator-schema.json
import * as z from 'zod';

export interface Mr_money_mustache_calculatorInput {
  annualIncome: number;
  annualExpenses: number;
  currentPortfolio: number;
  expectedReturn: number;
  safeWithdrawalRate: number;
}

export const Mr_money_mustache_calculatorInputSchema = z.object({
  annualIncome: z.number().default(100000),
  annualExpenses: z.number().default(40000),
  currentPortfolio: z.number().default(0),
  expectedReturn: z.number().default(7),
  safeWithdrawalRate: z.number().default(4),
});

function evaluateAllFormulas(input: Mr_money_mustache_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.annualIncome - input.annualExpenses; results["annualSavings"] = Number.isFinite(v) ? v : 0; } catch { results["annualSavings"] = 0; }
  try { const v = (input.annualIncome - input.annualExpenses) / input.annualIncome; results["savingsRate"] = Number.isFinite(v) ? v : 0; } catch { results["savingsRate"] = 0; }
  try { const v = input.annualExpenses / (input.safeWithdrawalRate / 100); results["futurePortfolioNeeded"] = Number.isFinite(v) ? v : 0; } catch { results["futurePortfolioNeeded"] = 0; }
  try { const v = Math.log(((results["futurePortfolioNeeded"] ?? 0) * (input.expectedReturn / 100) + (results["annualSavings"] ?? 0)) / (input.currentPortfolio * (input.expectedReturn / 100) + (results["annualSavings"] ?? 0))) / Math.log(1 + input.expectedReturn / 100); results["yearsToFI"] = Number.isFinite(v) ? v : 0; } catch { results["yearsToFI"] = 0; }
  return results;
}


export function calculateMr_money_mustache_calculator(input: Mr_money_mustache_calculatorInput): Mr_money_mustache_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["yearsToFI"] ?? 0;
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


export interface Mr_money_mustache_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
