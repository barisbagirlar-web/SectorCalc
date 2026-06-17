// Auto-generated from convection-calculator-schema.json
import * as z from 'zod';

export interface Convection_calculatorInput {
  L: number;
  W: number;
  Ts: number;
  Tinf: number;
  k: number;
  nu: number;
  Pr: number;
}

export const Convection_calculatorInputSchema = z.object({
  L: z.number().default(0.5),
  W: z.number().default(0.3),
  Ts: z.number().default(50),
  Tinf: z.number().default(25),
  k: z.number().default(0.0257),
  nu: z.number().default(0.000016),
  Pr: z.number().default(0.7),
});

function evaluateAllFormulas(input: Convection_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.Ts - input.Tinf; results["deltaT"] = Number.isFinite(v) ? v : 0; } catch { results["deltaT"] = 0; }
  try { const v = input.Tinf + 273.15; results["Tf_K"] = Number.isFinite(v) ? v : 0; } catch { results["Tf_K"] = 0; }
  try { const v = 1 / (results["Tf_K"] ?? 0); results["beta"] = Number.isFinite(v) ? v : 0; } catch { results["beta"] = 0; }
  try { const v = 9.81 * (results["beta"] ?? 0) * Math.abs((results["deltaT"] ?? 0)) * Math.pow(input.L, 3) / (input.nu * input.nu); results["Gr"] = Number.isFinite(v) ? v : 0; } catch { results["Gr"] = 0; }
  try { const v = (results["Gr"] ?? 0) * input.Pr; results["Ra"] = Number.isFinite(v) ? v : 0; } catch { results["Ra"] = 0; }
  try { const v = (results["Ra"] ?? 0) <= 1e9 ? 0.59 * Math.pow((results["Ra"] ?? 0), 0.25) : 0.1 * Math.pow((results["Ra"] ?? 0), 1/3); results["Nu"] = Number.isFinite(v) ? v : 0; } catch { results["Nu"] = 0; }
  try { const v = (results["Nu"] ?? 0) * input.k / input.L; results["h"] = Number.isFinite(v) ? v : 0; } catch { results["h"] = 0; }
  try { const v = input.L * input.W; results["A"] = Number.isFinite(v) ? v : 0; } catch { results["A"] = 0; }
  try { const v = (results["h"] ?? 0) * (results["A"] ?? 0) * (results["deltaT"] ?? 0); results["Q"] = Number.isFinite(v) ? v : 0; } catch { results["Q"] = 0; }
  results["Grashof_Say_s___Gr_"] = 0;
  results["Rayleigh_Say_s___Ra_"] = 0;
  results["Nusselt_Say_s___Nu_"] = 0;
  results["Is__Ta__n_m_Katsay_s___h___W_m_K_"] = 0;
  try { const v = Alan ((results["A"] ?? 0)); results["Alan__A___m__"] = Number.isFinite(v) ? v : 0; } catch { results["Alan__A___m__"] = 0; }
  results["S_cakl_k_Fark____T____C_"] = 0;
  return results;
}


export function calculateConvection_calculator(input: Convection_calculatorInput): Convection_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["Q"] ?? 0;
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


export interface Convection_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
