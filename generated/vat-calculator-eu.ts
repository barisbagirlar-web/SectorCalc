// Auto-generated from vat-calculator-eu-schema.json
import * as z from 'zod';

export interface Vat_calculator_euInput {
  netAmount: number;
  vatRate: number;
  quantity: number;
  discountPercent: number;
}

export const Vat_calculator_euInputSchema = z.object({
  netAmount: z.number().default(100),
  vatRate: z.number().default(20),
  quantity: z.number().default(1),
  discountPercent: z.number().default(0),
});

function evaluateAllFormulas(input: Vat_calculator_euInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.netAmount * (1 - input.discountPercent / 100); results["discountedNet"] = Number.isFinite(v) ? v : 0; } catch { results["discountedNet"] = 0; }
  try { const v = (results["discountedNet"] ?? 0) * (input.vatRate / 100); results["vatAmount"] = Number.isFinite(v) ? v : 0; } catch { results["vatAmount"] = 0; }
  try { const v = (results["discountedNet"] ?? 0) + (results["vatAmount"] ?? 0); results["grossAmount"] = Number.isFinite(v) ? v : 0; } catch { results["grossAmount"] = 0; }
  try { const v = (results["discountedNet"] ?? 0) * input.quantity; results["totalNet"] = Number.isFinite(v) ? v : 0; } catch { results["totalNet"] = 0; }
  try { const v = (results["vatAmount"] ?? 0) * input.quantity; results["totalVat"] = Number.isFinite(v) ? v : 0; } catch { results["totalVat"] = 0; }
  try { const v = (results["grossAmount"] ?? 0) * input.quantity; results["totalGross"] = Number.isFinite(v) ? v : 0; } catch { results["totalGross"] = 0; }
  return results;
}


export function calculateVat_calculator_eu(input: Vat_calculator_euInput): Vat_calculator_euOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["totalGross"] ?? 0;
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


export interface Vat_calculator_euOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
