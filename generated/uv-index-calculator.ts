// Auto-generated from uv-index-calculator-schema.json
import * as z from 'zod';

export interface Uv_index_calculatorInput {
  sza: number;
  ozone: number;
  altitude: number;
  albedo: number;
  aod: number;
  cloudCover: number;
}

export const Uv_index_calculatorInputSchema = z.object({
  sza: z.number().default(30),
  ozone: z.number().default(300),
  altitude: z.number().default(0),
  albedo: z.number().default(0.05),
  aod: z.number().default(0.1),
  cloudCover: z.number().default(0),
});

function evaluateAllFormulas(input: Uv_index_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = 12 * Math.pow(Math.cos(input.sza * Math.PI / 180), 1.2) * Math.exp(-0.003 * (input.ozone - 250)) * (1 + 0.04 * input.altitude / 1000) * (1 + input.albedo) * Math.exp(-input.aod); results["clearSkyUvIndex"] = Number.isFinite(v) ? v : 0; } catch { results["clearSkyUvIndex"] = 0; }
  try { const v = (results["clearSkyUvIndex"] ?? 0) * (1 - 0.75 * input.cloudCover); results["uvIndex"] = Number.isFinite(v) ? v : 0; } catch { results["uvIndex"] = 0; }
  try { const v = (results["uvIndex"] ?? 0) * 25; results["uvIrradiance"] = Number.isFinite(v) ? v : 0; } catch { results["uvIrradiance"] = 0; }
  return results;
}


export function calculateUv_index_calculator(input: Uv_index_calculatorInput): Uv_index_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["uvIndex"] ?? 0;
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


export interface Uv_index_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
