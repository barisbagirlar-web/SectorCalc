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

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: One_percent_rule_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.purchasePrice + input.renovationCost + input.closingCosts; results["totalInvestment"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["totalInvestment"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["totalInvestment"])) * 0.01; results["onePercent"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["onePercent"] = Number.NaN; }
  try { const v = input.monthlyRent - (toNumericFormulaValue(results["onePercent"])); results["gap"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["gap"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["gap"])) >= 0 ? 1 : 0; results["meetsRule"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["meetsRule"] = Number.NaN; }
  return results;
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
