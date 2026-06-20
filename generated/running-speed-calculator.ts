// Auto-generated from running-speed-calculator-schema.json
import * as z from 'zod';

export interface Running_speed_calculatorInput {
  distance: number;
  time_hours: number;
  time_minutes: number;
  time_seconds: number;
  dataConfidence?: number;
}

export const Running_speed_calculatorInputSchema = z.object({
  distance: z.number().default(5),
  time_hours: z.number().default(0),
  time_minutes: z.number().default(30),
  time_seconds: z.number().default(0),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Running_speed_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = (input.time_hours * 3600 + input.time_minutes * 60 + input.time_seconds) / 3600; results["total_time"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["total_time"] = Number.NaN; }
  try { const v = input.distance / (toNumericFormulaValue(results["total_time"])); results["speed"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["speed"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["total_time"])) * 60 / input.distance; results["pace"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["pace"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["speed"])) / 3.6; results["speed_ms"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["speed_ms"] = Number.NaN; }
  return results;
}


export function calculateRunning_speed_calculator(input: Running_speed_calculatorInput): Running_speed_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["speed"]);
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


export interface Running_speed_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
