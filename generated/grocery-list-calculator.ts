// Auto-generated from grocery-list-calculator-schema.json
import * as z from 'zod';

export interface Grocery_list_calculatorInput {
  quantity: number;
  unitPrice: number;
  discountPercent: number;
  taxPercent: number;
  shippingFee: number;
  couponValue: number;
}

export const Grocery_list_calculatorInputSchema = z.object({
  quantity: z.number().default(1),
  unitPrice: z.number().default(0),
  discountPercent: z.number().default(0),
  taxPercent: z.number().default(0),
  shippingFee: z.number().default(0),
  couponValue: z.number().default(0),
});

function evaluateAllFormulas(input: Grocery_list_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.quantity * input.unitPrice; results["subtotal"] = Number.isFinite(v) ? v : 0; } catch { results["subtotal"] = 0; }
  try { const v = (results["subtotal"] ?? 0) * input.discountPercent / 100; results["discountAmount"] = Number.isFinite(v) ? v : 0; } catch { results["discountAmount"] = 0; }
  try { const v = ((results["subtotal"] ?? 0) - (results["discountAmount"] ?? 0)) * input.taxPercent / 100; results["taxAmount"] = Number.isFinite(v) ? v : 0; } catch { results["taxAmount"] = 0; }
  try { const v = (results["subtotal"] ?? 0) - (results["discountAmount"] ?? 0) + (results["taxAmount"] ?? 0) + input.shippingFee - input.couponValue; results["finalTotal"] = Number.isFinite(v) ? v : 0; } catch { results["finalTotal"] = 0; }
  return results;
}


export function calculateGrocery_list_calculator(input: Grocery_list_calculatorInput): Grocery_list_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["finalTotal"] ?? 0;
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


export interface Grocery_list_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
