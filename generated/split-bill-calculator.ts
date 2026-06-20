// Auto-generated from split-bill-calculator-schema.json
import * as z from 'zod';

export interface Split_bill_calculatorInput {
  totalBill: number;
  numberOfPeople: number;
  taxPercent: number;
  tipPercent: number;
  dataConfidence?: number;
}

export const Split_bill_calculatorInputSchema = z.object({
  totalBill: z.number().default(100),
  numberOfPeople: z.number().default(2),
  taxPercent: z.number().default(10),
  tipPercent: z.number().default(15),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Split_bill_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.totalBill * (1 + input.taxPercent / 100); results["totalWithTax"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["totalWithTax"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["totalWithTax"])) * (1 + input.tipPercent / 100); results["totalWithTip"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["totalWithTip"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["totalWithTip"])) / input.numberOfPeople; results["perPerson"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["perPerson"] = Number.NaN; }
  return results;
}


export function calculateSplit_bill_calculator(input: Split_bill_calculatorInput): Split_bill_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["perPerson"]);
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


export interface Split_bill_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
