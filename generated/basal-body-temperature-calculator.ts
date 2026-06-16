// Auto-generated from basal-body-temperature-calculator-schema.json
import * as z from 'zod';

export interface Basal_body_temperature_calculatorInput {
  day1Temp: number;
  day2Temp: number;
  day3Temp: number;
  baselineTemp: number;
  threshold: number;
  daysToConfirm: number;
}

export const Basal_body_temperature_calculatorInputSchema = z.object({
  day1Temp: z.number().default(36.5),
  day2Temp: z.number().default(36.6),
  day3Temp: z.number().default(36.7),
  baselineTemp: z.number().default(36.5),
  threshold: z.number().default(0.2),
  daysToConfirm: z.number().default(3),
});

function evaluateAllFormulas(input: Basal_body_temperature_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = (input.day1Temp + input.day2Temp + input.day3Temp) / 3; results["averageTemperature"] = Number.isFinite(v) ? v : 0; } catch { results["averageTemperature"] = 0; }
  try { const v = (input.day1Temp > input.baselineTemp + input.threshold ? 1 : 0) + (input.day2Temp > input.baselineTemp + input.threshold ? 1 : 0) + (input.day3Temp > input.baselineTemp + input.threshold ? 1 : 0); results["daysAboveThreshold"] = Number.isFinite(v) ? v : 0; } catch { results["daysAboveThreshold"] = 0; }
  try { const v = ((input.day1Temp > input.baselineTemp + input.threshold ? 1 : 0) + (input.day2Temp > input.baselineTemp + input.threshold ? 1 : 0) + (input.day3Temp > input.baselineTemp + input.threshold ? 1 : 0)) >= input.daysToConfirm ? 1 : 0; results["temperatureShiftScore"] = Number.isFinite(v) ? v : 0; } catch { results["temperatureShiftScore"] = 0; }
  return results;
}


export function calculateBasal_body_temperature_calculator(input: Basal_body_temperature_calculatorInput): Basal_body_temperature_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["temperatureShiftScore"] ?? 0;
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


export interface Basal_body_temperature_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
