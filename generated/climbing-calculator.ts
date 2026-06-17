// @ts-nocheck
// Auto-generated from climbing-calculator-schema.json
import * as z from 'zod';

export interface Climbing_calculatorInput {
  climberMass: number;
  fallFactor: number;
  ratedImpactForce: number;
  ratedMass: number;
  ratedFallFactor: number;
  safetyFactor: number;
}

export const Climbing_calculatorInputSchema = z.object({
  climberMass: z.number().default(80),
  fallFactor: z.number().default(1),
  ratedImpactForce: z.number().default(9),
  ratedMass: z.number().default(80),
  ratedFallFactor: z.number().default(1.77),
  safetyFactor: z.number().default(1),
});

function asFormulaNumber(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Climbing_calculatorInput): Record<string, number | string> {
  const results: Record<string, number | string> = {};
  try { const v = input.climberMass + input.fallFactor + input.ratedImpactForce; results["result"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["result"] = 0; }
  try { const v = input.climberMass + input.fallFactor + input.ratedImpactForce; results["result_copy"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["result_copy"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

export function calculateClimbing_calculator(input: Climbing_calculatorInput): Climbing_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["result"]);
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


export interface Climbing_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
