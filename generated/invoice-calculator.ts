// Auto-generated from invoice-calculator-schema.json
import * as z from 'zod';

export interface Invoice_calculatorInput {
  subtotal: number;
  discountPercent: number;
  taxRate: number;
  shippingCost: number;
  dataConfidence?: number;
}

export const Invoice_calculatorInputSchema = z.object({
  subtotal: z.number().default(0),
  discountPercent: z.number().default(0),
  taxRate: z.number().default(0),
  shippingCost: z.number().default(0),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Invoice_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.subtotal * (1 - input.discountPercent / 100) * (1 + input.taxRate / 100) + input.shippingCost; results["Final Invoice Total"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["Final Invoice Total"] = Number.NaN; }
  try { const v = input.subtotal * input.discountPercent / 100; results["Discount Amount"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["Discount Amount"] = Number.NaN; }
  try { const v = input.subtotal * (1 - input.discountPercent / 100) * input.taxRate / 100; results["Tax Amount"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["Tax Amount"] = Number.NaN; }
  try { const v = input.subtotal * (1 - input.discountPercent / 100); results["Subtotal After Discount"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["Subtotal After Discount"] = Number.NaN; }
  return results;
}


export function calculateInvoice_calculator(input: Invoice_calculatorInput): Invoice_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["Final"]);
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


export interface Invoice_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
