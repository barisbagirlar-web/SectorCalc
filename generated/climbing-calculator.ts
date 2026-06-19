// Auto-generated from climbing-calculator-schema.json
import * as z from 'zod';

export interface Climbing_calculatorInput {
  climberMass: number;
  fallFactor: number;
  ratedImpactForce: number;
  ratedMass: number;
  ratedFallFactor: number;
  safetyFactor: number;
  dataConfidence?: number;
}

export const Climbing_calculatorInputSchema = z.object({
  climberMass: z.number().default(80),
  fallFactor: z.number().default(1),
  ratedImpactForce: z.number().default(9),
  ratedMass: z.number().default(80),
  ratedFallFactor: z.number().default(1.77),
  safetyFactor: z.number().default(1),
});

function asFormulaNumber(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Climbing_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.climberMass * input.fallFactor * input.ratedImpactForce * input.ratedMass; results["normalized_product"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["normalized_product"] = 0; }
  try { const v = input.climberMass * input.fallFactor * input.ratedImpactForce * input.ratedMass * (input.ratedFallFactor * input.safetyFactor); results["result"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["result"] = 0; }
  try { const v = input.ratedFallFactor * input.safetyFactor; results["adjustment_factor"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["adjustment_factor"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

export function calculateClimbing_calculator(input: Climbing_calculatorInput): Climbing_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["result"]);
  const breakdown = {
    
  };
  const hiddenLossDrivers: string[] = ["Model uses normalized input chain — validate units","Assumption-heavy without site benchmark"];
  const suggestedActions: string[] = ["Cross-check with historical actuals","Run sensitivity on top 2 inputs"];
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


export interface Climbing_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
