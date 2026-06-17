// Auto-generated from 1-percent-rule-calculator-schema.json
import * as z from 'zod';

export interface _1_percent_rule_calculatorInput {
  purchasePrice: number;
  monthlyRent: number;
  closingCosts: number;
  repairCosts: number;
  monthlyExpenses: number;
}

export const _1_percent_rule_calculatorInputSchema = z.object({
  purchasePrice: z.number().default(200000),
  monthlyRent: z.number().default(2000),
  closingCosts: z.number().default(5000),
  repairCosts: z.number().default(10000),
  monthlyExpenses: z.number().default(500),
});

function evaluateAllFormulas(input: _1_percent_rule_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.purchasePrice + input.closingCosts + input.repairCosts; results["totalInvestment"] = Number.isFinite(v) ? v : 0; } catch { results["totalInvestment"] = 0; }
  try { const v = input.monthlyRent - input.monthlyExpenses; results["monthlyNetIncome"] = Number.isFinite(v) ? v : 0; } catch { results["monthlyNetIncome"] = 0; }
  try { const v = (results["totalInvestment"] ?? 0) * 0.01; results["onePercentThreshold"] = Number.isFinite(v) ? v : 0; } catch { results["onePercentThreshold"] = 0; }
  try { const v = input.monthlyRent >= (results["onePercentThreshold"] ?? 0) ? 1 : 0; results["meetsRule"] = Number.isFinite(v) ? v : 0; } catch { results["meetsRule"] = 0; }
  try { const v = ((results["monthlyNetIncome"] ?? 0) * 12 / (results["totalInvestment"] ?? 0)) * 100; results["annualReturn"] = Number.isFinite(v) ? v : 0; } catch { results["annualReturn"] = 0; }
  try { const v = input.monthlyRent >= (results["onePercentThreshold"] ?? 0) ? 'Passes 1% Rule' : 'Fails 1% Rule'; results["result"] = Number.isFinite(v) ? v : 0; } catch { results["result"] = 0; }
  return results;
}


export function calculate_1_percent_rule_calculator(input: _1_percent_rule_calculatorInput): _1_percent_rule_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["result"] ?? 0;
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


export interface _1_percent_rule_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
