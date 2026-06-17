// @ts-nocheck
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

function asFormulaNumber(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Split_bill_calculatorInput): Record<string, number | string> {
  const results: Record<string, number | string> = {};
  try { const v = input.totalBill * (1 + input.taxPercent / 100); results["totalWithTax"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["totalWithTax"] = 0; }
  try { const v = (asFormulaNumber(results["totalWithTax"])) * (1 + input.tipPercent / 100); results["totalWithTip"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["totalWithTip"] = 0; }
  try { const v = (asFormulaNumber(results["totalWithTip"])) / input.numberOfPeople; results["perPerson"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["perPerson"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

export function calculateSplit_bill_calculator(input: Split_bill_calculatorInput): Split_bill_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["perPerson"]);
  const breakdown = {
    
  };
  const hiddenLossDrivers: string[] = [];
  const suggestedActions: string[] = ["Review inputs and verify results against site standards."];
  const dataConfidenceAdjusted =
    typeof (input as unknown as Record<string, unknown>).dataConfidence === "number"
      ? totalWasteCost * (((input as unknown as Record<string, unknown>).dataConfidence as number) / 100)
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
