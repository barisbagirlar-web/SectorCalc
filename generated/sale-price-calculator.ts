// Auto-generated from sale-price-calculator-schema.json
import * as z from 'zod';

export interface Sale_price_calculatorInput {
  costPrice: number;
  markupPercentage: number;
  discount: number;
  taxRate: number;
}

export const Sale_price_calculatorInputSchema = z.object({
  costPrice: z.number().default(100),
  markupPercentage: z.number().default(20),
  discount: z.number().default(0),
  taxRate: z.number().default(10),
});

function evaluateAllFormulas(input: Sale_price_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.costPrice * (1 + input.markupPercentage / 100); results["basePrice"] = Number.isFinite(v) ? v : 0; } catch { results["basePrice"] = 0; }
  try { const v = input.costPrice * (1 + input.markupPercentage / 100) * input.discount / 100; results["discountAmount"] = Number.isFinite(v) ? v : 0; } catch { results["discountAmount"] = 0; }
  try { const v = input.costPrice * (1 + input.markupPercentage / 100) * (1 - input.discount / 100); results["discountedPrice"] = Number.isFinite(v) ? v : 0; } catch { results["discountedPrice"] = 0; }
  try { const v = input.costPrice * (1 + input.markupPercentage / 100) * (1 - input.discount / 100) * input.taxRate / 100; results["taxAmount"] = Number.isFinite(v) ? v : 0; } catch { results["taxAmount"] = 0; }
  try { const v = input.costPrice * (1 + input.markupPercentage / 100) * (1 - input.discount / 100) * (1 + input.taxRate / 100); results["finalPrice"] = Number.isFinite(v) ? v : 0; } catch { results["finalPrice"] = 0; }
  return results;
}


export function calculateSale_price_calculator(input: Sale_price_calculatorInput): Sale_price_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["finalPrice"] ?? 0;
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


export interface Sale_price_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
