// @ts-nocheck
// Auto-generated from cns-fatigue-calculator-schema.json
import * as z from 'zod';

export interface Cns_fatigue_calculatorInput {
  bodyWeight: number;
  weightLifted: number;
  reps: number;
  sets: number;
  restBetweenSets: number;
  daysSinceLastSession: number;
  trainingExperience: number;
}

export const Cns_fatigue_calculatorInputSchema = z.object({
  bodyWeight: z.number().default(70),
  weightLifted: z.number().default(100),
  reps: z.number().default(10),
  sets: z.number().default(5),
  restBetweenSets: z.number().default(2),
  daysSinceLastSession: z.number().default(1),
  trainingExperience: z.number().default(2),
});

function asFormulaNumber(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Cns_fatigue_calculatorInput): Record<string, number | string> {
  const results: Record<string, number | string> = {};
  try { const v = input.weightLifted * input.reps * input.sets; results["totalLoad"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["totalLoad"] = 0; }
  try { const v = input.weightLifted / input.bodyWeight; results["intensity"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["intensity"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

export function calculateCns_fatigue_calculator(input: Cns_fatigue_calculatorInput): Cns_fatigue_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["intensity"]);
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


export interface Cns_fatigue_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
