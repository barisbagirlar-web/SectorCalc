// Auto-generated from sunrise-sunset-calculator-schema.json
import * as z from 'zod';

export interface Sunrise_sunset_calculatorInput {
  latitude: number;
  longitude: number;
  dayOfYear: number;
  timezoneOffset: number;
}

export const Sunrise_sunset_calculatorInputSchema = z.object({
  latitude: z.number().default(40.7128),
  longitude: z.number().default(-74.006),
  dayOfYear: z.number().default(172),
  timezoneOffset: z.number().default(-4),
});

function evaluateAllFormulas(input: Sunrise_sunset_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = 23.44 * Math.sin((360/365) * (input.dayOfYear - 81) * Math.PI / 180); results["declination"] = Number.isFinite(v) ? v : 0; } catch { results["declination"] = 0; }
  try { const v = Math.acos(-Math.tan(input.latitude * Math.PI / 180) * Math.tan((results["declination"] ?? 0) * Math.PI / 180)) * 180 / Math.PI; results["hourAngle"] = Number.isFinite(v) ? v : 0; } catch { results["hourAngle"] = 0; }
  try { const v = 12 - (results["hourAngle"] ?? 0) / 15 - 0.00083; results["sunriseUTC"] = Number.isFinite(v) ? v : 0; } catch { results["sunriseUTC"] = 0; }
  try { const v = 12 + (results["hourAngle"] ?? 0) / 15 - 0.00083; results["sunsetUTC"] = Number.isFinite(v) ? v : 0; } catch { results["sunsetUTC"] = 0; }
  try { const v = (results["sunriseUTC"] ?? 0) + input.timezoneOffset; results["sunriseLocal"] = Number.isFinite(v) ? v : 0; } catch { results["sunriseLocal"] = 0; }
  try { const v = (results["sunsetUTC"] ?? 0) + input.timezoneOffset; results["sunsetLocal"] = Number.isFinite(v) ? v : 0; } catch { results["sunsetLocal"] = 0; }
  return results;
}


export function calculateSunrise_sunset_calculator(input: Sunrise_sunset_calculatorInput): Sunrise_sunset_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["sunriseLocal"] ?? 0;
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


export interface Sunrise_sunset_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
