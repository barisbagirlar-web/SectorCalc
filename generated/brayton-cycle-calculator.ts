// Auto-generated from brayton-cycle-calculator-schema.json
import * as z from 'zod';

export interface Brayton_cycle_calculatorInput {
  T1: number;
  T3: number;
  rp: number;
  eta_c: number;
  eta_t: number;
  gamma: number;
  cp: number;
}

export const Brayton_cycle_calculatorInputSchema = z.object({
  T1: z.number().default(300),
  T3: z.number().default(1200),
  rp: z.number().default(10),
  eta_c: z.number().default(0.85),
  eta_t: z.number().default(0.9),
  gamma: z.number().default(1.4),
  cp: z.number().default(1.005),
});

function evaluateAllFormulas(input: Brayton_cycle_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.T1 * Math.pow(input.rp, (input.gamma - 1) / input.gamma); results["T2s"] = Number.isFinite(v) ? v : 0; } catch { results["T2s"] = 0; }
  try { const v = input.T1 + ((results["T2s"] ?? 0) - input.T1) / input.eta_c; results["T2"] = Number.isFinite(v) ? v : 0; } catch { results["T2"] = 0; }
  try { const v = input.T3 / Math.pow(input.rp, (input.gamma - 1) / input.gamma); results["T4s"] = Number.isFinite(v) ? v : 0; } catch { results["T4s"] = 0; }
  try { const v = input.T3 - input.eta_t * (input.T3 - (results["T4s"] ?? 0)); results["T4"] = Number.isFinite(v) ? v : 0; } catch { results["T4"] = 0; }
  try { const v = input.cp * ((results["T2"] ?? 0) - input.T1); results["Wc"] = Number.isFinite(v) ? v : 0; } catch { results["Wc"] = 0; }
  try { const v = input.cp * (input.T3 - (results["T4"] ?? 0)); results["Wt"] = Number.isFinite(v) ? v : 0; } catch { results["Wt"] = 0; }
  try { const v = (results["Wt"] ?? 0) - (results["Wc"] ?? 0); results["Wnet"] = Number.isFinite(v) ? v : 0; } catch { results["Wnet"] = 0; }
  try { const v = input.cp * (input.T3 - (results["T2"] ?? 0)); results["Q_in"] = Number.isFinite(v) ? v : 0; } catch { results["Q_in"] = 0; }
  try { const v = (results["Wnet"] ?? 0) / (results["Q_in"] ?? 0); results["eta_th"] = Number.isFinite(v) ? v : 0; } catch { results["eta_th"] = 0; }
  try { const v = (results["Wc"] ?? 0) / (results["Wt"] ?? 0); results["bwr"] = Number.isFinite(v) ? v : 0; } catch { results["bwr"] = 0; }
  return results;
}


export function calculateBrayton_cycle_calculator(input: Brayton_cycle_calculatorInput): Brayton_cycle_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["eta_th"] ?? 0;
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


export interface Brayton_cycle_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
