// Auto-generated from texas-method-calculator-schema.json
import * as z from 'zod';

export interface Texas_method_calculatorInput {
  oneRepMax: number;
  fiveRepMaxPercentage: number;
  volumeDayPercentage: number;
  lightDayPercentage: number;
  intensityDayIncrement: number;
}

export const Texas_method_calculatorInputSchema = z.object({
  oneRepMax: z.number().default(100),
  fiveRepMaxPercentage: z.number().default(85),
  volumeDayPercentage: z.number().default(90),
  lightDayPercentage: z.number().default(80),
  intensityDayIncrement: z.number().default(2.5),
});

function evaluateAllFormulas(input: Texas_method_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.oneRepMax * (input.fiveRepMaxPercentage / 100); results["fiveRM"] = Number.isFinite(v) ? v : 0; } catch { results["fiveRM"] = 0; }
  try { const v = (results["fiveRM"] ?? 0) * (input.volumeDayPercentage / 100); results["volumeDayWeight"] = Number.isFinite(v) ? v : 0; } catch { results["volumeDayWeight"] = 0; }
  try { const v = (results["volumeDayWeight"] ?? 0) * (input.lightDayPercentage / 100); results["lightDayWeight"] = Number.isFinite(v) ? v : 0; } catch { results["lightDayWeight"] = 0; }
  try { const v = (results["fiveRM"] ?? 0) + input.intensityDayIncrement; results["intensityDayWeight"] = Number.isFinite(v) ? v : 0; } catch { results["intensityDayWeight"] = 0; }
  return results;
}


export function calculateTexas_method_calculator(input: Texas_method_calculatorInput): Texas_method_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["volumeDayWeight"] ?? 0;
  const breakdown = {
    
  };
  const hiddenLossDrivers: string[] = [];
  const suggestedActions: string[] = [];
  const dataConfidenceAdjusted =
    typeof (input as Record<string, unknown>).dataConfidence === "number"
      ? totalWasteCost * (((input as Record<string, unknown>).dataConfidence as number) / 100)
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
