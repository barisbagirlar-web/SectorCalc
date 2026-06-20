// Auto-generated from minimum-spanning-tree-calculator-schema.json
import * as z from 'zod';

export interface Minimum_spanning_tree_calculatorInput {
  nodeCount: number;
  edgeAB: number;
  edgeBC: number;
  edgeCA: number;
  unitCost: number;
  safetyFactor: number;
  dataConfidence?: number;
}

export const Minimum_spanning_tree_calculatorInputSchema = z.object({
  nodeCount: z.number().default(3),
  edgeAB: z.number().default(10),
  edgeBC: z.number().default(15),
  edgeCA: z.number().default(20),
  unitCost: z.number().default(5),
  safetyFactor: z.number().default(1.1),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Minimum_spanning_tree_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.nodeCount * input.unitCost; results["base_cost"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["base_cost"] = Number.NaN; }
  try { const v = input.nodeCount * input.unitCost; results["adjusted_cost"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["adjusted_cost"] = Number.NaN; }
  try { const v = input.nodeCount * input.unitCost * 1 * (input.edgeAB); results["result"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["result"] = Number.NaN; }
  try { const v = input.edgeAB; results["factor_edgeAB"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["factor_edgeAB"] = Number.NaN; }
  return results;
}


export function calculateMinimum_spanning_tree_calculator(input: Minimum_spanning_tree_calculatorInput): Minimum_spanning_tree_calculatorOutput {
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


export interface Minimum_spanning_tree_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
