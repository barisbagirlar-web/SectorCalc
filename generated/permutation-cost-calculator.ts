// Auto-generated from permutation-cost-calculator-schema.json
import * as z from 'zod';

export interface Permutation_cost_calculatorInput {
  totalItems: number;
  itemsToArrange: number;
  costPerPermutation: number;
  setupCost: number;
  discountPercent: number;
  dataConfidence?: number;
}

export const Permutation_cost_calculatorInputSchema = z.object({
  totalItems: z.number().default(10),
  itemsToArrange: z.number().default(3),
  costPerPermutation: z.number().default(0.5),
  setupCost: z.number().default(100),
  discountPercent: z.number().default(0),
});

function asFormulaNumber(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Permutation_cost_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.totalItems ** input.itemsToArrange; results["numberOfPermutations"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["numberOfPermutations"] = 0; }
  try { const v = (asFormulaNumber(results["numberOfPermutations"])) * input.costPerPermutation + input.setupCost; results["costBeforeDiscount"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["costBeforeDiscount"] = 0; }
  try { const v = (asFormulaNumber(results["costBeforeDiscount"])) * (1 - input.discountPercent / 100); results["totalCost"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["totalCost"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

export function calculatePermutation_cost_calculator(input: Permutation_cost_calculatorInput): Permutation_cost_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = Math.max(0, toNumericFormulaValue(values["totalCost"]));
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


export interface Permutation_cost_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
