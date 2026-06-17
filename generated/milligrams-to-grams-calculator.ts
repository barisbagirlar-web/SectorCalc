// @ts-nocheck
// Auto-generated from milligrams-to-grams-calculator-schema.json
import * as z from 'zod';

export interface Milligrams_to_grams_calculatorInput {
  inputMilligrams: number;
  conversionFactor: number;
  decimalPlaces: number;
  batchMultiplier: number;
  roundingMode: number;
}

export const Milligrams_to_grams_calculatorInputSchema = z.object({
  inputMilligrams: z.number().default(0),
  conversionFactor: z.number().default(0.001),
  decimalPlaces: z.number().default(3),
  batchMultiplier: z.number().default(1),
  roundingMode: z.number().default(0),
});

function asFormulaNumber(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Milligrams_to_grams_calculatorInput): Record<string, number | string> {
  const results: Record<string, number | string> = {};
  try { const v = input.inputMilligrams * input.conversionFactor * input.batchMultiplier; results["rawGrams"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["rawGrams"] = 0; }
  try { const v = input.inputMilligrams; results["inputMilligrams"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["inputMilligrams"] = 0; }
  try { const v = input.conversionFactor; results["conversionFactor"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["conversionFactor"] = 0; }
  try { const v = input.batchMultiplier; results["batchMultiplier"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["batchMultiplier"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

export function calculateMilligrams_to_grams_calculator(input: Milligrams_to_grams_calculatorInput): Milligrams_to_grams_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["batchMultiplier"]);
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


export interface Milligrams_to_grams_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
