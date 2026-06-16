// Auto-generated from golden-hour-calculator-schema.json
import * as z from 'zod';

export interface Golden_hour_calculatorInput {
  sunrise: number;
  sunset: number;
  latitude: number;
  longitude: number;
  dateOffset: number;
  timezoneOffset: number;
}

export const Golden_hour_calculatorInputSchema = z.object({
  sunrise: z.number().default(6.5),
  sunset: z.number().default(19.5),
  latitude: z.number().default(40.7128),
  longitude: z.number().default(-74.006),
  dateOffset: z.number().default(172),
  timezoneOffset: z.number().default(-4),
});

function evaluateAllFormulas(input: Golden_hour_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.sunset - input.sunrise; results["dayLength"] = Number.isFinite(v) ? v : 0; } catch { results["dayLength"] = 0; }
  try { const v = input.sunrise + (results["dayLength"] ?? 0) / 2; results["solarNoon"] = Number.isFinite(v) ? v : 0; } catch { results["solarNoon"] = 0; }
  try { const v = 23.45 * Math.sin((360/365) * (input.dateOffset - 81) * Math.PI / 180); results["declination"] = Number.isFinite(v) ? v : 0; } catch { results["declination"] = 0; }
  try { const v = Math.acos(-Math.tan(input.latitude * Math.PI / 180) * Math.tan((results["declination"] ?? 0) * Math.PI / 180)) * 180 / Math.PI; results["hourAngle"] = Number.isFinite(v) ? v : 0; } catch { results["hourAngle"] = 0; }
  try { const v = (results["solarNoon"] ?? 0) - (results["hourAngle"] ?? 0) / 15 - 0.5; results["goldenHourMorningStart"] = Number.isFinite(v) ? v : 0; } catch { results["goldenHourMorningStart"] = 0; }
  try { const v = (results["solarNoon"] ?? 0) - (results["hourAngle"] ?? 0) / 15 + 0.5; results["goldenHourMorningEnd"] = Number.isFinite(v) ? v : 0; } catch { results["goldenHourMorningEnd"] = 0; }
  try { const v = (results["solarNoon"] ?? 0) + (results["hourAngle"] ?? 0) / 15 - 0.5; results["goldenHourEveningStart"] = Number.isFinite(v) ? v : 0; } catch { results["goldenHourEveningStart"] = 0; }
  try { const v = (results["solarNoon"] ?? 0) + (results["hourAngle"] ?? 0) / 15 + 0.5; results["goldenHourEveningEnd"] = Number.isFinite(v) ? v : 0; } catch { results["goldenHourEveningEnd"] = 0; }
  return results;
}


export function calculateGolden_hour_calculator(input: Golden_hour_calculatorInput): Golden_hour_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["Golden"] ?? 0;
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


export interface Golden_hour_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
