// @ts-nocheck
// Auto-generated from swimming-calculator-schema.json
import * as z from 'zod';

export interface Swimming_calculatorInput {
  distance: number;
  time: number;
  restTime: number;
  laps: number;
  poolLength: number;
}

export const Swimming_calculatorInputSchema = z.object({
  distance: z.number().default(100),
  time: z.number().default(60),
  restTime: z.number().default(30),
  laps: z.number().default(1),
  poolLength: z.number().default(25),
});

function asFormulaNumber(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Swimming_calculatorInput): Record<string, number | string> {
  const results: Record<string, number | string> = {};
  try { const v = input.time / (input.distance / 100); results["averagePacePer100m"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["averagePacePer100m"] = 0; }
  try { const v = input.time * input.laps + input.restTime * (input.laps - 1); results["totalTimeWithRest"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["totalTimeWithRest"] = 0; }
  try { const v = input.distance * input.laps; results["totalDistance"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["totalDistance"] = 0; }
  try { const v = input.distance / input.poolLength; results["lapsPerPool"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["lapsPerPool"] = 0; }
  try { const v = input.distance / input.time; results["speedMetersPerSecond"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["speedMetersPerSecond"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

export function calculateSwimming_calculator(input: Swimming_calculatorInput): Swimming_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["averagePacePer100m"]);
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


export interface Swimming_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
