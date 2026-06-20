// Auto-generated from 4-percent-rule-calculator-schema.json
import * as z from 'zod';

export interface _4_percent_rule_calculatorInput {
  desiredAnnualIncome: number;
  otherAnnualIncome: number;
  withdrawalRate: number;
  currentSavings: number;
  dataConfidence?: number;
}

export const _4_percent_rule_calculatorInputSchema = z.object({
  desiredAnnualIncome: z.number().default(80000),
  otherAnnualIncome: z.number().default(20000),
  withdrawalRate: z.number().default(4),
  currentSavings: z.number().default(0),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: _4_percent_rule_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.desiredAnnualIncome - input.otherAnnualIncome; results["netAnnualIncome"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["netAnnualIncome"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["netAnnualIncome"])) / (input.withdrawalRate / 100); results["requiredSavings"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["requiredSavings"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["netAnnualIncome"])) / 12; results["monthlyIncome"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["monthlyIncome"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["requiredSavings"])) - input.currentSavings; results["savingsGap"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["savingsGap"] = Number.NaN; }
  return results;
}


export function calculate_4_percent_rule_calculator(input: _4_percent_rule_calculatorInput): _4_percent_rule_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["requiredSavings"]);
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


export interface _4_percent_rule_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
