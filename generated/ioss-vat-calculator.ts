// Auto-generated from ioss-vat-calculator-schema.json
import * as z from 'zod';

export interface Ioss_vat_calculatorInput {
  netPrice: number;
  shippingCost: number;
  vatRate: number;
}

export const Ioss_vat_calculatorInputSchema = z.object({
  netPrice: z.number().default(0),
  shippingCost: z.number().default(0),
  vatRate: z.number().default(21),
});

function evaluateAllFormulas(input: Ioss_vat_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.netPrice + input.shippingCost; results["totalExcl"] = Number.isFinite(v) ? v : 0; } catch { results["totalExcl"] = 0; }
  try { const v = (results["totalExcl"] ?? 0) * input.vatRate / 100; results["vatAmount"] = Number.isFinite(v) ? v : 0; } catch { results["vatAmount"] = 0; }
  try { const v = (results["totalExcl"] ?? 0) + (results["vatAmount"] ?? 0); results["totalIncl"] = Number.isFinite(v) ? v : 0; } catch { results["totalIncl"] = 0; }
  return results;
}


export function calculateIoss_vat_calculator(input: Ioss_vat_calculatorInput): Ioss_vat_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["totalIncl"] ?? 0;
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


export interface Ioss_vat_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
