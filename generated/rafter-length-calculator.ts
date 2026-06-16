// Auto-generated from rafter-length-calculator-schema.json
import * as z from 'zod';

export interface Rafter_length_calculatorInput {
  buildingWidth: number;
  ridgeThickness: number;
  overhang: number;
  roofPitch: number;
}

export const Rafter_length_calculatorInputSchema = z.object({
  buildingWidth: z.number().default(6000),
  ridgeThickness: z.number().default(38),
  overhang: z.number().default(300),
  roofPitch: z.number().default(30),
});

function evaluateAllFormulas(input: Rafter_length_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.buildingWidth / 2 - input.ridgeThickness / 2; results["horizontalRun"] = Number.isFinite(v) ? v : 0; } catch { results["horizontalRun"] = 0; }
  try { const v = (results["horizontalRun"] ?? 0) + input.overhang; results["totalRun"] = Number.isFinite(v) ? v : 0; } catch { results["totalRun"] = 0; }
  try { const v = (results["totalRun"] ?? 0) / Math.cos(input.roofPitch * Math.PI / 180); results["rafterLength"] = Number.isFinite(v) ? v : 0; } catch { results["rafterLength"] = 0; }
  try { const v = (results["totalRun"] ?? 0) * Math.sin(input.roofPitch * Math.PI / 180) / Math.cos(input.roofPitch * Math.PI / 180); results["verticalRise"] = Number.isFinite(v) ? v : 0; } catch { results["verticalRise"] = 0; }
  try { const v = input.roofPitch; results["plumbCutAngle"] = Number.isFinite(v) ? v : 0; } catch { results["plumbCutAngle"] = 0; }
  return results;
}


export function calculateRafter_length_calculator(input: Rafter_length_calculatorInput): Rafter_length_calculatorOutput {
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


export interface Rafter_length_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
