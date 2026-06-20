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

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: _50_percent_rule_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.monthlyRent + input.otherMonthlyIncome; results["grossMonthlyIncome"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["grossMonthlyIncome"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["grossMonthlyIncome"])) * (1 - input.vacancyRate / 100); results["effectiveGrossIncome"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["effectiveGrossIncome"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["effectiveGrossIncome"])) * (input.expensePercentage / 100); results["monthlyOperatingExpenses"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["monthlyOperatingExpenses"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["effectiveGrossIncome"])) - (toNumericFormulaValue(results["monthlyOperatingExpenses"])); results["monthlyNetOperatingIncome"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["monthlyNetOperatingIncome"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["monthlyNetOperatingIncome"])) * 12; results["annualNetOperatingIncome"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["annualNetOperatingIncome"] = Number.NaN; }
  return results;
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
