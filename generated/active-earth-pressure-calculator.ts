// Auto-generated from active-earth-pressure-calculator-schema.json
import * as z from 'zod';

export interface Active_earth_pressure_calculatorInput {
  height: number;
  unitWeight: number;
  frictionAngle: number;
  cohesion: number;
  surcharge: number;
}

export const Active_earth_pressure_calculatorInputSchema = z.object({
  height: z.number().default(5),
  unitWeight: z.number().default(18),
  frictionAngle: z.number().default(30),
  cohesion: z.number().default(10),
  surcharge: z.number().default(0),
});

function evaluateAllFormulas(input: Active_earth_pressure_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = Math.tan(Math.PI/4 - (input.frictionAngle * Math.PI/180) / 2) ** 2; results["ka"] = Number.isFinite(v) ? v : 0; } catch { results["ka"] = 0; }
  try { const v = (2 * input.cohesion) / (input.unitWeight * Math.sqrt((results["ka"] ?? 0))); results["z0"] = Number.isFinite(v) ? v : 0; } catch { results["z0"] = 0; }
  try { const v = Math.max(0, (results["ka"] ?? 0) * (input.unitWeight * input.height + input.surcharge) - 2 * input.cohesion * Math.sqrt((results["ka"] ?? 0))); results["sigmaBase"] = Number.isFinite(v) ? v : 0; } catch { results["sigmaBase"] = 0; }
  try { const v = input.height > (results["z0"] ?? 0) ? 0.5 * (results["sigmaBase"] ?? 0) * (input.height - (results["z0"] ?? 0)) : 0; results["totalForce"] = Number.isFinite(v) ? v : 0; } catch { results["totalForce"] = 0; }
  return results;
}


export function calculateActive_earth_pressure_calculator(input: Active_earth_pressure_calculatorInput): Active_earth_pressure_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["ka"] ?? 0;
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


export interface Active_earth_pressure_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
