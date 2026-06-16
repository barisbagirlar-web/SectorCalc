// Auto-generated from short-term-savings-schema.json
import * as z from 'zod';

export interface Short_term_savingsInput {
  initialDeposit: number;
  monthlyContribution: number;
  annualInterestRate: number;
  months: number;
}

export const Short_term_savingsInputSchema = z.object({
  initialDeposit: z.number().default(0),
  monthlyContribution: z.number().default(100),
  annualInterestRate: z.number().default(2.5),
  months: z.number().default(12),
});

function evaluateAllFormulas(input: Short_term_savingsInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.initialDeposit * (1 + input.annualInterestRate/100/12)**input.months + input.monthlyContribution * (((1 + input.annualInterestRate/100/12)**input.months - 1) / (input.annualInterestRate/100/12)); results["futureValue"] = Number.isFinite(v) ? v : 0; } catch { results["futureValue"] = 0; }
  try { const v = input.initialDeposit + input.monthlyContribution * input.months; results["totalDeposits"] = Number.isFinite(v) ? v : 0; } catch { results["totalDeposits"] = 0; }
  try { const v = (input.initialDeposit * (1 + input.annualInterestRate/100/12)**input.months + input.monthlyContribution * (((1 + input.annualInterestRate/100/12)**input.months - 1) / (input.annualInterestRate/100/12))) - (input.initialDeposit + input.monthlyContribution * input.months); results["interestEarned"] = Number.isFinite(v) ? v : 0; } catch { results["interestEarned"] = 0; }
  return results;
}


export function calculateShort_term_savings(input: Short_term_savingsInput): Short_term_savingsOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["futureValue"] ?? 0;
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


export interface Short_term_savingsOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
