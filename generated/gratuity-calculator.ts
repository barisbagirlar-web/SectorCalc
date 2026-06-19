// Auto-generated from gratuity-calculator-schema.json
import * as z from 'zod';

export interface Gratuity_calculatorInput {
  billAmount: number;
  tipPercentage: number;
  numberOfPeople: number;
  serviceChargePercent: number;
  dataConfidence?: number;
}

export const Gratuity_calculatorInputSchema = z.object({
  billAmount: z.number().default(0),
  tipPercentage: z.number().default(15),
  numberOfPeople: z.number().default(1),
  serviceChargePercent: z.number().default(0),
});

function asFormulaNumber(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Gratuity_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.billAmount * input.tipPercentage / 100; results["gratuityAmount"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["gratuityAmount"] = 0; }
  try { const v = input.billAmount + (input.billAmount * input.tipPercentage / 100) + (input.billAmount * input.serviceChargePercent / 100); results["totalBill"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["totalBill"] = 0; }
  try { const v = (input.billAmount + (input.billAmount * input.tipPercentage / 100) + (input.billAmount * input.serviceChargePercent / 100)) / input.numberOfPeople; results["perPersonAmount"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["perPersonAmount"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

export function calculateGratuity_calculator(input: Gratuity_calculatorInput): Gratuity_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["gratuityAmount"]);
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


export interface Gratuity_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
