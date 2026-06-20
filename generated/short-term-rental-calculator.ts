// Auto-generated from short-term-rental-calculator-schema.json
import * as z from 'zod';

export interface Short_term_rental_calculatorInput {
  nightlyRate: number;
  numberOfNights: number;
  cleaningFee: number;
  serviceFeePercent: number;
  occupancyTaxPercent: number;
  discountPercent: number;
  dataConfidence?: number;
}

export const Short_term_rental_calculatorInputSchema = z.object({
  nightlyRate: z.number().default(0),
  numberOfNights: z.number().default(1),
  cleaningFee: z.number().default(0),
  serviceFeePercent: z.number().default(0),
  occupancyTaxPercent: z.number().default(0),
  discountPercent: z.number().default(0),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Short_term_rental_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.nightlyRate * input.numberOfNights; results["baseAmount"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["baseAmount"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["baseAmount"])) * input.serviceFeePercent / 100; results["serviceFee"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["serviceFee"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["baseAmount"])) * input.discountPercent / 100; results["discountAmount"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["discountAmount"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["baseAmount"])) + input.cleaningFee + (toNumericFormulaValue(results["serviceFee"])) - (toNumericFormulaValue(results["discountAmount"])); results["subtotal"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["subtotal"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["subtotal"])) * input.occupancyTaxPercent / 100; results["taxAmount"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["taxAmount"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["subtotal"])) + (toNumericFormulaValue(results["taxAmount"])); results["totalAmount"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["totalAmount"] = Number.NaN; }
  return results;
}


export function calculateShort_term_rental_calculator(input: Short_term_rental_calculatorInput): Short_term_rental_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["totalAmount"]);
  const breakdown = {
    
  };
  const hiddenLossDrivers: string[] = [];
  const suggestedActions: string[] = ["Review inputs and verify results against site standards."];
  const dataConfidenceAdjusted =
    typeof input.dataConfidence === "number"
      ? totalWasteCost * (input.dataConfidence / 100)
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
