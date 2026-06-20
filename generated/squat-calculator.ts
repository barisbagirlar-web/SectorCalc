// Auto-generated from squat-calculator-schema.json
import * as z from 'zod';

export interface Squat_calculatorInput {
  weight: number;
  reps: number;
  auto_input_3: number;
  dataConfidence?: number;
}

export const Squat_calculatorInputSchema = z.object({
  weight: z.number().default(100),
  reps: z.number().default(5),
  auto_input_3: z.number().default(1),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Squat_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.weight * (1 + input.reps / 30); results["estimated1RM"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["estimated1RM"] = Number.NaN; }
  try { const v = input.weight * (1 + input.reps / 30) * 0.95; results["speedWeight"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["speedWeight"] = Number.NaN; }
  try { const v = input.weight * (1 + input.reps / 30) * 0.90; results["heavyTriple"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["heavyTriple"] = Number.NaN; }
  try { const v = input.weight * (1 + input.reps / 30) * 0.80; results["workSetWeight"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["workSetWeight"] = Number.NaN; }
  try { const v = input.weight * (1 + input.reps / 30) * 0.70; results["deloadWeight"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["deloadWeight"] = Number.NaN; }
  return results;
}


export function calculateSquat_calculator(input: Squat_calculatorInput): Squat_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["estimated1RM"]);
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


export interface Squat_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
