// Auto-generated from bundle-discount-calculator-schema.json
import * as z from 'zod';

export interface Bundle_discount_calculatorInput {
  numberOfBundles: number;
  itemsPerBundle: number;
  pricePerItem: number;
  bundleDiscountPercent: number;
  bulkThreshold: number;
  bulkDiscountPercent: number;
}

export const Bundle_discount_calculatorInputSchema = z.object({
  numberOfBundles: z.number().default(1),
  itemsPerBundle: z.number().default(1),
  pricePerItem: z.number().default(10),
  bundleDiscountPercent: z.number().default(10),
  bulkThreshold: z.number().default(10),
  bulkDiscountPercent: z.number().default(5),
});

function evaluateAllFormulas(input: Bundle_discount_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.numberOfBundles * input.itemsPerBundle; results["totalItems"] = Number.isFinite(v) ? v : 0; } catch { results["totalItems"] = 0; }
  try { const v = (results["totalItems"] ?? 0) * input.pricePerItem; results["undiscountedCost"] = Number.isFinite(v) ? v : 0; } catch { results["undiscountedCost"] = 0; }
  try { const v = input.pricePerItem * (1 - input.bundleDiscountPercent / 100); results["bundleDiscountedPricePerItem"] = Number.isFinite(v) ? v : 0; } catch { results["bundleDiscountedPricePerItem"] = 0; }
  try { const v = input.itemsPerBundle * (results["bundleDiscountedPricePerItem"] ?? 0); results["bundlePrice"] = Number.isFinite(v) ? v : 0; } catch { results["bundlePrice"] = 0; }
  try { const v = input.numberOfBundles * (results["bundlePrice"] ?? 0); results["totalBundleCost"] = Number.isFinite(v) ? v : 0; } catch { results["totalBundleCost"] = 0; }
  try { const v = (results["undiscountedCost"] ?? 0) - (results["totalBundleCost"] ?? 0); results["bundleDiscountAmount"] = Number.isFinite(v) ? v : 0; } catch { results["bundleDiscountAmount"] = 0; }
  try { const v = input.numberOfBundles >= input.bulkThreshold ? (results["totalBundleCost"] ?? 0) * (input.bulkDiscountPercent / 100) : 0; results["bulkDiscountAmount"] = Number.isFinite(v) ? v : 0; } catch { results["bulkDiscountAmount"] = 0; }
  try { const v = (results["bundleDiscountAmount"] ?? 0) + (results["bulkDiscountAmount"] ?? 0); results["discountAmount"] = Number.isFinite(v) ? v : 0; } catch { results["discountAmount"] = 0; }
  try { const v = (results["undiscountedCost"] ?? 0) - (results["discountAmount"] ?? 0); results["finalCost"] = Number.isFinite(v) ? v : 0; } catch { results["finalCost"] = 0; }
  return results;
}


export function calculateBundle_discount_calculator(input: Bundle_discount_calculatorInput): Bundle_discount_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["total"] ?? 0;
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


export interface Bundle_discount_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
