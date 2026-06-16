// Auto-generated from pool-evaporation-calculator-schema.json
import * as z from 'zod';

export interface Pool_evaporation_calculatorInput {
  surfaceArea: number;
  waterTemp: number;
  airTemp: number;
  relativeHumidity: number;
  windSpeed: number;
}

export const Pool_evaporation_calculatorInputSchema = z.object({
  surfaceArea: z.number().default(50),
  waterTemp: z.number().default(28),
  airTemp: z.number().default(25),
  relativeHumidity: z.number().default(60),
  windSpeed: z.number().default(2),
});

function evaluateAllFormulas(input: Pool_evaporation_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = 0.6108 * Math.exp(17.27 * input.waterTemp / (input.waterTemp + 237.3)); results["saturationVaporPressureWater"] = Number.isFinite(v) ? v : 0; } catch { results["saturationVaporPressureWater"] = 0; }
  try { const v = 0.6108 * Math.exp(17.27 * input.airTemp / (input.airTemp + 237.3)); results["saturationVaporPressureAir"] = Number.isFinite(v) ? v : 0; } catch { results["saturationVaporPressureAir"] = 0; }
  try { const v = (results["saturationVaporPressureAir"] ?? 0) * input.relativeHumidity / 100; results["actualVaporPressureAir"] = Number.isFinite(v) ? v : 0; } catch { results["actualVaporPressureAir"] = 0; }
  try { const v = (results["saturationVaporPressureWater"] ?? 0) - (results["actualVaporPressureAir"] ?? 0); results["vaporPressureDeficit"] = Number.isFinite(v) ? v : 0; } catch { results["vaporPressureDeficit"] = 0; }
  try { const v = 0.02 * (results["vaporPressureDeficit"] ?? 0) * input.surfaceArea * (1 + 0.5 * input.windSpeed); results["evaporationRateLPerH"] = Number.isFinite(v) ? v : 0; } catch { results["evaporationRateLPerH"] = 0; }
  return results;
}


export function calculatePool_evaporation_calculator(input: Pool_evaporation_calculatorInput): Pool_evaporation_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["evaporationRateLPerH"] ?? 0;
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


export interface Pool_evaporation_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
