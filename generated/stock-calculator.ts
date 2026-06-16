// Auto-generated from stock-calculator-schema.json
import * as z from 'zod';

export interface Stock_calculatorInput {
  annualDemand: number;
  orderingCost: number;
  holdingCost: number;
  unitCost: number;
  leadTimeDays: number;
  workingDaysPerYear: number;
}

export const Stock_calculatorInputSchema = z.object({
  annualDemand: z.number().default(1000),
  orderingCost: z.number().default(50),
  holdingCost: z.number().default(2),
  unitCost: z.number().default(0),
  leadTimeDays: z.number().default(7),
  workingDaysPerYear: z.number().default(250),
});

function evaluateAllFormulas(input: Stock_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = Math.sqrt((2 * input.annualDemand * input.orderingCost) / input.holdingCost); results["eoq"] = Number.isFinite(v) ? v : 0; } catch { results["eoq"] = 0; }
  try { const v = input.annualDemand / input.workingDaysPerYear; results["dailyDemand"] = Number.isFinite(v) ? v : 0; } catch { results["dailyDemand"] = 0; }
  try { const v = (results["dailyDemand"] ?? 0) * input.leadTimeDays; results["reorderPoint"] = Number.isFinite(v) ? v : 0; } catch { results["reorderPoint"] = 0; }
  try { const v = input.annualDemand / (results["eoq"] ?? 0); results["ordersPerYear"] = Number.isFinite(v) ? v : 0; } catch { results["ordersPerYear"] = 0; }
  try { const v = (results["eoq"] ?? 0) / 2; results["averageInventory"] = Number.isFinite(v) ? v : 0; } catch { results["averageInventory"] = 0; }
  try { const v = input.annualDemand * input.unitCost + ((results["ordersPerYear"] ?? 0) * input.orderingCost) + ((results["averageInventory"] ?? 0) * input.holdingCost); results["totalAnnualCost"] = Number.isFinite(v) ? v : 0; } catch { results["totalAnnualCost"] = 0; }
  return results;
}


export function calculateStock_calculator(input: Stock_calculatorInput): Stock_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["eoq"] ?? 0;
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


export interface Stock_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
