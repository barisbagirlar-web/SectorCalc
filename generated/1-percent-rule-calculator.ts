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

function asFormulaNumber(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: _1_percent_rule_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.purchasePrice + input.closingCosts + input.repairCosts; results["totalInvestment"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["totalInvestment"] = 0; }
  try { const v = input.monthlyRent - input.monthlyExpenses; results["monthlyNetIncome"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["monthlyNetIncome"] = 0; }
  try { const v = (asFormulaNumber(results["totalInvestment"])) * 0.01; results["onePercentThreshold"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["onePercentThreshold"] = 0; }
  try { const v = input.monthlyRent >= (asFormulaNumber(results["onePercentThreshold"])) ? 1 : 0; results["meetsRule"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["meetsRule"] = 0; }
  try { const v = ((asFormulaNumber(results["monthlyNetIncome"])) * 12 / (asFormulaNumber(results["totalInvestment"]))) * 100; results["annualReturn"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["annualReturn"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

export function calculate_1_percent_rule_calculator(input: _1_percent_rule_calculatorInput): _1_percent_rule_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = Math.max(0, toNumericFormulaValue(values["annualReturn"]));
  const breakdown = {
    
  };
  const hiddenLossDrivers: string[] = [];
  const suggestedActions: string[] = ["Review inputs and verify results against site standards."];
  const dataConfidenceAdjusted =
    typeof input.dataConfidence === "number"
      ? Math.max(0, totalWasteCost * (input.dataConfidence / 100))
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
