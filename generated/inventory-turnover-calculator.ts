// Auto-generated from inventory-turnover-calculator-schema.json
import * as z from 'zod';

export interface Inventory_turnover_calculatorInput {
  cogs: number;
  beginInventory: number;
  endInventory: number;
  days: number;
  dataConfidence?: number;
}

export const Inventory_turnover_calculatorInputSchema = z.object({
  cogs: z.number().default(100000),
  beginInventory: z.number().default(20000),
  endInventory: z.number().default(30000),
  days: z.number().default(365),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Inventory_turnover_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = (input.beginInventory + input.endInventory) / 2; results["averageInventory"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["averageInventory"] = Number.NaN; }
  try { const v = input.cogs / (toNumericFormulaValue(results["averageInventory"])); results["inventoryTurnover"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["inventoryTurnover"] = Number.NaN; }
  try { const v = input.days / (toNumericFormulaValue(results["inventoryTurnover"])); results["daysInventoryOutstanding"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["daysInventoryOutstanding"] = Number.NaN; }
  return results;
}


export function calculateInventory_turnover_calculator(input: Inventory_turnover_calculatorInput): Inventory_turnover_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["inventoryTurnover"]);
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


export interface Inventory_turnover_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
