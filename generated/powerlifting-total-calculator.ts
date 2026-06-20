// Auto-generated from powerlifting-total-calculator-schema.json
import * as z from 'zod';

export interface Powerlifting_total_calculatorInput {
  squat: number;
  benchPress: number;
  deadlift: number;
  bodyWeight: number;
  dataConfidence?: number;
}

export const Powerlifting_total_calculatorInputSchema = z.object({
  squat: z.number().default(0),
  benchPress: z.number().default(0),
  deadlift: z.number().default(0),
  bodyWeight: z.number().default(0),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Powerlifting_total_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.squat + input.benchPress + input.deadlift; results["primary"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["primary"] = Number.NaN; }
  try { const v = input.squat; results["breakdown"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["breakdown"] = Number.NaN; }
  try { const v = input.squat; results["squat"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["squat"] = Number.NaN; }
  try { const v = input.benchPress; results["benchPress"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["benchPress"] = Number.NaN; }
  try { const v = input.deadlift; results["deadlift"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["deadlift"] = Number.NaN; }
  return results;
}


export function calculatePowerlifting_total_calculator(input: Powerlifting_total_calculatorInput): Powerlifting_total_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["primary"]);
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


export interface Powerlifting_total_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
