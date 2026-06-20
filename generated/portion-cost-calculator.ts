// Auto-generated from portion-cost-calculator-schema.json
import * as z from 'zod';

export interface Portion_cost_calculatorInput {
  recipe_cost: number;
  labor_cost: number;
  other_costs: number;
  number_of_portions: number;
  desired_margin_percent: number;
  dataConfidence?: number;
}

export const Portion_cost_calculatorInputSchema = z.object({
  recipe_cost: z.number().default(0),
  labor_cost: z.number().default(0),
  other_costs: z.number().default(0),
  number_of_portions: z.number().default(1),
  desired_margin_percent: z.number().default(0),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Portion_cost_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.number_of_portions * input.recipe_cost; results["base_cost"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["base_cost"] = Number.NaN; }
  try { const v = input.number_of_portions * input.recipe_cost * (1 + (input.desired_margin_percent / 100)); results["adjusted_cost"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["adjusted_cost"] = Number.NaN; }
  try { const v = input.number_of_portions * input.recipe_cost * (1 + (input.desired_margin_percent / 100)); results["result"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["result"] = Number.NaN; }
  return results;
}


export function calculatePortion_cost_calculator(input: Portion_cost_calculatorInput): Portion_cost_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["result"]);
  const breakdown = {
    
  };
  const hiddenLossDrivers: string[] = ["Scrap and rework not in unit price","Volume discount not applied"];
  const suggestedActions: string[] = ["Reconcile unit cost with last PO","Stress-test with +10% waste"];
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


export interface Portion_cost_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
