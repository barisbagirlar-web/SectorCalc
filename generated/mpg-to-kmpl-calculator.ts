// @ts-nocheck
// Auto-generated from mpg-to-kmpl-calculator-schema.json
import * as z from 'zod';

export interface Mpg_to_kmpl_calculatorInput {
  mpg: number;
  gallonType: number;
  decimalPlaces: number;
  customLitersPerGallon: number;
}

export const Mpg_to_kmpl_calculatorInputSchema = z.object({
  mpg: z.number().default(30),
  gallonType: z.number().default(0),
  decimalPlaces: z.number().default(2),
  customLitersPerGallon: z.number().default(0),
});

function asFormulaNumber(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Mpg_to_kmpl_calculatorInput): Record<string, number | string> {
  const results: Record<string, number | string> = {};
  try { const v = (input.customLitersPerGallon > 0) ? input.customLitersPerGallon : (input.gallonType === 1 ? 4.54609 : 3.785411784); results["litersUsed"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["litersUsed"] = 0; }
  try { const v = input.mpg * 1.609344 / (asFormulaNumber(results["litersUsed"])); results["kmPerLiterExact"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["kmPerLiterExact"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

export function calculateMpg_to_kmpl_calculator(input: Mpg_to_kmpl_calculatorInput): Mpg_to_kmpl_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["kmPerLiterExact"]);
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


export interface Mpg_to_kmpl_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
