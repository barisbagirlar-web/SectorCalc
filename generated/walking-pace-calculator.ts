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

function asFormulaNumber(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Walking_pace_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.distanceMeters > 0 ? input.distanceMeters : (input.steps * input.strideLengthCm / 100); results["distanceMetersCalc"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["distanceMetersCalc"] = 0; }
  try { const v = input.timeHours * 3600 + input.timeMinutes * 60 + input.timeSeconds; results["totalSeconds"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["totalSeconds"] = 0; }
  try { const v = ((asFormulaNumber(results["distanceMetersCalc"])) * 3.6) / (asFormulaNumber(results["totalSeconds"])); results["speedKmh"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["speedKmh"] = 0; }
  try { const v = (asFormulaNumber(results["totalSeconds"])) / (asFormulaNumber(results["distanceMetersCalc"])) * 1000 / 60; results["paceMinPerKm"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["paceMinPerKm"] = 0; }
  try { const v = (asFormulaNumber(results["distanceMetersCalc"])) / 1000; results["totalDistanceKm"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["totalDistanceKm"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

export function calculateWalking_pace_calculator(input: Walking_pace_calculatorInput): Walking_pace_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = Math.max(0, toNumericFormulaValue(values["paceMinPerKm"]));
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


export interface Walking_pace_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
