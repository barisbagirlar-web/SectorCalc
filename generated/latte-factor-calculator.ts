// Auto-generated from latte-factor-calculator-schema.json
import * as z from 'zod';

export interface Latte_factor_calculatorInput {
  dailyExpense: number;
  daysPerWeek: number;
  years: number;
  annualReturnRate: number;
}

export const Latte_factor_calculatorInputSchema = z.object({
  dailyExpense: z.number().default(5),
  daysPerWeek: z.number().default(5),
  years: z.number().default(10),
  annualReturnRate: z.number().default(7),
});

function evaluateAllFormulas(input: Latte_factor_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.dailyExpense * input.daysPerWeek * 52; results["annualContribution"] = Number.isFinite(v) ? v : 0; } catch { results["annualContribution"] = 0; }
  try { const v = (results["annualContribution"] ?? 0) * input.years; results["totalContributions"] = Number.isFinite(v) ? v : 0; } catch { results["totalContributions"] = 0; }
  try { const v = (results["annualContribution"] ?? 0) * ((1 + (input.annualReturnRate/100))**input.years - 1) / (input.annualReturnRate/100); results["futureValue"] = Number.isFinite(v) ? v : 0; } catch { results["futureValue"] = 0; }
  try { const v = (results["futureValue"] ?? 0) - (results["totalContributions"] ?? 0); results["interestEarned"] = Number.isFinite(v) ? v : 0; } catch { results["interestEarned"] = 0; }
  return results;
}


export function calculateLatte_factor_calculator(input: Latte_factor_calculatorInput): Latte_factor_calculatorOutput {
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


export interface Latte_factor_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
