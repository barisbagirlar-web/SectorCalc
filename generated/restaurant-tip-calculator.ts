// Auto-generated from restaurant-tip-calculator-schema.json
import * as z from 'zod';

export interface Restaurant_tip_calculatorInput {
  billAmount: number;
  taxAmount: number;
  tipPercentage: number;
  numberOfPeople: number;
}

export const Restaurant_tip_calculatorInputSchema = z.object({
  billAmount: z.number().default(0),
  taxAmount: z.number().default(0),
  tipPercentage: z.number().default(15),
  numberOfPeople: z.number().default(1),
});

function evaluateAllFormulas(input: Restaurant_tip_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.billAmount * input.tipPercentage / 100; results["tipAmount"] = Number.isFinite(v) ? v : 0; } catch { results["tipAmount"] = 0; }
  try { const v = input.billAmount + input.taxAmount + (results["tipAmount"] ?? 0); results["totalBill"] = Number.isFinite(v) ? v : 0; } catch { results["totalBill"] = 0; }
  try { const v = (results["totalBill"] ?? 0) / input.numberOfPeople; results["perPerson"] = Number.isFinite(v) ? v : 0; } catch { results["perPerson"] = 0; }
  return results;
}


export function calculateRestaurant_tip_calculator(input: Restaurant_tip_calculatorInput): Restaurant_tip_calculatorOutput {
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


export interface Restaurant_tip_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
