// Auto-generated from short-term-rental-calculator-schema.json
import * as z from 'zod';

export interface Short_term_rental_calculatorInput {
  nightlyRate: number;
  numberOfNights: number;
  cleaningFee: number;
  serviceFeePercent: number;
  occupancyTaxPercent: number;
  discountPercent: number;
}

export const Short_term_rental_calculatorInputSchema = z.object({
  nightlyRate: z.number().default(0),
  numberOfNights: z.number().default(1),
  cleaningFee: z.number().default(0),
  serviceFeePercent: z.number().default(0),
  occupancyTaxPercent: z.number().default(0),
  discountPercent: z.number().default(0),
});

function evaluateAllFormulas(input: Short_term_rental_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.nightlyRate * input.numberOfNights; results["baseAmount"] = Number.isFinite(v) ? v : 0; } catch { results["baseAmount"] = 0; }
  try { const v = (results["baseAmount"] ?? 0) * input.serviceFeePercent / 100; results["serviceFee"] = Number.isFinite(v) ? v : 0; } catch { results["serviceFee"] = 0; }
  try { const v = (results["baseAmount"] ?? 0) * input.discountPercent / 100; results["discountAmount"] = Number.isFinite(v) ? v : 0; } catch { results["discountAmount"] = 0; }
  try { const v = (results["baseAmount"] ?? 0) + input.cleaningFee + (results["serviceFee"] ?? 0) - (results["discountAmount"] ?? 0); results["subtotal"] = Number.isFinite(v) ? v : 0; } catch { results["subtotal"] = 0; }
  try { const v = (results["subtotal"] ?? 0) * input.occupancyTaxPercent / 100; results["taxAmount"] = Number.isFinite(v) ? v : 0; } catch { results["taxAmount"] = 0; }
  try { const v = (results["subtotal"] ?? 0) + (results["taxAmount"] ?? 0); results["totalAmount"] = Number.isFinite(v) ? v : 0; } catch { results["totalAmount"] = 0; }
  return results;
}


export function calculateShort_term_rental_calculator(input: Short_term_rental_calculatorInput): Short_term_rental_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["totalAmount"] ?? 0;
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


export interface Short_term_rental_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
