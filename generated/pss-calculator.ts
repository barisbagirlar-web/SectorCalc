// Auto-generated from pss-calculator-schema.json
import * as z from 'zod';

export interface Pss_calculatorInput {
  inertiaConstant: number;
  initialAngle: number;
  mechPower: number;
  maxElecPower: number;
  frequency: number;
}

export const Pss_calculatorInputSchema = z.object({
  inertiaConstant: z.number().default(3.5),
  initialAngle: z.number().default(30),
  mechPower: z.number().default(0.8),
  maxElecPower: z.number().default(1.5),
  frequency: z.number().default(50),
});

function evaluateAllFormulas(input: Pss_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.initialAngle * Math.PI / 180; results["delta0_rad"] = Number.isFinite(v) ? v : 0; } catch { results["delta0_rad"] = 0; }
  try { const v = input.mechPower; results["pm"] = Number.isFinite(v) ? v : 0; } catch { results["pm"] = 0; }
  try { const v = input.maxElecPower; results["pmax"] = Number.isFinite(v) ? v : 0; } catch { results["pmax"] = 0; }
  try { const v = input.inertiaConstant; results["h"] = Number.isFinite(v) ? v : 0; } catch { results["h"] = 0; }
  try { const v = input.frequency; results["freq"] = Number.isFinite(v) ? v : 0; } catch { results["freq"] = 0; }
  try { const v = Math.asin((results["pm"] ?? 0) / (results["pmax"] ?? 0)); results["delta1_rad"] = Number.isFinite(v) ? v : 0; } catch { results["delta1_rad"] = 0; }
  try { const v = Math.PI - (results["delta1_rad"] ?? 0); results["delta_max_rad"] = Number.isFinite(v) ? v : 0; } catch { results["delta_max_rad"] = 0; }
  try { const v = ((results["pm"] ?? 0) * ((results["delta_max_rad"] ?? 0) - (results["delta0_rad"] ?? 0)) + (results["pmax"] ?? 0) * Math.cos((results["delta_max_rad"] ?? 0))) / (results["pmax"] ?? 0); results["cosDelta_cr"] = Number.isFinite(v) ? v : 0; } catch { results["cosDelta_cr"] = 0; }
  try { const v = Math.acos((results["cosDelta_cr"] ?? 0)); results["delta_cr_rad"] = Number.isFinite(v) ? v : 0; } catch { results["delta_cr_rad"] = 0; }
  try { const v = (results["delta_cr_rad"] ?? 0) * 180 / Math.PI; results["criticalClearingAngle"] = Number.isFinite(v) ? v : 0; } catch { results["criticalClearingAngle"] = 0; }
  try { const v = Math.sqrt((2 * (results["h"] ?? 0) * ((results["delta_cr_rad"] ?? 0) - (results["delta0_rad"] ?? 0))) / (Math.PI * (results["freq"] ?? 0) * (results["pm"] ?? 0))); results["criticalClearingTime"] = Number.isFinite(v) ? v : 0; } catch { results["criticalClearingTime"] = 0; }
  try { const v = (results["delta_max_rad"] ?? 0) * 180 / Math.PI; results["maxSwingAngle"] = Number.isFinite(v) ? v : 0; } catch { results["maxSwingAngle"] = 0; }
  try { const v = (results["pm"] ?? 0) * ((results["delta_cr_rad"] ?? 0) - (results["delta0_rad"] ?? 0)); results["acceleratingEnergy"] = Number.isFinite(v) ? v : 0; } catch { results["acceleratingEnergy"] = 0; }
  return results;
}


export function calculatePss_calculator(input: Pss_calculatorInput): Pss_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["criticalClearingTime"] ?? 0;
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


export interface Pss_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
