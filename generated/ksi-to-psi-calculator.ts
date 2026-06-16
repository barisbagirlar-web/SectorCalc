// Auto-generated from ksi-to-psi-calculator-schema.json
import * as z from 'zod';

export interface Ksi_to_psi_calculatorInput {
  nominal_pressure_ksi: number;
  safety_factor: number;
  temperature_derating: number;
  ambient_pressure_psi: number;
  allowable_stress_ksi: number;
}

export const Ksi_to_psi_calculatorInputSchema = z.object({
  nominal_pressure_ksi: z.number().default(0),
  safety_factor: z.number().default(1.5),
  temperature_derating: z.number().default(1),
  ambient_pressure_psi: z.number().default(14.7),
  allowable_stress_ksi: z.number().default(30),
});

function evaluateAllFormulas(input: Ksi_to_psi_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.nominal_pressure_ksi * 1000 * input.safety_factor * input.temperature_derating; results["total_pressure_psi"] = Number.isFinite(v) ? v : 0; } catch { results["total_pressure_psi"] = 0; }
  try { const v = (results["total_pressure_psi"] ?? 0) - input.ambient_pressure_psi; results["design_pressure_psi"] = Number.isFinite(v) ? v : 0; } catch { results["design_pressure_psi"] = 0; }
  try { const v = ((results["design_pressure_psi"] ?? 0) / 1000) / input.allowable_stress_ksi; results["utilization_ratio"] = Number.isFinite(v) ? v : 0; } catch { results["utilization_ratio"] = 0; }
  return results;
}


export function calculateKsi_to_psi_calculator(input: Ksi_to_psi_calculatorInput): Ksi_to_psi_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["design_pressure_psi"] ?? 0;
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


export interface Ksi_to_psi_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
