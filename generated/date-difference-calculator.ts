// Auto-generated from date-difference-calculator-schema.json
import * as z from 'zod';

export interface Date_difference_calculatorInput {
  startYear: number;
  startMonth: number;
  startDay: number;
  endYear: number;
  endMonth: number;
  endDay: number;
  dataConfidence?: number;
}

export const Date_difference_calculatorInputSchema = z.object({
  startYear: z.number().default(2023),
  startMonth: z.number().default(1),
  startDay: z.number().default(1),
  endYear: z.number().default(2024),
  endMonth: z.number().default(1),
  endDay: z.number().default(1),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Date_difference_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.endYear * 365 + input.endMonth * 30 + input.endDay - (input.startYear * 365 + input.startMonth * 30 + input.startDay); results["diffDays"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["diffDays"] = Number.NaN; }
  try { const v = (input.endYear * 365 + input.endMonth * 30 + input.endDay - (input.startYear * 365 + input.startMonth * 30 + input.startDay)) / 365; results["diffYears"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["diffYears"] = Number.NaN; }
  try { const v = (input.endYear * 365 + input.endMonth * 30 + input.endDay - (input.startYear * 365 + input.startMonth * 30 + input.startDay)) / 30; results["diffMonths"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["diffMonths"] = Number.NaN; }
  return results;
}


export function calculateDate_difference_calculator(input: Date_difference_calculatorInput): Date_difference_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["diffDays"]);
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


export interface Date_difference_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
