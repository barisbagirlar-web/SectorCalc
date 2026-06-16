// Auto-generated from absorbed-dose-calculator-schema.json
import * as z from 'zod';

export interface Absorbed_dose_calculatorInput {
  mass: number;
  energy: number;
  time: number;
  density: number;
  volume: number;
}

export const Absorbed_dose_calculatorInputSchema = z.object({
  mass: z.number().default(1),
  energy: z.number().default(100),
  time: z.number().default(3600),
  density: z.number().default(1000),
  volume: z.number().default(0.001),
});

function evaluateAllFormulas(input: Absorbed_dose_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.energy / input.mass; results["absorbedDose"] = Number.isFinite(v) ? v : 0; } catch { results["absorbedDose"] = 0; }
  try { const v = (results["absorbedDose"] ?? 0) / input.time; results["doseRate"] = Number.isFinite(v) ? v : 0; } catch { results["doseRate"] = 0; }
  try { const v = input.density * input.volume; results["massFromDensity"] = Number.isFinite(v) ? v : 0; } catch { results["massFromDensity"] = 0; }
  try { const v = input.mass === (results["massFromDensity"] ?? 0) ? input.mass : (input.mass + (results["massFromDensity"] ?? 0)) / 2; results["checkMass"] = Number.isFinite(v) ? v : 0; } catch { results["checkMass"] = 0; }
  return results;
}


export function calculateAbsorbed_dose_calculator(input: Absorbed_dose_calculatorInput): Absorbed_dose_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["absorbedDose"] ?? 0;
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


export interface Absorbed_dose_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
