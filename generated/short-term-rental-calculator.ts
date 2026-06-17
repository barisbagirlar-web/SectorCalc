// @ts-nocheck
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

function asFormulaNumber(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Short_term_rental_calculatorInput): Record<string, number | string> {
  const results: Record<string, number | string> = {};
  try { const v = input.nightlyRate * input.numberOfNights; results["baseAmount"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["baseAmount"] = 0; }
  try { const v = (asFormulaNumber(results["baseAmount"])) * input.serviceFeePercent / 100; results["serviceFee"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["serviceFee"] = 0; }
  try { const v = (asFormulaNumber(results["baseAmount"])) * input.discountPercent / 100; results["discountAmount"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["discountAmount"] = 0; }
  try { const v = (asFormulaNumber(results["baseAmount"])) + input.cleaningFee + (asFormulaNumber(results["serviceFee"])) - (asFormulaNumber(results["discountAmount"])); results["subtotal"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["subtotal"] = 0; }
  try { const v = (asFormulaNumber(results["subtotal"])) * input.occupancyTaxPercent / 100; results["taxAmount"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["taxAmount"] = 0; }
  try { const v = (asFormulaNumber(results["subtotal"])) + (asFormulaNumber(results["taxAmount"])); results["totalAmount"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["totalAmount"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

export function calculateShort_term_rental_calculator(input: Short_term_rental_calculatorInput): Short_term_rental_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["totalAmount"]);
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


export interface Short_term_rental_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
