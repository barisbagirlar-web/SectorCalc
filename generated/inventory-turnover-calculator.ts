// Auto-generated from inventory-turnover-calculator-schema.json
import * as z from 'zod';

export interface Inventory_turnover_calculatorInput {
  cogs: number;
  beginInventory: number;
  endInventory: number;
  days: number;
}

export const Inventory_turnover_calculatorInputSchema = z.object({
  cogs: z.number().default(100000),
  beginInventory: z.number().default(20000),
  endInventory: z.number().default(30000),
  days: z.number().default(365),
});

function evaluateAllFormulas(input: Inventory_turnover_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = (input.beginInventory + input.endInventory) / 2; results["averageInventory"] = Number.isFinite(v) ? v : 0; } catch { results["averageInventory"] = 0; }
  try { const v = input.cogs / (results["averageInventory"] ?? 0); results["inventoryTurnover"] = Number.isFinite(v) ? v : 0; } catch { results["inventoryTurnover"] = 0; }
  try { const v = input.days / (results["inventoryTurnover"] ?? 0); results["daysInventoryOutstanding"] = Number.isFinite(v) ? v : 0; } catch { results["daysInventoryOutstanding"] = 0; }
  return results;
}


export function calculateInventory_turnover_calculator(input: Inventory_turnover_calculatorInput): Inventory_turnover_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["inventoryTurnover"] ?? 0;
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


export interface Inventory_turnover_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
