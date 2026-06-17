// @ts-nocheck
// Auto-generated from shear-force-diagram-calculator-schema.json
import * as z from 'zod';

export interface Shear_force_diagram_calculatorInput {
  beamLength: number;
  loadMagnitude: number;
  loadDistanceFromLeft: number;
  calculationPoint: number;
}

export const Shear_force_diagram_calculatorInputSchema = z.object({
  beamLength: z.number().default(10),
  loadMagnitude: z.number().default(100),
  loadDistanceFromLeft: z.number().default(5),
  calculationPoint: z.number().default(0),
});

function asFormulaNumber(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Shear_force_diagram_calculatorInput): Record<string, number | string> {
  const results: Record<string, number | string> = {};
  try { const v = (input.loadMagnitude * (input.beamLength - input.loadDistanceFromLeft)) / input.beamLength; results["leftReaction"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["leftReaction"] = 0; }
  try { const v = (input.loadMagnitude * input.loadDistanceFromLeft) / input.beamLength; results["rightReaction"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["rightReaction"] = 0; }
  try { const v = input.calculationPoint <= input.loadDistanceFromLeft ? (input.loadMagnitude * (input.beamLength - input.loadDistanceFromLeft)) / input.beamLength : -(input.loadMagnitude * input.loadDistanceFromLeft) / input.beamLength; results["shearForce"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["shearForce"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

export function calculateShear_force_diagram_calculator(input: Shear_force_diagram_calculatorInput): Shear_force_diagram_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["shearForce"]);
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


export interface Shear_force_diagram_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
