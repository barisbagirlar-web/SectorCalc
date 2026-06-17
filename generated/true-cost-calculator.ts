// @ts-nocheck
// Auto-generated from true-cost-calculator-schema.json
import * as z from 'zod';

export interface True_cost_calculatorInput {
  materialCost: number;
  laborCost: number;
  energyCost: number;
  overheadRate: number;
  wasteRate: number;
}

export const True_cost_calculatorInputSchema = z.object({
  materialCost: z.number().default(100),
  laborCost: z.number().default(50),
  energyCost: z.number().default(20),
  overheadRate: z.number().default(25),
  wasteRate: z.number().default(10),
});

function asFormulaNumber(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: True_cost_calculatorInput): Record<string, number | string> {
  const results: Record<string, number | string> = {};
  try { const v = input.materialCost + input.laborCost + input.energyCost; results["directCost"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["directCost"] = 0; }
  try { const v = 1 / (1 - input.wasteRate / 100); results["yieldMultiplier"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["yieldMultiplier"] = 0; }
  try { const v = (asFormulaNumber(results["directCost"])) * ((asFormulaNumber(results["yieldMultiplier"])) - 1); results["wasteCost"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["wasteCost"] = 0; }
  try { const v = ((asFormulaNumber(results["directCost"])) + (asFormulaNumber(results["wasteCost"]))) * (input.overheadRate / 100); results["overheadCost"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["overheadCost"] = 0; }
  try { const v = (asFormulaNumber(results["directCost"])) + (asFormulaNumber(results["wasteCost"])) + (asFormulaNumber(results["overheadCost"])); results["trueCostPerUnit"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["trueCostPerUnit"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

export function calculateTrue_cost_calculator(input: True_cost_calculatorInput): True_cost_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["trueCostPerUnit"]);
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


export interface True_cost_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
