// @ts-nocheck
// Auto-generated from uberman-sleep-calculator-schema.json
import * as z from 'zod';

export interface Uberman_sleep_calculatorInput {
  napDuration: number;
  intervalBetweenNaps: number;
  numberOfNaps: number;
  startHour: number;
}

export const Uberman_sleep_calculatorInputSchema = z.object({
  napDuration: z.number().default(20),
  intervalBetweenNaps: z.number().default(4),
  numberOfNaps: z.number().default(6),
  startHour: z.number().default(0),
});

function asFormulaNumber(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Uberman_sleep_calculatorInput): Record<string, number | string> {
  const results: Record<string, number | string> = {};
  try { const v = input.napDuration * input.numberOfNaps / 60; results["totalSleep"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["totalSleep"] = 0; }
  try { const v = (input.napDuration / 60 + input.intervalBetweenNaps) * input.numberOfNaps; results["totalSchedule"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["totalSchedule"] = 0; }
  try { const v = 24 - ((input.napDuration / 60 + input.intervalBetweenNaps) * input.numberOfNaps); results["freeTime"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["freeTime"] = 0; }
  try { const v = (input.startHour + (input.napDuration / 60 + input.intervalBetweenNaps) * input.numberOfNaps) % 24; results["lastNapEnd"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["lastNapEnd"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

export function calculateUberman_sleep_calculator(input: Uberman_sleep_calculatorInput): Uberman_sleep_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["totalSleep"]);
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


export interface Uberman_sleep_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
