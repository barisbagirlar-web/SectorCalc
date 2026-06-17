// @ts-nocheck
// Auto-generated from bending-stress-calculator-schema.json
import * as z from 'zod';

export interface Bending_stress_calculatorInput {
  bendingMoment: number;
  sectionModulus: number;
  distanceFromNeutralAxis: number;
  momentOfInertia: number;
}

export const Bending_stress_calculatorInputSchema = z.object({
  bendingMoment: z.number().default(1000),
  sectionModulus: z.number().default(100000),
  distanceFromNeutralAxis: z.number().default(50),
  momentOfInertia: z.number().default(5000000),
});

function asFormulaNumber(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Bending_stress_calculatorInput): Record<string, number | string> {
  const results: Record<string, number | string> = {};
  try { const v = (input.bendingMoment * 1000) / input.sectionModulus; results["bendingStress"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["bendingStress"] = 0; }
  try { const v = (input.bendingMoment * 1000 * input.distanceFromNeutralAxis) / input.momentOfInertia; results["bendingStressAlt"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["bendingStressAlt"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

export function calculateBending_stress_calculator(input: Bending_stress_calculatorInput): Bending_stress_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["bendingStress"]);
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


export interface Bending_stress_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
