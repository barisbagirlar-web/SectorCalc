// @ts-nocheck
// Auto-generated from minutes-to-hours-calculator-schema.json
import * as z from 'zod';

export interface Minutes_to_hours_calculatorInput {
  inputMinutes: number;
  decPlaces: number;
  fmt: number;
  rndMode: number;
}

export const Minutes_to_hours_calculatorInputSchema = z.object({
  inputMinutes: z.number().default(60),
  decPlaces: z.number().default(2),
  fmt: z.number().default(0),
  rndMode: z.number().default(0),
});

function asFormulaNumber(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Minutes_to_hours_calculatorInput): Record<string, number | string> {
  const results: Record<string, number | string> = {};
  try { const v = input.inputMinutes / 60; results["decimalHours"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["decimalHours"] = 0; }
  try { const v = input.inputMinutes / 60; results["decimalHours_aux"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["decimalHours_aux"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

export function calculateMinutes_to_hours_calculator(input: Minutes_to_hours_calculatorInput): Minutes_to_hours_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["decimalHours_aux"]);
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


export interface Minutes_to_hours_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
