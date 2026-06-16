// Auto-generated from stock-average-calculator-schema.json
import * as z from 'zod';

export interface Stock_average_calculatorInput {
  currentQuantity: number;
  currentAvgPrice: number;
  purchaseQuantity: number;
  purchasePrice: number;
}

export const Stock_average_calculatorInputSchema = z.object({
  currentQuantity: z.number().default(0),
  currentAvgPrice: z.number().default(0),
  purchaseQuantity: z.number().default(0),
  purchasePrice: z.number().default(0),
});

function evaluateAllFormulas(input: Stock_average_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = (input.currentQuantity * input.currentAvgPrice + input.purchaseQuantity * input.purchasePrice) / (input.currentQuantity + input.purchaseQuantity); results["newAvgPrice"] = Number.isFinite(v) ? v : 0; } catch { results["newAvgPrice"] = 0; }
  try { const v = input.currentQuantity * input.currentAvgPrice + input.purchaseQuantity * input.purchasePrice; results["totalCost"] = Number.isFinite(v) ? v : 0; } catch { results["totalCost"] = 0; }
  try { const v = input.currentQuantity + input.purchaseQuantity; results["totalShares"] = Number.isFinite(v) ? v : 0; } catch { results["totalShares"] = 0; }
  return results;
}


export function calculateStock_average_calculator(input: Stock_average_calculatorInput): Stock_average_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["newAvgPrice"] ?? 0;
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


export interface Stock_average_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
