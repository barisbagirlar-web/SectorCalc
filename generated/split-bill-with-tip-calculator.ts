// @ts-nocheck
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

function asFormulaNumber(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Split_bill_with_tip_calculatorInput): Record<string, number | string> {
  const results: Record<string, number | string> = {};
  try { const v = input.billAmount / input.numberOfPeople; results["subtotalPerPerson"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["subtotalPerPerson"] = 0; }
  try { const v = input.billAmount * (input.tipPercentage / 100); results["tipAmount"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["tipAmount"] = 0; }
  try { const v = input.billAmount * (input.taxPercentage / 100); results["taxAmount"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["taxAmount"] = 0; }
  try { const v = input.billAmount * (input.tipPercentage / 100) / input.numberOfPeople; results["tipPerPerson"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["tipPerPerson"] = 0; }
  try { const v = input.billAmount * (input.taxPercentage / 100) / input.numberOfPeople; results["taxPerPerson"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["taxPerPerson"] = 0; }
  try { const v = (input.billAmount * (1 + input.tipPercentage / 100 + input.taxPercentage / 100)) / input.numberOfPeople; results["totalPerPerson"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["totalPerPerson"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

export function calculateSplit_bill_with_tip_calculator(input: Split_bill_with_tip_calculatorInput): Split_bill_with_tip_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["totalPerPerson"]);
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


export interface Split_bill_with_tip_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
