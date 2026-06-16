// Auto-generated from 50-percent-rule-calculator-schema.json
import * as z from 'zod';

export interface _50_percent_rule_calculatorInput {
  monthlyRent: number;
  otherMonthlyIncome: number;
  expensePercentage: number;
  vacancyRate: number;
}

export const _50_percent_rule_calculatorInputSchema = z.object({
  monthlyRent: z.number().default(0),
  otherMonthlyIncome: z.number().default(0),
  expensePercentage: z.number().default(50),
  vacancyRate: z.number().default(5),
});

function evaluateAllFormulas(input: _50_percent_rule_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.monthlyRent + input.otherMonthlyIncome; results["grossMonthlyIncome"] = Number.isFinite(v) ? v : 0; } catch { results["grossMonthlyIncome"] = 0; }
  try { const v = (results["grossMonthlyIncome"] ?? 0) * (1 - input.vacancyRate / 100); results["effectiveGrossIncome"] = Number.isFinite(v) ? v : 0; } catch { results["effectiveGrossIncome"] = 0; }
  try { const v = (results["effectiveGrossIncome"] ?? 0) * (input.expensePercentage / 100); results["monthlyOperatingExpenses"] = Number.isFinite(v) ? v : 0; } catch { results["monthlyOperatingExpenses"] = 0; }
  try { const v = (results["effectiveGrossIncome"] ?? 0) - (results["monthlyOperatingExpenses"] ?? 0); results["monthlyNetOperatingIncome"] = Number.isFinite(v) ? v : 0; } catch { results["monthlyNetOperatingIncome"] = 0; }
  try { const v = (results["monthlyNetOperatingIncome"] ?? 0) * 12; results["annualNetOperatingIncome"] = Number.isFinite(v) ? v : 0; } catch { results["annualNetOperatingIncome"] = 0; }
  return results;
}


export function calculate_50_percent_rule_calculator(input: _50_percent_rule_calculatorInput): _50_percent_rule_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["annualNetOperatingIncome"] ?? 0;
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


export interface _50_percent_rule_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
