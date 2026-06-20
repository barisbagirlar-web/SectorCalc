// Auto-generated from tip-calculator-schema.json
import * as z from 'zod';

export interface Tip_calculatorInput {
  billAmount: number;
  tipPercent: number;
  numberOfPeople: number;
  taxRate: number;
  dataConfidence?: number;
}

export const Tip_calculatorInputSchema = z.object({
  billAmount: z.number().default(100),
  tipPercent: z.number().default(15),
  numberOfPeople: z.number().default(2),
  taxRate: z.number().default(8),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Tip_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.billAmount * (input.taxRate / 100); results["taxAmount"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["taxAmount"] = Number.NaN; }
  try { const v = input.billAmount + (toNumericFormulaValue(results["taxAmount"])); results["totalWithTax"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["totalWithTax"] = Number.NaN; }
  try { const v = input.billAmount * (input.tipPercent / 100); results["tipAmount"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["tipAmount"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["totalWithTax"])) + (toNumericFormulaValue(results["tipAmount"])); results["totalAmount"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["totalAmount"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["totalAmount"])) / input.numberOfPeople; results["totalPerPerson"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["totalPerPerson"] = Number.NaN; }
  return results;
}


export function calculateTip_calculator(input: Tip_calculatorInput): Tip_calculatorOutput {
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


export interface Tip_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
