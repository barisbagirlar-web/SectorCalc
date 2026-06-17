// @ts-nocheck
// Auto-generated from cycling-speed-calculator-schema.json
import * as z from 'zod';

export interface Cycling_speed_calculatorInput {
  distance: number;
  timeHours: number;
  timeMinutes: number;
  timeSeconds: number;
  breakTime: number;
}

export const Cycling_speed_calculatorInputSchema = z.object({
  distance: z.number().default(10),
  timeHours: z.number().default(0),
  timeMinutes: z.number().default(30),
  timeSeconds: z.number().default(0),
  breakTime: z.number().default(5),
});

function asFormulaNumber(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Cycling_speed_calculatorInput): Record<string, number | string> {
  const results: Record<string, number | string> = {};
  try { const v = input.timeHours * 60 + input.timeMinutes + input.timeSeconds / 60; results["totalTimeMinutes"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["totalTimeMinutes"] = 0; }
  try { const v = (asFormulaNumber(results["totalTimeMinutes"])) - input.breakTime; results["movingTimeMinutes"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["movingTimeMinutes"] = 0; }
  try { const v = input.distance / ((asFormulaNumber(results["movingTimeMinutes"])) / 60); results["avgMovingSpeed"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["avgMovingSpeed"] = 0; }
  try { const v = input.distance / ((asFormulaNumber(results["totalTimeMinutes"])) / 60); results["avgTotalSpeed"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["avgTotalSpeed"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

export function calculateCycling_speed_calculator(input: Cycling_speed_calculatorInput): Cycling_speed_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["avgMovingSpeed"]);
  const breakdown = {
    
  };
  const hiddenLossDrivers: string[] = [];
  const suggestedActions: string[] = ["Review inputs and verify results against site standards."];
  const dataConfidenceAdjusted =
    typeof (input as unknown as Record<string, unknown>).dataConfidence === "number"
      ? totalWasteCost * (((input as unknown as Record<string, unknown>).dataConfidence as number) / 100)
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
