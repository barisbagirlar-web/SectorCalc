// Auto-generated from binding-energy-calculator-schema.json
import * as z from 'zod';

export interface Binding_energy_calculatorInput {
  protons: number;
  neutrons: number;
  protonMass: number;
  neutronMass: number;
  nucleusMass: number;
  conversionFactor: number;
}

export const Binding_energy_calculatorInputSchema = z.object({
  protons: z.number().default(1),
  neutrons: z.number().default(1),
  protonMass: z.number().default(1.007276466812),
  neutronMass: z.number().default(1.00866491588),
  nucleusMass: z.number().default(2.01410177811),
  conversionFactor: z.number().default(931.49410242),
});

function evaluateAllFormulas(input: Binding_energy_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = (input.protons * input.protonMass + input.neutrons * input.neutronMass - input.nucleusMass) * input.conversionFactor; results["totalBindingEnergy"] = Number.isFinite(v) ? v : 0; } catch { results["totalBindingEnergy"] = 0; }
  try { const v = ((input.protons * input.protonMass + input.neutrons * input.neutronMass - input.nucleusMass) * input.conversionFactor) / Math.max(1, (input.protons + input.neutrons)); results["bindingEnergyPerNucleon"] = Number.isFinite(v) ? v : 0; } catch { results["bindingEnergyPerNucleon"] = 0; }
  try { const v = (input.protons * input.protonMass + input.neutrons * input.neutronMass - input.nucleusMass); results["massDefect"] = Number.isFinite(v) ? v : 0; } catch { results["massDefect"] = 0; }
  return results;
}


export function calculateBinding_energy_calculator(input: Binding_energy_calculatorInput): Binding_energy_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["totalBindingEnergy"] ?? 0;
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


export interface Binding_energy_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
