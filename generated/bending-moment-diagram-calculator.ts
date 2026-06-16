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

function evaluateAllFormulas(input: Bending_moment_diagram_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.loadMagnitude * (input.beamLength - input.loadPosition) / input.beamLength; results["leftReaction"] = Number.isFinite(v) ? v : 0; } catch { results["leftReaction"] = 0; }
  try { const v = input.loadMagnitude * input.loadPosition / input.beamLength; results["rightReaction"] = Number.isFinite(v) ? v : 0; } catch { results["rightReaction"] = 0; }
  try { const v = input.distanceX <= input.loadPosition ? (input.loadMagnitude * (input.beamLength - input.loadPosition) * input.distanceX / input.beamLength) : (input.loadMagnitude * input.loadPosition * (input.beamLength - input.distanceX) / input.beamLength); results["bendingMomentAtX"] = Number.isFinite(v) ? v : 0; } catch { results["bendingMomentAtX"] = 0; }
  try { const v = input.loadMagnitude * input.loadPosition * (input.beamLength - input.loadPosition) / input.beamLength; results["maxBendingMoment"] = Number.isFinite(v) ? v : 0; } catch { results["maxBendingMoment"] = 0; }
  try { const v = input.loadPosition; results["maxMomentLocation"] = Number.isFinite(v) ? v : 0; } catch { results["maxMomentLocation"] = 0; }
  return results;
}


export function calculateBending_moment_diagram_calculator(input: Bending_moment_diagram_calculatorInput): Bending_moment_diagram_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["bendingMomentAtX"] ?? 0;
  const breakdown = {
    
  };
  const hiddenLossDrivers: string[] = [];
  const suggestedActions: string[] = [];
  const dataConfidenceAdjusted =
    typeof (input as Record<string, unknown>).dataConfidence === "number"
      ? totalWasteCost * (((input as Record<string, unknown>).dataConfidence as number) / 100)
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
