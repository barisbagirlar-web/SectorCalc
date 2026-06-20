// Auto-generated from bending-stress-calculator-schema.json
import * as z from 'zod';

export interface Bending_stress_calculatorInput {
  bendingMoment: number;
  sectionModulus: number;
  distanceFromNeutralAxis: number;
  momentOfInertia: number;
  dataConfidence?: number;
}

export const Bending_stress_calculatorInputSchema = z.object({
  bendingMoment: z.number().default(1000),
  sectionModulus: z.number().default(100000),
  distanceFromNeutralAxis: z.number().default(50),
  momentOfInertia: z.number().default(5000000),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Bending_stress_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = (input.bendingMoment * 1000) / input.sectionModulus; results["bendingStress"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["bendingStress"] = Number.NaN; }
  try { const v = (input.bendingMoment * 1000 * input.distanceFromNeutralAxis) / input.momentOfInertia; results["bendingStressAlt"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["bendingStressAlt"] = Number.NaN; }
  return results;
}


export function calculateBending_stress_calculator(input: Bending_stress_calculatorInput): Bending_stress_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["bendingStress"]);
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


export interface Bending_stress_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
