// Auto-generated from walking-pace-calculator-schema.json
import * as z from 'zod';

export interface Walking_pace_calculatorInput {
  distanceMeters: number;
  timeHours: number;
  timeMinutes: number;
  timeSeconds: number;
  strideLengthCm: number;
  steps: number;
  dataConfidence?: number;
}

export const Walking_pace_calculatorInputSchema = z.object({
  distanceMeters: z.number().default(1000),
  timeHours: z.number().default(0),
  timeMinutes: z.number().default(15),
  timeSeconds: z.number().default(0),
  strideLengthCm: z.number().default(0),
  steps: z.number().default(0),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Walking_pace_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.distanceMeters > 0 ? input.distanceMeters : (input.steps * input.strideLengthCm / 100); results["distanceMetersCalc"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["distanceMetersCalc"] = Number.NaN; }
  try { const v = input.timeHours * 3600 + input.timeMinutes * 60 + input.timeSeconds; results["totalSeconds"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["totalSeconds"] = Number.NaN; }
  try { const v = ((toNumericFormulaValue(results["distanceMetersCalc"])) * 3.6) / (toNumericFormulaValue(results["totalSeconds"])); results["speedKmh"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["speedKmh"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["totalSeconds"])) / (toNumericFormulaValue(results["distanceMetersCalc"])) * 1000 / 60; results["paceMinPerKm"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["paceMinPerKm"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["distanceMetersCalc"])) / 1000; results["totalDistanceKm"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["totalDistanceKm"] = Number.NaN; }
  return results;
}


export function calculateWalking_pace_calculator(input: Walking_pace_calculatorInput): Walking_pace_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["paceMinPerKm"]);
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


export interface Walking_pace_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
