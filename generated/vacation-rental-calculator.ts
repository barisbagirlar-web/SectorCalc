// Auto-generated from vacation-rental-calculator-schema.json
import * as z from 'zod';

export interface Vacation_rental_calculatorInput {
  nightlyRate: number;
  numberOfNights: number;
  cleaningFee: number;
  serviceFeePercent: number;
  taxRate: number;
  discountPercent: number;
}

export const Vacation_rental_calculatorInputSchema = z.object({
  nightlyRate: z.number().default(150),
  numberOfNights: z.number().default(5),
  cleaningFee: z.number().default(50),
  serviceFeePercent: z.number().default(10),
  taxRate: z.number().default(8),
  discountPercent: z.number().default(0),
});

function evaluateAllFormulas(input: Vacation_rental_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.nightlyRate * input.numberOfNights; results["subtotal"] = Number.isFinite(v) ? v : 0; } catch { results["subtotal"] = 0; }
  try { const v = (results["subtotal"] ?? 0) * (input.discountPercent / 100); results["discountAmount"] = Number.isFinite(v) ? v : 0; } catch { results["discountAmount"] = 0; }
  try { const v = (results["subtotal"] ?? 0) - (results["discountAmount"] ?? 0); results["afterDiscount"] = Number.isFinite(v) ? v : 0; } catch { results["afterDiscount"] = 0; }
  try { const v = (results["afterDiscount"] ?? 0) * (input.serviceFeePercent / 100); results["serviceFee"] = Number.isFinite(v) ? v : 0; } catch { results["serviceFee"] = 0; }
  try { const v = (results["afterDiscount"] ?? 0) + input.cleaningFee + (results["serviceFee"] ?? 0); results["beforeTax"] = Number.isFinite(v) ? v : 0; } catch { results["beforeTax"] = 0; }
  try { const v = (results["beforeTax"] ?? 0) * (input.taxRate / 100); results["tax"] = Number.isFinite(v) ? v : 0; } catch { results["tax"] = 0; }
  try { const v = (results["beforeTax"] ?? 0) + (results["tax"] ?? 0); results["total"] = Number.isFinite(v) ? v : 0; } catch { results["total"] = 0; }
  return results;
}


export function calculateVacation_rental_calculator(input: Vacation_rental_calculatorInput): Vacation_rental_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["total"] ?? 0;
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


export interface Vacation_rental_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
