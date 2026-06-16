// Auto-generated from cost-of-goods-sold-calculator-schema.json
import * as z from 'zod';

export interface Cost_of_goods_sold_calculatorInput {
  beginningInventory: number;
  materialPurchases: number;
  directLabor: number;
  overhead: number;
  endingInventory: number;
}

export const Cost_of_goods_sold_calculatorInputSchema = z.object({
  beginningInventory: z.number().default(0),
  materialPurchases: z.number().default(0),
  directLabor: z.number().default(0),
  overhead: z.number().default(0),
  endingInventory: z.number().default(0),
});

function evaluateAllFormulas(input: Cost_of_goods_sold_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.materialPurchases + input.directLabor + input.overhead; results["totalProductionCost"] = Number.isFinite(v) ? v : 0; } catch { results["totalProductionCost"] = 0; }
  try { const v = input.beginningInventory + (results["totalProductionCost"] ?? 0); results["costOfGoodsAvailableForSale"] = Number.isFinite(v) ? v : 0; } catch { results["costOfGoodsAvailableForSale"] = 0; }
  try { const v = (results["costOfGoodsAvailableForSale"] ?? 0) - input.endingInventory; results["cogs"] = Number.isFinite(v) ? v : 0; } catch { results["cogs"] = 0; }
  return results;
}


export function calculateCost_of_goods_sold_calculator(input: Cost_of_goods_sold_calculatorInput): Cost_of_goods_sold_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["cogs"] ?? 0;
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


export interface Cost_of_goods_sold_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
