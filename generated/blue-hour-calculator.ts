// Auto-generated from blue-hour-calculator-schema.json
import * as z from 'zod';

export interface Blue_hour_calculatorInput {
  sunrise_time: number;
  sunset_time: number;
  latitude: number;
  longitude: number;
  timezone_offset: number;
  day_of_year: number;
}

export const Blue_hour_calculatorInputSchema = z.object({
  sunrise_time: z.number().default(6.5),
  sunset_time: z.number().default(18),
  latitude: z.number().default(40),
  longitude: z.number().default(-74),
  timezone_offset: z.number().default(-5),
  day_of_year: z.number().default(172),
});

function evaluateAllFormulas(input: Blue_hour_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = 23.45 * Math.sin((360/365) * (input.day_of_year - 81) * Math.PI / 180); results["solar_declination"] = Number.isFinite(v) ? v : 0; } catch { results["solar_declination"] = 0; }
  try { const v = Math.acos(-Math.tan(input.latitude * Math.PI / 180) * Math.tan((results["solar_declination"] ?? 0) * Math.PI / 180)) * 180 / Math.PI; results["hour_angle_sunrise"] = Number.isFinite(v) ? v : 0; } catch { results["hour_angle_sunrise"] = 0; }
  try { const v = 12 - (input.longitude / 15) - input.timezone_offset; results["solar_noon"] = Number.isFinite(v) ? v : 0; } catch { results["solar_noon"] = 0; }
  try { const v = (results["solar_noon"] ?? 0) - (results["hour_angle_sunrise"] ?? 0) / 15; results["sunrise_solar"] = Number.isFinite(v) ? v : 0; } catch { results["sunrise_solar"] = 0; }
  try { const v = (results["solar_noon"] ?? 0) + (results["hour_angle_sunrise"] ?? 0) / 15; results["sunset_solar"] = Number.isFinite(v) ? v : 0; } catch { results["sunset_solar"] = 0; }
  try { const v = (results["sunrise_solar"] ?? 0) - 0.5; results["blue_hour_morning_start"] = Number.isFinite(v) ? v : 0; } catch { results["blue_hour_morning_start"] = 0; }
  try { const v = (results["sunrise_solar"] ?? 0); results["blue_hour_morning_end"] = Number.isFinite(v) ? v : 0; } catch { results["blue_hour_morning_end"] = 0; }
  try { const v = (results["sunset_solar"] ?? 0); results["blue_hour_evening_start"] = Number.isFinite(v) ? v : 0; } catch { results["blue_hour_evening_start"] = 0; }
  try { const v = (results["sunset_solar"] ?? 0) + 0.5; results["blue_hour_evening_end"] = Number.isFinite(v) ? v : 0; } catch { results["blue_hour_evening_end"] = 0; }
  try { const v = (results["blue_hour_morning_end"] ?? 0) - (results["blue_hour_morning_start"] ?? 0); results["blue_hour_morning_duration"] = Number.isFinite(v) ? v : 0; } catch { results["blue_hour_morning_duration"] = 0; }
  try { const v = (results["blue_hour_evening_end"] ?? 0) - (results["blue_hour_evening_start"] ?? 0); results["blue_hour_evening_duration"] = Number.isFinite(v) ? v : 0; } catch { results["blue_hour_evening_duration"] = 0; }
  return results;
}


export function calculateBlue_hour_calculator(input: Blue_hour_calculatorInput): Blue_hour_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["Blue"] ?? 0;
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


export interface Blue_hour_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
