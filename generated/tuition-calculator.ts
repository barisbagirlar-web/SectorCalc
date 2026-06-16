// Auto-generated from tuition-calculator-schema.json
import * as z from 'zod';

export interface Tuition_calculatorInput {
  tuitionPerCredit: number;
  numberOfCredits: number;
  additionalFees: number;
  discountPercent: number;
  taxRate: number;
  scholarship: number;
}

export const Tuition_calculatorInputSchema = z.object({
  tuitionPerCredit: z.number().default(100),
  numberOfCredits: z.number().default(15),
  additionalFees: z.number().default(0),
  discountPercent: z.number().default(0),
  taxRate: z.number().default(0),
  scholarship: z.number().default(0),
});

function evaluateAllFormulas(input: Tuition_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.tuitionPerCredit * input.numberOfCredits + input.additionalFees; results["subtotal"] = Number.isFinite(v) ? v : 0; } catch { results["subtotal"] = 0; }
  try { const v = (results["subtotal"] ?? 0) * (input.discountPercent / 100); results["discountAmount"] = Number.isFinite(v) ? v : 0; } catch { results["discountAmount"] = 0; }
  try { const v = (results["subtotal"] ?? 0) - (results["discountAmount"] ?? 0); results["subtotalAfterDiscount"] = Number.isFinite(v) ? v : 0; } catch { results["subtotalAfterDiscount"] = 0; }
  try { const v = (results["subtotalAfterDiscount"] ?? 0) * (input.taxRate / 100); results["taxAmount"] = Number.isFinite(v) ? v : 0; } catch { results["taxAmount"] = 0; }
  try { const v = (results["subtotalAfterDiscount"] ?? 0) + (results["taxAmount"] ?? 0); results["totalBeforeScholarship"] = Number.isFinite(v) ? v : 0; } catch { results["totalBeforeScholarship"] = 0; }
  try { const v = (results["totalBeforeScholarship"] ?? 0) - input.scholarship; results["totalTuition"] = Number.isFinite(v) ? v : 0; } catch { results["totalTuition"] = 0; }
  return results;
}


export function calculateTuition_calculator(input: Tuition_calculatorInput): Tuition_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["totalTuition"] ?? 0;
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


export interface Tuition_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
