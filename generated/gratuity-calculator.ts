// Auto-generated from gratuity-calculator-schema.json
import * as z from 'zod';

export interface Gratuity_calculatorInput {
  billAmount: number;
  tipPercentage: number;
  numberOfPeople: number;
  serviceChargePercent: number;
}

export const Gratuity_calculatorInputSchema = z.object({
  billAmount: z.number().default(0),
  tipPercentage: z.number().default(15),
  numberOfPeople: z.number().default(1),
  serviceChargePercent: z.number().default(0),
});

function evaluateAllFormulas(input: Gratuity_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.billAmount * input.tipPercentage / 100; results["gratuityAmount"] = Number.isFinite(v) ? v : 0; } catch { results["gratuityAmount"] = 0; }
  try { const v = input.billAmount + (input.billAmount * input.tipPercentage / 100) + (input.billAmount * input.serviceChargePercent / 100); results["totalBill"] = Number.isFinite(v) ? v : 0; } catch { results["totalBill"] = 0; }
  try { const v = (input.billAmount + (input.billAmount * input.tipPercentage / 100) + (input.billAmount * input.serviceChargePercent / 100)) / input.numberOfPeople; results["perPersonAmount"] = Number.isFinite(v) ? v : 0; } catch { results["perPersonAmount"] = 0; }
  return results;
}


export function calculateGratuity_calculator(input: Gratuity_calculatorInput): Gratuity_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["gratuityAmount"] ?? 0;
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


export interface Gratuity_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
