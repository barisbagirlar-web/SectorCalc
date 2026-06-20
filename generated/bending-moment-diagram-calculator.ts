// Auto-generated from bending-moment-diagram-calculator-schema.json
import * as z from 'zod';

export interface Bending_moment_diagram_calculatorInput {
  beamLength: number;
  loadMagnitude: number;
  loadPosition: number;
  distanceX: number;
  dataConfidence?: number;
}

export const Bending_moment_diagram_calculatorInputSchema = z.object({
  beamLength: z.number().default(5),
  loadMagnitude: z.number().default(10),
  loadPosition: z.number().default(2.5),
  distanceX: z.number().default(2.5),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Bending_moment_diagram_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.loadMagnitude * (input.beamLength - input.loadPosition) / input.beamLength; results["leftReaction"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["leftReaction"] = Number.NaN; }
  try { const v = input.loadMagnitude * input.loadPosition / input.beamLength; results["rightReaction"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["rightReaction"] = Number.NaN; }
  try { const v = input.distanceX <= input.loadPosition ? (input.loadMagnitude * (input.beamLength - input.loadPosition) * input.distanceX / input.beamLength) : (input.loadMagnitude * input.loadPosition * (input.beamLength - input.distanceX) / input.beamLength); results["bendingMomentAtX"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["bendingMomentAtX"] = Number.NaN; }
  try { const v = input.loadMagnitude * input.loadPosition * (input.beamLength - input.loadPosition) / input.beamLength; results["maxBendingMoment"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["maxBendingMoment"] = Number.NaN; }
  try { const v = input.loadPosition; results["maxMomentLocation"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["maxMomentLocation"] = Number.NaN; }
  return results;
}


export function calculateBending_moment_diagram_calculator(input: Bending_moment_diagram_calculatorInput): Bending_moment_diagram_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["bendingMomentAtX"]);
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


export interface Bending_moment_diagram_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
