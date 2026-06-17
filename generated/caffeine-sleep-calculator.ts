// @ts-nocheck
// Auto-generated from caffeine-sleep-calculator-schema.json
import * as z from 'zod';

export interface Caffeine_sleep_calculatorInput {
  caffeineDose: number;
  halfLife: number;
  hoursBeforeSleep: number;
  toleranceFactor: number;
}

export const Caffeine_sleep_calculatorInputSchema = z.object({
  caffeineDose: z.number().default(200),
  halfLife: z.number().default(5),
  hoursBeforeSleep: z.number().default(8),
  toleranceFactor: z.number().default(1),
});

function asFormulaNumber(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Caffeine_sleep_calculatorInput): Record<string, number | string> {
  const results: Record<string, number | string> = {};
  try { const v = input.caffeineDose + input.halfLife + input.hoursBeforeSleep; results["result"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["result"] = 0; }
  try { const v = input.caffeineDose + input.halfLife + input.hoursBeforeSleep; results["result_copy"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["result_copy"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

export function calculateCaffeine_sleep_calculator(input: Caffeine_sleep_calculatorInput): Caffeine_sleep_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["result"]);
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


export interface Caffeine_sleep_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
