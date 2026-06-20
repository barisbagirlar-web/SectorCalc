// Auto-generated from goal-setting-calculator-schema.json
import * as z from 'zod';

export interface Goal_setting_calculatorInput {
  currentOEE: number;
  targetOEE: number;
  timeframe: number;
  currentAvailability: number;
  currentPerformance: number;
  currentQuality: number;
  dataConfidence?: number;
}

export const Goal_setting_calculatorInputSchema = z.object({
  currentOEE: z.number().default(70),
  targetOEE: z.number().default(85),
  timeframe: z.number().default(6),
  currentAvailability: z.number().default(80),
  currentPerformance: z.number().default(90),
  currentQuality: z.number().default(95),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Goal_setting_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.targetOEE - input.currentOEE; results["deltaOEE"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["deltaOEE"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["deltaOEE"])) / input.timeframe; results["monthlyOEEincrease"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["monthlyOEEincrease"] = Number.NaN; }
  return results;
}


export function calculateGoal_setting_calculator(input: Goal_setting_calculatorInput): Goal_setting_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["monthlyOEEincrease"]);
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


export interface Goal_setting_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
