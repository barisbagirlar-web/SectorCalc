// @ts-nocheck
// Auto-generated from imperial-gallons-to-us-gallons-calculator-schema.json
import * as z from 'zod';

export interface Imperial_gallons_to_us_gallons_calculatorInput {
  imperialGallons: number;
  batchSize: number;
  tolerance: number;
  temperature: number;
}

export const Imperial_gallons_to_us_gallons_calculatorInputSchema = z.object({
  imperialGallons: z.number().default(1),
  batchSize: z.number().default(1),
  tolerance: z.number().default(0),
  temperature: z.number().default(20),
});

function asFormulaNumber(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Imperial_gallons_to_us_gallons_calculatorInput): Record<string, number | string> {
  const results: Record<string, number | string> = {};
  try { const v = input.imperialGallons + input.batchSize + input.tolerance; results["result"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["result"] = 0; }
  try { const v = input.imperialGallons + input.batchSize + input.tolerance; results["result_copy"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["result_copy"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

export function calculateImperial_gallons_to_us_gallons_calculator(input: Imperial_gallons_to_us_gallons_calculatorInput): Imperial_gallons_to_us_gallons_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["result"]);
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


export interface Imperial_gallons_to_us_gallons_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
