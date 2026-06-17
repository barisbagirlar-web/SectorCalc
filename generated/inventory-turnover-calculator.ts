// @ts-nocheck
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

function asFormulaNumber(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Inventory_turnover_calculatorInput): Record<string, number | string> {
  const results: Record<string, number | string> = {};
  try { const v = (input.beginInventory + input.endInventory) / 2; results["averageInventory"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["averageInventory"] = 0; }
  try { const v = input.cogs / (asFormulaNumber(results["averageInventory"])); results["inventoryTurnover"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["inventoryTurnover"] = 0; }
  try { const v = input.days / (asFormulaNumber(results["inventoryTurnover"])); results["daysInventoryOutstanding"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["daysInventoryOutstanding"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

export function calculateInventory_turnover_calculator(input: Inventory_turnover_calculatorInput): Inventory_turnover_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["inventoryTurnover"]);
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


export interface Inventory_turnover_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
