// Auto-generated from worm-gear-calculator-schema.json
import * as z from 'zod';

export interface Worm_gear_calculatorInput {
  module: number;
  z1: number;
  z2: number;
  centerDistance: number;
}

export const Worm_gear_calculatorInputSchema = z.object({
  module: z.number().default(2),
  z1: z.number().default(1),
  z2: z.number().default(40),
  centerDistance: z.number().default(50),
});

function evaluateAllFormulas(input: Worm_gear_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.z2 / input.z1; results["gearRatio"] = Number.isFinite(v) ? v : 0; } catch { results["gearRatio"] = 0; }
  try { const v = input.module * input.z2; results["gearPitchDiameter"] = Number.isFinite(v) ? v : 0; } catch { results["gearPitchDiameter"] = 0; }
  try { const v = 2 * input.centerDistance - input.module * input.z2; results["wormPitchDiameter"] = Number.isFinite(v) ? v : 0; } catch { results["wormPitchDiameter"] = 0; }
  try { const v = Math.PI * input.module * input.z1; results["lead"] = Number.isFinite(v) ? v : 0; } catch { results["lead"] = 0; }
  try { const v = Math.atan((results["lead"] ?? 0) / (Math.PI * (results["wormPitchDiameter"] ?? 0))) * (180 / Math.PI); results["leadAngle"] = Number.isFinite(v) ? v : 0; } catch { results["leadAngle"] = 0; }
  try { const v = (results["wormPitchDiameter"] ?? 0) + 2 * input.module; results["wormOuterDiameter"] = Number.isFinite(v) ? v : 0; } catch { results["wormOuterDiameter"] = 0; }
  try { const v = (results["gearPitchDiameter"] ?? 0) + 2 * input.module; results["gearOuterDiameter"] = Number.isFinite(v) ? v : 0; } catch { results["gearOuterDiameter"] = 0; }
  try { const v = (results["wormPitchDiameter"] ?? 0) - 2.4 * input.module; results["wormRootDiameter"] = Number.isFinite(v) ? v : 0; } catch { results["wormRootDiameter"] = 0; }
  try { const v = (results["gearPitchDiameter"] ?? 0) - 2.4 * input.module; results["gearRootDiameter"] = Number.isFinite(v) ? v : 0; } catch { results["gearRootDiameter"] = 0; }
  return results;
}


export function calculateWorm_gear_calculator(input: Worm_gear_calculatorInput): Worm_gear_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["gearRatio"] ?? 0;
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


export interface Worm_gear_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
