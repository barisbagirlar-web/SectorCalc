// @ts-nocheck
// Auto-generated from jack-daniels-vdot-calculator-schema.json
import * as z from 'zod';

export interface Jack_daniels_vdot_calculatorInput {
  raceDistance: number;
  raceTimeMinutes: number;
  raceTimeSeconds: number;
  targetDistance: number;
}

export const Jack_daniels_vdot_calculatorInputSchema = z.object({
  raceDistance: z.number().default(5000),
  raceTimeMinutes: z.number().default(20),
  raceTimeSeconds: z.number().default(0),
  targetDistance: z.number().default(10000),
});

function asFormulaNumber(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Jack_daniels_vdot_calculatorInput): Record<string, number | string> {
  const results: Record<string, number | string> = {};
  try { const v = input.raceDistance / (input.raceTimeMinutes + input.raceTimeSeconds / 60); results["velocity"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["velocity"] = 0; }
  try { const v = 0.2 * (input.raceDistance / (input.raceTimeMinutes + input.raceTimeSeconds / 60)) + 3.5; results["vdot"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["vdot"] = 0; }
  try { const v = input.targetDistance / (input.raceDistance / (input.raceTimeMinutes + input.raceTimeSeconds / 60)); results["predictedTimeMinutes"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["predictedTimeMinutes"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

export function calculateJack_daniels_vdot_calculator(input: Jack_daniels_vdot_calculatorInput): Jack_daniels_vdot_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["vdot"]);
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


export interface Jack_daniels_vdot_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
