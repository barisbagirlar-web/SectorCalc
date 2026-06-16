// Auto-generated from tennis-serve-speed-calculator-schema.json
import * as z from 'zod';

export interface Tennis_serve_speed_calculatorInput {
  distance: number;
  timeOfFlight: number;
  ballMass: number;
  launchHeight: number;
  landingHeight: number;
}

export const Tennis_serve_speed_calculatorInputSchema = z.object({
  distance: z.number().default(18.29),
  timeOfFlight: z.number().default(0.5),
  ballMass: z.number().default(0.0577),
  launchHeight: z.number().default(2.6),
  landingHeight: z.number().default(0),
});

function evaluateAllFormulas(input: Tennis_serve_speed_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.distance / input.timeOfFlight; results["vx"] = Number.isFinite(v) ? v : 0; } catch { results["vx"] = 0; }
  try { const v = (input.landingHeight - input.launchHeight + 0.5 * 9.81 * input.timeOfFlight**2) / input.timeOfFlight; results["vy"] = Number.isFinite(v) ? v : 0; } catch { results["vy"] = 0; }
  try { const v = Math.sqrt((results["vx"] ?? 0)**2 + (results["vy"] ?? 0)**2); results["speedMs"] = Number.isFinite(v) ? v : 0; } catch { results["speedMs"] = 0; }
  try { const v = (results["speedMs"] ?? 0) * 3.6; results["speedKmh"] = Number.isFinite(v) ? v : 0; } catch { results["speedKmh"] = 0; }
  try { const v = 0.5 * input.ballMass * (results["speedMs"] ?? 0)**2; results["kineticEnergyJ"] = Number.isFinite(v) ? v : 0; } catch { results["kineticEnergyJ"] = 0; }
  try { const v = Math.atan((results["vy"] ?? 0)/(results["vx"] ?? 0)) * (180 / Math.PI); results["angleDeg"] = Number.isFinite(v) ? v : 0; } catch { results["angleDeg"] = 0; }
  return results;
}


export function calculateTennis_serve_speed_calculator(input: Tennis_serve_speed_calculatorInput): Tennis_serve_speed_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["speedKmh"] ?? 0;
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


export interface Tennis_serve_speed_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
