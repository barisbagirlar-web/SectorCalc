// Auto-generated from vertical-curve-calculator-schema.json
import * as z from 'zod';

export interface Vertical_curve_calculatorInput {
  g1: number;
  g2: number;
  L: number;
  station_PVC: number;
  elevation_PVC: number;
  target_station: number;
}

export const Vertical_curve_calculatorInputSchema = z.object({
  g1: z.number().default(-2),
  g2: z.number().default(1),
  L: z.number().default(200),
  station_PVC: z.number().default(0),
  elevation_PVC: z.number().default(100),
  target_station: z.number().default(100),
});

function evaluateAllFormulas(input: Vertical_curve_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = (input.g2 - input.g1) / (100 * input.L); results["r"] = Number.isFinite(v) ? v : 0; } catch { results["r"] = 0; }
  try { const v = input.target_station - input.station_PVC; results["distance"] = Number.isFinite(v) ? v : 0; } catch { results["distance"] = 0; }
  try { const v = input.elevation_PVC + (input.g1/100) * (input.target_station - input.station_PVC) + ((results["r"] ?? 0)/2) * (input.target_station - input.station_PVC)**2; results["elevation_at_target"] = Number.isFinite(v) ? v : 0; } catch { results["elevation_at_target"] = 0; }
  try { const v = (input.g2 - input.g1) === 0 ? 0 : - (input.g1/100) / (results["r"] ?? 0); results["x_max"] = Number.isFinite(v) ? v : 0; } catch { results["x_max"] = 0; }
  try { const v = input.station_PVC + (results["x_max"] ?? 0); results["high_point_station"] = Number.isFinite(v) ? v : 0; } catch { results["high_point_station"] = 0; }
  try { const v = input.elevation_PVC + (input.g1/100) * (results["x_max"] ?? 0) + ((results["r"] ?? 0)/2) * (results["x_max"] ?? 0)**2; results["high_point_elevation"] = Number.isFinite(v) ? v : 0; } catch { results["high_point_elevation"] = 0; }
  try { const v = input.g2 - input.g1; results["rate_change"] = Number.isFinite(v) ? v : 0; } catch { results["rate_change"] = 0; }
  return results;
}


export function calculateVertical_curve_calculator(input: Vertical_curve_calculatorInput): Vertical_curve_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["elevation_at_target"] ?? 0;
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


export interface Vertical_curve_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
