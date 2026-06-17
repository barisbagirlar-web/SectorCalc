// @ts-nocheck
// Auto-generated from net-price-calculator-schema.json
import * as z from 'zod';

export interface Net_price_calculatorInput {
  listPrice: number;
  discountPercent: number;
  vatPercent: number;
  extraCharge: number;
}

export const Net_price_calculatorInputSchema = z.object({
  listPrice: z.number().default(100),
  discountPercent: z.number().default(10),
  vatPercent: z.number().default(20),
  extraCharge: z.number().default(0),
});

function asFormulaNumber(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Net_price_calculatorInput): Record<string, number | string> {
  const results: Record<string, number | string> = {};
  try { const v = input.listPrice * (1 - input.discountPercent / 100) + input.extraCharge; results["discountedPrice"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["discountedPrice"] = 0; }
  try { const v = (input.listPrice * (1 - input.discountPercent / 100) + input.extraCharge) * input.vatPercent / 100; results["vatAmount"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["vatAmount"] = 0; }
  try { const v = (input.listPrice * (1 - input.discountPercent / 100) + input.extraCharge) * (1 + input.vatPercent / 100); results["netPrice"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["netPrice"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

export function calculateNet_price_calculator(input: Net_price_calculatorInput): Net_price_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["netPrice"]);
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


export interface Net_price_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
