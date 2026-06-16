// Auto-generated from atomic-mass-calculator-schema.json
import * as z from 'zod';

export interface Atomic_mass_calculatorInput {
  protonCount: number;
  neutronCount: number;
  electronCount: number;
  protonMass: number;
  neutronMass: number;
  electronMass: number;
  bindingEnergy: number;
}

export const Atomic_mass_calculatorInputSchema = z.object({
  protonCount: z.number().default(6),
  neutronCount: z.number().default(6),
  electronCount: z.number().default(6),
  protonMass: z.number().default(1.007276),
  neutronMass: z.number().default(1.008665),
  electronMass: z.number().default(0.00054858),
  bindingEnergy: z.number().default(0),
});

function evaluateAllFormulas(input: Atomic_mass_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = (input.protonCount * input.protonMass + input.neutronCount * input.neutronMass + input.electronCount * input.electronMass) - (input.bindingEnergy * 0.001073544); results["atomicMass"] = Number.isFinite(v) ? v : 0; } catch { results["atomicMass"] = 0; }
  try { const v = input.protonCount + input.neutronCount; results["massNumber"] = Number.isFinite(v) ? v : 0; } catch { results["massNumber"] = 0; }
  try { const v = (input.protonCount * input.protonMass + input.neutronCount * input.neutronMass) - ((results["atomicMass"] ?? 0) - input.electronCount * input.electronMass); results["massDefect"] = Number.isFinite(v) ? v : 0; } catch { results["massDefect"] = 0; }
  return results;
}


export function calculateAtomic_mass_calculator(input: Atomic_mass_calculatorInput): Atomic_mass_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["atomicMass"] ?? 0;
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


export interface Atomic_mass_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
