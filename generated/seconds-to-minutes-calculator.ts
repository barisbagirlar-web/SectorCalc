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
  dataConfidence?: number;
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

function asFormulaNumber(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Seconds_to_minutes_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.seconds * input.scaleFactor + input.offsetSeconds + input.temperatureCelsius * input.tempCoefficient; results["effectiveSeconds"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["effectiveSeconds"] = 0; }
  try { const v = (asFormulaNumber(results["effectiveSeconds"])) / 60; results["rawMinutes"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["rawMinutes"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

export function calculateSeconds_to_minutes_calculator(input: Seconds_to_minutes_calculatorInput): Seconds_to_minutes_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["rawMinutes"]);
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


export interface Seconds_to_minutes_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
