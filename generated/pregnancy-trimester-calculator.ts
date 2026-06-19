// Auto-generated from pregnancy-trimester-calculator-schema.json
import * as z from 'zod';

export interface Pregnancy_trimester_calculatorInput {
  lmpDay: number;
  lmpMonth: number;
  lmpYear: number;
  currentDay: number;
  currentMonth: number;
  currentYear: number;
  dataConfidence?: number;
}

export const Pregnancy_trimester_calculatorInputSchema = z.object({
  lmpDay: z.number().default(1),
  lmpMonth: z.number().default(1),
  lmpYear: z.number().default(2024),
  currentDay: z.number().default(1),
  currentMonth: z.number().default(1),
  currentYear: z.number().default(2024),
});

function asFormulaNumber(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Pregnancy_trimester_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = (input.currentYear - input.lmpYear)*365 + (input.currentMonth - input.lmpMonth)*30 + (input.currentDay - input.lmpDay); results["totalDaysDifference"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["totalDaysDifference"] = 0; }
  try { const v = input.lmpYear*365 + input.lmpMonth*30 + input.lmpDay; results["lmpTotalDays"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["lmpTotalDays"] = 0; }
  try { const v = (asFormulaNumber(results["lmpTotalDays"])) + 280; results["dueTotalDays"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["dueTotalDays"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

export function calculatePregnancy_trimester_calculator(input: Pregnancy_trimester_calculatorInput): Pregnancy_trimester_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = Math.max(0, toNumericFormulaValue(values["dueTotalDays"]));
  const breakdown = {
    
  };
  const hiddenLossDrivers: string[] = [];
  const suggestedActions: string[] = ["Review inputs and verify results against site standards."];
  const dataConfidenceAdjusted =
    typeof input.dataConfidence === "number"
      ? Math.max(0, totalWasteCost * (input.dataConfidence / 100))
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


export interface Pregnancy_trimester_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
