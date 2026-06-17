// @ts-nocheck
// Auto-generated from grams-to-moles-calculator-schema.json
import * as z from 'zod';

export interface Grams_to_moles_calculatorInput {
  mass_in_grams: number;
  molecular_weight: number;
  purity_percent: number;
  yield_percent: number;
}

export const Grams_to_moles_calculatorInputSchema = z.object({
  mass_in_grams: z.number().default(0),
  molecular_weight: z.number().default(18.015),
  purity_percent: z.number().default(100),
  yield_percent: z.number().default(100),
});

function asFormulaNumber(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Grams_to_moles_calculatorInput): Record<string, number | string> {
  const results: Record<string, number | string> = {};
  try { const v = input.mass_in_grams * (input.purity_percent / 100); results["effectiveMass"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["effectiveMass"] = 0; }
  try { const v = (asFormulaNumber(results["effectiveMass"])) / input.molecular_weight; results["theoreticalMoles"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["theoreticalMoles"] = 0; }
  try { const v = (asFormulaNumber(results["theoreticalMoles"])) * (input.yield_percent / 100); results["actualMoles"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["actualMoles"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

export function calculateGrams_to_moles_calculator(input: Grams_to_moles_calculatorInput): Grams_to_moles_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["actualMoles"]);
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


export interface Grams_to_moles_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
