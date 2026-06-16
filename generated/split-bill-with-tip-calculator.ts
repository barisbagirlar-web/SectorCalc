// Auto-generated from split-bill-with-tip-calculator-schema.json
import * as z from 'zod';

export interface Split_bill_with_tip_calculatorInput {
  billAmount: number;
  tipPercentage: number;
  taxPercentage: number;
  numberOfPeople: number;
}

export const Split_bill_with_tip_calculatorInputSchema = z.object({
  billAmount: z.number().default(100),
  tipPercentage: z.number().default(15),
  taxPercentage: z.number().default(8),
  numberOfPeople: z.number().default(2),
});

function evaluateAllFormulas(input: Split_bill_with_tip_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.billAmount / input.numberOfPeople; results["subtotalPerPerson"] = Number.isFinite(v) ? v : 0; } catch { results["subtotalPerPerson"] = 0; }
  try { const v = input.billAmount * (input.tipPercentage / 100); results["tipAmount"] = Number.isFinite(v) ? v : 0; } catch { results["tipAmount"] = 0; }
  try { const v = input.billAmount * (input.taxPercentage / 100); results["taxAmount"] = Number.isFinite(v) ? v : 0; } catch { results["taxAmount"] = 0; }
  try { const v = input.billAmount * (input.tipPercentage / 100) / input.numberOfPeople; results["tipPerPerson"] = Number.isFinite(v) ? v : 0; } catch { results["tipPerPerson"] = 0; }
  try { const v = input.billAmount * (input.taxPercentage / 100) / input.numberOfPeople; results["taxPerPerson"] = Number.isFinite(v) ? v : 0; } catch { results["taxPerPerson"] = 0; }
  try { const v = (input.billAmount * (1 + input.tipPercentage / 100 + input.taxPercentage / 100)) / input.numberOfPeople; results["totalPerPerson"] = Number.isFinite(v) ? v : 0; } catch { results["totalPerPerson"] = 0; }
  try { const v = `Each person pays $${(results["totalPerPerson"] ?? 0).toFixed(2)}`; results["primaryText"] = Number.isFinite(v) ? v : 0; } catch { results["primaryText"] = 0; }
  try { const v = `Subtotal per person: $${(results["subtotalPerPerson"] ?? 0).toFixed(2)}`; results["subtotalText"] = Number.isFinite(v) ? v : 0; } catch { results["subtotalText"] = 0; }
  try { const v = `Tip per person: $${(results["tipPerPerson"] ?? 0).toFixed(2)}`; results["tipText"] = Number.isFinite(v) ? v : 0; } catch { results["tipText"] = 0; }
  try { const v = `Tax per person: $${(results["taxPerPerson"] ?? 0).toFixed(2)}`; results["taxText"] = Number.isFinite(v) ? v : 0; } catch { results["taxText"] = 0; }
  try { const v = `Total per person: $${(results["totalPerPerson"] ?? 0).toFixed(2)}`; results["totalText"] = Number.isFinite(v) ? v : 0; } catch { results["totalText"] = 0; }
  return results;
}


export function calculateSplit_bill_with_tip_calculator(input: Split_bill_with_tip_calculatorInput): Split_bill_with_tip_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["primaryText"] ?? 0;
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


export interface Split_bill_with_tip_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
