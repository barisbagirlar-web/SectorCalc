// Auto-generated from cannabis-calculator-schema.json
import * as z from 'zod';

export interface Cannabis_calculatorInput {
  initial_cannabinoid_mg: number;
  solvent_volume_ml: number;
  extraction_time_min: number;
  temperature_c: number;
  k0: number;
  Ea: number;
}

export const Cannabis_calculatorInputSchema = z.object({
  initial_cannabinoid_mg: z.number().default(1000),
  solvent_volume_ml: z.number().default(500),
  extraction_time_min: z.number().default(60),
  temperature_c: z.number().default(25),
  k0: z.number().default(0.01),
  Ea: z.number().default(50000),
});

function evaluateAllFormulas(input: Cannabis_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.k0 * Math.exp(-input.Ea / (8.314 * (input.temperature_c + 273.15))); results["k"] = Number.isFinite(v) ? v : 0; } catch { results["k"] = 0; }
  try { const v = input.initial_cannabinoid_mg * (1 - Math.exp(-(results["k"] ?? 0) * input.extraction_time_min)); results["extracted"] = Number.isFinite(v) ? v : 0; } catch { results["extracted"] = 0; }
  try { const v = ((results["extracted"] ?? 0) / input.initial_cannabinoid_mg) * 100; results["efficiency"] = Number.isFinite(v) ? v : 0; } catch { results["efficiency"] = 0; }
  return results;
}


export function calculateCannabis_calculator(input: Cannabis_calculatorInput): Cannabis_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["extracted"] ?? 0;
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


export interface Cannabis_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
