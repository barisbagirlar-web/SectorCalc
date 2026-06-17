// @ts-nocheck
// Auto-generated from powerlifting-total-calculator-schema.json
import * as z from 'zod';

export interface Powerlifting_total_calculatorInput {
  squat: number;
  benchPress: number;
  deadlift: number;
  bodyWeight: number;
}

export const Powerlifting_total_calculatorInputSchema = z.object({
  squat: z.number().default(0),
  benchPress: z.number().default(0),
  deadlift: z.number().default(0),
  bodyWeight: z.number().default(0),
});

function asFormulaNumber(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Powerlifting_total_calculatorInput): Record<string, number | string> {
  const results: Record<string, number | string> = {};
  try { const v = input.squat + input.benchPress + input.deadlift; results["primary"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["primary"] = 0; }
  try { const v = input.squat; results["breakdown"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["breakdown"] = 0; }
  try { const v = input.squat; results["squat"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["squat"] = 0; }
  try { const v = input.benchPress; results["benchPress"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["benchPress"] = 0; }
  try { const v = input.deadlift; results["deadlift"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["deadlift"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

export function calculatePowerlifting_total_calculator(input: Powerlifting_total_calculatorInput): Powerlifting_total_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["primary"]);
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


export interface Powerlifting_total_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
