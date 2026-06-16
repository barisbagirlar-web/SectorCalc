// Auto-generated from split-bill-calculator-schema.json
import * as z from 'zod';

export interface Split_bill_calculatorInput {
  totalBill: number;
  numberOfPeople: number;
  taxPercent: number;
  tipPercent: number;
}

export const Split_bill_calculatorInputSchema = z.object({
  totalBill: z.number().default(100),
  numberOfPeople: z.number().default(2),
  taxPercent: z.number().default(10),
  tipPercent: z.number().default(15),
});

function evaluateAllFormulas(input: Split_bill_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.totalBill * (1 + input.taxPercent / 100); results["totalWithTax"] = Number.isFinite(v) ? v : 0; } catch { results["totalWithTax"] = 0; }
  try { const v = (results["totalWithTax"] ?? 0) * (1 + input.tipPercent / 100); results["totalWithTip"] = Number.isFinite(v) ? v : 0; } catch { results["totalWithTip"] = 0; }
  try { const v = (results["totalWithTip"] ?? 0) / input.numberOfPeople; results["perPerson"] = Number.isFinite(v) ? v : 0; } catch { results["perPerson"] = 0; }
  return results;
}


export function calculateSplit_bill_calculator(input: Split_bill_calculatorInput): Split_bill_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["perPerson"] ?? 0;
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


export interface Split_bill_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
