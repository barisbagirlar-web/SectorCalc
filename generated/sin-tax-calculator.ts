// @ts-nocheck
// Auto-generated from sin-tax-calculator-schema.json
import * as z from 'zod';

export interface Sin_tax_calculatorInput {
  basePrice: number;
  sinTaxRate: number;
  vatRate: number;
  quantity: number;
}

export const Sin_tax_calculatorInputSchema = z.object({
  basePrice: z.number().default(100),
  sinTaxRate: z.number().default(25),
  vatRate: z.number().default(18),
  quantity: z.number().default(1),
});

function asFormulaNumber(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Sin_tax_calculatorInput): Record<string, number | string> {
  const results: Record<string, number | string> = {};
  try { const v = input.quantity * input.basePrice * (1 + input.sinTaxRate / 100) * (1 + input.vatRate / 100); results["totalPrice"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["totalPrice"] = 0; }
  try { const v = input.quantity * input.basePrice * input.sinTaxRate / 100; results["sinTaxAmount"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["sinTaxAmount"] = 0; }
  try { const v = input.quantity * input.basePrice * (1 + input.sinTaxRate / 100) * input.vatRate / 100; results["vatAmount"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["vatAmount"] = 0; }
  try { const v = input.quantity * input.basePrice * (1 + input.sinTaxRate / 100); results["totalBeforeVat"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["totalBeforeVat"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

export function calculateSin_tax_calculator(input: Sin_tax_calculatorInput): Sin_tax_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["totalPrice"]);
  const breakdown = {
    
  };
  const hiddenLossDrivers: string[] = [];
  const suggestedActions: string[] = ["Review inputs and verify results against site standards."];
  const dataConfidenceAdjusted =
    typeof (input as unknown as Record<string, unknown>).dataConfidence === "number"
      ? totalWasteCost * (((input as unknown as Record<string, unknown>).dataConfidence as number) / 100)
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


export interface Sin_tax_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
