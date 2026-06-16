// Auto-generated from adaptive-thermogenesis-calculator-schema.json
import * as z from 'zod';

export interface Adaptive_thermogenesis_calculatorInput {
  bee: number;
  energyIntake: number;
  duration: number;
  weight: number;
  tau: number;
  fatFreeMass: number;
}

export const Adaptive_thermogenesis_calculatorInputSchema = z.object({
  bee: z.number().default(2000),
  energyIntake: z.number().default(1500),
  duration: z.number().default(30),
  weight: z.number().default(70),
  tau: z.number().default(14),
  fatFreeMass: z.number().default(50),
});

function evaluateAllFormulas(input: Adaptive_thermogenesis_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.bee - input.energyIntake; results["initialDeficit"] = Number.isFinite(v) ? v : 0; } catch { results["initialDeficit"] = 0; }
  try { const v = 1 - Math.exp(-input.duration / input.tau); results["adaptationFactor"] = Number.isFinite(v) ? v : 0; } catch { results["adaptationFactor"] = 0; }
  try { const v = Math.sqrt(input.weight / 70); results["weightFactor"] = Number.isFinite(v) ? v : 0; } catch { results["weightFactor"] = 0; }
  try { const v = input.fatFreeMass / input.weight; results["ffmFactor"] = Number.isFinite(v) ? v : 0; } catch { results["ffmFactor"] = 0; }
  try { const v = (input.bee - input.energyIntake) * (1 - Math.exp(-input.duration / input.tau)) * Math.sqrt(input.weight / 70) * (input.fatFreeMass / input.weight); results["adaptiveThermogenesis"] = Number.isFinite(v) ? v : 0; } catch { results["adaptiveThermogenesis"] = 0; }
  return results;
}


export function calculateAdaptive_thermogenesis_calculator(input: Adaptive_thermogenesis_calculatorInput): Adaptive_thermogenesis_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["adaptiveThermogenesis"] ?? 0;
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


export interface Adaptive_thermogenesis_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
