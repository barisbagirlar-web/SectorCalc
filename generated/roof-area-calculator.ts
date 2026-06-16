// Auto-generated from roof-area-calculator-schema.json
import * as z from 'zod';

export interface Roof_area_calculatorInput {
  buildingWidth: number;
  buildingLength: number;
  roofPitch: number;
  overhang: number;
}

export const Roof_area_calculatorInputSchema = z.object({
  buildingWidth: z.number().default(10),
  buildingLength: z.number().default(12),
  roofPitch: z.number().default(30),
  overhang: z.number().default(0.5),
});

function evaluateAllFormulas(input: Roof_area_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.buildingWidth + 2 * input.overhang; results["effectiveWidth"] = Number.isFinite(v) ? v : 0; } catch { results["effectiveWidth"] = 0; }
  try { const v = input.buildingLength + 2 * input.overhang; results["effectiveLength"] = Number.isFinite(v) ? v : 0; } catch { results["effectiveLength"] = 0; }
  try { const v = input.roofPitch * Math.PI / 180; results["angleRad"] = Number.isFinite(v) ? v : 0; } catch { results["angleRad"] = 0; }
  try { const v = 1 / Math.cos((results["angleRad"] ?? 0)); results["slopeFactor"] = Number.isFinite(v) ? v : 0; } catch { results["slopeFactor"] = 0; }
  try { const v = (results["effectiveWidth"] ?? 0) * (results["effectiveLength"] ?? 0); results["footprintArea"] = Number.isFinite(v) ? v : 0; } catch { results["footprintArea"] = 0; }
  try { const v = (results["footprintArea"] ?? 0) / Math.cos((results["angleRad"] ?? 0)); results["roofArea"] = Number.isFinite(v) ? v : 0; } catch { results["roofArea"] = 0; }
  return results;
}


export function calculateRoof_area_calculator(input: Roof_area_calculatorInput): Roof_area_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["roofArea"] ?? 0;
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


export interface Roof_area_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
