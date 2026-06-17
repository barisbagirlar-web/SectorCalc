// @ts-nocheck
// Auto-generated from bending-moment-diagram-calculator-schema.json
import * as z from 'zod';

export interface Bending_moment_diagram_calculatorInput {
  beamLength: number;
  loadMagnitude: number;
  loadPosition: number;
  distanceX: number;
}

export const Bending_moment_diagram_calculatorInputSchema = z.object({
  beamLength: z.number().default(5),
  loadMagnitude: z.number().default(10),
  loadPosition: z.number().default(2.5),
  distanceX: z.number().default(2.5),
});

function asFormulaNumber(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Bending_moment_diagram_calculatorInput): Record<string, number | string> {
  const results: Record<string, number | string> = {};
  try { const v = input.loadMagnitude * (input.beamLength - input.loadPosition) / input.beamLength; results["leftReaction"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["leftReaction"] = 0; }
  try { const v = input.loadMagnitude * input.loadPosition / input.beamLength; results["rightReaction"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["rightReaction"] = 0; }
  try { const v = input.distanceX <= input.loadPosition ? (input.loadMagnitude * (input.beamLength - input.loadPosition) * input.distanceX / input.beamLength) : (input.loadMagnitude * input.loadPosition * (input.beamLength - input.distanceX) / input.beamLength); results["bendingMomentAtX"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["bendingMomentAtX"] = 0; }
  try { const v = input.loadMagnitude * input.loadPosition * (input.beamLength - input.loadPosition) / input.beamLength; results["maxBendingMoment"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["maxBendingMoment"] = 0; }
  try { const v = input.loadPosition; results["maxMomentLocation"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["maxMomentLocation"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

export function calculateBending_moment_diagram_calculator(input: Bending_moment_diagram_calculatorInput): Bending_moment_diagram_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["bendingMomentAtX"]);
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


export interface Bending_moment_diagram_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
