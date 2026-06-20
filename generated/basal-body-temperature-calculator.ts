// Auto-generated from basal-body-temperature-calculator-schema.json
import * as z from 'zod';

export interface Basal_body_temperature_calculatorInput {
  day1Temp: number;
  day2Temp: number;
  day3Temp: number;
  baselineTemp: number;
  threshold: number;
  daysToConfirm: number;
  dataConfidence?: number;
}

export const Basal_body_temperature_calculatorInputSchema = z.object({
  day1Temp: z.number().default(36.5),
  day2Temp: z.number().default(36.6),
  day3Temp: z.number().default(36.7),
  baselineTemp: z.number().default(36.5),
  threshold: z.number().default(0.2),
  daysToConfirm: z.number().default(3),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Basal_body_temperature_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = (input.day1Temp + input.day2Temp + input.day3Temp) / 3; results["averageTemperature"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["averageTemperature"] = Number.NaN; }
  try { const v = (input.day1Temp > input.baselineTemp + input.threshold ? 1 : 0) + (input.day2Temp > input.baselineTemp + input.threshold ? 1 : 0) + (input.day3Temp > input.baselineTemp + input.threshold ? 1 : 0); results["daysAboveThreshold"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["daysAboveThreshold"] = Number.NaN; }
  try { const v = ((input.day1Temp > input.baselineTemp + input.threshold ? 1 : 0) + (input.day2Temp > input.baselineTemp + input.threshold ? 1 : 0) + (input.day3Temp > input.baselineTemp + input.threshold ? 1 : 0)) >= input.daysToConfirm ? 1 : 0; results["temperatureShiftScore"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["temperatureShiftScore"] = Number.NaN; }
  return results;
}


export function calculateBasal_body_temperature_calculator(input: Basal_body_temperature_calculatorInput): Basal_body_temperature_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["temperatureShiftScore"]);
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


export interface Basal_body_temperature_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
