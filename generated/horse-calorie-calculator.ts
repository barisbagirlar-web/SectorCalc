// @ts-nocheck
// Auto-generated from horse-calorie-calculator-schema.json
import * as z from 'zod';

export interface Horse_calorie_calculatorInput {
  bodyWeight: number;
  activityLevel: number;
  pregnancyStage: number;
  lactationStage: number;
  ageFactor: number;
}

export const Horse_calorie_calculatorInputSchema = z.object({
  bodyWeight: z.number().default(500),
  activityLevel: z.number().default(1.2),
  pregnancyStage: z.number().default(1),
  lactationStage: z.number().default(1),
  ageFactor: z.number().default(1),
});

function asFormulaNumber(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Horse_calorie_calculatorInput): Record<string, number | string> {
  const results: Record<string, number | string> = {};
  try { const v = 1.4 + 0.03 * (input.bodyWeight * 2.20462); results["maintenanceDE"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["maintenanceDE"] = 0; }
  try { const v = (asFormulaNumber(results["maintenanceDE"])) * input.activityLevel * input.pregnancyStage * input.lactationStage * input.ageFactor; results["totalDailyDE"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["totalDailyDE"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

export function calculateHorse_calorie_calculator(input: Horse_calorie_calculatorInput): Horse_calorie_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["totalDailyDE"]);
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


export interface Horse_calorie_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
