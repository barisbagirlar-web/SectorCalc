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

function evaluateAllFormulas(input: Sin_tax_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.quantity * input.basePrice * (1 + input.sinTaxRate / 100) * (1 + input.vatRate / 100); results["totalPrice"] = Number.isFinite(v) ? v : 0; } catch { results["totalPrice"] = 0; }
  try { const v = input.quantity * input.basePrice * input.sinTaxRate / 100; results["sinTaxAmount"] = Number.isFinite(v) ? v : 0; } catch { results["sinTaxAmount"] = 0; }
  try { const v = input.quantity * input.basePrice * (1 + input.sinTaxRate / 100) * input.vatRate / 100; results["vatAmount"] = Number.isFinite(v) ? v : 0; } catch { results["vatAmount"] = 0; }
  try { const v = input.quantity * input.basePrice * (1 + input.sinTaxRate / 100); results["totalBeforeVat"] = Number.isFinite(v) ? v : 0; } catch { results["totalBeforeVat"] = 0; }
  return results;
}


export function calculateSin_tax_calculator(input: Sin_tax_calculatorInput): Sin_tax_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["totalPrice"] ?? 0;
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


export interface Sin_tax_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
