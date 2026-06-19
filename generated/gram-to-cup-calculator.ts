// Auto-generated from gram-to-cup-calculator-schema.json
import * as z from 'zod';

export interface Gram_to_cup_calculatorInput {
  grams: number;
  density: number;
  cupVolume: number;
  packingFactor: number;
  dataConfidence?: number;
}

export const Gram_to_cup_calculatorInputSchema = z.object({
  grams: z.number().default(100),
  density: z.number().default(0.59),
  cupVolume: z.number().default(240),
  packingFactor: z.number().default(1),
});

function asFormulaNumber(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Gram_to_cup_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.grams / (input.density * input.packingFactor * input.cupVolume); results["cups"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["cups"] = 0; }
  try { const v = input.grams / (input.density * input.packingFactor); results["volumeML"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["volumeML"] = 0; }
  try { const v = input.density * input.packingFactor * input.cupVolume; results["gramsPerCup"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["gramsPerCup"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

export function calculateGram_to_cup_calculator(input: Gram_to_cup_calculatorInput): Gram_to_cup_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = Math.max(0, toNumericFormulaValue(values["cups"]));
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


export interface Gram_to_cup_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
