// @ts-nocheck
// Auto-generated from slope-stability-calculator-schema.json
import * as z from 'zod';

export interface Slope_stability_calculatorInput {
  slopeAngle: number;
  frictionAngle: number;
  cohesion: number;
  unitWeight: number;
  depth: number;
  porePressureRatio: number;
}

export const Slope_stability_calculatorInputSchema = z.object({
  slopeAngle: z.number().default(30),
  frictionAngle: z.number().default(25),
  cohesion: z.number().default(10),
  unitWeight: z.number().default(18),
  depth: z.number().default(5),
  porePressureRatio: z.number().default(0),
});

function asFormulaNumber(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Slope_stability_calculatorInput): Record<string, number | string> {
  const results: Record<string, number | string> = {};
  try { const v = input.slopeAngle * Math.PI / 180; results["angleRad"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["angleRad"] = 0; }
  try { const v = input.frictionAngle * Math.PI / 180; results["frictionRad"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["frictionRad"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

export function calculateSlope_stability_calculator(input: Slope_stability_calculatorInput): Slope_stability_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["frictionRad"]);
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


export interface Slope_stability_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
