// @ts-nocheck
// Auto-generated from miles-to-meters-calculator-schema.json
import * as z from 'zod';

export interface Miles_to_meters_calculatorInput {
  miles: number;
  conversion_factor: number;
  precision: number;
  rounding_mode: number;
}

export const Miles_to_meters_calculatorInputSchema = z.object({
  miles: z.number().default(1),
  conversion_factor: z.number().default(1609.344),
  precision: z.number().default(2),
  rounding_mode: z.number().default(0),
});

function asFormulaNumber(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Miles_to_meters_calculatorInput): Record<string, number | string> {
  const results: Record<string, number | string> = {};
  try { const v = input.miles * input.conversion_factor; results["raw_meters"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["raw_meters"] = 0; }
  try { const v = input.miles * input.conversion_factor; results["raw_meters_aux"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["raw_meters_aux"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

export function calculateMiles_to_meters_calculator(input: Miles_to_meters_calculatorInput): Miles_to_meters_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["raw_meters_aux"]);
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


export interface Miles_to_meters_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
