// Auto-generated from oss-vat-calculator-schema.json
import * as z from 'zod';

export interface Oss_vat_calculatorInput {
  netAmount: number;
  vatRate: number;
  quantity: number;
  discount: number;
  additionalCost: number;
}

export const Oss_vat_calculatorInputSchema = z.object({
  netAmount: z.number().default(1000),
  vatRate: z.number().default(20),
  quantity: z.number().default(1),
  discount: z.number().default(0),
  additionalCost: z.number().default(0),
});

function evaluateAllFormulas(input: Oss_vat_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.netAmount * (1 - input.discount / 100); results["discountedNet"] = Number.isFinite(v) ? v : 0; } catch { results["discountedNet"] = 0; }
  try { const v = (results["discountedNet"] ?? 0) * input.quantity + input.additionalCost; results["totalNet"] = Number.isFinite(v) ? v : 0; } catch { results["totalNet"] = 0; }
  try { const v = (results["totalNet"] ?? 0) * input.vatRate / 100; results["vatAmount"] = Number.isFinite(v) ? v : 0; } catch { results["vatAmount"] = 0; }
  try { const v = (results["totalNet"] ?? 0) + (results["vatAmount"] ?? 0); results["grossTotal"] = Number.isFinite(v) ? v : 0; } catch { results["grossTotal"] = 0; }
  return results;
}


export function calculateOss_vat_calculator(input: Oss_vat_calculatorInput): Oss_vat_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["grossTotal"] ?? 0;
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


export interface Oss_vat_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
