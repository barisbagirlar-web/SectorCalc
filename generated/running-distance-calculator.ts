// Auto-generated from running-distance-calculator-schema.json
import * as z from 'zod';

export interface Running_distance_calculatorInput {
  speed: number;
  hours: number;
  minutes: number;
  seconds: number;
  dataConfidence?: number;
}

export const Running_distance_calculatorInputSchema = z.object({
  speed: z.number().default(10),
  hours: z.number().default(0),
  minutes: z.number().default(30),
  seconds: z.number().default(0),
});

function asFormulaNumber(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Running_distance_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.hours + input.minutes/60 + input.seconds/3600; results["totalTimeHours"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["totalTimeHours"] = 0; }
  try { const v = input.hours*60 + input.minutes + input.seconds/60; results["totalTimeMinutes"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["totalTimeMinutes"] = 0; }
  try { const v = input.speed * (asFormulaNumber(results["totalTimeHours"])); results["distance_km"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["distance_km"] = 0; }
  try { const v = (asFormulaNumber(results["distance_km"])) * 0.621371; results["distance_miles"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["distance_miles"] = 0; }
  try { const v = (asFormulaNumber(results["distance_km"])) > 0 ? (asFormulaNumber(results["totalTimeMinutes"])) / (asFormulaNumber(results["distance_km"])) : 0; results["pace_per_km"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["pace_per_km"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

export function calculateRunning_distance_calculator(input: Running_distance_calculatorInput): Running_distance_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["distance_km"]);
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


export interface Running_distance_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
