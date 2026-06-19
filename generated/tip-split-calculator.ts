// Auto-generated from tip-split-calculator-schema.json
import * as z from 'zod';

export interface Tip_split_calculatorInput {
  totalBill: number;
  tipPercentage: number;
  numberOfPeople: number;
  taxAmount: number;
  roundUp: number;
  dataConfidence?: number;
}

export const Tip_split_calculatorInputSchema = z.object({
  totalBill: z.number().default(100),
  tipPercentage: z.number().default(15),
  numberOfPeople: z.number().default(2),
  taxAmount: z.number().default(0),
  roundUp: z.number().default(0),
});

function asFormulaNumber(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Tip_split_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.totalBill - input.taxAmount; results["subtotal"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["subtotal"] = 0; }
  try { const v = (asFormulaNumber(results["subtotal"])) * input.tipPercentage / 100; results["tipAmount"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["tipAmount"] = 0; }
  try { const v = input.totalBill + (asFormulaNumber(results["tipAmount"])); results["total"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["total"] = 0; }
  try { const v = (asFormulaNumber(results["tipAmount"])) / input.numberOfPeople; results["tipPerPerson"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["tipPerPerson"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

export function calculateTip_split_calculator(input: Tip_split_calculatorInput): Tip_split_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = Math.max(0, toNumericFormulaValue(values["tipPerPerson"]));
  const breakdown = {
    
  };
  const hiddenLossDrivers: string[] = [];
  const suggestedActions: string[] = ["Review inputs and verify results against site standards."];
  const dataConfidenceAdjusted =
    typeof input.dataConfidence === "number"
      ? Math.max(0, totalWasteCost * (input.dataConfidence / 100))
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
