// @ts-nocheck
// Auto-generated from 16-8-fasting-calculator-schema.json
import * as z from 'zod';

export interface _16_8_fasting_calculatorInput {
  currentHour: number;
  fastingStartHour: number;
  fastingDuration: number;
  eatingDuration: number;
}

export const _16_8_fasting_calculatorInputSchema = z.object({
  currentHour: z.number().default(12),
  fastingStartHour: z.number().default(20),
  fastingDuration: z.number().default(16),
  eatingDuration: z.number().default(8),
});

function asFormulaNumber(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: _16_8_fasting_calculatorInput): Record<string, number | string> {
  const results: Record<string, number | string> = {};
  try { const v = (input.fastingStartHour + input.fastingDuration) % 24; results["fastingEndHour"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["fastingEndHour"] = 0; }
  try { const v = ((input.fastingStartHour + input.fastingDuration) % 24 + input.eatingDuration) % 24; results["eatingWindowEndHour"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["eatingWindowEndHour"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

export function calculate_16_8_fasting_calculator(input: _16_8_fasting_calculatorInput): _16_8_fasting_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["eatingWindowEndHour"]);
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


export interface _16_8_fasting_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
