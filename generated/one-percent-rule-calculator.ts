// Auto-generated from one-percent-rule-calculator-schema.json
import * as z from 'zod';

export interface One_percent_rule_calculatorInput {
  purchasePrice: number;
  renovationCost: number;
  closingCosts: number;
  monthlyRent: number;
}

export const One_percent_rule_calculatorInputSchema = z.object({
  purchasePrice: z.number().default(100000),
  renovationCost: z.number().default(20000),
  closingCosts: z.number().default(5000),
  monthlyRent: z.number().default(1200),
});

function evaluateAllFormulas(input: One_percent_rule_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.purchasePrice + input.renovationCost + input.closingCosts; results["totalInvestment"] = Number.isFinite(v) ? v : 0; } catch { results["totalInvestment"] = 0; }
  try { const v = (results["totalInvestment"] ?? 0) * 0.01; results["onePercent"] = Number.isFinite(v) ? v : 0; } catch { results["onePercent"] = 0; }
  try { const v = input.monthlyRent - (results["onePercent"] ?? 0); results["gap"] = Number.isFinite(v) ? v : 0; } catch { results["gap"] = 0; }
  try { const v = (results["gap"] ?? 0) >= 0 ? 1 : 0; results["meetsRule"] = Number.isFinite(v) ? v : 0; } catch { results["meetsRule"] = 0; }
  return results;
}


export function calculateOne_percent_rule_calculator(input: One_percent_rule_calculatorInput): One_percent_rule_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["gap"] ?? 0;
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


export interface One_percent_rule_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
