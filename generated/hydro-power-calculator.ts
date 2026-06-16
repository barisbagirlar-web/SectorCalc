// Auto-generated from hydro-power-calculator-schema.json
import * as z from 'zod';

export interface Hydro_power_calculatorInput {
  flowRate: number;
  head: number;
  turbineEfficiency: number;
  generatorEfficiency: number;
  waterDensity: number;
  gravity: number;
}

export const Hydro_power_calculatorInputSchema = z.object({
  flowRate: z.number().default(1),
  head: z.number().default(10),
  turbineEfficiency: z.number().default(85),
  generatorEfficiency: z.number().default(95),
  waterDensity: z.number().default(1000),
  gravity: z.number().default(9.81),
});

function evaluateAllFormulas(input: Hydro_power_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = (input.turbineEfficiency * input.generatorEfficiency) / 100; results["overallEfficiencyPercent"] = Number.isFinite(v) ? v : 0; } catch { results["overallEfficiencyPercent"] = 0; }
  try { const v = ((results["overallEfficiencyPercent"] ?? 0) / 100) * input.waterDensity * input.gravity * input.flowRate * input.head; results["powerWatts"] = Number.isFinite(v) ? v : 0; } catch { results["powerWatts"] = 0; }
  try { const v = (results["powerWatts"] ?? 0) / 1000; results["powerKW"] = Number.isFinite(v) ? v : 0; } catch { results["powerKW"] = 0; }
  return results;
}


export function calculateHydro_power_calculator(input: Hydro_power_calculatorInput): Hydro_power_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["powerKW"] ?? 0;
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


export interface Hydro_power_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
