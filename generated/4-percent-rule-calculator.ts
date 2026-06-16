// Auto-generated from 4-percent-rule-calculator-schema.json
import * as z from 'zod';

export interface _4_percent_rule_calculatorInput {
  desiredAnnualIncome: number;
  otherAnnualIncome: number;
  withdrawalRate: number;
  currentSavings: number;
}

export const _4_percent_rule_calculatorInputSchema = z.object({
  desiredAnnualIncome: z.number().default(80000),
  otherAnnualIncome: z.number().default(20000),
  withdrawalRate: z.number().default(4),
  currentSavings: z.number().default(0),
});

function evaluateAllFormulas(input: _4_percent_rule_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.desiredAnnualIncome - input.otherAnnualIncome; results["netAnnualIncome"] = Number.isFinite(v) ? v : 0; } catch { results["netAnnualIncome"] = 0; }
  try { const v = (results["netAnnualIncome"] ?? 0) / (input.withdrawalRate / 100); results["requiredSavings"] = Number.isFinite(v) ? v : 0; } catch { results["requiredSavings"] = 0; }
  try { const v = (results["netAnnualIncome"] ?? 0) / 12; results["monthlyIncome"] = Number.isFinite(v) ? v : 0; } catch { results["monthlyIncome"] = 0; }
  try { const v = (results["requiredSavings"] ?? 0) - input.currentSavings; results["savingsGap"] = Number.isFinite(v) ? v : 0; } catch { results["savingsGap"] = 0; }
  return results;
}


export function calculate_4_percent_rule_calculator(input: _4_percent_rule_calculatorInput): _4_percent_rule_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["requiredSavings"] ?? 0;
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


export interface _4_percent_rule_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
