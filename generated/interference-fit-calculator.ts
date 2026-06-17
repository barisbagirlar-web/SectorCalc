// Auto-generated from interference-fit-calculator-schema.json
import * as z from 'zod';

export interface Interference_fit_calculatorInput {
  shaft_diameter: number;
  hub_diameter: number;
  interference: number;
  young_modulus_shaft: number;
  young_modulus_hub: number;
  poisson_shaft: number;
  poisson_hub: number;
  friction_coefficient: number;
}

export const Interference_fit_calculatorInputSchema = z.object({
  shaft_diameter: z.number().default(50),
  hub_diameter: z.number().default(100),
  interference: z.number().default(0.05),
  young_modulus_shaft: z.number().default(210),
  young_modulus_hub: z.number().default(210),
  poisson_shaft: z.number().default(0.3),
  poisson_hub: z.number().default(0.3),
  friction_coefficient: z.number().default(0.15),
});

function evaluateAllFormulas(input: Interference_fit_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.interference / ( (input.shaft_diameter/2) * ( (1/input.young_modulus_shaft) * (1 - input.poisson_shaft) + (1/input.young_modulus_hub) * ( (input.hub_diameter**2 + input.shaft_diameter**2) / (input.hub_diameter**2 - input.shaft_diameter**2) + input.poisson_hub ) ) ); results["contact_pressure"] = Number.isFinite(v) ? v : 0; } catch { results["contact_pressure"] = 0; }
  try { const v = Math.PI * input.shaft_diameter * 1000 * (results["contact_pressure"] ?? 0) * input.friction_coefficient * (input.shaft_diameter/2); results["axial_force"] = Number.isFinite(v) ? v : 0; } catch { results["axial_force"] = 0; }
  try { const v = Math.PI * input.shaft_diameter * 1000 * (results["contact_pressure"] ?? 0) * input.friction_coefficient * (input.shaft_diameter/2) * (input.shaft_diameter/2); results["torque_capacity"] = Number.isFinite(v) ? v : 0; } catch { results["torque_capacity"] = 0; }
  try { const v = (results["contact_pressure"] ?? 0) * ( (input.hub_diameter**2 + input.shaft_diameter**2) / (input.hub_diameter**2 - input.shaft_diameter**2) ); results["von_mises_stress_hub"] = Number.isFinite(v) ? v : 0; } catch { results["von_mises_stress_hub"] = 0; }
  results["_contact_pressure__MPa"] = 0;
  results["_axial_force__N"] = 0;
  results["_torque_capacity__N_mm"] = 0;
  results["_von_mises_stress_hub__MPa"] = 0;
  return results;
}


export function calculateInterference_fit_calculator(input: Interference_fit_calculatorInput): Interference_fit_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["contact_pressure"] ?? 0;
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


export interface Interference_fit_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
