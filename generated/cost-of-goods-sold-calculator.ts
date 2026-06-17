// @ts-nocheck
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

function asFormulaNumber(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Cost_of_goods_sold_calculatorInput): Record<string, number | string> {
  const results: Record<string, number | string> = {};
  try { const v = input.materialPurchases + input.directLabor + input.overhead; results["totalProductionCost"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["totalProductionCost"] = 0; }
  try { const v = input.beginningInventory + (asFormulaNumber(results["totalProductionCost"])); results["costOfGoodsAvailableForSale"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["costOfGoodsAvailableForSale"] = 0; }
  try { const v = (asFormulaNumber(results["costOfGoodsAvailableForSale"])) - input.endingInventory; results["cogs"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["cogs"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

export function calculateCost_of_goods_sold_calculator(input: Cost_of_goods_sold_calculatorInput): Cost_of_goods_sold_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["cogs"]);
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


export interface Cost_of_goods_sold_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
