// Auto-generated from inhg-to-psi-calculator-schema.json
import * as z from 'zod';

export interface Inhg_to_psi_calculatorInput {
  pressure_inhg: number;
  conversion_factor: number;
  decimal_places: number;
  altitude_ft: number;
  temperature_f: number;
}

export const Inhg_to_psi_calculatorInputSchema = z.object({
  pressure_inhg: z.number().default(29.92),
  conversion_factor: z.number().default(0.491154),
  decimal_places: z.number().default(4),
  altitude_ft: z.number().default(0),
  temperature_f: z.number().default(32),
});

function evaluateAllFormulas(input: Inhg_to_psi_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.pressure_inhg * input.conversion_factor; results["pressure_psi_raw"] = Number.isFinite(v) ? v : 0; } catch { results["pressure_psi_raw"] = 0; }
  try { const v = Math.round((results["pressure_psi_raw"] ?? 0) * Math.pow(10, input.decimal_places)) / Math.pow(10, input.decimal_places); results["pressure_psi"] = Number.isFinite(v) ? v : 0; } catch { results["pressure_psi"] = 0; }
  try { const v = input.pressure_inhg * input.conversion_factor; results["pressure_psi_raw___pressure_inhg___conve"] = Number.isFinite(v) ? v : 0; } catch { results["pressure_psi_raw___pressure_inhg___conve"] = 0; }
  try { const v = Math.round((results["pressure_psi_raw"] ?? 0), input.decimal_places); results["pressure_psi___round_pressure_psi_raw__d"] = Number.isFinite(v) ? v : 0; } catch { results["pressure_psi___round_pressure_psi_raw__d"] = 0; }
  return results;
}


export function calculateInhg_to_psi_calculator(input: Inhg_to_psi_calculatorInput): Inhg_to_psi_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["pressure_psi"] ?? 0;
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


export interface Inhg_to_psi_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
