// Auto-generated from 1-percent-rule-calculator-schema.json
import * as z from 'zod';

export interface _1_percent_rule_calculatorInput {
  purchasePrice: number;
  monthlyRent: number;
  closingCosts: number;
  repairCosts: number;
  monthlyExpenses: number;
  dataConfidence?: number;
}

export const _1_percent_rule_calculatorInputSchema = z.object({
  purchasePrice: z.number().default(200000),
  monthlyRent: z.number().default(2000),
  closingCosts: z.number().default(5000),
  repairCosts: z.number().default(10000),
  monthlyExpenses: z.number().default(500),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: _1_percent_rule_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.purchasePrice + input.closingCosts + input.repairCosts; results["totalInvestment"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["totalInvestment"] = Number.NaN; }
  try { const v = input.monthlyRent - input.monthlyExpenses; results["monthlyNetIncome"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["monthlyNetIncome"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["totalInvestment"])) * 0.01; results["onePercentThreshold"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["onePercentThreshold"] = Number.NaN; }
  try { const v = input.monthlyRent >= (toNumericFormulaValue(results["onePercentThreshold"])) ? 1 : 0; results["meetsRule"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["meetsRule"] = Number.NaN; }
  try { const v = ((toNumericFormulaValue(results["monthlyNetIncome"])) * 12 / (toNumericFormulaValue(results["totalInvestment"]))) * 100; results["annualReturn"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["annualReturn"] = Number.NaN; }
  return results;
}


export function calculate_1_percent_rule_calculator(input: _1_percent_rule_calculatorInput): _1_percent_rule_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["annualReturn"]);
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


export interface _1_percent_rule_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
