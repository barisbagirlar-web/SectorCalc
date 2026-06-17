// @ts-nocheck
// Auto-generated from carbon-offset-calculator-schema.json
import * as z from 'zod';

export interface Carbon_offset_calculatorInput {
  electricityUsage: number;
  naturalGasUsage: number;
  vehicleMiles: number;
  flightMiles: number;
  wasteGeneration: number;
  waterUsage: number;
}

export const Carbon_offset_calculatorInputSchema = z.object({
  electricityUsage: z.number().default(10000),
  naturalGasUsage: z.number().default(1000),
  vehicleMiles: z.number().default(12000),
  flightMiles: z.number().default(5000),
  wasteGeneration: z.number().default(2000),
  waterUsage: z.number().default(50000),
});

function asFormulaNumber(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Carbon_offset_calculatorInput): Record<string, number | string> {
  const results: Record<string, number | string> = {};
  try { const v = input.electricityUsage; results["emissions"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["emissions"] = 0; }
  try { const v = input.electricityUsage; results["emissions_aux"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["emissions_aux"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

export function calculateCarbon_offset_calculator(input: Carbon_offset_calculatorInput): Carbon_offset_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["emissions_aux"]);
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


export interface Carbon_offset_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
