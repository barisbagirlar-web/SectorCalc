// Auto-generated from seconds-to-minutes-calculator-schema.json
import * as z from 'zod';

export interface Seconds_to_minutes_calculatorInput {
  seconds: number;
  scaleFactor: number;
  offsetSeconds: number;
  roundingPrecision: number;
  roundingMethod: number;
  temperatureCelsius: number;
  tempCoefficient: number;
  humidityPercent: number;
}

export const Seconds_to_minutes_calculatorInputSchema = z.object({
  seconds: z.number().default(60),
  scaleFactor: z.number().default(1),
  offsetSeconds: z.number().default(0),
  roundingPrecision: z.number().default(2),
  roundingMethod: z.number().default(1),
  temperatureCelsius: z.number().default(20),
  tempCoefficient: z.number().default(0),
  humidityPercent: z.number().default(50),
});

function evaluateAllFormulas(input: Seconds_to_minutes_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.seconds * input.scaleFactor + input.offsetSeconds + input.temperatureCelsius * input.tempCoefficient; results["effectiveSeconds"] = Number.isFinite(v) ? v : 0; } catch { results["effectiveSeconds"] = 0; }
  try { const v = (results["effectiveSeconds"] ?? 0) / 60; results["rawMinutes"] = Number.isFinite(v) ? v : 0; } catch { results["rawMinutes"] = 0; }
  try { const v = (input.roundingMethod === 0 ? Math.floor((results["rawMinutes"] ?? 0) * Math.pow(10, input.roundingPrecision)) / Math.pow(10, input.roundingPrecision) : input.roundingMethod === 2 ? Math.ceil((results["rawMinutes"] ?? 0) * Math.pow(10, input.roundingPrecision)) / Math.pow(10, input.roundingPrecision) : Math.round((results["rawMinutes"] ?? 0) * Math.pow(10, input.roundingPrecision)) / Math.pow(10, input.roundingPrecision)); results["roundedMinutes"] = Number.isFinite(v) ? v : 0; } catch { results["roundedMinutes"] = 0; }
  return results;
}


export function calculateSeconds_to_minutes_calculator(input: Seconds_to_minutes_calculatorInput): Seconds_to_minutes_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["roundedMinutes"] ?? 0;
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


export interface Seconds_to_minutes_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
