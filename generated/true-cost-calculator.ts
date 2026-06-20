// Auto-generated from true-cost-calculator-schema.json
import * as z from 'zod';

export interface True_cost_calculatorInput {
  materialCost: number;
  laborCost: number;
  energyCost: number;
  overheadRate: number;
  wasteRate: number;
  dataConfidence?: number;
}

export const True_cost_calculatorInputSchema = z.object({
  materialCost: z.number().default(100),
  laborCost: z.number().default(50),
  energyCost: z.number().default(20),
  overheadRate: z.number().default(25),
  wasteRate: z.number().default(10),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: True_cost_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.materialCost + input.laborCost + input.energyCost; results["directCost"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["directCost"] = Number.NaN; }
  try { const v = 1 / (1 - input.wasteRate / 100); results["yieldMultiplier"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["yieldMultiplier"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["directCost"])) * ((toNumericFormulaValue(results["yieldMultiplier"])) - 1); results["wasteCost"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["wasteCost"] = Number.NaN; }
  try { const v = ((toNumericFormulaValue(results["directCost"])) + (toNumericFormulaValue(results["wasteCost"]))) * (input.overheadRate / 100); results["overheadCost"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["overheadCost"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["directCost"])) + (toNumericFormulaValue(results["wasteCost"])) + (toNumericFormulaValue(results["overheadCost"])); results["trueCostPerUnit"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["trueCostPerUnit"] = Number.NaN; }
  return results;
}


export function calculateTrue_cost_calculator(input: True_cost_calculatorInput): True_cost_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["trueCostPerUnit"]);
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


export interface True_cost_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
