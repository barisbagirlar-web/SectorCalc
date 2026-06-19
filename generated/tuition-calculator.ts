// Auto-generated from tuition-calculator-schema.json
import * as z from 'zod';

export interface Tuition_calculatorInput {
  tuitionPerCredit: number;
  numberOfCredits: number;
  additionalFees: number;
  discountPercent: number;
  taxRate: number;
  scholarship: number;
  dataConfidence?: number;
}

export const Tuition_calculatorInputSchema = z.object({
  tuitionPerCredit: z.number().default(100),
  numberOfCredits: z.number().default(15),
  additionalFees: z.number().default(0),
  discountPercent: z.number().default(0),
  taxRate: z.number().default(0),
  scholarship: z.number().default(0),
});

function asFormulaNumber(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Tuition_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.tuitionPerCredit * input.numberOfCredits + input.additionalFees; results["subtotal"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["subtotal"] = 0; }
  try { const v = (asFormulaNumber(results["subtotal"])) * (input.discountPercent / 100); results["discountAmount"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["discountAmount"] = 0; }
  try { const v = (asFormulaNumber(results["subtotal"])) - (asFormulaNumber(results["discountAmount"])); results["subtotalAfterDiscount"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["subtotalAfterDiscount"] = 0; }
  try { const v = (asFormulaNumber(results["subtotalAfterDiscount"])) * (input.taxRate / 100); results["taxAmount"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["taxAmount"] = 0; }
  try { const v = (asFormulaNumber(results["subtotalAfterDiscount"])) + (asFormulaNumber(results["taxAmount"])); results["totalBeforeScholarship"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["totalBeforeScholarship"] = 0; }
  try { const v = (asFormulaNumber(results["totalBeforeScholarship"])) - input.scholarship; results["totalTuition"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["totalTuition"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

export function calculateTuition_calculator(input: Tuition_calculatorInput): Tuition_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = Math.max(0, toNumericFormulaValue(values["totalTuition"]));
  const breakdown = {
    
  };
  const hiddenLossDrivers: string[] = [];
  const suggestedActions: string[] = ["Review inputs and verify results against site standards."];
  const dataConfidenceAdjusted =
    typeof input.dataConfidence === "number"
      ? Math.max(0, totalWasteCost * (input.dataConfidence / 100))
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


export interface Tuition_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
