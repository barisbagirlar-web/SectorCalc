// Auto-generated from polarization-calculator-schema.json
import * as z from 'zod';

export interface Polarization_calculatorInput {
  incident_intensity: number;
  incident_angle: number;
  polarizer1_angle: number;
  polarizer2_angle: number;
}

export const Polarization_calculatorInputSchema = z.object({
  incident_intensity: z.number().default(1),
  incident_angle: z.number().default(0),
  polarizer1_angle: z.number().default(0),
  polarizer2_angle: z.number().default(45),
});

function evaluateAllFormulas(input: Polarization_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.incident_intensity * Math.cos((input.incident_angle - input.polarizer1_angle) * Math.PI / 180) ** 2; results["I1"] = Number.isFinite(v) ? v : 0; } catch { results["I1"] = 0; }
  try { const v = (results["I1"] ?? 0) * Math.cos((input.polarizer1_angle - input.polarizer2_angle) * Math.PI / 180) ** 2; results["I2"] = Number.isFinite(v) ? v : 0; } catch { results["I2"] = 0; }
  return results;
}


export function calculatePolarization_calculator(input: Polarization_calculatorInput): Polarization_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["final_intensity"] ?? 0;
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


export interface Polarization_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
