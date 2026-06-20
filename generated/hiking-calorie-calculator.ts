// Auto-generated from hiking-calorie-calculator-schema.json
import * as z from 'zod';

export interface Hiking_calorie_calculatorInput {
  bodyWeight: number;
  packWeight: number;
  distance: number;
  elevationGain: number;
  terrainFactor: number;
  dataConfidence?: number;
}

export const Hiking_calorie_calculatorInputSchema = z.object({
  bodyWeight: z.number().default(70),
  packWeight: z.number().default(10),
  distance: z.number().default(10),
  elevationGain: z.number().default(500),
  terrainFactor: z.number().default(1.2),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Hiking_calorie_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = (input.bodyWeight + input.packWeight) * (input.distance * 0.8 + input.elevationGain * 0.0094) * input.terrainFactor; results["totalCalories"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["totalCalories"] = Number.NaN; }
  try { const v = (input.bodyWeight + input.packWeight) * input.distance * 0.8 * input.terrainFactor; results["horizontalCalories"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["horizontalCalories"] = Number.NaN; }
  try { const v = (input.bodyWeight + input.packWeight) * input.elevationGain * 0.0094 * input.terrainFactor; results["verticalCalories"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["verticalCalories"] = Number.NaN; }
  return results;
}


export function calculateHiking_calorie_calculator(input: Hiking_calorie_calculatorInput): Hiking_calorie_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["totalCalories"]);
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


export interface Hiking_calorie_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
