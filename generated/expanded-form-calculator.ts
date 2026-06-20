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

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Expanded_form_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.labor + input.material + input.overhead; results["subtotal"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["subtotal"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["subtotal"])) * input.discountPercent / 100; results["discountAmount"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["discountAmount"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["subtotal"])) - (toNumericFormulaValue(results["discountAmount"])); results["costAfterDiscount"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["costAfterDiscount"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["costAfterDiscount"])) * input.profitMargin / 100; results["profitAmount"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["profitAmount"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["costAfterDiscount"])) + (toNumericFormulaValue(results["profitAmount"])); results["taxableAmount"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["taxableAmount"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["taxableAmount"])) * input.taxRate / 100; results["taxAmount"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["taxAmount"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["taxableAmount"])) + (toNumericFormulaValue(results["taxAmount"])); results["total"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["total"] = Number.NaN; }
  return results;
}


export function calculateExpanded_form_calculator(input: Expanded_form_calculatorInput): Expanded_form_calculatorOutput {
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


export interface Expanded_form_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
