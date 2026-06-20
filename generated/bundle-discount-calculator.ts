// Auto-generated from bundle-discount-calculator-schema.json
import * as z from 'zod';

export interface Bundle_discount_calculatorInput {
  numberOfBundles: number;
  itemsPerBundle: number;
  pricePerItem: number;
  bundleDiscountPercent: number;
  bulkThreshold: number;
  bulkDiscountPercent: number;
  dataConfidence?: number;
}

export const Bundle_discount_calculatorInputSchema = z.object({
  numberOfBundles: z.number().default(1),
  itemsPerBundle: z.number().default(1),
  pricePerItem: z.number().default(10),
  bundleDiscountPercent: z.number().default(10),
  bulkThreshold: z.number().default(10),
  bulkDiscountPercent: z.number().default(5),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Bundle_discount_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.numberOfBundles * input.itemsPerBundle; results["totalItems"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["totalItems"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["totalItems"])) * input.pricePerItem; results["undiscountedCost"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["undiscountedCost"] = Number.NaN; }
  try { const v = input.pricePerItem * (1 - input.bundleDiscountPercent / 100); results["bundleDiscountedPricePerItem"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["bundleDiscountedPricePerItem"] = Number.NaN; }
  try { const v = input.itemsPerBundle * (toNumericFormulaValue(results["bundleDiscountedPricePerItem"])); results["bundlePrice"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["bundlePrice"] = Number.NaN; }
  try { const v = input.numberOfBundles * (toNumericFormulaValue(results["bundlePrice"])); results["totalBundleCost"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["totalBundleCost"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["undiscountedCost"])) - (toNumericFormulaValue(results["totalBundleCost"])); results["bundleDiscountAmount"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["bundleDiscountAmount"] = Number.NaN; }
  try { const v = input.numberOfBundles >= input.bulkThreshold ? (toNumericFormulaValue(results["totalBundleCost"])) * (input.bulkDiscountPercent / 100) : 0; results["bulkDiscountAmount"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["bulkDiscountAmount"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["bundleDiscountAmount"])) + (toNumericFormulaValue(results["bulkDiscountAmount"])); results["discountAmount"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["discountAmount"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["undiscountedCost"])) - (toNumericFormulaValue(results["discountAmount"])); results["finalCost"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["finalCost"] = Number.NaN; }
  try { const v = 0; results["direct_labor_cost"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["direct_labor_cost"] = Number.NaN; }
  return results;
}


export function calculateBundle_discount_calculator(input: Bundle_discount_calculatorInput): Bundle_discount_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["totalItems"]);
  const breakdown = {
    
  };
  const hiddenLossDrivers: string[] = ["Direct labor cost is set to 0 because no labor-related inputs are available in this tool"];
  const suggestedActions: string[] = ["Review inputs and verify results against site standards."];
  const dataConfidenceAdjusted =
    typeof input.dataConfidence === "number"
      ? totalWasteCost * (input.dataConfidence / 100)
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
