// @ts-nocheck
// Auto-generated from ironman-70-3-calculator-schema.json
import * as z from 'zod';

export interface Ironman_70_3_calculatorInput {
  swim_pace: number;
  bike_speed: number;
  run_pace: number;
  t1: number;
  t2: number;
}

export const Ironman_70_3_calculatorInputSchema = z.object({
  swim_pace: z.number().default(2),
  bike_speed: z.number().default(30),
  run_pace: z.number().default(5.5),
  t1: z.number().default(3),
  t2: z.number().default(2),
});

function asFormulaNumber(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Ironman_70_3_calculatorInput): Record<string, number | string> {
  const results: Record<string, number | string> = {};
  try { const v = 19 * input.swim_pace; results["swim_time"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["swim_time"] = 0; }
  try { const v = (90 / input.bike_speed) * 60; results["bike_time"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["bike_time"] = 0; }
  try { const v = 21.1 * input.run_pace; results["run_time"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["run_time"] = 0; }
  try { const v = input.t1 + input.t2; results["transition_time"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["transition_time"] = 0; }
  try { const v = (asFormulaNumber(results["swim_time"])) + (asFormulaNumber(results["bike_time"])) + (asFormulaNumber(results["run_time"])) + (asFormulaNumber(results["transition_time"])); results["total_time_minutes"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["total_time_minutes"] = 0; }
  try { const v = (asFormulaNumber(results["total_time_minutes"])) / 60; results["total_time_hours"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["total_time_hours"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

export function calculateIronman_70_3_calculator(input: Ironman_70_3_calculatorInput): Ironman_70_3_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["total_time_hours"]);
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


export interface Ironman_70_3_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
