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

function asFormulaNumber(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Tip_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.billAmount * (input.taxRate / 100); results["taxAmount"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["taxAmount"] = 0; }
  try { const v = input.billAmount + (asFormulaNumber(results["taxAmount"])); results["totalWithTax"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["totalWithTax"] = 0; }
  try { const v = input.billAmount * (input.tipPercent / 100); results["tipAmount"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["tipAmount"] = 0; }
  try { const v = (asFormulaNumber(results["totalWithTax"])) + (asFormulaNumber(results["tipAmount"])); results["totalAmount"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["totalAmount"] = 0; }
  try { const v = (asFormulaNumber(results["totalAmount"])) / input.numberOfPeople; results["totalPerPerson"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["totalPerPerson"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : 0;
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
