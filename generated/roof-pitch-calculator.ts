// Auto-generated from roof-pitch-calculator-schema.json
import * as z from 'zod';

export interface Roof_pitch_calculatorInput {
  rise: number;
  span: number;
  length: number;
  overhang: number;
}

export const Roof_pitch_calculatorInputSchema = z.object({
  rise: z.number().default(2),
  span: z.number().default(8),
  length: z.number().default(10),
  overhang: z.number().default(0.5),
});

function evaluateAllFormulas(input: Roof_pitch_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.span / 2; results["run"] = Number.isFinite(v) ? v : 0; } catch { results["run"] = 0; }
  try { const v = input.rise / (results["run"] ?? 0); results["pitchRatio"] = Number.isFinite(v) ? v : 0; } catch { results["pitchRatio"] = 0; }
  try { const v = Math.atan((results["pitchRatio"] ?? 0)) * 180 / Math.PI; results["pitchAngleDeg"] = Number.isFinite(v) ? v : 0; } catch { results["pitchAngleDeg"] = 0; }
  try { const v = (results["pitchRatio"] ?? 0) * 100; results["slopePercent"] = Number.isFinite(v) ? v : 0; } catch { results["slopePercent"] = 0; }
  try { const v = (results["pitchRatio"] ?? 0) * 12; results["pitchImperial"] = Number.isFinite(v) ? v : 0; } catch { results["pitchImperial"] = 0; }
  try { const v = Math.sqrt(input.rise**2 + (results["run"] ?? 0)**2) + input.overhang / Math.cos(Math.atan((results["pitchRatio"] ?? 0))); results["rafterLength"] = Number.isFinite(v) ? v : 0; } catch { results["rafterLength"] = 0; }
  try { const v = (results["rafterLength"] ?? 0) * input.length; results["roofAreaOneSide"] = Number.isFinite(v) ? v : 0; } catch { results["roofAreaOneSide"] = 0; }
  try { const v = 2 * (results["roofAreaOneSide"] ?? 0); results["totalRoofArea"] = Number.isFinite(v) ? v : 0; } catch { results["totalRoofArea"] = 0; }
  return results;
}


export function calculateRoof_pitch_calculator(input: Roof_pitch_calculatorInput): Roof_pitch_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["pitchAngleDeg"] ?? 0;
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


export interface Roof_pitch_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
