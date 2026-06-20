// Auto-generated from vacation-rental-calculator-schema.json
import * as z from 'zod';

export interface Vacation_rental_calculatorInput {
  nightlyRate: number;
  numberOfNights: number;
  cleaningFee: number;
  serviceFeePercent: number;
  taxRate: number;
  discountPercent: number;
  dataConfidence?: number;
}

export const Vacation_rental_calculatorInputSchema = z.object({
  nightlyRate: z.number().default(150),
  numberOfNights: z.number().default(5),
  cleaningFee: z.number().default(50),
  serviceFeePercent: z.number().default(10),
  taxRate: z.number().default(8),
  discountPercent: z.number().default(0),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Vacation_rental_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.nightlyRate * input.numberOfNights; results["subtotal"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["subtotal"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["subtotal"])) * (input.discountPercent / 100); results["discountAmount"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["discountAmount"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["subtotal"])) - (toNumericFormulaValue(results["discountAmount"])); results["afterDiscount"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["afterDiscount"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["afterDiscount"])) * (input.serviceFeePercent / 100); results["serviceFee"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["serviceFee"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["afterDiscount"])) + input.cleaningFee + (toNumericFormulaValue(results["serviceFee"])); results["beforeTax"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["beforeTax"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["beforeTax"])) * (input.taxRate / 100); results["tax"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["tax"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["beforeTax"])) + (toNumericFormulaValue(results["tax"])); results["total"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["total"] = Number.NaN; }
  return results;
}


export function calculateVacation_rental_calculator(input: Vacation_rental_calculatorInput): Vacation_rental_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["total"]);
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


export interface Vacation_rental_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
