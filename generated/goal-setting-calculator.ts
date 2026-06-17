// @ts-nocheck
// Auto-generated from goal-setting-calculator-schema.json
import * as z from 'zod';

export interface Goal_setting_calculatorInput {
  currentOEE: number;
  targetOEE: number;
  timeframe: number;
  currentAvailability: number;
  currentPerformance: number;
  currentQuality: number;
}

export const Goal_setting_calculatorInputSchema = z.object({
  currentOEE: z.number().default(70),
  targetOEE: z.number().default(85),
  timeframe: z.number().default(6),
  currentAvailability: z.number().default(80),
  currentPerformance: z.number().default(90),
  currentQuality: z.number().default(95),
});

function asFormulaNumber(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Goal_setting_calculatorInput): Record<string, number | string> {
  const results: Record<string, number | string> = {};
  try { const v = input.targetOEE - input.currentOEE; results["deltaOEE"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["deltaOEE"] = 0; }
  try { const v = (asFormulaNumber(results["deltaOEE"])) / input.timeframe; results["monthlyOEEincrease"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["monthlyOEEincrease"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

export function calculateGoal_setting_calculator(input: Goal_setting_calculatorInput): Goal_setting_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["monthlyOEEincrease"]);
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


export interface Goal_setting_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
