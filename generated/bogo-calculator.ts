// Auto-generated from bogo-calculator-schema.json
import * as z from 'zod';

export interface Bogo_calculatorInput {
  originalPrice: number;
  buyQuantity: number;
  getQuantity: number;
  numberOfSets: number;
  taxRate: number;
  additionalDiscount: number;
}

export const Bogo_calculatorInputSchema = z.object({
  originalPrice: z.number().default(10),
  buyQuantity: z.number().default(1),
  getQuantity: z.number().default(1),
  numberOfSets: z.number().default(1),
  taxRate: z.number().default(0),
  additionalDiscount: z.number().default(0),
});

function evaluateAllFormulas(input: Bogo_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = (input.buyQuantity + input.getQuantity) * input.numberOfSets; results["totalItems"] = Number.isFinite(v) ? v : 0; } catch { results["totalItems"] = 0; }
  try { const v = input.originalPrice * input.buyQuantity * input.numberOfSets * (1 - input.additionalDiscount / 100) * (1 + input.taxRate / 100); results["totalCost"] = Number.isFinite(v) ? v : 0; } catch { results["totalCost"] = 0; }
  try { const v = (input.originalPrice * input.buyQuantity * input.numberOfSets * (1 - input.additionalDiscount / 100) * (1 + input.taxRate / 100)) / ((input.buyQuantity + input.getQuantity) * input.numberOfSets); results["costPerItem"] = Number.isFinite(v) ? v : 0; } catch { results["costPerItem"] = 0; }
  try { const v = input.originalPrice * (input.buyQuantity + input.getQuantity) * input.numberOfSets - input.originalPrice * input.buyQuantity * input.numberOfSets * (1 - input.additionalDiscount / 100) * (1 + input.taxRate / 100); results["totalSavings"] = Number.isFinite(v) ? v : 0; } catch { results["totalSavings"] = 0; }
  try { const v = (1 - (input.buyQuantity * (1 - input.additionalDiscount / 100) * (1 + input.taxRate / 100)) / (input.buyQuantity + input.getQuantity)) * 100; results["effectiveDiscountPercent"] = Number.isFinite(v) ? v : 0; } catch { results["effectiveDiscountPercent"] = 0; }
  return results;
}


export function calculateBogo_calculator(input: Bogo_calculatorInput): Bogo_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["effectiveDiscountPercent"] ?? 0;
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


export interface Bogo_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
