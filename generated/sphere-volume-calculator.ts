// Auto-generated from sphere-volume-calculator-schema.json
import * as z from 'zod';

export interface Sphere_volume_calculatorInput {
  radius1: number;
  radius2: number;
  radius3: number;
  radius4: number;
  unitMultiplier: number;
  density: number;
  wasteFactor: number;
}

export const Sphere_volume_calculatorInputSchema = z.object({
  radius1: z.number().default(1),
  radius2: z.number().default(0),
  radius3: z.number().default(0),
  radius4: z.number().default(0),
  unitMultiplier: z.number().default(1),
  density: z.number().default(1000),
  wasteFactor: z.number().default(5),
});

function evaluateAllFormulas(input: Sphere_volume_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.radius1 * input.unitMultiplier; results["convertedRadius1"] = Number.isFinite(v) ? v : 0; } catch { results["convertedRadius1"] = 0; }
  try { const v = input.radius2 * input.unitMultiplier; results["convertedRadius2"] = Number.isFinite(v) ? v : 0; } catch { results["convertedRadius2"] = 0; }
  try { const v = input.radius3 * input.unitMultiplier; results["convertedRadius3"] = Number.isFinite(v) ? v : 0; } catch { results["convertedRadius3"] = 0; }
  try { const v = input.radius4 * input.unitMultiplier; results["convertedRadius4"] = Number.isFinite(v) ? v : 0; } catch { results["convertedRadius4"] = 0; }
  try { const v = (4/3) * Math.PI * Math.pow((results["convertedRadius1"] ?? 0), 3); results["V1"] = Number.isFinite(v) ? v : 0; } catch { results["V1"] = 0; }
  try { const v = (4/3) * Math.PI * Math.pow((results["convertedRadius2"] ?? 0), 3); results["V2"] = Number.isFinite(v) ? v : 0; } catch { results["V2"] = 0; }
  try { const v = (4/3) * Math.PI * Math.pow((results["convertedRadius3"] ?? 0), 3); results["V3"] = Number.isFinite(v) ? v : 0; } catch { results["V3"] = 0; }
  try { const v = (4/3) * Math.PI * Math.pow((results["convertedRadius4"] ?? 0), 3); results["V4"] = Number.isFinite(v) ? v : 0; } catch { results["V4"] = 0; }
  try { const v = (results["V1"] ?? 0) + (results["V2"] ?? 0) + (results["V3"] ?? 0) + (results["V4"] ?? 0); results["totalVolume"] = Number.isFinite(v) ? v : 0; } catch { results["totalVolume"] = 0; }
  try { const v = (results["totalVolume"] ?? 0) * input.density; results["totalMass"] = Number.isFinite(v) ? v : 0; } catch { results["totalMass"] = 0; }
  try { const v = (results["totalMass"] ?? 0) * (1 + input.wasteFactor/100); results["totalMassWithWaste"] = Number.isFinite(v) ? v : 0; } catch { results["totalMassWithWaste"] = 0; }
  results["_V1__m_"] = 0;
  results["_V2__m_"] = 0;
  results["_V3__m_"] = 0;
  results["_V4__m_"] = 0;
  results["_totalMass__kg"] = 0;
  results["_totalMassWithWaste__kg"] = 0;
  return results;
}


export function calculateSphere_volume_calculator(input: Sphere_volume_calculatorInput): Sphere_volume_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["convertedRadius1"] ?? 0;
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


export interface Sphere_volume_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
