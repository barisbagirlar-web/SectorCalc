// Auto-generated from vat-moss-calculator-schema.json
import * as z from 'zod';

export interface Vat_moss_calculatorInput {
  netAmount: number;
  vatRate: number;
  quantity: number;
  discountPercent: number;
  additionalCosts: number;
}

export const Vat_moss_calculatorInputSchema = z.object({
  netAmount: z.number().default(100),
  vatRate: z.number().default(20),
  quantity: z.number().default(1),
  discountPercent: z.number().default(0),
  additionalCosts: z.number().default(0),
});

function evaluateAllFormulas(input: Vat_moss_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = (input.netAmount * input.quantity) * (1 - input.discountPercent/100) + input.additionalCosts; results["taxableAmount"] = Number.isFinite(v) ? v : 0; } catch { results["taxableAmount"] = 0; }
  try { const v = (results["taxableAmount"] ?? 0) * (input.vatRate/100); results["vatAmount"] = Number.isFinite(v) ? v : 0; } catch { results["vatAmount"] = 0; }
  try { const v = (results["taxableAmount"] ?? 0) + (results["vatAmount"] ?? 0); results["grossAmount"] = Number.isFinite(v) ? v : 0; } catch { results["grossAmount"] = 0; }
  return results;
}


export function calculateVat_moss_calculator(input: Vat_moss_calculatorInput): Vat_moss_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["vatAmount"] ?? 0;
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


export interface Vat_moss_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
