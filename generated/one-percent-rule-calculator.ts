// Auto-generated from one-percent-rule-calculator-schema.json
import * as z from 'zod';

export interface One_percent_rule_calculatorInput {
  purchasePrice: number;
  renovationCost: number;
  closingCosts: number;
  monthlyRent: number;
  dataConfidence?: number;
}

export const One_percent_rule_calculatorInputSchema = z.object({
  purchasePrice: z.number().default(100000),
  renovationCost: z.number().default(20000),
  closingCosts: z.number().default(5000),
  monthlyRent: z.number().default(1200),
});

function asFormulaNumber(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: One_percent_rule_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.purchasePrice + input.renovationCost + input.closingCosts; results["totalInvestment"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["totalInvestment"] = 0; }
  try { const v = (asFormulaNumber(results["totalInvestment"])) * 0.01; results["onePercent"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["onePercent"] = 0; }
  try { const v = input.monthlyRent - (asFormulaNumber(results["onePercent"])); results["gap"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["gap"] = 0; }
  try { const v = (asFormulaNumber(results["gap"])) >= 0 ? 1 : 0; results["meetsRule"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["meetsRule"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

export function calculateOne_percent_rule_calculator(input: One_percent_rule_calculatorInput): One_percent_rule_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["gap"]);
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


export interface One_percent_rule_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
