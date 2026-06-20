// Auto-generated from restaurant-tip-calculator-schema.json
import * as z from 'zod';

export interface Restaurant_tip_calculatorInput {
  billAmount: number;
  taxAmount: number;
  tipPercentage: number;
  numberOfPeople: number;
  dataConfidence?: number;
}

export const Restaurant_tip_calculatorInputSchema = z.object({
  billAmount: z.number().default(0),
  taxAmount: z.number().default(0),
  tipPercentage: z.number().default(15),
  numberOfPeople: z.number().default(1),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Restaurant_tip_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.billAmount * input.tipPercentage / 100; results["tipAmount"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["tipAmount"] = Number.NaN; }
  try { const v = input.billAmount + input.taxAmount + (toNumericFormulaValue(results["tipAmount"])); results["totalBill"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["totalBill"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["totalBill"])) / input.numberOfPeople; results["perPerson"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["perPerson"] = Number.NaN; }
  return results;
}


export function calculateRestaurant_tip_calculator(input: Restaurant_tip_calculatorInput): Restaurant_tip_calculatorOutput {
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


export interface Restaurant_tip_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
