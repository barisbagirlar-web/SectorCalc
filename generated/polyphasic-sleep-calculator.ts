// Auto-generated from polyphasic-sleep-calculator-schema.json
import * as z from 'zod';

export interface Polyphasic_sleep_calculatorInput {
  coreSleepDuration: number;
  numberOfNaps: number;
  napDuration: number;
  sleepGoal: number;
  dataConfidence?: number;
}

export const Polyphasic_sleep_calculatorInputSchema = z.object({
  coreSleepDuration: z.number().default(3),
  numberOfNaps: z.number().default(4),
  napDuration: z.number().default(20),
  sleepGoal: z.number().default(8),
});

function asFormulaNumber(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Polyphasic_sleep_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.coreSleepDuration; results["coreSleepDuration"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["coreSleepDuration"] = 0; }
  try { const v = (input.numberOfNaps * input.napDuration) / 60; results["napSleepHours"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["napSleepHours"] = 0; }
  try { const v = input.coreSleepDuration + ((input.numberOfNaps * input.napDuration) / 60); results["totalSleepHours"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["totalSleepHours"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

export function calculatePolyphasic_sleep_calculator(input: Polyphasic_sleep_calculatorInput): Polyphasic_sleep_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["totalSleepHours"]);
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


export interface Polyphasic_sleep_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
