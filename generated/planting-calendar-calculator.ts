// @ts-nocheck
// Auto-generated from planting-calendar-calculator-schema.json
import * as z from 'zod';

export interface Planting_calendar_calculatorInput {
  lastFrostDay: number;
  plantingDateOffset: number;
  baseTemperature: number;
  targetGDD: number;
  averageDailyTemp: number;
  soilTemp: number;
  minSoilTemp: number;
  safetyMargin: number;
}

export const Planting_calendar_calculatorInputSchema = z.object({
  lastFrostDay: z.number().default(120),
  plantingDateOffset: z.number().default(7),
  baseTemperature: z.number().default(10),
  targetGDD: z.number().default(1500),
  averageDailyTemp: z.number().default(20),
  soilTemp: z.number().default(14),
  minSoilTemp: z.number().default(10),
  safetyMargin: z.number().default(10),
});

function asFormulaNumber(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Planting_calendar_calculatorInput): Record<string, number | string> {
  const results: Record<string, number | string> = {};
  try { const v = input.lastFrostDay + input.plantingDateOffset + input.baseTemperature; results["result"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["result"] = 0; }
  try { const v = input.lastFrostDay + input.plantingDateOffset + input.baseTemperature; results["result_copy"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["result_copy"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

export function calculatePlanting_calendar_calculator(input: Planting_calendar_calculatorInput): Planting_calendar_calculatorOutput {
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


export interface Planting_calendar_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
