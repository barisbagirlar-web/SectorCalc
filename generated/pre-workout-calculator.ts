// @ts-nocheck
// Auto-generated from pre-workout-calculator-schema.json
import * as z from 'zod';

export interface Pre_workout_calculatorInput {
  bodyWeight: number;
  caffeinePerKg: number;
  betaAlaninePerKg: number;
  citrullinePerKg: number;
  water: number;
}

export const Pre_workout_calculatorInputSchema = z.object({
  bodyWeight: z.number().default(75),
  caffeinePerKg: z.number().default(3),
  betaAlaninePerKg: z.number().default(50),
  citrullinePerKg: z.number().default(80),
  water: z.number().default(300),
});

function asFormulaNumber(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Pre_workout_calculatorInput): Record<string, number | string> {
  const results: Record<string, number | string> = {};
  try { const v = input.bodyWeight * input.caffeinePerKg; results["caffeineDose"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["caffeineDose"] = 0; }
  try { const v = input.bodyWeight * input.betaAlaninePerKg; results["betaAlanineDose"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["betaAlanineDose"] = 0; }
  try { const v = input.bodyWeight * input.citrullinePerKg; results["citrullineDose"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["citrullineDose"] = 0; }
  try { const v = ((asFormulaNumber(results["caffeineDose"])) + (asFormulaNumber(results["betaAlanineDose"])) + (asFormulaNumber(results["citrullineDose"]))) / 1000; results["totalActiveGrams"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["totalActiveGrams"] = 0; }
  try { const v = input.water; results["waterAmount"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["waterAmount"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

export function calculatePre_workout_calculator(input: Pre_workout_calculatorInput): Pre_workout_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["caffeineDose"]);
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


export interface Pre_workout_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
