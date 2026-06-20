// Auto-generated from texas-method-calculator-schema.json
import * as z from 'zod';

export interface Texas_method_calculatorInput {
  oneRepMax: number;
  fiveRepMaxPercentage: number;
  volumeDayPercentage: number;
  lightDayPercentage: number;
  intensityDayIncrement: number;
  dataConfidence?: number;
}

export const Texas_method_calculatorInputSchema = z.object({
  oneRepMax: z.number().default(100),
  fiveRepMaxPercentage: z.number().default(85),
  volumeDayPercentage: z.number().default(90),
  lightDayPercentage: z.number().default(80),
  intensityDayIncrement: z.number().default(2.5),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Texas_method_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.oneRepMax * (input.fiveRepMaxPercentage / 100); results["fiveRM"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["fiveRM"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["fiveRM"])) * (input.volumeDayPercentage / 100); results["volumeDayWeight"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["volumeDayWeight"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["volumeDayWeight"])) * (input.lightDayPercentage / 100); results["lightDayWeight"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["lightDayWeight"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["fiveRM"])) + input.intensityDayIncrement; results["intensityDayWeight"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["intensityDayWeight"] = Number.NaN; }
  return results;
}


export function calculateTexas_method_calculator(input: Texas_method_calculatorInput): Texas_method_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["volumeDayWeight"]);
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


export interface Texas_method_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
