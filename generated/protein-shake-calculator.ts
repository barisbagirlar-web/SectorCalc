// Auto-generated from protein-shake-calculator-schema.json
import * as z from 'zod';

export interface Protein_shake_calculatorInput {
  scoopWeight: number;
  numScoops: number;
  proteinPer100g: number;
  caloriesPer100g: number;
  liquidVolume: number;
  dataConfidence?: number;
}

export const Protein_shake_calculatorInputSchema = z.object({
  scoopWeight: z.number().default(30),
  numScoops: z.number().default(1),
  proteinPer100g: z.number().default(80),
  caloriesPer100g: z.number().default(400),
  liquidVolume: z.number().default(300),
});

function asFormulaNumber(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Protein_shake_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.scoopWeight * input.numScoops * input.proteinPer100g / 100; results["totalProtein"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["totalProtein"] = 0; }
  try { const v = input.scoopWeight * input.numScoops; results["totalPowderWeight"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["totalPowderWeight"] = 0; }
  try { const v = input.scoopWeight * input.numScoops * input.caloriesPer100g / 100; results["totalCalories"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["totalCalories"] = 0; }
  try { const v = input.scoopWeight * input.numScoops * input.proteinPer100g / input.liquidVolume; results["proteinPer100ml"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["proteinPer100ml"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

export function calculateProtein_shake_calculator(input: Protein_shake_calculatorInput): Protein_shake_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["totalProtein"]);
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


export interface Protein_shake_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
