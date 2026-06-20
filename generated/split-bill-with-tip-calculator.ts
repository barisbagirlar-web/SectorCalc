// Auto-generated from split-bill-with-tip-calculator-schema.json
import * as z from 'zod';

export interface Split_bill_with_tip_calculatorInput {
  billAmount: number;
  tipPercentage: number;
  taxPercentage: number;
  numberOfPeople: number;
  dataConfidence?: number;
}

export const Split_bill_with_tip_calculatorInputSchema = z.object({
  billAmount: z.number().default(100),
  tipPercentage: z.number().default(15),
  taxPercentage: z.number().default(8),
  numberOfPeople: z.number().default(2),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Split_bill_with_tip_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.billAmount / input.numberOfPeople; results["subtotalPerPerson"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["subtotalPerPerson"] = Number.NaN; }
  try { const v = input.billAmount * (input.tipPercentage / 100); results["tipAmount"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["tipAmount"] = Number.NaN; }
  try { const v = input.billAmount * (input.taxPercentage / 100); results["taxAmount"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["taxAmount"] = Number.NaN; }
  try { const v = input.billAmount * (input.tipPercentage / 100) / input.numberOfPeople; results["tipPerPerson"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["tipPerPerson"] = Number.NaN; }
  try { const v = input.billAmount * (input.taxPercentage / 100) / input.numberOfPeople; results["taxPerPerson"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["taxPerPerson"] = Number.NaN; }
  try { const v = (input.billAmount * (1 + input.tipPercentage / 100 + input.taxPercentage / 100)) / input.numberOfPeople; results["totalPerPerson"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["totalPerPerson"] = Number.NaN; }
  return results;
}


export function calculateSplit_bill_with_tip_calculator(input: Split_bill_with_tip_calculatorInput): Split_bill_with_tip_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["totalPerPerson"]);
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


export interface Split_bill_with_tip_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
