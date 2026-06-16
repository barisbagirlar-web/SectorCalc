// Auto-generated from concrete-stairs-calculator-schema.json
import * as z from 'zod';

export interface Concrete_stairs_calculatorInput {
  totalRise: number;
  numberOfSteps: number;
  treadDepth: number;
  stepWidth: number;
  waistThickness: number;
  landingLength: number;
}

export const Concrete_stairs_calculatorInputSchema = z.object({
  totalRise: z.number().default(3000),
  numberOfSteps: z.number().default(15),
  treadDepth: z.number().default(280),
  stepWidth: z.number().default(1000),
  waistThickness: z.number().default(150),
  landingLength: z.number().default(0),
});

function evaluateAllFormulas(input: Concrete_stairs_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.totalRise / input.numberOfSteps; results["riserHeight"] = Number.isFinite(v) ? v : 0; } catch { results["riserHeight"] = 0; }
  try { const v = (input.numberOfSteps - 1) * input.treadDepth; results["horizontalRun"] = Number.isFinite(v) ? v : 0; } catch { results["horizontalRun"] = 0; }
  try { const v = Math.sqrt(input.totalRise**2 + (results["horizontalRun"] ?? 0)**2); results["inclinedLength"] = Number.isFinite(v) ? v : 0; } catch { results["inclinedLength"] = 0; }
  try { const v = input.stepWidth * input.waistThickness * (results["inclinedLength"] ?? 0); results["volumeWaist_mm3"] = Number.isFinite(v) ? v : 0; } catch { results["volumeWaist_mm3"] = 0; }
  try { const v = input.numberOfSteps * 0.5 * input.treadDepth * (results["riserHeight"] ?? 0) * input.stepWidth; results["volumeSteps_mm3"] = Number.isFinite(v) ? v : 0; } catch { results["volumeSteps_mm3"] = 0; }
  try { const v = input.landingLength * input.stepWidth * input.waistThickness; results["volumeLanding_mm3"] = Number.isFinite(v) ? v : 0; } catch { results["volumeLanding_mm3"] = 0; }
  try { const v = ((results["volumeWaist_mm3"] ?? 0) + (results["volumeSteps_mm3"] ?? 0) + (results["volumeLanding_mm3"] ?? 0)) / 1e9; results["volume_m3"] = Number.isFinite(v) ? v : 0; } catch { results["volume_m3"] = 0; }
  try { const v = (results["volumeWaist_mm3"] ?? 0) / 1e9; results["volumeWaist_m3"] = Number.isFinite(v) ? v : 0; } catch { results["volumeWaist_m3"] = 0; }
  try { const v = (results["volumeSteps_mm3"] ?? 0) / 1e9; results["volumeSteps_m3"] = Number.isFinite(v) ? v : 0; } catch { results["volumeSteps_m3"] = 0; }
  try { const v = (results["volumeLanding_mm3"] ?? 0) / 1e9; results["volumeLanding_m3"] = Number.isFinite(v) ? v : 0; } catch { results["volumeLanding_m3"] = 0; }
  return results;
}


export function calculateConcrete_stairs_calculator(input: Concrete_stairs_calculatorInput): Concrete_stairs_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["volume_m3"] ?? 0;
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


export interface Concrete_stairs_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
