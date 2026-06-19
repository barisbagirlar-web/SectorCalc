// Auto-generated from unit-price-calculator-schema.json
import * as z from 'zod';

export interface Unit_price_calculatorInput {
  totalCost: number;
  quantity: number;
  additionalCosts: number;
  discountPercent: number;
  taxRate: number;
  dataConfidence?: number;
}

export const Unit_price_calculatorInputSchema = z.object({
  totalCost: z.number().default(1000),
  quantity: z.number().default(100),
  additionalCosts: z.number().default(0),
  discountPercent: z.number().default(0),
  taxRate: z.number().default(0),
});

function asFormulaNumber(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Unit_price_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.totalCost * input.discountPercent / 100; results["discountAmount"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["discountAmount"] = 0; }
  try { const v = (input.totalCost + input.additionalCosts - (input.totalCost * input.discountPercent / 100)) / input.quantity; results["netUnitPrice"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["netUnitPrice"] = 0; }
  try { const v = ((input.totalCost + input.additionalCosts - (input.totalCost * input.discountPercent / 100)) / input.quantity) * (1 + input.taxRate / 100); results["unitPrice"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["unitPrice"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

export function calculateUnit_price_calculator(input: Unit_price_calculatorInput): Unit_price_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = Math.max(0, toNumericFormulaValue(values["unitPrice"]));
  const breakdown = {
    
  };
  const hiddenLossDrivers: string[] = [];
  const suggestedActions: string[] = ["Review inputs and verify results against site standards."];
  const dataConfidenceAdjusted =
    typeof input.dataConfidence === "number"
      ? Math.max(0, totalWasteCost * (input.dataConfidence / 100))
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


export interface Unit_price_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
