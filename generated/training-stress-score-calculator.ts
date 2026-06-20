// Auto-generated from training-stress-score-calculator-schema.json
import * as z from 'zod';

export interface Training_stress_score_calculatorInput {
  hours: number;
  minutes: number;
  ftp: number;
  normalizedPower: number;
  dataConfidence?: number;
}

export const Training_stress_score_calculatorInputSchema = z.object({
  hours: z.number().default(1),
  minutes: z.number().default(0),
  ftp: z.number().default(250),
  normalizedPower: z.number().default(200),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Training_stress_score_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = (input.hours + input.minutes / 60) * ((input.normalizedPower / input.ftp) ** 2) * 100; results["tss"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["tss"] = Number.NaN; }
  try { const v = input.normalizedPower / input.ftp; results["intensityFactor"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["intensityFactor"] = Number.NaN; }
  try { const v = input.hours + input.minutes / 60; results["totalHours"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["totalHours"] = Number.NaN; }
  return results;
}


export function calculateTraining_stress_score_calculator(input: Training_stress_score_calculatorInput): Training_stress_score_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["tss"]);
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


export interface Training_stress_score_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
