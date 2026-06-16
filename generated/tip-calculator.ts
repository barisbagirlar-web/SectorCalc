// Auto-generated from tip-calculator-schema.json
import * as z from 'zod';

export interface Tip_calculatorInput {
  billAmount: number;
  tipPercent: number;
  numberOfPeople: number;
  taxRate: number;
}

export const Tip_calculatorInputSchema = z.object({
  billAmount: z.number().default(100),
  tipPercent: z.number().default(15),
  numberOfPeople: z.number().default(2),
  taxRate: z.number().default(8),
});

function evaluateAllFormulas(input: Tip_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.billAmount * (input.taxRate / 100); results["taxAmount"] = Number.isFinite(v) ? v : 0; } catch { results["taxAmount"] = 0; }
  try { const v = input.billAmount + (results["taxAmount"] ?? 0); results["totalWithTax"] = Number.isFinite(v) ? v : 0; } catch { results["totalWithTax"] = 0; }
  try { const v = input.billAmount * (input.tipPercent / 100); results["tipAmount"] = Number.isFinite(v) ? v : 0; } catch { results["tipAmount"] = 0; }
  try { const v = (results["totalWithTax"] ?? 0) + (results["tipAmount"] ?? 0); results["totalAmount"] = Number.isFinite(v) ? v : 0; } catch { results["totalAmount"] = 0; }
  try { const v = (results["totalAmount"] ?? 0) / input.numberOfPeople; results["totalPerPerson"] = Number.isFinite(v) ? v : 0; } catch { results["totalPerPerson"] = 0; }
  return results;
}


export function calculateTip_calculator(input: Tip_calculatorInput): Tip_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["totalPerPerson"] ?? 0;
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


export interface Tip_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
