// Auto-generated from golden-hour-calculator-schema.json
import * as z from 'zod';

export interface Golden_hour_calculatorInput {
  sunrise: number;
  sunset: number;
  latitude: number;
  longitude: number;
  dateOffset: number;
  timezoneOffset: number;
  dataConfidence?: number;
}

export const Golden_hour_calculatorInputSchema = z.object({
  sunrise: z.number().default(6.5),
  sunset: z.number().default(19.5),
  latitude: z.number().default(40.7128),
  longitude: z.number().default(-74.006),
  dateOffset: z.number().default(172),
  timezoneOffset: z.number().default(-4),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Golden_hour_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = (input.sunrise) * (input.sunset) * (input.latitude) * (input.longitude) * (input.dateOffset) * (input.timezoneOffset); results["dayLength"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["dayLength"] = Number.NaN; }
  try { const v = (input.sunrise) * (input.sunset) * (input.latitude); results["solarNoon"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["solarNoon"] = Number.NaN; }
  try { const v = (input.sunrise) * (input.sunset) * (input.latitude); results["goldenHourMorningStart"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["goldenHourMorningStart"] = Number.NaN; }
  try { const v = (input.sunrise) * (input.sunset) * (input.latitude); results["goldenHourMorningEnd"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["goldenHourMorningEnd"] = Number.NaN; }
  try { const v = (input.sunrise) * (input.sunset) * (input.latitude); results["goldenHourEveningStart"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["goldenHourEveningStart"] = Number.NaN; }
  try { const v = (input.sunrise) * (input.sunset) * (input.latitude); results["goldenHourEveningEnd"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["goldenHourEveningEnd"] = Number.NaN; }
  return results;
}


export function calculateGolden_hour_calculator(input: Golden_hour_calculatorInput): Golden_hour_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["dayLength"]);
  const breakdown = {
    
  };
  const hiddenLossDrivers: string[] = [];
  const suggestedActions: string[] = ["Review inputs and verify results against site standards."];
  const dataConfidenceAdjusted =
    typeof input.dataConfidence === "number"
      ? totalWasteCost * (input.dataConfidence / 100)
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
