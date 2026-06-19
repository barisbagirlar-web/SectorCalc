// Auto-generated from rock-climbing-calculator-schema.json
import * as z from 'zod';

export interface Rock_climbing_calculatorInput {
  climberMass: number;
  ropeLength: number;
  fallLength: number;
  ropeImpactForceRating: number;
  dataConfidence?: number;
}

export const Rock_climbing_calculatorInputSchema = z.object({
  climberMass: z.number().default(80),
  ropeLength: z.number().default(30),
  fallLength: z.number().default(5),
  ropeImpactForceRating: z.number().default(8.5),
});

function asFormulaNumber(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Rock_climbing_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.fallLength / input.ropeLength; results["fallFactor"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["fallFactor"] = 0; }
  try { const v = input.fallLength / input.ropeLength; results["fallFactor_aux"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["fallFactor_aux"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

export function calculateRock_climbing_calculator(input: Rock_climbing_calculatorInput): Rock_climbing_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = Math.max(0, toNumericFormulaValue(values["fallFactor_aux"]));
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


export interface Rock_climbing_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
