// @ts-nocheck
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

function asFormulaNumber(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Vacation_rental_calculatorInput): Record<string, number | string> {
  const results: Record<string, number | string> = {};
  try { const v = input.nightlyRate * input.numberOfNights; results["subtotal"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["subtotal"] = 0; }
  try { const v = (asFormulaNumber(results["subtotal"])) * (input.discountPercent / 100); results["discountAmount"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["discountAmount"] = 0; }
  try { const v = (asFormulaNumber(results["subtotal"])) - (asFormulaNumber(results["discountAmount"])); results["afterDiscount"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["afterDiscount"] = 0; }
  try { const v = (asFormulaNumber(results["afterDiscount"])) * (input.serviceFeePercent / 100); results["serviceFee"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["serviceFee"] = 0; }
  try { const v = (asFormulaNumber(results["afterDiscount"])) + input.cleaningFee + (asFormulaNumber(results["serviceFee"])); results["beforeTax"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["beforeTax"] = 0; }
  try { const v = (asFormulaNumber(results["beforeTax"])) * (input.taxRate / 100); results["tax"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["tax"] = 0; }
  try { const v = (asFormulaNumber(results["beforeTax"])) + (asFormulaNumber(results["tax"])); results["total"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["total"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

export function calculateVacation_rental_calculator(input: Vacation_rental_calculatorInput): Vacation_rental_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["total"]);
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


export interface Vacation_rental_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
