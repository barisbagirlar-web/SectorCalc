// Auto-generated from cycling-speed-calculator-schema.json
import * as z from 'zod';

export interface Cycling_speed_calculatorInput {
  distance: number;
  timeHours: number;
  timeMinutes: number;
  timeSeconds: number;
  breakTime: number;
  dataConfidence?: number;
}

export const Cycling_speed_calculatorInputSchema = z.object({
  distance: z.number().default(10),
  timeHours: z.number().default(0),
  timeMinutes: z.number().default(30),
  timeSeconds: z.number().default(0),
  breakTime: z.number().default(5),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Cycling_speed_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.timeHours * 60 + input.timeMinutes + input.timeSeconds / 60; results["totalTimeMinutes"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["totalTimeMinutes"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["totalTimeMinutes"])) - input.breakTime; results["movingTimeMinutes"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["movingTimeMinutes"] = Number.NaN; }
  try { const v = input.distance / ((toNumericFormulaValue(results["movingTimeMinutes"])) / 60); results["avgMovingSpeed"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["avgMovingSpeed"] = Number.NaN; }
  try { const v = input.distance / ((toNumericFormulaValue(results["totalTimeMinutes"])) / 60); results["avgTotalSpeed"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["avgTotalSpeed"] = Number.NaN; }
  return results;
}


export function calculateCycling_speed_calculator(input: Cycling_speed_calculatorInput): Cycling_speed_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["avgMovingSpeed"]);
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


export interface Cycling_speed_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
