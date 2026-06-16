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

function evaluateAllFormulas(input: Inventory_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = Math.sqrt((2 * input.annualDemand * input.orderingCost) / input.holdingCost); results["economicOrderQuantity"] = Number.isFinite(v) ? v : 0; } catch { results["economicOrderQuantity"] = 0; }
  try { const v = input.dailyDemand * input.leadTimeDays; results["reorderPoint"] = Number.isFinite(v) ? v : 0; } catch { results["reorderPoint"] = 0; }
  try { const v = (input.annualDemand / (results["economicOrderQuantity"] ?? 0)) * input.orderingCost + ((results["economicOrderQuantity"] ?? 0) / 2) * input.holdingCost; results["totalAnnualCost"] = Number.isFinite(v) ? v : 0; } catch { results["totalAnnualCost"] = 0; }
  try { const v = input.annualDemand / ((results["economicOrderQuantity"] ?? 0) / 2); results["inventoryTurnover"] = Number.isFinite(v) ? v : 0; } catch { results["inventoryTurnover"] = 0; }
  return results;
}


export function calculateInventory_calculator(input: Inventory_calculatorInput): Inventory_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["economicOrderQuantity"] ?? 0;
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


export interface Inventory_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
