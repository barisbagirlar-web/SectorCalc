// Auto-generated from running-equivalent-calculator-schema.json
import * as z from 'zod';

export interface Running_equivalent_calculatorInput {
  knownDistance: number;
  knownTimeMinutes: number;
  knownTimeSeconds: number;
  targetDistance: number;
  exponent: number;
  dataConfidence?: number;
}

export const Running_equivalent_calculatorInputSchema = z.object({
  knownDistance: z.number().default(5),
  knownTimeMinutes: z.number().default(25),
  knownTimeSeconds: z.number().default(0),
  targetDistance: z.number().default(10),
  exponent: z.number().default(1.06),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Running_equivalent_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.knownTimeMinutes + input.knownTimeSeconds / 60; results["totalKnownTime"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["totalKnownTime"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["totalKnownTime"])) * (input.targetDistance / input.knownDistance) ^ input.exponent; results["predictedTimeMinutes"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["predictedTimeMinutes"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["predictedTimeMinutes"])) / input.targetDistance; results["predictedPacePerKm"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["predictedPacePerKm"] = Number.NaN; }
  return results;
}


export function calculateRunning_equivalent_calculator(input: Running_equivalent_calculatorInput): Running_equivalent_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["predictedTimeMinutes"]);
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


export interface Running_equivalent_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
