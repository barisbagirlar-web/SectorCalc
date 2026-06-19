// Auto-generated from halloween-calculator-schema.json
import * as z from 'zod';

export interface Halloween_calculatorInput {
  num_children: number;
  candy_per_child: number;
  cost_per_candy: number;
  decor_budget: number;
  pumpkin_count: number;
  pumpkin_cost: number;
  dataConfidence?: number;
}

export const Halloween_calculatorInputSchema = z.object({
  num_children: z.number().default(30),
  candy_per_child: z.number().default(5),
  cost_per_candy: z.number().default(0.5),
  decor_budget: z.number().default(50),
  pumpkin_count: z.number().default(3),
  pumpkin_cost: z.number().default(10),
});

function asFormulaNumber(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Halloween_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.num_children * input.candy_per_child; results["total_candy_needed"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["total_candy_needed"] = 0; }
  try { const v = (asFormulaNumber(results["total_candy_needed"])) * input.cost_per_candy; results["candy_cost"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["candy_cost"] = 0; }
  try { const v = input.pumpkin_count * input.pumpkin_cost; results["pumpkin_total_cost"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["pumpkin_total_cost"] = 0; }
  try { const v = (asFormulaNumber(results["candy_cost"])) + input.decor_budget + (asFormulaNumber(results["pumpkin_total_cost"])); results["total_cost"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["total_cost"] = 0; }
  try { const v = (asFormulaNumber(results["total_cost"])) / input.num_children; results["cost_per_child"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["cost_per_child"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

export function calculateHalloween_calculator(input: Halloween_calculatorInput): Halloween_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = Math.max(0, toNumericFormulaValue(values["total_cost"]));
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


export interface Halloween_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
