// Auto-generated from training-stress-score-calculator-schema.json
import * as z from 'zod';

export interface Training_stress_score_calculatorInput {
  hours: number;
  minutes: number;
  ftp: number;
  normalizedPower: number;
}

export const Training_stress_score_calculatorInputSchema = z.object({
  hours: z.number().default(1),
  minutes: z.number().default(0),
  ftp: z.number().default(250),
  normalizedPower: z.number().default(200),
});

function evaluateAllFormulas(input: Training_stress_score_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = (input.hours + input.minutes / 60) * ((input.normalizedPower / input.ftp) ** 2) * 100; results["tss"] = Number.isFinite(v) ? v : 0; } catch { results["tss"] = 0; }
  try { const v = input.normalizedPower / input.ftp; results["intensityFactor"] = Number.isFinite(v) ? v : 0; } catch { results["intensityFactor"] = 0; }
  try { const v = input.hours + input.minutes / 60; results["totalHours"] = Number.isFinite(v) ? v : 0; } catch { results["totalHours"] = 0; }
  return results;
}


export function calculateTraining_stress_score_calculator(input: Training_stress_score_calculatorInput): Training_stress_score_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["tss"] ?? 0;
  const breakdown = {
    
  };
  const hiddenLossDrivers: string[] = [];
  const suggestedActions: string[] = [];
  const dataConfidenceAdjusted =
    typeof (input as Record<string, unknown>).dataConfidence === "number"
      ? totalWasteCost * (((input as Record<string, unknown>).dataConfidence as number) / 100)
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
