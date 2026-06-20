// Auto-generated from slope-stability-calculator-schema.json
import * as z from 'zod';

export interface Slope_stability_calculatorInput {
  slopeAngle: number;
  frictionAngle: number;
  cohesion: number;
  unitWeight: number;
  depth: number;
  porePressureRatio: number;
  dataConfidence?: number;
}

export const Slope_stability_calculatorInputSchema = z.object({
  slopeAngle: z.number().default(30),
  frictionAngle: z.number().default(25),
  cohesion: z.number().default(10),
  unitWeight: z.number().default(18),
  depth: z.number().default(5),
  porePressureRatio: z.number().default(0),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Slope_stability_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = (input.slopeAngle) * (input.frictionAngle) * (input.cohesion) * (input.unitWeight) * (input.depth) * (input.porePressureRatio); results["angleRad"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["angleRad"] = Number.NaN; }
  try { const v = (input.slopeAngle) * (input.frictionAngle) * (input.cohesion); results["frictionRad"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["frictionRad"] = Number.NaN; }
  return results;
}


export function calculateSlope_stability_calculator(input: Slope_stability_calculatorInput): Slope_stability_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["frictionRad"]);
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


export interface Slope_stability_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
