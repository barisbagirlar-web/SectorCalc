// Auto-generated from journaling-calculator-schema.json
import * as z from 'zod';

export interface Journaling_calculatorInput {
  shaftDiameter: number;
  bearingLength: number;
  radialLoad: number;
  rotationalSpeed: number;
  oilViscosity: number;
  radialClearance: number;
}

export const Journaling_calculatorInputSchema = z.object({
  shaftDiameter: z.number().default(50),
  bearingLength: z.number().default(80),
  radialLoad: z.number().default(5000),
  rotationalSpeed: z.number().default(1500),
  oilViscosity: z.number().default(30),
  radialClearance: z.number().default(0.05),
});

function evaluateAllFormulas(input: Journaling_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.shaftDiameter / 2; results["shaftRadius_mm"] = Number.isFinite(v) ? v : 0; } catch { results["shaftRadius_mm"] = 0; }
  try { const v = (results["shaftRadius_mm"] ?? 0) / 1000; results["shaftRadius_m"] = Number.isFinite(v) ? v : 0; } catch { results["shaftRadius_m"] = 0; }
  try { const v = input.bearingLength / 1000; results["bearingLength_m"] = Number.isFinite(v) ? v : 0; } catch { results["bearingLength_m"] = 0; }
  try { const v = input.radialClearance / 1000; results["radialClearance_m"] = Number.isFinite(v) ? v : 0; } catch { results["radialClearance_m"] = 0; }
  try { const v = input.oilViscosity * 0.001; results["oilViscosity_Pas"] = Number.isFinite(v) ? v : 0; } catch { results["oilViscosity_Pas"] = 0; }
  try { const v = input.rotationalSpeed / 60; results["rotationalSpeed_rps"] = Number.isFinite(v) ? v : 0; } catch { results["rotationalSpeed_rps"] = 0; }
  try { const v = (input.radialLoad * 1e6) / (input.shaftDiameter * input.bearingLength); results["unitLoadPressure"] = Number.isFinite(v) ? v : 0; } catch { results["unitLoadPressure"] = 0; }
  try { const v = Math.pow((results["shaftRadius_m"] ?? 0) / (results["radialClearance_m"] ?? 0), 2) * ((results["oilViscosity_Pas"] ?? 0) * (results["rotationalSpeed_rps"] ?? 0)) / (results["unitLoadPressure"] ?? 0); results["sommerfeldNumber"] = Number.isFinite(v) ? v : 0; } catch { results["sommerfeldNumber"] = 0; }
  try { const v = (results["radialClearance_m"] ?? 0) / (results["shaftRadius_m"] ?? 0); results["clearanceRatio"] = Number.isFinite(v) ? v : 0; } catch { results["clearanceRatio"] = 0; }
  return results;
}


export function calculateJournaling_calculator(input: Journaling_calculatorInput): Journaling_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["sommerfeldNumber"] ?? 0;
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


export interface Journaling_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
