// Auto-generated from diesel-cycle-calculator-schema.json
import * as z from 'zod';

export interface Diesel_cycle_calculatorInput {
  r: number;
  rc: number;
  T1: number;
  p1: number;
  k: number;
  cv: number;
}

export const Diesel_cycle_calculatorInputSchema = z.object({
  r: z.number().default(18),
  rc: z.number().default(2.5),
  T1: z.number().default(300),
  p1: z.number().default(100000),
  k: z.number().default(1.4),
  cv: z.number().default(718),
});

function evaluateAllFormulas(input: Diesel_cycle_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.cv * (input.k - 1); results["R"] = Number.isFinite(v) ? v : 0; } catch { results["R"] = 0; }
  try { const v = input.T1 * Math.pow(input.r, input.k - 1); results["T2"] = Number.isFinite(v) ? v : 0; } catch { results["T2"] = 0; }
  try { const v = (results["T2"] ?? 0) * input.rc; results["T3"] = Number.isFinite(v) ? v : 0; } catch { results["T3"] = 0; }
  try { const v = (results["T3"] ?? 0) * Math.pow(input.rc / input.r, input.k - 1); results["T4"] = Number.isFinite(v) ? v : 0; } catch { results["T4"] = 0; }
  try { const v = input.p1 * Math.pow(input.r, input.k); results["p2"] = Number.isFinite(v) ? v : 0; } catch { results["p2"] = 0; }
  try { const v = (results["p2"] ?? 0); results["p3"] = Number.isFinite(v) ? v : 0; } catch { results["p3"] = 0; }
  try { const v = (results["p3"] ?? 0) * Math.pow(input.rc / input.r, input.k); results["p4"] = Number.isFinite(v) ? v : 0; } catch { results["p4"] = 0; }
  try { const v = input.k * input.cv * ((results["T3"] ?? 0) - (results["T2"] ?? 0)); results["q_in"] = Number.isFinite(v) ? v : 0; } catch { results["q_in"] = 0; }
  try { const v = input.cv * ((results["T4"] ?? 0) - input.T1); results["q_out"] = Number.isFinite(v) ? v : 0; } catch { results["q_out"] = 0; }
  try { const v = (results["q_in"] ?? 0) - (results["q_out"] ?? 0); results["w_net"] = Number.isFinite(v) ? v : 0; } catch { results["w_net"] = 0; }
  try { const v = (results["w_net"] ?? 0) / (results["q_in"] ?? 0); results["eta"] = Number.isFinite(v) ? v : 0; } catch { results["eta"] = 0; }
  try { const v = (results["R"] ?? 0) * input.T1 / input.p1; results["v1"] = Number.isFinite(v) ? v : 0; } catch { results["v1"] = 0; }
  try { const v = (results["w_net"] ?? 0) / ((results["v1"] ?? 0) * (1 - 1/input.r)); results["mep"] = Number.isFinite(v) ? v : 0; } catch { results["mep"] = 0; }
  try { const v = (results["mep"] ?? 0) / 1000; results["mep_kPa"] = Number.isFinite(v) ? v : 0; } catch { results["mep_kPa"] = 0; }
  return results;
}


export function calculateDiesel_cycle_calculator(input: Diesel_cycle_calculatorInput): Diesel_cycle_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["eta"] ?? 0;
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


export interface Diesel_cycle_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
