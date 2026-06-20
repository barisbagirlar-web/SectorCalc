// Auto-generated from days-inventory-outstanding-calculator-schema.json
import * as z from 'zod';

export interface Days_inventory_outstanding_calculatorInput {
  averageInventory: number;
  costOfGoodsSold: number;
  periodDays: number;
  inventoryTurnover: number;
  dataConfidence?: number;
}

export const Days_inventory_outstanding_calculatorInputSchema = z.object({
  averageInventory: z.number().default(0),
  costOfGoodsSold: z.number().default(0),
  periodDays: z.number().default(365),
  inventoryTurnover: z.number().default(0),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Days_inventory_outstanding_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = (((input.inventoryTurnover > 0) ? (input.periodDays / input.inventoryTurnover) : ((input.averageInventory > 0 && input.costOfGoodsSold > 0) ? (input.periodDays * input.averageInventory / input.costOfGoodsSold) : 0)) ? 1 : 0); results["daysInventoryOutstanding"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["daysInventoryOutstanding"] = Number.NaN; }
  try { const v = (((input.inventoryTurnover > 0) ? input.inventoryTurnover : ((input.averageInventory > 0 && input.costOfGoodsSold > 0) ? (input.costOfGoodsSold / input.averageInventory) : 0)) ? 1 : 0); results["inventoryTurnoverRatio"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["inventoryTurnoverRatio"] = Number.NaN; }
  return results;
}


export function calculateDays_inventory_outstanding_calculator(input: Days_inventory_outstanding_calculatorInput): Days_inventory_outstanding_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["daysInventoryOutstanding"]);
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


export interface Days_inventory_outstanding_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
