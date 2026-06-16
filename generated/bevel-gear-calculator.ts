// Auto-generated from bevel-gear-calculator-schema.json
import * as z from 'zod';

export interface Bevel_gear_calculatorInput {
  module: number;
  z1: number;
  z2: number;
  shaftAngle: number;
  pressureAngle: number;
  faceWidthFactor: number;
}

export const Bevel_gear_calculatorInputSchema = z.object({
  module: z.number().default(4),
  z1: z.number().default(20),
  z2: z.number().default(40),
  shaftAngle: z.number().default(90),
  pressureAngle: z.number().default(20),
  faceWidthFactor: z.number().default(0.3),
});

function evaluateAllFormulas(input: Bevel_gear_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.z2 / input.z1; results["gearRatio"] = Number.isFinite(v) ? v : 0; } catch { results["gearRatio"] = 0; }
  try { const v = input.module * input.z1; results["d1"] = Number.isFinite(v) ? v : 0; } catch { results["d1"] = 0; }
  try { const v = input.module * input.z2; results["d2"] = Number.isFinite(v) ? v : 0; } catch { results["d2"] = 0; }
  try { const v = input.shaftAngle * Math.PI / 180; results["shaftAngleRad"] = Number.isFinite(v) ? v : 0; } catch { results["shaftAngleRad"] = 0; }
  try { const v = Math.atan( Math.sin((results["shaftAngleRad"] ?? 0)) / ((input.z2/input.z1) + Math.cos((results["shaftAngleRad"] ?? 0))) ); results["delta1Rad"] = Number.isFinite(v) ? v : 0; } catch { results["delta1Rad"] = 0; }
  try { const v = (results["shaftAngleRad"] ?? 0) - (results["delta1Rad"] ?? 0); results["delta2Rad"] = Number.isFinite(v) ? v : 0; } catch { results["delta2Rad"] = 0; }
  try { const v = (results["delta1Rad"] ?? 0) * 180 / Math.PI; results["delta1Deg"] = Number.isFinite(v) ? v : 0; } catch { results["delta1Deg"] = 0; }
  try { const v = (results["delta2Rad"] ?? 0) * 180 / Math.PI; results["delta2Deg"] = Number.isFinite(v) ? v : 0; } catch { results["delta2Deg"] = 0; }
  try { const v = (results["d2"] ?? 0) / (2 * Math.sin((results["delta2Rad"] ?? 0))); results["R"] = Number.isFinite(v) ? v : 0; } catch { results["R"] = 0; }
  try { const v = input.faceWidthFactor * (results["R"] ?? 0); results["b"] = Number.isFinite(v) ? v : 0; } catch { results["b"] = 0; }
  try { const v = input.module; results["ha"] = Number.isFinite(v) ? v : 0; } catch { results["ha"] = 0; }
  try { const v = 1.25 * input.module; results["hf"] = Number.isFinite(v) ? v : 0; } catch { results["hf"] = 0; }
  try { const v = (results["ha"] ?? 0) + (results["hf"] ?? 0); results["h"] = Number.isFinite(v) ? v : 0; } catch { results["h"] = 0; }
  return results;
}


export function calculateBevel_gear_calculator(input: Bevel_gear_calculatorInput): Bevel_gear_calculatorOutput {
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


export interface Bevel_gear_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
