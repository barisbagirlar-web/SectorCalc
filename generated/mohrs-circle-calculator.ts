// Auto-generated from mohrs-circle-calculator-schema.json
import * as z from 'zod';

export interface Mohrs_circle_calculatorInput {
  sigma_x: number;
  sigma_y: number;
  tau_xy: number;
}

export const Mohrs_circle_calculatorInputSchema = z.object({
  sigma_x: z.number().default(0),
  sigma_y: z.number().default(0),
  tau_xy: z.number().default(0),
});

function evaluateAllFormulas(input: Mohrs_circle_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = (input.sigma_x + input.sigma_y) / 2; results["sigma_avg"] = Number.isFinite(v) ? v : 0; } catch { results["sigma_avg"] = 0; }
  try { const v = Math.sqrt(((input.sigma_x - input.sigma_y) / 2) ** 2 + input.tau_xy ** 2); results["R"] = Number.isFinite(v) ? v : 0; } catch { results["R"] = 0; }
  try { const v = (results["sigma_avg"] ?? 0) + (results["R"] ?? 0); results["sigma_1"] = Number.isFinite(v) ? v : 0; } catch { results["sigma_1"] = 0; }
  try { const v = (results["sigma_avg"] ?? 0) - (results["R"] ?? 0); results["sigma_2"] = Number.isFinite(v) ? v : 0; } catch { results["sigma_2"] = 0; }
  try { const v = (results["R"] ?? 0); results["tau_max"] = Number.isFinite(v) ? v : 0; } catch { results["tau_max"] = 0; }
  try { const v = 0.5 * Math.atan2(input.tau_xy, (input.sigma_x - input.sigma_y) / 2) * 180 / Math.PI; results["theta_p"] = Number.isFinite(v) ? v : 0; } catch { results["theta_p"] = 0; }
  try { const v = (results["theta_p"] ?? 0) + 45; results["theta_s"] = Number.isFinite(v) ? v : 0; } catch { results["theta_s"] = 0; }
  results["Average_Stress___avg____sigma_avg__MPa"] = 0;
  results["Radius_R____R__MPa"] = 0;
  results["Principal_Angle___p____theta_p__"] = 0;
  results["Shear_Angle___s____theta_s__"] = 0;
  return results;
}


export function calculateMohrs_circle_calculator(input: Mohrs_circle_calculatorInput): Mohrs_circle_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["sigma_avg"] ?? 0;
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


export interface Mohrs_circle_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
