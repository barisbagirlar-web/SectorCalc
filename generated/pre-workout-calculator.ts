// Auto-generated from pre-workout-calculator-schema.json
import * as z from 'zod';

export interface Pre_workout_calculatorInput {
  bodyWeight: number;
  caffeinePerKg: number;
  betaAlaninePerKg: number;
  citrullinePerKg: number;
  water: number;
  dataConfidence?: number;
}

export const Pre_workout_calculatorInputSchema = z.object({
  bodyWeight: z.number().default(75),
  caffeinePerKg: z.number().default(3),
  betaAlaninePerKg: z.number().default(50),
  citrullinePerKg: z.number().default(80),
  water: z.number().default(300),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Pre_workout_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.bodyWeight * input.caffeinePerKg; results["caffeineDose"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["caffeineDose"] = Number.NaN; }
  try { const v = input.bodyWeight * input.betaAlaninePerKg; results["betaAlanineDose"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["betaAlanineDose"] = Number.NaN; }
  try { const v = input.bodyWeight * input.citrullinePerKg; results["citrullineDose"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["citrullineDose"] = Number.NaN; }
  try { const v = ((toNumericFormulaValue(results["caffeineDose"])) + (toNumericFormulaValue(results["betaAlanineDose"])) + (toNumericFormulaValue(results["citrullineDose"]))) / 1000; results["totalActiveGrams"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["totalActiveGrams"] = Number.NaN; }
  try { const v = input.water; results["waterAmount"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["waterAmount"] = Number.NaN; }
  return results;
}


export function calculatePre_workout_calculator(input: Pre_workout_calculatorInput): Pre_workout_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["caffeineDose"]);
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


export interface Pre_workout_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
