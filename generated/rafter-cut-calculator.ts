// Auto-generated from rafter-cut-calculator-schema.json
import * as z from 'zod';

export interface Rafter_cut_calculatorInput {
  roofPitch: number;
  buildingWidth: number;
  overhang: number;
  rafterDepth: number;
}

export const Rafter_cut_calculatorInputSchema = z.object({
  roofPitch: z.number().default(30),
  buildingWidth: z.number().default(6000),
  overhang: z.number().default(500),
  rafterDepth: z.number().default(150),
});

function evaluateAllFormulas(input: Rafter_cut_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = (input.buildingWidth / 2 + input.overhang) / Math.cos(input.roofPitch * Math.PI / 180); results["rafterLength"] = Number.isFinite(v) ? v : 0; } catch { results["rafterLength"] = 0; }
  try { const v = input.buildingWidth / 2 + input.overhang; results["totalRun"] = Number.isFinite(v) ? v : 0; } catch { results["totalRun"] = 0; }
  try { const v = (input.buildingWidth / 2 + input.overhang) * Math.tan(input.roofPitch * Math.PI / 180); results["rise"] = Number.isFinite(v) ? v : 0; } catch { results["rise"] = 0; }
  try { const v = input.rafterDepth / 3; results["seatCutDepth"] = Number.isFinite(v) ? v : 0; } catch { results["seatCutDepth"] = 0; }
  try { const v = input.rafterDepth * 2 / 3; results["heelHeight"] = Number.isFinite(v) ? v : 0; } catch { results["heelHeight"] = 0; }
  try { const v = input.roofPitch; results["plumbCutAngle"] = Number.isFinite(v) ? v : 0; } catch { results["plumbCutAngle"] = 0; }
  return results;
}


export function calculateRafter_cut_calculator(input: Rafter_cut_calculatorInput): Rafter_cut_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["rafterLength"] ?? 0;
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


export interface Rafter_cut_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
