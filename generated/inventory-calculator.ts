// @ts-nocheck
// Auto-generated from inventory-calculator-schema.json
import * as z from 'zod';

export interface Inventory_calculatorInput {
  annualDemand: number;
  orderingCost: number;
  holdingCost: number;
  dailyDemand: number;
  leadTimeDays: number;
}

export const Inventory_calculatorInputSchema = z.object({
  annualDemand: z.number().default(1200),
  orderingCost: z.number().default(50),
  holdingCost: z.number().default(2),
  dailyDemand: z.number().default(5),
  leadTimeDays: z.number().default(5),
});

function asFormulaNumber(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Inventory_calculatorInput): Record<string, number | string> {
  const results: Record<string, number | string> = {};
  try { const v = input.dailyDemand * input.leadTimeDays; results["reorderPoint"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["reorderPoint"] = 0; }
  try { const v = input.dailyDemand * input.leadTimeDays; results["reorderPoint_aux"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["reorderPoint_aux"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

export function calculateInventory_calculator(input: Inventory_calculatorInput): Inventory_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["reorderPoint_aux"]);
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


export interface Inventory_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
