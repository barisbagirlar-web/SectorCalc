// Auto-generated from grocery-list-calculator-schema.json
import * as z from 'zod';

export interface Grocery_list_calculatorInput {
  quantity: number;
  unitPrice: number;
  discountPercent: number;
  taxPercent: number;
  shippingFee: number;
  couponValue: number;
  dataConfidence?: number;
}

export const Grocery_list_calculatorInputSchema = z.object({
  quantity: z.number().default(1),
  unitPrice: z.number().default(0),
  discountPercent: z.number().default(0),
  taxPercent: z.number().default(0),
  shippingFee: z.number().default(0),
  couponValue: z.number().default(0),
});

function asFormulaNumber(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Grocery_list_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.quantity * input.unitPrice; results["subtotal"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["subtotal"] = 0; }
  try { const v = (asFormulaNumber(results["subtotal"])) * input.discountPercent / 100; results["discountAmount"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["discountAmount"] = 0; }
  try { const v = ((asFormulaNumber(results["subtotal"])) - (asFormulaNumber(results["discountAmount"]))) * input.taxPercent / 100; results["taxAmount"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["taxAmount"] = 0; }
  try { const v = (asFormulaNumber(results["subtotal"])) - (asFormulaNumber(results["discountAmount"])) + (asFormulaNumber(results["taxAmount"])) + input.shippingFee - input.couponValue; results["finalTotal"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["finalTotal"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

export function calculateGrocery_list_calculator(input: Grocery_list_calculatorInput): Grocery_list_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["finalTotal"]);
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


export interface Grocery_list_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
