// Auto-generated from 50-percent-rule-calculator-schema.json
import * as z from 'zod';

export interface _50_percent_rule_calculatorInput {
  monthlyRent: number;
  otherMonthlyIncome: number;
  expensePercentage: number;
  vacancyRate: number;
  dataConfidence?: number;
}

export const _50_percent_rule_calculatorInputSchema = z.object({
  monthlyRent: z.number().default(0),
  otherMonthlyIncome: z.number().default(0),
  expensePercentage: z.number().default(50),
  vacancyRate: z.number().default(5),
});

function asFormulaNumber(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: _50_percent_rule_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.monthlyRent + input.otherMonthlyIncome; results["grossMonthlyIncome"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["grossMonthlyIncome"] = 0; }
  try { const v = (asFormulaNumber(results["grossMonthlyIncome"])) * (1 - input.vacancyRate / 100); results["effectiveGrossIncome"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["effectiveGrossIncome"] = 0; }
  try { const v = (asFormulaNumber(results["effectiveGrossIncome"])) * (input.expensePercentage / 100); results["monthlyOperatingExpenses"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["monthlyOperatingExpenses"] = 0; }
  try { const v = (asFormulaNumber(results["effectiveGrossIncome"])) - (asFormulaNumber(results["monthlyOperatingExpenses"])); results["monthlyNetOperatingIncome"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["monthlyNetOperatingIncome"] = 0; }
  try { const v = (asFormulaNumber(results["monthlyNetOperatingIncome"])) * 12; results["annualNetOperatingIncome"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["annualNetOperatingIncome"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

export function calculate_50_percent_rule_calculator(input: _50_percent_rule_calculatorInput): _50_percent_rule_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["annualNetOperatingIncome"]);
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


export interface _50_percent_rule_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
