// Auto-generated from metabolic-equivalent-calculator-schema.json
import * as z from 'zod';

export interface Metabolic_equivalent_calculatorInput {
  weight: number;
  duration_hours: number;
  duration_minutes: number;
  met: number;
  dataConfidence?: number;
}

export const Metabolic_equivalent_calculatorInputSchema = z.object({
  weight: z.number().default(70),
  duration_hours: z.number().default(0),
  duration_minutes: z.number().default(30),
  met: z.number().default(5),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Metabolic_equivalent_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.met * input.weight * (input.duration_hours + input.duration_minutes/60); results["caloriesBurned"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["caloriesBurned"] = Number.NaN; }
  try { const v = input.met * (input.duration_hours*60 + input.duration_minutes); results["metMinutes"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["metMinutes"] = Number.NaN; }
  try { const v = (input.met * 3.5 * input.weight * (input.duration_hours*60 + input.duration_minutes)) / 1000; results["oxygenConsumed"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["oxygenConsumed"] = Number.NaN; }
  return results;
}


export function calculateMetabolic_equivalent_calculator(input: Metabolic_equivalent_calculatorInput): Metabolic_equivalent_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["caloriesBurned"]);
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


export interface Metabolic_equivalent_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
