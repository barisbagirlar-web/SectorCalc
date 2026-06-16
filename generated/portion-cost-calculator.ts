// Auto-generated from portion-cost-calculator-schema.json
import * as z from 'zod';

export interface Portion_cost_calculatorInput {
  recipe_cost: number;
  labor_cost: number;
  other_costs: number;
  number_of_portions: number;
  desired_margin_percent: number;
}

export const Portion_cost_calculatorInputSchema = z.object({
  recipe_cost: z.number().default(0),
  labor_cost: z.number().default(0),
  other_costs: z.number().default(0),
  number_of_portions: z.number().default(1),
  desired_margin_percent: z.number().default(0),
});

function evaluateAllFormulas(input: Portion_cost_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = recipeCost + laborCost + otherCosts; results["totalBatchCost"] = Number.isFinite(v) ? v : 0; } catch { results["totalBatchCost"] = 0; }
  try { const v = (results["totalBatchCost"] ?? 0) / numberOfPortions; results["portionCost"] = Number.isFinite(v) ? v : 0; } catch { results["portionCost"] = 0; }
  try { const v = (results["portionCost"] ?? 0) / (1 - desiredMarginPercent / 100); results["sellingPrice"] = Number.isFinite(v) ? v : 0; } catch { results["sellingPrice"] = 0; }
  return results;
}


export function calculatePortion_cost_calculator(input: Portion_cost_calculatorInput): Portion_cost_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["portionCost"] ?? 0;
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


export interface Portion_cost_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
