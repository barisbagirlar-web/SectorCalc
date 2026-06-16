// Auto-generated from tip-split-calculator-schema.json
import * as z from 'zod';

export interface Tip_split_calculatorInput {
  totalBill: number;
  tipPercentage: number;
  numberOfPeople: number;
  taxAmount: number;
  roundUp: number;
}

export const Tip_split_calculatorInputSchema = z.object({
  totalBill: z.number().default(100),
  tipPercentage: z.number().default(15),
  numberOfPeople: z.number().default(2),
  taxAmount: z.number().default(0),
  roundUp: z.number().default(0),
});

function evaluateAllFormulas(input: Tip_split_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.totalBill - input.taxAmount; results["subtotal"] = Number.isFinite(v) ? v : 0; } catch { results["subtotal"] = 0; }
  try { const v = (results["subtotal"] ?? 0) * input.tipPercentage / 100; results["tipAmount"] = Number.isFinite(v) ? v : 0; } catch { results["tipAmount"] = 0; }
  try { const v = input.totalBill + (results["tipAmount"] ?? 0); results["total"] = Number.isFinite(v) ? v : 0; } catch { results["total"] = 0; }
  try { const v = input.roundUp === 1 ? Math.ceil((results["total"] ?? 0) / input.numberOfPeople) : ((results["total"] ?? 0) / input.numberOfPeople); results["totalPerPerson"] = Number.isFinite(v) ? v : 0; } catch { results["totalPerPerson"] = 0; }
  try { const v = (results["tipAmount"] ?? 0) / input.numberOfPeople; results["tipPerPerson"] = Number.isFinite(v) ? v : 0; } catch { results["tipPerPerson"] = 0; }
  return results;
}


export function calculateTip_split_calculator(input: Tip_split_calculatorInput): Tip_split_calculatorOutput {
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


export interface Tip_split_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
