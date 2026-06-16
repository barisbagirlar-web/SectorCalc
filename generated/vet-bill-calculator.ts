// Auto-generated from vet-bill-calculator-schema.json
import * as z from 'zod';

export interface Vet_bill_calculatorInput {
  consultationFee: number;
  medicationCost: number;
  procedureCost: number;
  labTestsCost: number;
  discountPercent: number;
}

export const Vet_bill_calculatorInputSchema = z.object({
  consultationFee: z.number().default(0),
  medicationCost: z.number().default(0),
  procedureCost: z.number().default(0),
  labTestsCost: z.number().default(0),
  discountPercent: z.number().default(0),
});

function evaluateAllFormulas(input: Vet_bill_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.consultationFee + input.medicationCost + input.procedureCost + input.labTestsCost; results["subtotal"] = Number.isFinite(v) ? v : 0; } catch { results["subtotal"] = 0; }
  try { const v = (results["subtotal"] ?? 0) * input.discountPercent / 100; results["discountAmount"] = Number.isFinite(v) ? v : 0; } catch { results["discountAmount"] = 0; }
  try { const v = (results["subtotal"] ?? 0) - (results["discountAmount"] ?? 0); results["totalBill"] = Number.isFinite(v) ? v : 0; } catch { results["totalBill"] = 0; }
  return results;
}


export function calculateVet_bill_calculator(input: Vet_bill_calculatorInput): Vet_bill_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["totalBill"] ?? 0;
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


export interface Vet_bill_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
