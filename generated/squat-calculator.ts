// @ts-nocheck
// Auto-generated from squat-calculator-schema.json
import * as z from 'zod';

export interface Squat_calculatorInput {
  weight: number;
  reps: number;
  auto_input_3: number;
}

export const Squat_calculatorInputSchema = z.object({
  weight: z.number().default(100),
  reps: z.number().default(5),
  auto_input_3: z.number().default(1),
});

function asFormulaNumber(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Squat_calculatorInput): Record<string, number | string> {
  const results: Record<string, number | string> = {};
  try { const v = input.weight * (1 + input.reps / 30); results["estimated1RM"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["estimated1RM"] = 0; }
  try { const v = input.weight * (1 + input.reps / 30) * 0.95; results["speedWeight"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["speedWeight"] = 0; }
  try { const v = input.weight * (1 + input.reps / 30) * 0.90; results["heavyTriple"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["heavyTriple"] = 0; }
  try { const v = input.weight * (1 + input.reps / 30) * 0.80; results["workSetWeight"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["workSetWeight"] = 0; }
  try { const v = input.weight * (1 + input.reps / 30) * 0.70; results["deloadWeight"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["deloadWeight"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

export function calculateSquat_calculator(input: Squat_calculatorInput): Squat_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["estimated1RM"]);
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


export interface Squat_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
