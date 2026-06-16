// Auto-generated from margin-calculator-schema.json
import * as z from 'zod';

export interface Margin_calculatorInput {
  cost: number;
  sellingPrice: number;
  quantity: number;
  discount: number;
}

export const Margin_calculatorInputSchema = z.object({
  cost: z.number().default(0),
  sellingPrice: z.number().default(0),
  quantity: z.number().default(1),
  discount: z.number().default(0),
});

function evaluateAllFormulas(input: Margin_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.sellingPrice * (1 - input.discount / 100); results["netPrice"] = Number.isFinite(v) ? v : 0; } catch { results["netPrice"] = 0; }
  try { const v = ((results["netPrice"] ?? 0) - input.cost) * input.quantity; results["profitAmount"] = Number.isFinite(v) ? v : 0; } catch { results["profitAmount"] = 0; }
  try { const v = (results["netPrice"] ?? 0) * input.quantity; results["totalRevenue"] = Number.isFinite(v) ? v : 0; } catch { results["totalRevenue"] = 0; }
  try { const v = input.cost * input.quantity; results["totalCost"] = Number.isFinite(v) ? v : 0; } catch { results["totalCost"] = 0; }
  try { const v = (((results["netPrice"] ?? 0) - input.cost) / (results["netPrice"] ?? 0)) * 100; results["profitMargin"] = Number.isFinite(v) ? v : 0; } catch { results["profitMargin"] = 0; }
  return results;
}


export function calculateMargin_calculator(input: Margin_calculatorInput): Margin_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["profitMargin"] ?? 0;
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


export interface Margin_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
