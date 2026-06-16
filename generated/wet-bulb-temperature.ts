// Auto-generated from wet-bulb-temperature-schema.json
import * as z from 'zod';

export interface Wet_bulb_temperatureInput {
  dryBulbTemp: number;
  relativeHumidity: number;
  atmosphericPressure: number;
  altitude: number;
}

export const Wet_bulb_temperatureInputSchema = z.object({
  dryBulbTemp: z.number().default(25),
  relativeHumidity: z.number().default(50),
  atmosphericPressure: z.number().default(1013.25),
  altitude: z.number().default(0),
});

function evaluateAllFormulas(input: Wet_bulb_temperatureInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.dryBulbTemp * Math.atan(0.151977 * Math.sqrt(input.relativeHumidity + 8.313659)); results["term1"] = Number.isFinite(v) ? v : 0; } catch { results["term1"] = 0; }
  try { const v = Math.atan(input.dryBulbTemp + input.relativeHumidity); results["term2"] = Number.isFinite(v) ? v : 0; } catch { results["term2"] = 0; }
  try { const v = -Math.atan(input.relativeHumidity - 1.676331); results["term3"] = Number.isFinite(v) ? v : 0; } catch { results["term3"] = 0; }
  try { const v = 0.00391838 * Math.pow(input.relativeHumidity, 1.5) * Math.atan(0.023101 * input.relativeHumidity); results["term4"] = Number.isFinite(v) ? v : 0; } catch { results["term4"] = 0; }
  try { const v = (results["term1"] ?? 0) + (results["term2"] ?? 0) + (results["term3"] ?? 0) + (results["term4"] ?? 0) - 4.686035; results["wetBulbTemp"] = Number.isFinite(v) ? v : 0; } catch { results["wetBulbTemp"] = 0; }
  return results;
}


export function calculateWet_bulb_temperature(input: Wet_bulb_temperatureInput): Wet_bulb_temperatureOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["wetBulbTemp"] ?? 0;
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


export interface Wet_bulb_temperatureOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
