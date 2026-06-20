// Auto-generated from cycling-pace-calculator-schema.json
import * as z from 'zod';

export interface Cycling_pace_calculatorInput {
  distance: number;
  hours: number;
  minutes: number;
  seconds: number;
  dataConfidence?: number;
}

export const Cycling_pace_calculatorInputSchema = z.object({
  distance: z.number().default(10),
  hours: z.number().default(0),
  minutes: z.number().default(30),
  seconds: z.number().default(0),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Cycling_pace_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.hours * 3600 + input.minutes * 60 + input.seconds; results["totalTimeSec"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["totalTimeSec"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["totalTimeSec"])) / 60; results["totalTimeMin"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["totalTimeMin"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["totalTimeMin"])) / input.distance; results["pace"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["pace"] = Number.NaN; }
  try { const v = input.distance / ((toNumericFormulaValue(results["totalTimeSec"])) / 3600); results["speed"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["speed"] = Number.NaN; }
  return results;
}


export function calculateCycling_pace_calculator(input: Cycling_pace_calculatorInput): Cycling_pace_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["pace"]);
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


export interface Cycling_pace_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
