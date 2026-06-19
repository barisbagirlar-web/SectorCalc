// Auto-generated from net-price-calculator-schema.json
import * as z from 'zod';

export interface Net_price_calculatorInput {
  listPrice: number;
  discountPercent: number;
  vatPercent: number;
  extraCharge: number;
  dataConfidence?: number;
}

export const Net_price_calculatorInputSchema = z.object({
  listPrice: z.number().default(100),
  discountPercent: z.number().default(10),
  vatPercent: z.number().default(20),
  extraCharge: z.number().default(0),
});

function asFormulaNumber(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Net_price_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.listPrice * (1 - input.discountPercent / 100) + input.extraCharge; results["discountedPrice"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["discountedPrice"] = 0; }
  try { const v = (input.listPrice * (1 - input.discountPercent / 100) + input.extraCharge) * input.vatPercent / 100; results["vatAmount"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["vatAmount"] = 0; }
  try { const v = (input.listPrice * (1 - input.discountPercent / 100) + input.extraCharge) * (1 + input.vatPercent / 100); results["netPrice"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["netPrice"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

export function calculateNet_price_calculator(input: Net_price_calculatorInput): Net_price_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = Math.max(0, toNumericFormulaValue(values["netPrice"]));
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


export interface Net_price_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
