// Auto-generated from sale-price-calculator-schema.json
import * as z from 'zod';

export interface Sale_price_calculatorInput {
  costPrice: number;
  markupPercentage: number;
  discount: number;
  taxRate: number;
  dataConfidence?: number;
}

export const Sale_price_calculatorInputSchema = z.object({
  costPrice: z.number().default(100),
  markupPercentage: z.number().default(20),
  discount: z.number().default(0),
  taxRate: z.number().default(10),
});

function asFormulaNumber(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Sale_price_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.costPrice * (1 + input.markupPercentage / 100); results["basePrice"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["basePrice"] = 0; }
  try { const v = input.costPrice * (1 + input.markupPercentage / 100) * input.discount / 100; results["discountAmount"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["discountAmount"] = 0; }
  try { const v = input.costPrice * (1 + input.markupPercentage / 100) * (1 - input.discount / 100); results["discountedPrice"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["discountedPrice"] = 0; }
  try { const v = input.costPrice * (1 + input.markupPercentage / 100) * (1 - input.discount / 100) * input.taxRate / 100; results["taxAmount"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["taxAmount"] = 0; }
  try { const v = input.costPrice * (1 + input.markupPercentage / 100) * (1 - input.discount / 100) * (1 + input.taxRate / 100); results["finalPrice"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["finalPrice"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

export function calculateSale_price_calculator(input: Sale_price_calculatorInput): Sale_price_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["finalPrice"]);
  const breakdown = {
    
  };
  const hiddenLossDrivers: string[] = [];
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


export interface Sale_price_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
