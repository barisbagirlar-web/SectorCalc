// Auto-generated from soil-bearing-capacity-calculator-schema.json
import * as z from 'zod';

export interface Soil_bearing_capacity_calculatorInput {
  cohesion: number;
  frictionAngle: number;
  unitWeight: number;
  foundationDepth: number;
  foundationWidth: number;
  safetyFactor: number;
  dataConfidence?: number;
}

export const Soil_bearing_capacity_calculatorInputSchema = z.object({
  cohesion: z.number().default(0),
  frictionAngle: z.number().default(30),
  unitWeight: z.number().default(18),
  foundationDepth: z.number().default(1),
  foundationWidth: z.number().default(1.5),
  safetyFactor: z.number().default(3),
});

function asFormulaNumber(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Soil_bearing_capacity_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = (input.cohesion) * (input.frictionAngle) * (input.unitWeight) * (input.foundationDepth) * (input.foundationWidth) * (input.safetyFactor); results["φ_rad"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["φ_rad"] = 0; }
  try { const v = (input.cohesion) * (input.frictionAngle) * (input.unitWeight); results["φ_rad_aux"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["φ_rad_aux"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

export function calculateSoil_bearing_capacity_calculator(input: Soil_bearing_capacity_calculatorInput): Soil_bearing_capacity_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = Math.max(0, toNumericFormulaValue(values["φ_rad_aux"]));
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


export interface Soil_bearing_capacity_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
