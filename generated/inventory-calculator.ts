// Auto-generated from inventory-calculator-schema.json
import * as z from 'zod';

export interface Inventory_calculatorInput {
  annualDemand: number;
  orderingCost: number;
  holdingCost: number;
  dailyDemand: number;
  leadTimeDays: number;
  dataConfidence?: number;
}

export const Inventory_calculatorInputSchema = z.object({
  annualDemand: z.number().default(1200),
  orderingCost: z.number().default(50),
  holdingCost: z.number().default(2),
  dailyDemand: z.number().default(5),
  leadTimeDays: z.number().default(5),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Inventory_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = (input.annualDemand) * (input.orderingCost) * (input.holdingCost) * (input.dailyDemand) * (input.leadTimeDays); results["reorderPoint"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["reorderPoint"] = Number.NaN; }
  try { const v = (input.annualDemand) * (input.orderingCost) * (input.holdingCost); results["reorderPoint_aux"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["reorderPoint_aux"] = Number.NaN; }
  return results;
}


export function calculateInventory_calculator(input: Inventory_calculatorInput): Inventory_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["reorderPoint_aux"]);
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


export interface Inventory_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
