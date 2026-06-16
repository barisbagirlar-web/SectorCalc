// Auto-generated from expanded-form-calculator-schema.json
import * as z from 'zod';

export interface Expanded_form_calculatorInput {
  labor: number;
  material: number;
  overhead: number;
  discountPercent: number;
  profitMargin: number;
  taxRate: number;
}

export const Expanded_form_calculatorInputSchema = z.object({
  labor: z.number().default(0),
  material: z.number().default(0),
  overhead: z.number().default(0),
  discountPercent: z.number().default(0),
  profitMargin: z.number().default(20),
  taxRate: z.number().default(18),
});

function evaluateAllFormulas(input: Expanded_form_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.labor + input.material + input.overhead; results["subtotal"] = Number.isFinite(v) ? v : 0; } catch { results["subtotal"] = 0; }
  try { const v = (results["subtotal"] ?? 0) * input.discountPercent / 100; results["discountAmount"] = Number.isFinite(v) ? v : 0; } catch { results["discountAmount"] = 0; }
  try { const v = (results["subtotal"] ?? 0) - (results["discountAmount"] ?? 0); results["costAfterDiscount"] = Number.isFinite(v) ? v : 0; } catch { results["costAfterDiscount"] = 0; }
  try { const v = (results["costAfterDiscount"] ?? 0) * input.profitMargin / 100; results["profitAmount"] = Number.isFinite(v) ? v : 0; } catch { results["profitAmount"] = 0; }
  try { const v = (results["costAfterDiscount"] ?? 0) + (results["profitAmount"] ?? 0); results["taxableAmount"] = Number.isFinite(v) ? v : 0; } catch { results["taxableAmount"] = 0; }
  try { const v = (results["taxableAmount"] ?? 0) * input.taxRate / 100; results["taxAmount"] = Number.isFinite(v) ? v : 0; } catch { results["taxAmount"] = 0; }
  try { const v = (results["taxableAmount"] ?? 0) + (results["taxAmount"] ?? 0); results["total"] = Number.isFinite(v) ? v : 0; } catch { results["total"] = 0; }
  return results;
}


export function calculateExpanded_form_calculator(input: Expanded_form_calculatorInput): Expanded_form_calculatorOutput {
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


export interface Expanded_form_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
