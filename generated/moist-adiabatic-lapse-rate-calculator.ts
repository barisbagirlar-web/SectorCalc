// Auto-generated from moist-adiabatic-lapse-rate-calculator-schema.json
import * as z from 'zod';

export interface Moist_adiabatic_lapse_rate_calculatorInput {
  temperature: number;
  pressure: number;
  g: number;
  Lv: number;
  Rd: number;
  cpd: number;
  epsilon: number;
}

export const Moist_adiabatic_lapse_rate_calculatorInputSchema = z.object({
  temperature: z.number().default(20),
  pressure: z.number().default(1013.25),
  g: z.number().default(9.81),
  Lv: z.number().default(2500000),
  Rd: z.number().default(287.058),
  cpd: z.number().default(1003.5),
  epsilon: z.number().default(0.622),
});

function evaluateAllFormulas(input: Moist_adiabatic_lapse_rate_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.temperature + 273.15; results["T_K"] = Number.isFinite(v) ? v : 0; } catch { results["T_K"] = 0; }
  try { const v = 6.112 * 100 * Math.exp(17.67 * input.temperature / (input.temperature + 243.5)); results["e_s_Pa"] = Number.isFinite(v) ? v : 0; } catch { results["e_s_Pa"] = 0; }
  try { const v = input.pressure * 100; results["p_Pa"] = Number.isFinite(v) ? v : 0; } catch { results["p_Pa"] = 0; }
  try { const v = input.epsilon * (results["e_s_Pa"] ?? 0) / ((results["p_Pa"] ?? 0) - (results["e_s_Pa"] ?? 0)); results["r_s"] = Number.isFinite(v) ? v : 0; } catch { results["r_s"] = 0; }
  try { const v = input.g * (1 + (input.Lv * (results["r_s"] ?? 0)) / (input.Rd * (results["T_K"] ?? 0))); results["numerator"] = Number.isFinite(v) ? v : 0; } catch { results["numerator"] = 0; }
  try { const v = input.cpd + (input.Lv**2 * (results["r_s"] ?? 0) * input.epsilon) / (input.Rd * (results["T_K"] ?? 0)**2); results["denominator"] = Number.isFinite(v) ? v : 0; } catch { results["denominator"] = 0; }
  try { const v = (results["numerator"] ?? 0) / (results["denominator"] ?? 0) * 1000; results["lapseRateKm"] = Number.isFinite(v) ? v : 0; } catch { results["lapseRateKm"] = 0; }
  return results;
}


export function calculateMoist_adiabatic_lapse_rate_calculator(input: Moist_adiabatic_lapse_rate_calculatorInput): Moist_adiabatic_lapse_rate_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["lapseRateKm"] ?? 0;
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


export interface Moist_adiabatic_lapse_rate_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
