// @ts-nocheck
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

function asFormulaNumber(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Atomic_mass_calculatorInput): Record<string, number | string> {
  const results: Record<string, number | string> = {};
  try { const v = (input.protonCount * input.protonMass + input.neutronCount * input.neutronMass + input.electronCount * input.electronMass) - (input.bindingEnergy * 0.001073544); results["atomicMass"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["atomicMass"] = 0; }
  try { const v = input.protonCount + input.neutronCount; results["massNumber"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["massNumber"] = 0; }
  try { const v = (input.protonCount * input.protonMass + input.neutronCount * input.neutronMass) - ((asFormulaNumber(results["atomicMass"])) - input.electronCount * input.electronMass); results["massDefect"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["massDefect"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

export function calculateAtomic_mass_calculator(input: Atomic_mass_calculatorInput): Atomic_mass_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["atomicMass"]);
  const breakdown = {
    
  };
  const hiddenLossDrivers: string[] = [];
  const suggestedActions: string[] = ["Review inputs and verify results against site standards."];
  const dataConfidenceAdjusted =
    typeof (input as unknown as Record<string, unknown>).dataConfidence === "number"
      ? totalWasteCost * (((input as unknown as Record<string, unknown>).dataConfidence as number) / 100)
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
