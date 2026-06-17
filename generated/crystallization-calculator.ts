// Auto-generated from crystallization-calculator-schema.json
import * as z from 'zod';

export interface Crystallization_calculatorInput {
  massSolvent: number;
  solubilityInitial: number;
  solubilityFinal: number;
  temperatureInitial: number;
  temperatureFinal: number;
}

export const Crystallization_calculatorInputSchema = z.object({
  massSolvent: z.number().default(100),
  solubilityInitial: z.number().default(50),
  solubilityFinal: z.number().default(20),
  temperatureInitial: z.number().default(80),
  temperatureFinal: z.number().default(25),
});

function evaluateAllFormulas(input: Crystallization_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.massSolvent * input.solubilityInitial / 100; results["massInitialSolute"] = Number.isFinite(v) ? v : 0; } catch { results["massInitialSolute"] = 0; }
  try { const v = input.massSolvent * (input.solubilityInitial - input.solubilityFinal) / 100; results["massCrystal"] = Number.isFinite(v) ? v : 0; } catch { results["massCrystal"] = 0; }
  try { const v = ((results["massCrystal"] ?? 0) / (results["massInitialSolute"] ?? 0)) * 100; results["yieldPercent"] = Number.isFinite(v) ? v : 0; } catch { results["yieldPercent"] = 0; }
  return results;
}


export function calculateCrystallization_calculator(input: Crystallization_calculatorInput): Crystallization_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["massInitialSolute"] ?? 0;
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


export interface Crystallization_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
