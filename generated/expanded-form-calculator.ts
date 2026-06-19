// Auto-generated from expanded-form-calculator-schema.json
import * as z from 'zod';

export interface Expanded_form_calculatorInput {
  labor: number;
  material: number;
  overhead: number;
  discountPercent: number;
  profitMargin: number;
  taxRate: number;
  dataConfidence?: number;
}

export const Expanded_form_calculatorInputSchema = z.object({
  labor: z.number().default(0),
  material: z.number().default(0),
  overhead: z.number().default(0),
  discountPercent: z.number().default(0),
  profitMargin: z.number().default(20),
  taxRate: z.number().default(18),
});

function asFormulaNumber(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Expanded_form_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.labor + input.material + input.overhead; results["subtotal"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["subtotal"] = 0; }
  try { const v = (asFormulaNumber(results["subtotal"])) * input.discountPercent / 100; results["discountAmount"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["discountAmount"] = 0; }
  try { const v = (asFormulaNumber(results["subtotal"])) - (asFormulaNumber(results["discountAmount"])); results["costAfterDiscount"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["costAfterDiscount"] = 0; }
  try { const v = (asFormulaNumber(results["costAfterDiscount"])) * input.profitMargin / 100; results["profitAmount"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["profitAmount"] = 0; }
  try { const v = (asFormulaNumber(results["costAfterDiscount"])) + (asFormulaNumber(results["profitAmount"])); results["taxableAmount"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["taxableAmount"] = 0; }
  try { const v = (asFormulaNumber(results["taxableAmount"])) * input.taxRate / 100; results["taxAmount"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["taxAmount"] = 0; }
  try { const v = (asFormulaNumber(results["taxableAmount"])) + (asFormulaNumber(results["taxAmount"])); results["total"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["total"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

export function calculateExpanded_form_calculator(input: Expanded_form_calculatorInput): Expanded_form_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = Math.max(0, toNumericFormulaValue(values["total"]));
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


export interface Expanded_form_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
