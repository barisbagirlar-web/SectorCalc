// @ts-nocheck
// Auto-generated from date-difference-calculator-schema.json
import * as z from 'zod';

export interface Date_difference_calculatorInput {
  startYear: number;
  startMonth: number;
  startDay: number;
  endYear: number;
  endMonth: number;
  endDay: number;
}

export const Date_difference_calculatorInputSchema = z.object({
  startYear: z.number().default(2023),
  startMonth: z.number().default(1),
  startDay: z.number().default(1),
  endYear: z.number().default(2024),
  endMonth: z.number().default(1),
  endDay: z.number().default(1),
});

function asFormulaNumber(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Date_difference_calculatorInput): Record<string, number | string> {
  const results: Record<string, number | string> = {};
  try { const v = input.endYear * 365 + input.endMonth * 30 + input.endDay - (input.startYear * 365 + input.startMonth * 30 + input.startDay); results["diffDays"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["diffDays"] = 0; }
  try { const v = (input.endYear * 365 + input.endMonth * 30 + input.endDay - (input.startYear * 365 + input.startMonth * 30 + input.startDay)) / 365; results["diffYears"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["diffYears"] = 0; }
  try { const v = (input.endYear * 365 + input.endMonth * 30 + input.endDay - (input.startYear * 365 + input.startMonth * 30 + input.startDay)) / 30; results["diffMonths"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["diffMonths"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

export function calculateDate_difference_calculator(input: Date_difference_calculatorInput): Date_difference_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["diffDays"]);
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


export interface Date_difference_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
