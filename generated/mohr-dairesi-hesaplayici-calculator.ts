// Auto-generated from mohr-dairesi-hesaplayici-calculator-schema.json
import * as z from 'zod';

export interface Mohr_dairesi_hesaplayici_calculatorInput {
  sigma_x: number;
  sigma_y: number;
  tau_xy: number;
  theta: number;
}

export const Mohr_dairesi_hesaplayici_calculatorInputSchema = z.object({
  sigma_x: z.number().default(0),
  sigma_y: z.number().default(0),
  tau_xy: z.number().default(0),
  theta: z.number().default(0),
});

function evaluateAllFormulas(input: Mohr_dairesi_hesaplayici_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = (input.sigma_x + input.sigma_y) / 2; results["sigma_avg"] = Number.isFinite(v) ? v : 0; } catch { results["sigma_avg"] = 0; }
  try { const v = Math.sqrt(Math.pow((input.sigma_x - input.sigma_y) / 2, 2) + Math.pow(input.tau_xy, 2)); results["radius"] = Number.isFinite(v) ? v : 0; } catch { results["radius"] = 0; }
  try { const v = (results["sigma_avg"] ?? 0) + (results["radius"] ?? 0); results["sigma_1"] = Number.isFinite(v) ? v : 0; } catch { results["sigma_1"] = 0; }
  try { const v = (results["sigma_avg"] ?? 0) - (results["radius"] ?? 0); results["sigma_2"] = Number.isFinite(v) ? v : 0; } catch { results["sigma_2"] = 0; }
  try { const v = (results["radius"] ?? 0); results["tau_max"] = Number.isFinite(v) ? v : 0; } catch { results["tau_max"] = 0; }
  try { const v = 0.5 * Math.atan2(2 * input.tau_xy, input.sigma_x - input.sigma_y); results["theta_p_rad"] = Number.isFinite(v) ? v : 0; } catch { results["theta_p_rad"] = 0; }
  try { const v = (results["theta_p_rad"] ?? 0) * (180 / Math.PI); results["theta_p_deg"] = Number.isFinite(v) ? v : 0; } catch { results["theta_p_deg"] = 0; }
  try { const v = input.theta * Math.PI / 180; results["theta_rad"] = Number.isFinite(v) ? v : 0; } catch { results["theta_rad"] = 0; }
  try { const v = (results["sigma_avg"] ?? 0) + ((input.sigma_x - input.sigma_y) / 2) * Math.cos(2 * (results["theta_rad"] ?? 0)) + input.tau_xy * Math.sin(2 * (results["theta_rad"] ?? 0)); results["sigma_x_prime"] = Number.isFinite(v) ? v : 0; } catch { results["sigma_x_prime"] = 0; }
  try { const v = (results["sigma_avg"] ?? 0) - ((input.sigma_x - input.sigma_y) / 2) * Math.cos(2 * (results["theta_rad"] ?? 0)) - input.tau_xy * Math.sin(2 * (results["theta_rad"] ?? 0)); results["sigma_y_prime"] = Number.isFinite(v) ? v : 0; } catch { results["sigma_y_prime"] = 0; }
  try { const v = -(input.sigma_x - input.sigma_y) / 2 * Math.sin(2 * (results["theta_rad"] ?? 0)) + input.tau_xy * Math.cos(2 * (results["theta_rad"] ?? 0)); results["tau_xy_prime"] = Number.isFinite(v) ? v : 0; } catch { results["tau_xy_prime"] = 0; }
  return results;
}


export function calculateMohr_dairesi_hesaplayici_calculator(input: Mohr_dairesi_hesaplayici_calculatorInput): Mohr_dairesi_hesaplayici_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["sigma_1"] ?? 0;
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


export interface Mohr_dairesi_hesaplayici_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
