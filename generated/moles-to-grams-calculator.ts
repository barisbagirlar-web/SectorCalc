// Auto-generated from moles-to-grams-calculator-schema.json
import * as z from 'zod';

export interface Moles_to_grams_calculatorInput {
  moles: number;
  molecularWeight: number;
  purity: number;
  scalingFactor: number;
  tolerance: number;
  dataConfidence?: number;
}

export const Moles_to_grams_calculatorInputSchema = z.object({
  moles: z.number().default(1),
  molecularWeight: z.number().default(18.015),
  purity: z.number().default(100),
  scalingFactor: z.number().default(1),
  tolerance: z.number().default(0),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Moles_to_grams_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.moles * input.molecularWeight; results["theoreticalMass"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["theoreticalMass"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["theoreticalMass"])) * (input.purity / 100); results["purityEffect"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["purityEffect"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["purityEffect"])) * input.scalingFactor; results["grams"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["grams"] = Number.NaN; }
  return results;
}


export function calculateMoles_to_grams_calculator(input: Moles_to_grams_calculatorInput): Moles_to_grams_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["grams"]);
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


export interface Moles_to_grams_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
