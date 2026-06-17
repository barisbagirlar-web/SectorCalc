// @ts-nocheck
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

function asFormulaNumber(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Portion_cost_calculatorInput): Record<string, number | string> {
  const results: Record<string, number | string> = {};
  try { const v = input.recipe_cost + input.labor_cost + input.other_costs; results["result"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["result"] = 0; }
  try { const v = input.recipe_cost + input.labor_cost + input.other_costs; results["result_copy"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["result_copy"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

export function calculatePortion_cost_calculator(input: Portion_cost_calculatorInput): Portion_cost_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["result"]);
  const breakdown = {
    
  };
  const hiddenLossDrivers: string[] = [];
  const suggestedActions: string[] = ["Review inputs and verify results against site standards."];
  const dataConfidenceAdjusted =
    typeof (input as unknown as Record<string, unknown>).dataConfidence === "number"
      ? totalWasteCost * (((input as unknown as Record<string, unknown>).dataConfidence as number) / 100)
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
