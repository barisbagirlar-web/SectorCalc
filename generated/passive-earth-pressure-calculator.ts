// Auto-generated from passive-earth-pressure-calculator-schema.json
import * as z from 'zod';

export interface Passive_earth_pressure_calculatorInput {
  soilUnitWeight: number;
  heightOfWall: number;
  frictionAngle: number;
  cohesion: number;
  surcharge: number;
}

export const Passive_earth_pressure_calculatorInputSchema = z.object({
  soilUnitWeight: z.number().default(18),
  heightOfWall: z.number().default(5),
  frictionAngle: z.number().default(30),
  cohesion: z.number().default(0),
  surcharge: z.number().default(0),
});

function evaluateAllFormulas(input: Passive_earth_pressure_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.frictionAngle * Math.PI / 180; results["frictionAngleRad"] = Number.isFinite(v) ? v : 0; } catch { results["frictionAngleRad"] = 0; }
  try { const v = Math.pow(Math.tan(Math.PI/4 + (results["frictionAngleRad"] ?? 0)/2), 2); results["kp"] = Number.isFinite(v) ? v : 0; } catch { results["kp"] = 0; }
  try { const v = (results["kp"] ?? 0) * (input.soilUnitWeight * input.heightOfWall + input.surcharge) + 2 * input.cohesion * Math.sqrt((results["kp"] ?? 0)); results["passivePressureBase"] = Number.isFinite(v) ? v : 0; } catch { results["passivePressureBase"] = 0; }
  try { const v = 0.5 * input.soilUnitWeight * input.heightOfWall * input.heightOfWall * (results["kp"] ?? 0); results["forceFromSoil"] = Number.isFinite(v) ? v : 0; } catch { results["forceFromSoil"] = 0; }
  try { const v = input.surcharge * input.heightOfWall * (results["kp"] ?? 0); results["forceFromSurcharge"] = Number.isFinite(v) ? v : 0; } catch { results["forceFromSurcharge"] = 0; }
  try { const v = 2 * input.cohesion * input.heightOfWall * Math.sqrt((results["kp"] ?? 0)); results["forceFromCohesion"] = Number.isFinite(v) ? v : 0; } catch { results["forceFromCohesion"] = 0; }
  try { const v = (results["forceFromSoil"] ?? 0) + (results["forceFromSurcharge"] ?? 0) + (results["forceFromCohesion"] ?? 0); results["totalPassiveForce"] = Number.isFinite(v) ? v : 0; } catch { results["totalPassiveForce"] = 0; }
  return results;
}


export function calculatePassive_earth_pressure_calculator(input: Passive_earth_pressure_calculatorInput): Passive_earth_pressure_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["frictionAngleRad"] ?? 0;
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


export interface Passive_earth_pressure_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
