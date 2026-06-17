// @ts-nocheck
// Auto-generated from rods-to-feet-calculator-schema.json
import * as z from 'zod';

export interface Rods_to_feet_calculatorInput {
  rods: number;
  feetPerRod: number;
  decimalPlaces: number;
  safetyFactor: number;
  tolerance: number;
}

export const Rods_to_feet_calculatorInputSchema = z.object({
  rods: z.number().default(1),
  feetPerRod: z.number().default(16.5),
  decimalPlaces: z.number().default(2),
  safetyFactor: z.number().default(0),
  tolerance: z.number().default(0),
});

function asFormulaNumber(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Rods_to_feet_calculatorInput): Record<string, number | string> {
  const results: Record<string, number | string> = {};
  try { const v = input.rods * input.feetPerRod; results["baseFeet"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["baseFeet"] = 0; }
  try { const v = (asFormulaNumber(results["baseFeet"])) * (1 + input.safetyFactor / 100); results["safetyFeet"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["safetyFeet"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

export function calculateRods_to_feet_calculator(input: Rods_to_feet_calculatorInput): Rods_to_feet_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["safetyFeet"]);
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


export interface Rods_to_feet_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
