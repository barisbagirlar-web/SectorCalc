// Auto-generated from circadian-rhythm-calculator-schema.json
import * as z from 'zod';

export interface Circadian_rhythm_calculatorInput {
  wakeTime: number;
  currentTime: number;
  sleepDuration: number;
  circadianAmplitude: number;
  baselineAlertness: number;
  dataConfidence?: number;
}

export const Circadian_rhythm_calculatorInputSchema = z.object({
  wakeTime: z.number().default(7),
  currentTime: z.number().default(12),
  sleepDuration: z.number().default(7.5),
  circadianAmplitude: z.number().default(30),
  baselineAlertness: z.number().default(70),
});

function asFormulaNumber(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Circadian_rhythm_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = ((input.currentTime - input.wakeTime + 24) % 24); results["hoursSinceWake"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["hoursSinceWake"] = 0; }
  try { const v = ((input.currentTime - input.wakeTime + 24) % 24); results["hoursSinceWake_aux"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["hoursSinceWake_aux"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

export function calculateCircadian_rhythm_calculator(input: Circadian_rhythm_calculatorInput): Circadian_rhythm_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["hoursSinceWake_aux"]);
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


export interface Circadian_rhythm_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
