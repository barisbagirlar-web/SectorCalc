// Auto-generated from capacitive-reactance-calculator-schema.json
import * as z from 'zod';

export interface Capacitive_reactance_calculatorInput {
  frequency: number;
  capacitance: number;
  tc: number;
  temperature: number;
  esr: number;
  safety_factor: number;
}

export const Capacitive_reactance_calculatorInputSchema = z.object({
  frequency: z.number().default(1000),
  capacitance: z.number().default(0.000001),
  tc: z.number().default(0),
  temperature: z.number().default(25),
  esr: z.number().default(0.1),
  safety_factor: z.number().default(1),
});

function evaluateAllFormulas(input: Capacitive_reactance_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.capacitance * (1 + (input.tc * 1e-6) * (input.temperature - 25)); results["C_eff"] = Number.isFinite(v) ? v : 0; } catch { results["C_eff"] = 0; }
  try { const v = 1 / (2 * Math.PI * input.frequency * (results["C_eff"] ?? 0)); results["Xc"] = Number.isFinite(v) ? v : 0; } catch { results["Xc"] = 0; }
  try { const v = (results["Xc"] ?? 0) * input.safety_factor; results["Xc_safe"] = Number.isFinite(v) ? v : 0; } catch { results["Xc_safe"] = 0; }
  try { const v = Math.sqrt(input.esr ** 2 + (results["Xc"] ?? 0) ** 2); results["Z_total"] = Number.isFinite(v) ? v : 0; } catch { results["Z_total"] = 0; }
  try { const v = Math.atan(-(results["Xc"] ?? 0) / input.esr) * (180 / Math.PI); results["phase_angle"] = Number.isFinite(v) ? v : 0; } catch { results["phase_angle"] = 0; }
  return results;
}


export function calculateCapacitive_reactance_calculator(input: Capacitive_reactance_calculatorInput): Capacitive_reactance_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["Xc_safe"] ?? 0;
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


export interface Capacitive_reactance_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
