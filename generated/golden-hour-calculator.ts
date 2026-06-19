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

function asFormulaNumber(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Golden_hour_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.sunset - input.sunrise; results["dayLength"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["dayLength"] = 0; }
  try { const v = input.sunrise + (asFormulaNumber(results["dayLength"])) / 2; results["solarNoon"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["solarNoon"] = 0; }
  try { const v = input.sunrise + 0.5; results["goldenHourMorningStart"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["goldenHourMorningStart"] = 0; }
  try { const v = input.sunrise + 1.5; results["goldenHourMorningEnd"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["goldenHourMorningEnd"] = 0; }
  try { const v = input.sunset - 1.5; results["goldenHourEveningStart"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["goldenHourEveningStart"] = 0; }
  try { const v = input.sunset - 0.5; results["goldenHourEveningEnd"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["goldenHourEveningEnd"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

export function calculateGolden_hour_calculator(input: Golden_hour_calculatorInput): Golden_hour_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = Math.max(0, toNumericFormulaValue(values["dayLength"]));
  const breakdown = {
    
  };
  const hiddenLossDrivers: string[] = [];
  const suggestedActions: string[] = ["Review inputs and verify results against site standards."];
  const dataConfidenceAdjusted =
    typeof input.dataConfidence === "number"
      ? Math.max(0, totalWasteCost * (input.dataConfidence / 100))
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
